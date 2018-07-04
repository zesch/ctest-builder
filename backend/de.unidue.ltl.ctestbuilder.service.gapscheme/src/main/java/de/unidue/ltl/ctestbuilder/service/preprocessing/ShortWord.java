package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.function.Predicate;

import org.apache.uima.analysis_engine.AnalysisEngineDescription;
import static org.apache.uima.fit.factory.AnalysisEngineFactory.createEngineDescription;

import org.apache.uima.jcas.JCas;
import org.apache.uima.jcas.tcas.Annotation;
import org.apache.uima.resource.ResourceInitializationException;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import de.tudarmstadt.ukp.dkpro.core.tokit.BreakIteratorSegmenter;

public class ShortWord implements Predicate<Token> {
	
	private int minWordLength;
	
	public ShortWord() {
		minWordLength = 3;
	}
	
	public ShortWord(int wordLength) {
		minWordLength = wordLength;
	}
	
	@Override
	public boolean test(Token toCheck) {
		return toCheck.getCoveredText().length() < minWordLength;
	}
}
