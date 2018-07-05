package de.unidue.ltl.ctestbuilder.service.gapscheme;

import static org.apache.uima.fit.factory.AnalysisEngineFactory.createEngine;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

import org.apache.uima.analysis_engine.AnalysisEngine;
import org.apache.uima.analysis_engine.AnalysisEngineProcessException;
import org.apache.uima.fit.factory.ExternalResourceFactory;
import org.apache.uima.fit.util.JCasUtil;
import org.apache.uima.jcas.JCas;
import org.apache.uima.resource.ResourceInitializationException;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Sentence;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import de.tudarmstadt.ukp.dkpro.core.decompounding.uima.annotator.CompoundAnnotator;
import de.tudarmstadt.ukp.dkpro.core.decompounding.uima.resource.BananaSplitterResource;
import de.tudarmstadt.ukp.dkpro.core.decompounding.uima.resource.SharedDictionary;
import de.tudarmstadt.ukp.dkpro.core.decompounding.uima.resource.SharedLinkingMorphemes;
import de.tudarmstadt.ukp.dkpro.core.stanfordnlp.StanfordNamedEntityRecognizer;
import de.tudarmstadt.ukp.dkpro.core.tokit.BreakIteratorSegmenter;
import de.unidue.ltl.ctestbuilder.service.preprocessing.CompoundGapFinder;
import de.unidue.ltl.ctestbuilder.service.preprocessing.GapIndexFinder;
import de.unidue.ltl.ctestbuilder.service.preprocessing.ShortWord;
import testDifficulty.core.CTestObject;
import testDifficulty.core.CTestToken;

public class CTestBuilder {
	
	private JCas jcas;
	private CTestObject ctest;
	private String language = "unknown";
	
	private List <AnalysisEngine> engines;
	private List<Predicate<Token>> exclusionCriteria;
	private List<GapIndexFinder> gapFinders;
	
	private List<Sentence> sentences;
	private List<Token> tokens;
	private List<String> warnings;
	
	private int gapInterval = 2;
	private int gapLimit = 20;
	private int gapCount = 0;
	private int gapCandidates = 0;
	private int sentenceCount = 0;
	private int sentenceLimit = Integer.MAX_VALUE;
	
	public CTestObject generateCTest(String text, String language) throws ResourceInitializationException, AnalysisEngineProcessException {
		//TODO: split into initialise and process()
		initialiseWith(text, language);
		
		//TODO: move to makeGaps method.
		for (Sentence sentence : sentences) {
			for (Token token : tokens = JCasUtil.selectCovered(jcas, Token.class, sentence)) {
	    		CTestToken cToken = new CTestToken(token.getCoveredText());
	    		
	    		if (!isValidGapCandidate(token)) {
	    			cToken.setGap(false);
	    		} else {
	    			if (gapCandidates % gapInterval == 0) {
		    			cToken.setGap(true);
		    			cToken.setGapIndex(estimateGapIndex(token));
		    			gapCount++;
		    			if (gapCount == gapLimit)
		    				sentenceLimit = sentences.indexOf(sentence) + 1;
		    		}
		    		gapCandidates++;
	    		}
	    		
	    		ctest.addToken(cToken);
	        }
			sentenceCount++;
			if (sentenceCount > sentenceLimit) {
				addWarning("TOO MUCH TEXT - The supplied text contained more sentences than necessary. The c-test may not use all sentences.");
				break;
			}
		}
    	
		//TODO: Define Warnings in JSON Format for frontend?
		if (gapCount < gapLimit)
			addWarning(String.format("INSUFFICIENT GAPS - The supplied text was too short to produce at least %s gaps. Try to add more words.", gapLimit));
		
		if (sentenceCount <= sentenceLimit)
			addWarning("INSUFFICIENT SENTENCES - The supplied text did not have enough sentences. c-Test is incomplete.");
		
        return ctest;
	}
	
	public List<String> getWarnings() {
		return warnings;
	}
	
	public JCas getJCas() {
		return jcas;
	}
	
	private void initialiseWith(String text, String language) throws ResourceInitializationException, AnalysisEngineProcessException {
		warnings = new ArrayList<>();
		
		engines = buildEngines(language);
		jcas = process(text);
		exclusionCriteria = getExclusionCriteria(jcas, language);
		gapFinders = getGapFinders(jcas, language);
		
		sentences = new ArrayList<>(JCasUtil.select(jcas, Sentence.class));
        tokens = new ArrayList<>(JCasUtil.select(jcas, Token.class));
        ctest = new CTestObject(language);
        
        sentenceCount = 0;
    	sentenceLimit = sentences.size() - 1;
        gapCount = 0;
        gapCandidates = 0;
        
        this.language = language;
        if (sentences.size() < 3)
        	addWarning("INSUFFICIENT SENTENCES - At least 3 sentences are required for a proper c-test.");
	}
	
	private List<AnalysisEngine> buildEngines(String language) throws ResourceInitializationException {
		if (this.language.equals(language))
			return engines;
		
		List<AnalysisEngine> engines = new ArrayList<>();
		
		engines.add(createEngine(
				BreakIteratorSegmenter.class));
		
		engines.add(createEngine(
				StanfordNamedEntityRecognizer.class,
        		StanfordNamedEntityRecognizer.PARAM_VARIANT, "nemgp",
        		StanfordNamedEntityRecognizer.PARAM_LANGUAGE, language));
		
		engines.add(createEngine(
				CompoundAnnotator.class,
                CompoundAnnotator.PARAM_SPLITTING_ALGO,
                ExternalResourceFactory.createExternalResourceDescription(
                        BananaSplitterResource.class,
                        BananaSplitterResource.PARAM_DICT_RESOURCE,
                        ExternalResourceFactory.createExternalResourceDescription(SharedDictionary.class),
                        BananaSplitterResource.PARAM_MORPHEME_RESOURCE,
                        ExternalResourceFactory.createExternalResourceDescription(SharedLinkingMorphemes.class))));
		
		
		return engines;
		
	}
	
	private JCas process(String text) throws AnalysisEngineProcessException, ResourceInitializationException {
		JCas jcas = engines.get(0).newJCas();
		jcas.setDocumentText(text);
		for (AnalysisEngine engine : engines)
			engine.process(jcas);
		return jcas;
	}
	
	private List<Predicate<Token>> getExclusionCriteria(JCas aJCas, String language) {
		//TODO: Compose from general and language specific criteria automatically.
		List<Predicate<Token>> criteria = new ArrayList<>();
		criteria.add(new ShortWord());
		return criteria;
	}
	
	private List<GapIndexFinder> getGapFinders(JCas aJCas, String language) {
		//TODO: Compose from general and language specific modifiers automatically.
		List<GapIndexFinder> finders = new ArrayList<>();
		finders.add(new CompoundGapFinder(aJCas));
		return finders;
	}
	
	private void addWarning(String string) {
		warnings.add(string);
	}
	
	private boolean isValidGapCandidate(Token token) {
		if (sentenceCount == 0)
			return false;
		
		//TODO: Remove if more gaps are more important than last sentence
		if (sentenceCount == sentenceLimit)
			return false;
		
		if (gapCount == gapLimit)
			return false;
		
		for (Predicate<Token> criterion : exclusionCriteria) {
			if (criterion.test(token))
				return false;
		}
		
		return true;
	}
	
	/* Assumes gaps at the end, e.g. playgro___ (playground) */
	private int estimateGapIndex(Token token) {
		int index = (token.getEnd() - token.getBegin()) / 2;
		
		for (GapIndexFinder modifier : gapFinders) {
			if (modifier.test(token)) {
				index = Math.max(index, modifier.getGapIndex(token));
			}
		}
		
		if (index % 2 != 0)
			return index - 1;
		
		return index;		
	}
	
	private boolean isGap() {
		return gapCandidates % gapInterval == 0;
	}
}
