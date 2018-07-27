package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;
import java.util.regex.Pattern;

import org.apache.uima.fit.util.JCasUtil;
import org.apache.uima.jcas.JCas;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

public class IsSimpleNamedEntity implements Predicate<Token> {

	private static Pattern pattern = Pattern.compile("^\\p{Lu}.+$");
	
	private List<Token> tokens;
	private boolean isNamedEntityCandidate;
	private boolean isAtBeginningOfSentence;
	
	public IsSimpleNamedEntity(JCas aJCas) {
		tokens = new ArrayList<>(JCasUtil.select(aJCas, Token.class));
	}
	
	@Override
	public boolean test(Token token) {
		isNamedEntityCandidate = pattern.matcher(token.getCoveredText()).matches();
		System.out.println(String.format("%s is a Named Entity: %b", token.getCoveredText(), isNamedEntityCandidate));
		isAtBeginningOfSentence = false;
		
		if (isNamedEntityCandidate) {
			isAtBeginningOfSentence = getPreviousTokenOf(token).equals(".");
		}
		
		return isNamedEntityCandidate && !isAtBeginningOfSentence;
	}
	
	private String getPreviousTokenOf(Token t) {
		int index = tokens.indexOf(t) - 1;
		if (index > -1)
			return tokens.get(index).getCoveredText();
		return "";		
	}
}
