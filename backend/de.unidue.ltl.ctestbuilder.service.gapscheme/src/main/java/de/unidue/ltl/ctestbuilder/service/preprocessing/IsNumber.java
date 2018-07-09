package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.function.Predicate;
import java.util.regex.Pattern;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

public class IsNumber implements Predicate<Token> {

	// should catch ips, isbns, power expressions (a^b) and percentages.
	//TODO: does not necessarily catch hexadecimals
	//TODO: should match, when number is contained in word?
	private Pattern pattern = Pattern.compile("[a-zA-Z]*\\d+([,\\.\\-\\^][0-9]+)*%?[a-zA-Z]*");
	
	@Override
	public boolean test(Token token) {
		return pattern.matcher(token.getCoveredText()).matches();
	}

}
