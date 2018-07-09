package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.regex.Pattern;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

public class SimpleFrenchGapFinder implements GapIndexFinder {
	
	private String[] splits;
	
	@Override
	public boolean test(Token token) {
		splits = token.getCoveredText().split("'");
		return splits.length > 1;
	}

	@Override
	public int getGapIndex(Token token) {
		if (splits == null || splits.length == 1)
			return -1;
		
		int tokenLength = token.getCoveredText().length();
		int lastWordLength = splits[splits.length - 1].length();
		int gapOffset = lastWordLength / 2;
		return tokenLength - lastWordLength + gapOffset;
	}

}
