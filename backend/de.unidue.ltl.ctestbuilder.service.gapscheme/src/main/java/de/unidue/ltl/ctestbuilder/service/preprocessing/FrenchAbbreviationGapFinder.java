package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.regex.Pattern;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

/**
 * A {@code GapIndexFinder} for apostrophe abbreviations in French.
 * These abbreviations are marked by an apostrophe between the abbreviated word and the word merged.
 * "c'est" is an example of such abbreviations.
 * 
 * @see de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token
 */
public class FrenchAbbreviationGapFinder implements GapIndexFinder {
	
	private Pattern abbreviation = Pattern.compile("'");
	private String[] splits;
	
	/**
	 * Tests whether a given token is an abbreviation.
	 */
	@Override
	public boolean test(Token token) {
		splits = token.getCoveredText().split(abbreviation.pattern(), 2);
		return splits.length > 1;
	}

	/**
	 * Returns the start index of the gappable area for the given token.
	 * The index is equal to start of the last word after the last abbreviation symbol.
	 * 
	 * @param  token The token.
	 * @return The start index of the gappable area of {@code token}.
	 */
	@Override
	public int getGapIndex(Token token) {
		if (splits == null || splits.length < 2)
			return -1;
		
		int tokenLength = token.getCoveredText().length();
		String target = splits[1];
		return tokenLength - target.length();
	}

}
