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

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import de.tudarmstadt.ukp.dkpro.core.decompounding.uima.annotator.CompoundAnnotator;
import de.tudarmstadt.ukp.dkpro.core.decompounding.uima.resource.BananaSplitterResource;
import de.tudarmstadt.ukp.dkpro.core.decompounding.uima.resource.SharedDictionary;
import de.tudarmstadt.ukp.dkpro.core.decompounding.uima.resource.SharedLinkingMorphemes;
import de.tudarmstadt.ukp.dkpro.core.stanfordnlp.StanfordNamedEntityRecognizer;
import de.tudarmstadt.ukp.dkpro.core.tokit.BreakIteratorSegmenter;
import de.unidue.ltl.ctestbuilder.service.preprocessing.InFirstSentence;
import de.unidue.ltl.ctestbuilder.service.preprocessing.ShortWord;
import testDifficulty.core.CTestObject;
import testDifficulty.core.CTestToken;

public class CTestBuilder {
	
	private JCas jcas;
	private CTestObject ctest;
	private List <AnalysisEngine> engines;
	private List<Predicate<Token>> exclusionCriteria;
	private List<Token> tokens;
	private List<String> warnings;
	private String language = "unknown";
	
	private int gapInterval = 2;
	private int gapCount = 0;
	private int gapCandidates = 0;
	
	public CTestObject generateCTest(String text, String language) throws ResourceInitializationException, AnalysisEngineProcessException {
		initialiseWith(text, language);
        
        tokens = new ArrayList<>(JCasUtil.select(jcas, Token.class));
        ctest = new CTestObject(language);
        
    	for (Token token : tokens) {
    		CTestToken cToken = makeCToken(token);
    		ctest.addToken(cToken);
        }
    	
        return ctest;
	}
	
	public List<String> getWarnings() {
		return warnings;
	}
	
	public JCas getJCas() {
		return jcas;
	}
	
	private void initialiseWith(String text, String language) throws ResourceInitializationException, AnalysisEngineProcessException {
		engines = buildEngines(language);
		jcas = process(text);
		exclusionCriteria = getExclusionCriteria(jcas, language);

        gapCount = 0;
        gapCandidates = 0;
        this.language = language;
        warnings = new ArrayList<>();
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
		criteria.add(new InFirstSentence(aJCas));
		criteria.add(new ShortWord());
		return criteria;
	}
	
	private boolean isValidGapCandidate(Token token) {
		for (Predicate<Token> criterion : exclusionCriteria) {
			if (criterion.test(token)) {
				return false;
			}
		}
		return true;
	}
	
	private CTestToken makeCToken(Token t) {
		CTestToken cToken = new CTestToken(t.getCoveredText());
		
		if(!isValidGapCandidate(t)) {
			cToken.setGap(false);
			return cToken;
		}
			
		if(isGap()) {
			cToken.setGap(true);
			//TODO: Handle special tokens, like compounds. Also: Extend CTestToken with better gap representation.
			gapCount++;
		}
		gapCandidates++;
		
		return cToken;
	} 
	
	private boolean isGap() {
		return gapCandidates % gapInterval == 0;
	}
}
