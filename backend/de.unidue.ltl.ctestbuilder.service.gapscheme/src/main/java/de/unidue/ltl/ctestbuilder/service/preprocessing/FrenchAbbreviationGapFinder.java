package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.regex.Pattern;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

public class FrenchAbbreviationGapFinder implements GapIndexFinder {
	
	private Pattern apostrophe = Pattern.compile("'");
	private String[] splits;
	
	@Override
	public boolean test(Token token) {
		splits = apostrophe.split(token.getCoveredText());
		return splits.length > 1;
	}

	@Override
	public int getGapIndex(Token token) {
		if (splits == null || splits.length == 1)
			return -1;
		
		int tokenLength = token.getCoveredText().length();
		int targetLength = splits[splits.length - 1].length();
		return tokenLength - targetLength;
	}

}
