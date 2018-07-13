package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.List;
import java.util.function.Predicate;
import java.util.regex.Pattern;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

public class IsAbbreviation implements Predicate<Token> {
	
	private static final Pattern ABBREVIATION_PATTERN = Pattern.compile("([a-zA-z]+\\.[-]?)+");
	private Pattern[] abbreviations;
		
	public IsAbbreviation(List<String> abbreviations) {
		this.abbreviations = abbreviations.stream().map(Pattern::compile).toArray(Pattern[]::new);
	}
	
	public IsAbbreviation(Pattern[] abbreviations) {
		this.abbreviations = abbreviations;
	}
	
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
