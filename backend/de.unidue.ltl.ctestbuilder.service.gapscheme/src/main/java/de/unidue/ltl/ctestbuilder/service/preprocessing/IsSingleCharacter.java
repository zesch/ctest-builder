package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.function.Predicate;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

public class IsSingleCharacter implements Predicate<Token> {

	private int minWordLength;

	public IsSingleCharacter() {
		minWordLength = 2;
	}

	public IsSingleCharacter(int wordLength) {
		minWordLength = wordLength;
	}

	@Override
	public boolean test(Token toCheck) {
		return toCheck.getCoveredText().length() < minWordLength;
	}
}
