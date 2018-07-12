package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.regex.Pattern;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import de.unidue.ltl.ctestbuilder.service.gapscheme.GapScheme;

public class IsAbbreviation implements Predicate<Token> {
	
	private static Pattern ABBREVIATION_PATTERN = Pattern.compile("([a-zA-z]+\\.[-]?)+");
	private static Map<String, Pattern[]> LANGUAGE_ABBREVIATIONS;	
	
	private Pattern[] abbreviations;
	
	static {
		LANGUAGE_ABBREVIATIONS = new HashMap<>();
		
		for (String language : GapScheme.SUPPORTED_LANGUAGES) {
			Path file = Paths.get(String.format("src/main/resources/abbreviations_%s.txt", language));			
			try {
				Pattern[] abbreviations = Files.lines(file).map(Pattern::compile).toArray(Pattern[]::new);
				LANGUAGE_ABBREVIATIONS.put(language, abbreviations);
			} catch (IOException e) {
				LANGUAGE_ABBREVIATIONS.put(language, new Pattern[0]);
				System.err.println("WARNING: Could not read file@" + file.toString());
				System.err.println("\tCheck if file exists and is readable.");
			}
		}
	}
	
	public IsAbbreviation(String language) {
		if (LANGUAGE_ABBREVIATIONS.containsKey(language))
			abbreviations = LANGUAGE_ABBREVIATIONS.get(language);
		else
			abbreviations = new Pattern[0];
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
