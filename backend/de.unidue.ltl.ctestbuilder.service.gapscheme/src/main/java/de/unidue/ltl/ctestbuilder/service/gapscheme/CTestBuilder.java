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
import de.unidue.ltl.ctestbuilder.service.preprocessing.HyphenGapFinder;
import de.unidue.ltl.ctestbuilder.service.preprocessing.IsAbbreviation;
import de.unidue.ltl.ctestbuilder.service.preprocessing.IsNumber;
import de.unidue.ltl.ctestbuilder.service.preprocessing.IsPunctuation;
import de.unidue.ltl.ctestbuilder.service.preprocessing.ShortWord;
import de.unidue.ltl.ctestbuilder.service.preprocessing.FrenchAbbreviationGapFinder;
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
		initialise(text, language);
		makeGaps();
        return ctest;
	}
	
	public JCas getJCas() {
		return jcas;
	}
	
	public List<String> getWarnings() {
		return warnings;
	}
	
	private void initialise(String text, String language) throws ResourceInitializationException, AnalysisEngineProcessException {
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
	
	/* TODO: Implement Provider for Preprocessing resources */
	private List<AnalysisEngine> buildEngines(String language) throws ResourceInitializationException {
		if (this.language.equals(language))
			return engines;
		
		List<AnalysisEngine> engines = new ArrayList<>();
		
		engines.add(createEngine(
				BreakIteratorSegmenter.class));
		
		//TODO: Replace with language specific compound annotators?
		engines.add(createEngine(
				CompoundAnnotator.class,
                CompoundAnnotator.PARAM_SPLITTING_ALGO,
                ExternalResourceFactory.createExternalResourceDescription(
                        BananaSplitterResource.class,
                        BananaSplitterResource.PARAM_DICT_RESOURCE,
                        ExternalResourceFactory.createExternalResourceDescription(SharedDictionary.class),
                        BananaSplitterResource.PARAM_MORPHEME_RESOURCE,
                        ExternalResourceFactory.createExternalResourceDescription(SharedLinkingMorphemes.class))));
		
		if (language.equals("de")) {
			engines.add(createEngine(
					StanfordNamedEntityRecognizer.class,
	        		StanfordNamedEntityRecognizer.PARAM_VARIANT, "nemgp",
	        		StanfordNamedEntityRecognizer.PARAM_LANGUAGE, "de"));
		}
		
		//FIXME: Find other NER models.
		/*
		if (language.equals("fr") || language.equals("it") || language.equals("es") || language.equals("en")) {
			engines.add(createEngine(
					StanfordNamedEntityRecognizer.class,
	        		StanfordNamedEntityRecognizer.PARAM_VARIANT, "freme-wikiner",
	        		StanfordNamedEntityRecognizer.PARAM_LANGUAGE, language));
		}
		*/		
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
		criteria.add(new IsNumber());
		criteria.add(new IsPunctuation());	
		criteria.add(new IsAbbreviation(language));
		return criteria;
	}
	
	//TODO: Compose from general and language specific modifiers automatically.
	private List<GapIndexFinder> getGapFinders(JCas aJCas, String language) {
		List<GapIndexFinder> finders = new ArrayList<>();
		
		if (language.equals("de")) {
			finders.add(new CompoundGapFinder(aJCas));
			finders.add(new HyphenGapFinder());
		}
		
		if (language.equals("en")) {
			finders.add(new HyphenGapFinder());
		}
		
		if (language.equals("fr")) {
			finders.add(new FrenchAbbreviationGapFinder());
			finders.add(new HyphenGapFinder());
		}
			
		
		return finders;
	}
	
	private void addWarning(String string) {
		warnings.add(string);
	}
	
	private void makeGaps() {
		for (Sentence sentence : sentences) {
			for (Token token : JCasUtil.selectCovered(jcas, Token.class, sentence)) {
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
    	
		if (gapCount < gapLimit)
			addWarning(String.format("INSUFFICIENT GAPS - The supplied text was too short to produce at least %s gaps. Try to add more words.", gapLimit));
		
		if (sentenceCount <= sentenceLimit)
			addWarning("INSUFFICIENT SENTENCES - The supplied text did not have enough sentences. c-Test is incomplete.");
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
	protected int estimateGapIndex(Token token) {
		int gapRangeStart = 0;
		
		for (GapIndexFinder modifier : gapFinders) {
			if (modifier.test(token)) {
				gapRangeStart = Math.max(gapRangeStart, modifier.getGapIndex(token));
			}
		}
		
		int gapOffset = token.getCoveredText().substring(gapRangeStart).length()/2;
		
		return gapRangeStart + gapOffset;		
	}
	
	private boolean isGap() {
		return gapCandidates % gapInterval == 0;
	}
}
