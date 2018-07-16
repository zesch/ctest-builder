package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.function.Predicate;
import java.util.regex.Pattern;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

/**
 * A {@code Predicate}, testing whether a given {@code Token} contains a number.
 * Also finds common number types, including IP-Adresses, ISBNs and percentages.
 * 
 * @see java.util.function.Predicate
 * @see de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token
 */
public class IsNumber implements Predicate<Token> {

	// should catch ips, isbns, power expressions (a^b) and percentages.
	//TODO: does not necessarily catch hexadecimals
	private static Pattern pattern = Pattern.compile("[a-zA-Z]*\\d+([,\\.\\-\\^][0-9]+)*%?[a-zA-Z]*");
	
	/**
	 * Returns the pattern, used by {@code IsNumber} objects to detect numbers in words.
	 */
	public static Pattern getPattern() {
		return pattern;
	}
	
	/**
	 * Tests whether a given token contains a number. 
	 */
	@Override
	public boolean test(Token token) {
		return pattern.matcher(token.getCoveredText()).matches();
	}

}
