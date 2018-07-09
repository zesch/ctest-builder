package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.function.Predicate;
import java.util.regex.Pattern;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

public class IsPunctuation implements Predicate<Token> {

	private Pattern pattern = Pattern.compile("[\\!\"#\\$%\\&'\\(\\)\\*\\+,\\-\\.\\/\\\\:;<=>\\?@\\[\\]\\^_`\\{\\|\\}~]+"); 
	
	@Override
	public boolean test(Token token) {
		return pattern.matcher(token.getCoveredText()).matches();
	}

}
