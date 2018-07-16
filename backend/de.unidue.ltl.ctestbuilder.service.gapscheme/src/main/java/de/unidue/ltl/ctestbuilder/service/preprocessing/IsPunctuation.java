package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.function.Predicate;
import java.util.regex.Pattern;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

/**
 * A {@code Predicate}, testing whether a given {@code Token} contains punctuation.
 * 
 * @see java.util.function.Predicate
 * @see de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token
 */
public class IsPunctuation implements Predicate<Token> {

	private static Pattern pattern = Pattern.compile("[\\!\"#\\$%¡¿\\&'\\(\\)\\*\\+,\\-\\.\\/\\\\:;<=>\\?@\\[\\]\\^_`\\{\\|\\}~]+");
	
	/**
	 * The {@code Pattern} used by {@code IsPunctuation} objects to find punctuation in tokens.
	 */
	public static Pattern getPattern() {
		return pattern;
	}
	
	/**
	 * Tests whether the given token is punctuation.
	 */
	@Override
	public boolean test(Token token) {
		return pattern.matcher(token.getCoveredText()).matches();
	}

}
