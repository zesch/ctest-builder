package de.unidue.ltl.ctestbuilder.service.gapscheme;

import static org.apache.uima.fit.factory.AnalysisEngineFactory.createEngine;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.apache.uima.analysis_engine.AnalysisEngine;
import org.apache.uima.fit.factory.ExternalResourceFactory;
import org.apache.uima.jcas.JCas;
import org.apache.uima.resource.ResourceInitializationException;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import de.tudarmstadt.ukp.dkpro.core.decompounding.uima.annotator.CompoundAnnotator;
import de.tudarmstadt.ukp.dkpro.core.decompounding.uima.resource.BananaSplitterResource;
import de.tudarmstadt.ukp.dkpro.core.decompounding.uima.resource.SharedDictionary;
import de.tudarmstadt.ukp.dkpro.core.decompounding.uima.resource.SharedLinkingMorphemes;
import de.tudarmstadt.ukp.dkpro.core.opennlp.OpenNlpNamedEntityRecognizer;
import de.tudarmstadt.ukp.dkpro.core.stanfordnlp.StanfordNamedEntityRecognizer;
import de.tudarmstadt.ukp.dkpro.core.tokit.BreakIteratorSegmenter;
import de.unidue.ltl.ctestbuilder.service.preprocessing.CompoundGapFinder;
import de.unidue.ltl.ctestbuilder.service.preprocessing.FrenchAbbreviationGapFinder;
import de.unidue.ltl.ctestbuilder.service.preprocessing.GapIndexFinder;
import de.unidue.ltl.ctestbuilder.service.preprocessing.HyphenGapFinder;
import de.unidue.ltl.ctestbuilder.service.preprocessing.IsAbbreviation;
import de.unidue.ltl.ctestbuilder.service.preprocessing.IsNamedEntity;
import de.unidue.ltl.ctestbuilder.service.preprocessing.IsNumber;
import de.unidue.ltl.ctestbuilder.service.preprocessing.IsPunctuation;
import de.unidue.ltl.ctestbuilder.service.preprocessing.IsSingleCharacter;

public class CTestResourceProvider {
	
	private static Map<String, List<AnalysisEngine>> analysisEngines = new HashMap<>();
	private static Map<String, List<String>> ABBREVIATIONS = new HashMap<>();	
	
	private static List<String> SUPPORTED_LANGUAGES = Arrays.asList(new String[] { "de", "en", "es", "fi", "fr", "it" });
	
	private CTestResourceProvider() {};
	
	public static List<AnalysisEngine> getAnalysisEngines(String language) throws ResourceInitializationException {
		List<AnalysisEngine> engines = new ArrayList<>();
		List<AnalysisEngine> currentEngines;
		
		currentEngines = analysisEngines.get("all");
		if (currentEngines == null) {
			currentEngines = createAndStoreEngines("all");
		}
		engines.addAll(currentEngines);
		
		currentEngines = analysisEngines.get(language);
		if (currentEngines == null) {
			currentEngines = createAndStoreEngines(language);
		}
		engines.addAll(currentEngines);
				
		return engines;
	}
	
	public static List<String> getAbbreviations(String language) {
		List<String> abbreviations = ABBREVIATIONS.get(language);
		if (abbreviations == null) {
			abbreviations = createAndStoreAbbreviations(language);
		}
		
		return abbreviations;
	}
	
	public static List<Predicate<Token>> getExclusionRules(JCas aJCas, String language) {
		List<Predicate<Token>> rules = new ArrayList<>();
		
		rules.add(new IsSingleCharacter());
		rules.add(new IsNumber());
		rules.add(new IsPunctuation());
		rules.add(new IsAbbreviation(getAbbreviations(language)));
		rules.add(new IsNamedEntity(aJCas));
		
		return rules;
	}
	
	public static List<GapIndexFinder> getGapFinders(JCas aJCas, String language) {
		List<GapIndexFinder> finders = new ArrayList<>();
		
		finders.add(new HyphenGapFinder());
		
		if (language.equals("de")) {
			finders.add(new CompoundGapFinder(aJCas));
		}

		if (language.equals("fr")) {
			finders.add(new FrenchAbbreviationGapFinder());
		}

		return finders;
	}
	
	public static List<String> getSupportedLanguages() {
		return SUPPORTED_LANGUAGES;
	}
	
	private static List<AnalysisEngine> createAndStoreEngines(String language) throws ResourceInitializationException {
		List<AnalysisEngine> engines = new ArrayList<>();
		
		if (language.equals("all")) {
			engines = new ArrayList<>();
			engines.add(createEngine(BreakIteratorSegmenter.class));
			analysisEngines.put("all", engines);
		}
		
		if (language.equals("de")) {
			engines.add(createEngine(StanfordNamedEntityRecognizer.class, 
					StanfordNamedEntityRecognizer.PARAM_VARIANT, "nemgp", 
					StanfordNamedEntityRecognizer.PARAM_LANGUAGE, language));
			engines.add(createEngine(CompoundAnnotator.class, 
					CompoundAnnotator.PARAM_SPLITTING_ALGO,
					ExternalResourceFactory.createExternalResourceDescription(BananaSplitterResource.class,
							BananaSplitterResource.PARAM_DICT_RESOURCE,
							ExternalResourceFactory.createExternalResourceDescription(SharedDictionary.class),
							BananaSplitterResource.PARAM_MORPHEME_RESOURCE,
							ExternalResourceFactory.createExternalResourceDescription(SharedLinkingMorphemes.class))));
			analysisEngines.put("de", engines);
		}

		if (language.equals("en")) {
			String[] nerVariants = new String[] { "date", "location", "money", "person", "organization", "time", "percentage" };
			for (String variant : nerVariants)
			engines.add(createEngine(OpenNlpNamedEntityRecognizer.class, 
					OpenNlpNamedEntityRecognizer.PARAM_VARIANT, variant, 
					OpenNlpNamedEntityRecognizer.PARAM_LANGUAGE, language));
			analysisEngines.put("en", engines);
		}
		
		if (language.equals("es")) {
			String[] nerVariants = new String[] { "location", "misc", "person", "organization" };
			for (String variant : nerVariants)
				engines.add(createEngine(OpenNlpNamedEntityRecognizer.class, 
						OpenNlpNamedEntityRecognizer.PARAM_VARIANT, variant, 
						OpenNlpNamedEntityRecognizer.PARAM_LANGUAGE, language));
			analysisEngines.put("es", engines);
		}
		
		return engines;
	}
	
	private static List<String> createAndStoreAbbreviations(String language) {
		List<String> abbreviations = new ArrayList<>();
		
		if (SUPPORTED_LANGUAGES.contains(language)) {
			Path file = Paths.get(String.format("src/main/resources/abbreviations_%s.txt", language));			
			try {
				abbreviations = Files.lines(file).collect(Collectors.toList());
			} catch (IOException e) {
				System.err.println("WARNING: Could not read file@" + file.toString());
				System.err.println("\tCheck if file exists and is readable.");
			}
			ABBREVIATIONS.put(language, abbreviations);
		}
		
		return abbreviations;
	}
}
