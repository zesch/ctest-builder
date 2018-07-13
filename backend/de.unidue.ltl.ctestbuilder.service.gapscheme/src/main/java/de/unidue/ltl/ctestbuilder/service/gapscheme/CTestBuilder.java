package de.unidue.ltl.ctestbuilder.service.gapscheme;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

import org.apache.uima.UIMAException;
import org.apache.uima.analysis_engine.AnalysisEngine;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.fit.util.JCasUtil;
import org.apache.uima.jcas.JCas;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Sentence;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import de.unidue.ltl.ctestbuilder.service.preprocessing.GapIndexFinder;
import testDifficulty.core.CTestObject;
import testDifficulty.core.CTestToken;

public class CTestBuilder {	
	private List<Predicate<Token>> exclusionRules;
	private List<GapIndexFinder> gapIndexFinders;
	private List<String> warnings;
	private List<Sentence> sentences;
	
	private String language;
	private CTestObject ctest;
	private JCas jcas;

	private int gapInterval;
	private int gapLimit;
	
	private int gapCount;
	private int gapCandidates;
	private int sentenceCount;
	private int sentenceLimit;

	
	public CTestBuilder() {
		gapInterval = 2;
		gapLimit = 20;
	}
	
	public CTestBuilder(int gapLimit, int gapInterval) {
		this.gapLimit = gapLimit;
		this.gapInterval = gapInterval;
	}
	
	
	public CTestObject generateCTest(String text, String language) throws UIMAException {
		initialise(text, language);
		makeGaps();
		return ctest;
	}
	
	public CTestObject getCTest() {
		return ctest;
	}
	
	public List<String> getWarnings() {
		return warnings;
	}

	
	private void initialise(String aText, String aLanguage)
			throws UIMAException {
		warnings = new ArrayList<>();
		language = aLanguage;
		
		List<AnalysisEngine> engines = CTestResourceProvider.getAnalysisEngines(language);
		
		jcas = process(aText, aLanguage, engines);
		exclusionRules = CTestResourceProvider.getExclusionRules(jcas, language);
		gapIndexFinders = CTestResourceProvider.getGapFinders(jcas, language);

		sentences = new ArrayList<>(JCasUtil.select(jcas, Sentence.class));
		ctest = new CTestObject(language);

		sentenceCount = 0;
		sentenceLimit = sentences.size() - 1;
		gapCount = 0;
		gapCandidates = 0;

	}

	private JCas process(String aText, String aLanguage, List<AnalysisEngine> engines) throws UIMAException {
		JCas jcas = JCasFactory.createText(aText, aLanguage);
		for (AnalysisEngine engine : engines)
			engine.process(jcas);
		return jcas;
	}


	private void makeGaps() {		
		for (Sentence sentence : sentences) {
			for (Token token : JCasUtil.selectCovered(jcas, Token.class, sentence)) {
				CTestToken cToken = new CTestToken(token.getCoveredText());

				if (!isValidGapCandidate(token)) {
					cToken.setGap(false);
				} else {
					if (gapCandidates % gapInterval != 0) {
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
		}
		
		if (sentenceCount < sentenceLimit || sentences.size() < 3)
			warnings.add(
					"INSUFFICIENT NUMBER OF SENTENCES - The supplied text did not contain enough sentences. You may need to add additional sentences.");

		if (sentenceCount > sentenceLimit)
			warnings.add(
					"TOO MANY SENTENCES - The supplied text contained more sentences than necessary. The c-test did not use all sentences.");
		
		if (gapCount < gapLimit)
			warnings.add(String.format(
					"INSUFFICIENT NUMBER OF GAPS - The supplied text was too short to produce at least %s gaps. Try to add more words.",
					gapLimit));
	}

	private boolean isValidGapCandidate(Token token) {
		if (sentenceCount == 0)
			return false;

		if (gapCount == gapLimit)
			return false;

		for (Predicate<Token> criterion : exclusionRules) {
			if (criterion.test(token))
				return false;
		}

		return true;
	}

	/* Assumes gaps at the end, e.g. playgro___ (playground) */
	protected int estimateGapIndex(Token token) {
		int gapRangeStart = 0;

		for (GapIndexFinder modifier : gapIndexFinders) {
			if (modifier.test(token)) {
				gapRangeStart = Math.max(gapRangeStart, modifier.getGapIndex(token));
			}
		}

		int gapOffset = token.getCoveredText().substring(gapRangeStart).length() / 2;

		return gapRangeStart + gapOffset;
	}
}
