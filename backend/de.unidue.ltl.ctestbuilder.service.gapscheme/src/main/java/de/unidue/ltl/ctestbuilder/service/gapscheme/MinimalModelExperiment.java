package de.unidue.ltl.ctestbuilder.service.gapscheme;

import static org.apache.uima.fit.factory.AnalysisEngineFactory.createEngineDescription;
import static org.dkpro.tc.api.features.TcFeatureFactory.create;

import java.util.ArrayList;
import java.util.List;

import org.apache.uima.analysis_engine.AnalysisEngineDescription;
import org.dkpro.tc.api.features.TcFeatureSet;

import de.tudarmstadt.ukp.dkpro.core.corenlp.CoreNlpPosTagger;
import de.tudarmstadt.ukp.dkpro.core.matetools.MateLemmatizer;
import de.tudarmstadt.ukp.dkpro.core.opennlp.OpenNlpChunker;
import de.tudarmstadt.ukp.dkpro.core.opennlp.OpenNlpNamedEntityRecognizer;
import de.tudarmstadt.ukp.dkpro.core.opennlp.OpenNlpPosTagger;
import de.tudarmstadt.ukp.dkpro.core.stanfordnlp.StanfordNamedEntityRecognizer;
import de.unidue.ltl.ctest.core.TestType;
import de.unidue.ltl.ctest.difficulty.experiments.Experiment;
import de.unidue.ltl.ctest.difficulty.features.candidate.StringSimilarityCandidatesExtractor;
import de.unidue.ltl.ctest.difficulty.features.readability.NumberOfChunksExtractor;
import de.unidue.ltl.ctest.difficulty.features.readability.PronounRatioExtractor;
import de.unidue.ltl.ctest.difficulty.features.readability.TypeTokenRatioExtractor;
import de.unidue.ltl.ctest.difficulty.features.wordDifficulty.CharLangModelProbExtractor;
import de.unidue.ltl.ctest.difficulty.features.wordDifficulty.GapLengthExtractor;
import de.unidue.ltl.ctest.difficulty.features.wordDifficulty.IsFunctionWordExtractor;
import de.unidue.ltl.ctest.difficulty.features.wordDifficulty.LengthExtractor;


public class MinimalModelExperiment extends Experiment {
	
	public static final String CHAR_LM_PATH = "src/main/resources/charlm/";

	public static List<AnalysisEngineDescription> getPreprocessingForLanguage(String languageCode) throws Exception {
		List<AnalysisEngineDescription> preprocessing = new ArrayList<>();
		preprocessing.add(createEngineDescription(MateLemmatizer.class, MateLemmatizer.PARAM_LANGUAGE, languageCode));
		if (languageCode == "fr") {
			preprocessing.add(createEngineDescription(CoreNlpPosTagger.class, 
					CoreNlpPosTagger.PARAM_LANGUAGE, languageCode));
		} else {
			preprocessing.add(createEngineDescription(OpenNlpPosTagger.class, OpenNlpPosTagger.PARAM_LANGUAGE, languageCode));			
		}
		preprocessing.add(createEngineDescription(OpenNlpChunker.class, OpenNlpChunker.PARAM_LANGUAGE, "en"));
		if (languageCode.equals("de")) {
			preprocessing.add(createEngineDescription(OpenNlpNamedEntityRecognizer.class, 
					OpenNlpNamedEntityRecognizer.PARAM_LANGUAGE, languageCode, 
					OpenNlpNamedEntityRecognizer.PARAM_VARIANT, "nemgp"));
		} else if (!languageCode.equals("fr")) {
			preprocessing.add(createEngineDescription(StanfordNamedEntityRecognizer.class, StanfordNamedEntityRecognizer.PARAM_LANGUAGE, languageCode));
		}
		
		return preprocessing;
	}
	
	public static TcFeatureSet getFeaturesForLanguage(String languageCode) throws Exception {
		TcFeatureSet features = new TcFeatureSet();
		// item level features
		features.add(create(LengthExtractor.class));
		features.add(create(StringSimilarityCandidatesExtractor.class));		
		features.add(create(IsFunctionWordExtractor.class));
		features.add(create(GapLengthExtractor.class));
		
		// test level features
		if (languageCode.equals("en")) {
			features.add(create(NumberOfChunksExtractor.class));			
		}
		features.add(create(TypeTokenRatioExtractor.class));
		features.add(create(PronounRatioExtractor.class));

		if (languageCode.equals("en") || languageCode.equals("de")) {
			features.add(create(CharLangModelProbExtractor.class,
		       		 CharLangModelProbExtractor.PARAM_UNIQUE_EXTRACTOR_NAME, CharLangModelProbExtractor.class.getName(),
		       		 CharLangModelProbExtractor.PARAM_LM_FILE, CHAR_LM_PATH + languageCode + "_3grm.binary",
		       		 CharLangModelProbExtractor.PARAM_TESTTYPE, TestType.ctest.toString()));
		}
		
		return features;
	}

	
	public MinimalModelExperiment(String name, String languageCode) throws Exception {	
		this.setExperimentName(name);
		this.setPreprocessing(getPreprocessingForLanguage(languageCode));
		this.setFeatureSet(getFeaturesForLanguage(languageCode));
	}
}
