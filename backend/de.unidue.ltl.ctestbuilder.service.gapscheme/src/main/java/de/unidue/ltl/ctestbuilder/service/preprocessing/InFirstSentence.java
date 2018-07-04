package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.ArrayList;
import java.util.Collection;
import java.util.function.Predicate;

import org.apache.uima.fit.util.JCasUtil;
import org.apache.uima.jcas.JCas;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Sentence;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

public class InFirstSentence implements Predicate<Token> {

	private Collection<Token> tokensInFirstSentence;
	
	public InFirstSentence(JCas aJCas) {
		Sentence firstSentence = new ArrayList<Sentence>(JCasUtil.select(aJCas, Sentence.class)).get(0);
		tokensInFirstSentence = JCasUtil.selectCovered(aJCas, Token.class, firstSentence);
	}
	
	@Override
	public boolean test(Token t) {
		return tokensInFirstSentence.contains(t);
	}

}
