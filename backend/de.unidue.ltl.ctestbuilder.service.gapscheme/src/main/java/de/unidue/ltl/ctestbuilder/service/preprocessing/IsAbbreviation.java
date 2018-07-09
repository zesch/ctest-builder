package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.regex.Pattern;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

public class IsAbbreviation implements Predicate<Token> {
	
	private static Map<String, String[]> LANGUAGE_ABBREVIATIONS;
	static {
		//TODO: fill with abbreviations
		String[] german = new String[] {
				"bzgl\\.",
				"usw\\.",
				"u\\.A\\."
		};
		String[] english = new String[] {};
		String[] french = new String[] {};
		String[] spanish = new String[] {};
		String[] italian = new String[] {};
		String[] finnish = new String[] {};
		
		LANGUAGE_ABBREVIATIONS = new HashMap<>();
		LANGUAGE_ABBREVIATIONS.put("de", german);
		LANGUAGE_ABBREVIATIONS.put("en", english);
		LANGUAGE_ABBREVIATIONS.put("fr", french);
		LANGUAGE_ABBREVIATIONS.put("es", spanish);
		LANGUAGE_ABBREVIATIONS.put("it", italian);
		LANGUAGE_ABBREVIATIONS.put("fi", finnish);
	}
	
	private Pattern abbreviationPattern = Pattern.compile("([a-zA-z]+\\.)+");
	private List<Pattern> abbreviations;
	
	public IsAbbreviation(String language) {
		String[] languageAbbreviations = LANGUAGE_ABBREVIATIONS.get(language);
		if (languageAbbreviations == null)
			languageAbbreviations = new String[] {};
		
		abbreviations = new ArrayList<>();
		for (String abbreviation : languageAbbreviations)
			abbreviations.add(Pattern.compile(abbreviation));		
	}
	
	@Override
	public boolean test(Token token) {
		for (Pattern abbreviation : abbreviations) {
			if (abbreviation.matcher(token.getCoveredText()).matches())
				return true;
		}
		
		return abbreviationPattern.matcher(token.getCoveredText()).matches();
	}
}
