package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.List;
import java.util.function.Predicate;
import java.util.regex.Pattern;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

/**
 * A {@code Predicate}, testing whether a given {@code Token} is an abbreviation. 
 * 
 * @see java.util.function.Predicate
 * @see de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token
 */
public class IsAbbreviation implements Predicate<Token> {
	
	private static final Pattern ABBREVIATION_PATTERN = Pattern.compile("([a-zA-z]+\\.[-]?)+");
	private Pattern[] abbreviations;
	
	/**
	 * Returns the pattern, used to identify abbreviations by {@code IsAbbreviation} Objects.
	 */
	public static Pattern getAbbreviationPattern() {
		return ABBREVIATION_PATTERN;
	}
	
	/**
	 * Creates a {@IsAbbreviation} Object with the specified abbreviations as additional abbreviation markers.
	 */
	public IsAbbreviation(List<String> abbreviations) {
		this.abbreviations = abbreviations.stream().map(Pattern::compile).toArray(Pattern[]::new);
	}
	
	/**
	 * Creates a {@IsAbbreviation} Object with the specified abbreviations as additional abbreviation markers.
	 */
	public IsAbbreviation(Pattern[] abbreviations) {
		this.abbreviations = abbreviations;
	}
	
	/**
	 * Tests whether the given token is an abbreviation.
	 */
	@Override
	public boolean test(Token token) {
		if (ABBREVIATION_PATTERN.matcher(token.getCoveredText()).matches())
			return true;
		
		for (Pattern abbreviation : abbreviations) {
			if (abbreviation.matcher(token.getCoveredText()).matches())
				return true;
		}
		
		return false;
	}
	
}
