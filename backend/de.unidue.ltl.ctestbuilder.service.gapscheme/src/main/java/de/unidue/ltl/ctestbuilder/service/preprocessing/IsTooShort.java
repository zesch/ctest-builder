package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.function.Predicate;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

/**
 * A {@code Predicate}, testing whether a given {@code Token} is below a minimum word length.
 * 
 * @see java.util.function.Predicate
 * @see de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token
 */
public class IsTooShort implements Predicate<Token> {

	private int minWordLength;

	/**
	 * Creates a new {@code IsTooShort} object with minimum word length of 2. 
	 */
	public IsTooShort() {
		minWordLength = 2;
	}

	/**
	 * Creates a new {@code IsTooShort} object with minimum word length given by {@code wordLength}. 
	 */
	public IsTooShort(int wordLength) {
		minWordLength = wordLength;
	}

	/**
	 * Tests whether a given token is too short.
	 */
	@Override
	public boolean test(Token toCheck) {
		return toCheck.getCoveredText().length() < minWordLength;
	}
	
	/**
	 * Returns the minimum word length, used by this {@code IsTooShort} object. 
	 */
	public int getMinWordLength() {
		return minWordLength;
	}
}
