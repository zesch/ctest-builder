package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.regex.Pattern;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

/**
 * A {@code GapIndexFinder} for hyphenated words.
 * These abbreviations are marked by an apostrophe between the abbreviated word and the word merged.
 * "c'est" is an example of such abbreviations.
 * 
 * @see de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token
 */
public class HyphenGapFinder implements GapIndexFinder {
	
	private static Pattern hyphen = Pattern.compile("-");
	private String[] splits;
	
	/**
	 * Tests whether the given token is hyphenated.
	 */
	@Override
	public boolean test(Token token) {
		splits = hyphen.split(token.getCoveredText());
		return splits.length > 1;
	}

	/**
	 * Returns the start index of the gappable area for the given token.
	 * The index is equal to start of the last word after the last hyphen.
	 * 
	 * @param  token The token.
	 * @return The start index of the gappable area of {@code token}.
	 */
	@Override
	public int getGapIndex(Token token) {
		if (splits == null || splits.length == 1)
			return -1;
		
		int tokenLength = token.getEnd() - token.getBegin();
		int targetLength = splits[splits.length - 1].length();
		return tokenLength - targetLength;
	}

}
