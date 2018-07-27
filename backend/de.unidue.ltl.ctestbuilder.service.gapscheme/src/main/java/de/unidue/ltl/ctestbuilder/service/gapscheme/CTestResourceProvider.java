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
import de.unidue.ltl.ctestbuilder.service.preprocessing.IsSimpleNamedEntity;
import de.unidue.ltl.ctestbuilder.service.preprocessing.IsTooShort;

/**
 * A class providing required resources for {@link CTestBuilder} objects.
 * Provides both general and language specific resources.
 * <p>
 * Resources include <ul>
 * <li> A list of supported languages.
 * <li> Exclusion criteria for gapping.
 * <li> {@code GapIndexFinder} objects.
 * <li> {@code AnalysisEngine} objects for necessary preprocessing steps.
 * <li> Abbreviations for {@code IsAbbreviation} predicates.
 * </ul>
 * 
 * @see de.unidue.ltl.ctestbuilder.service.preprocessing.GapIndexFinder
 * @see de.unidue.ltl.ctestbuilder.service.preprocessing.IsAbbreviation
 * @see org.apache.uima.analysis_engine.AnalysisEngine
 */
public class CTestResourceProvider {
	
	private static Map<String, List<AnalysisEngine>> analysisEngines = new HashMap<>();
	private static List<String> SUPPORTED_LANGUAGES = Arrays.asList(new String[] { "de", "en", "es", "fi", "fr", "it" });
	private static Map<String, List<String>> ABBREVIATIONS = new HashMap<>();	

	static {
		ABBREVIATIONS.put("de", Arrays.asList(new String[] {"a", "aA", "aaO", "aaS", "aD", "ad", "AdHrsg", "AdÜ", "aG", "aglO", "ang", "aS", "Abb", "Abf", "Abg", "abg", "Abh", "Abk", "abk", "Abs", "Abw", "Abz", "Adir", "Adj", "adj", "Adr", "Adv", "adv", "Afr", "Ag", "agg", "Aggr", "Ahg", "Anh", "Akad", "akad", "Akk", "Alg", "allg", "alph", "altgr", "Am", "Amp", "amtl", "Amtsbl", "An", "anat", "anerk", "Anf", "Anfr", "Ang", "angekl", "Angel", "Angest", "angew", "Ank", "Anl", "anl", "Anm", "Ann", "ann", "anon", "Anord", "Anp", "ANr", "Ans", "Ansch-K", "Ansch", "anschl", "Anschr", "Anspr", "Antiq", "Antr", "Antw", "Anw-L", "Anz", "Apart", "apl", "App", "Apr", "apr", "Aq", "Arbf", "Arbg", "Arbn", "ArbN", "Arch", "arr", "Art/Artt", "Art-Nr", "Asp", "Ass", "Assist", "ASt", "Astrol", "astron", "asym", "asymp", "At", "Atl", "Atm", "Attr", "Aufb", "Aufbew", "Aufg", "Aufkl", "Aufl", "Ausg", "ausschl", "Az", "Änd", "Äq", "ärztl", "ästh", "äth", "b", "bw", "Ba", "Bd", "Bde", "beil", "bes", "Best-Nr", "Betr", "bez", "Bez", "Bhf", "Bil", "Bl", "brosch", "Bsp", "bspw", "bzgl", "bzw", "ct", "ca", "dÄ", "dGr", "dh", "di", "dJ", "dM", "dO", "dR", "dU", "dVf", "DDr", "desgl", "dgl", "Dipl", "Dr", "Dr-Ing", "Drjur", "Drmed", "Drmeddent", "Drmedvet", "Drphil", "Drrernat", "Drrerpol", "Drtheol", "Dres", "PhD", "dt", "dtsch", "dto", "Dtz", "Dtzd", "eh", "eV", "ebd", "Ed", "ehem", "eig", "eigtl", "einschl", "entspr", "erg", "etal", "etc", "etcpp", "ev", "evtl", "exkl", "Expl", "Exz", "f", "fdR", "Fa", "Fam", "ff", "Forts", "Fr", "frdl", "Frhr", "Frl", "frz", "Gbf", "geb", "Gebr", "gegr", "geh", "gek", "Ges", "gesgesch", "gesch", "Geschw", "gest", "Gew", "gez", "ggf", "Hbf", "hg", "hL", "hl", "Hr(n)", "Hrsg", "Hs", "ia", "iallg", "iA", "iAllg", "iA", "idR", "ie", "ieS", "iHv", "iJ", "iR", "iS", "iV", "iW", "iwS", "iZm", "id", "Ing", "Inh", "inkl", "Jb", "Jg", "Jh", "Jkr", "jr", "jun", "Kap", "kart", "kath", "Kfm", "kfm", "kgl", "Kl", "Komp", "Kr", "Kto", "led", "lfd", "lfdm", "lfdNr", "Lfg", "Lfrg", "lt", "Ltn", "luth", "mAn", "maW", "mE", "mW", "math", "mdB", "Min", "Mio", "Mill", "möbl", "Mrd", "Md", "Mia", "Ms", "Mskr", "mtl", "MwSt", "Mz", "Nachf", "Nchf", "nChr", "nJ", "nM", "NN", "nachm", "Nds", "Nr", "No", "Nrn", "Nos", "o", "oÄ", "oB", "oBdA", "oBdA", "oJ", "oP", "Obb", "op", "pA", "Pf", "Pfd", "pp", "ppa", "Pfr", "Pkt", "Prof", "Prov", "ps", "qed", "r-k", "rk", "rd", "Reg-Bez", "Rel", "resp", "Rhh", "Rhld", "S", "sa", "sd", "so", "st", "su", "sZ", "Sa", "sen", "spez", "Spk", "sog", "spec", "St", "Skt", "St", "Std", "Str", "stud", "svw", "svw", "Tel", "Tsd", "uAwg", "u", "ua", "uam", "uÄ", "udM", "udgl(m)", "uE", "uU", "uüV", "uva", "uvm", "uW", "üdM", "Univ-Prof", "urspr", "usf", "usf", "usw", "usw", "v", "V", "va", "vChr", "vgu", "vH", "vJ", "vM", "vT", "Verf", "Vf", "verh", "Verl", "Vers", "vers", "verw", "vgl", "vorm", "Vors", "wo", "Wwe", "Wwr", "Wz", "zB", "zdA", "zH", "zHd", "zK", "zKts", "zS", "zT", "zz", "zzt", "zz", "zZ", "zZt", "Ztg", "Ztr", "Ztschr", "zus", "zw", "zzgl ", "A ", "a ", "AA ", "Abez ", "ABGB ", "Abo ", "ABz", "Abz ", "AD ", "ADAC ", "ADHGB ", "AE ", "AEG ", "AfA ", "AFB ", "AFeB ", "AFG ", "AG ", "AGB ", "AGBz ", "AK ", "AktZ ", "AL ", "Alu ", "AnV ", "AnwK ", "AOK ", "APA ", "APO", "Apo ", "AR ", "ArbA ", "ArbNV ", "ARD ", "Arge ", "ARI ", "AStA ", "ASV ", "ASVÖ ", "AT", "AT", "ATM ", "atü ", "AUA ", "B ", "BAT ", "BDI ", "BA", "BA", "BA", "BSc", "BSc", "BSc", "Bf ", "BGB ", "BGSt ", "BLZ ", "BND ", "BR ", "BRD ", "BRT ", "BRZ ", "C ", "CD ", "CDU ", "CH ", "cl ", "cm ", "CPU ", "CSU ", "CVJM ", "DAAD ", "DACH", "D-A-CH ", "DAG ", "DANN ", "dB ", "DB ", "DBB ", "DDR ", "DFB ", "DGB ", "DIN ", "DKP ", "dl ", "DLR ", "DLRG ", "DM ", "dpa ", "DRK ", "DRM ", "DSG ", "DVD ", "PhD", "PhD", "DPhil ", "dz ", "E ", "EDV ", "eG ", "EG ", "eGmbH ", "EKD ", "EKG ", "EU ", "EURATOM ", "EVG ", "EVU ", "EZU ", "EZÜ ", "F ", "FC ", "FDP ", "FH ", "FKK ", "fm ", "FOS ", "FU ", "g ", "GewO ", "GB", "GBC", "GBA ", "GEZ ", "GG ", "GmbH ", "GPRS ", "ha ", "HGB ", "hl ", "HLA ", "Hptm ", "HR ", "HS ", "HWK ", "IAA", "IC", "IG", "IHK", "Interpol", "IOK", "ISO", "IWF", "JH", "KFZ", "Kfz", "kg", "KG", "kHz", "KHz", "km", "KP", "Krad", "Kripo", "kW", "KZ", "l", "L", "LKW", "Lkw", "LP", "MA", "MA", "MA", "MA", "MA", "MSc", "MSc", "MSc", "m", "m²", "m/s", "mA", "MAD", "mb", "MC", "MdB", "MdB", "MdL", "MdL", "MEZ", "MfG", "mfg", "mg", "MG", "MHz", "mm", "MMS", "MOQ", "MP", "MP3", "N", "NDR", "NO", "NOK", "NS", "NT", "NT", "NW", "O", "OAS", "OB", "ÖBB", "OEZ", "OHG", "OP", "ÖPNV", "ORF", "ORG", "ÖTV", "PC", "PD", "PGA", "PH", "PKW", "Pkw", "PS", "PSchA", "q", "qkm", "qm", "R", "rh", "Rh", "rm", "S-Bahn", "S", "SaZ", "SBB", "SIM", "SMS", "SO", "SPD", "SS", "StGB", "StPO", "StVO", "SV", "SV", "SW", "t", "Tb", "Tbc", "TEE", "TH", "TL", "TU", "TÜV", "TV", "USt", "U/min", "UA", "UFO", "UID", "UKW", "USV", "USW", "V", "VDE", "verdi", "vH", "VHS", "VVaG", "VersVG", "VW", "W", "WAP", "WDR", "WEZ", "WGB", "WM", "WMA", "WS", "ZE", "ZDF", "ZPO", "ZVS"}));
		ABBREVIATIONS.put("en", Arrays.asList(new String[] {"approx", "b/c", "b/4", "bk", "C", "c", "cf", "cp", "def", "diff", "ea", "eg", "fr", "etc", "gen", "ie", "impt", "NB ", "nec", "no", "pt", "p", "re", "sim", "s/t", "T", "adm", "adj", "abr", "abbr", "acad", "aka", "app", "assoc", "biol", "bibliog", "bot", "cap", "chap", "chem", "co", "colloq", "conf", "cont", "com", "cr"}));
		ABBREVIATIONS.put("es", Arrays.asList(new String[] {"Av.", "Avda", "aprox.", "bco.", "c/", "c/c", "cta.", "Da.", "D.", "dcha.", "Dep.", "Dr.", "Dra.", "ej.", "entlo.", "fig.", "Hnos.", "izq.", "n°", "p.", "pp.", "p.a.", "p.ej.", "RAE", "RFA", "s.", "S.A.", "Sra.", "Sr.", "Ud.", "Vd.", "Uds.", "Vds.", "vol."}));
		ABBREVIATIONS.put("fi", Arrays.asList(new String[] {"esim", "jne", "klo", "pvm", "huom", "ko", "vrt", "yms", "mm"}));
		ABBREVIATIONS.put("fr", Arrays.asList(new String[] {"a", "adr.", "Alb.", "app.", "apr. J.-C.", "art.", "av.", "av. J.-C.", "BD", "bibl.", "boul.", "bur.", "c.", "CA ou c. a.", "c.-à -d.", "C.-B.", "c. c.", "c. élec.", "ch.", "ch.", "chap.", "ch. de f.", "Cie", "coll.", "C.P.", "C.R.", "Cté", "CV", "dom.", "Dr", "Dr", "Dre", "Dre", "E.", "éd.", "édit.", "enr.", "env.", "etc.", "é.-U.", "ex.", "excl.", "exp.", "féd.", "FM", "gouv.", "H. ou haut.", "HT", "id.", "inc.", "incl.", "àŽ.-P.-é.", "l. ou larg.", "l. ou long.", "ltée", "M.", "Man.", "max.", "MD", "Me", "Mes", "min.", "Mlle", "Mlles", "MM.", "Mme", "Mmes", "N.", "N. B.", "N.-B.", "nbre", "NDLR", "NDT", "N.-é.", "No ou no", "Nos ou nos", "Nt.", "O.", "o", "Ont.", "p.", "p. c. ou p. cent", "p. c. q.", "p.-d. g. ou pdg", "p. ex.", "pH", "p. j.", "Pr ou Pr", "Pre ou Pre", "prov.", "prov.", "P.-S.", "p.-v.", "Qc", "qq.", "qqch.", "qqn", "quest. ou Q.", "RC ou r.-de-ch.", "réf.", "rép. ou R.", "ro", "RSVP", "rte ou rte", "r.-v.", "s.", "S.", "Sask.", "sc.", "St", "Sts", "Ste", "Stes", "Sté", "SVP ou svp", "t.", "tél.", "tél. cell.", "T.-N.-L.", "T. N.-O", "TTC ou t.t.c.", "V. ou v.", "vo", "vol.", "v.-p.", "Yn"}));
		ABBREVIATIONS.put("it", Arrays.asList(new String[] {"a", "ab", "abbigl", "abbrev", "abl", "aC", "ac", "acc", "accorc", "accr", "adatt", "adr", "aeron", "aerodin", "affl", "agg", "agr", "agric", "alch", "alg", "alim", "allev", "allus", "alt", "anat", "anat comp", "ant", "antifr", "anton", "antrop", "ar", "arald", "arc", "arch", "archeol", "aritm", "arred", "art", "arti min", "artig", "artigl", "artt", "assic", "assol", "astr", "astrol", "astron", "att", "attrav", "aus", "autom", "avv", "avvers", "B", "b", "bal", "ball", "batt", "bibl", "bioch", "biol", "bot", "bur", "C", "ca", "cal", "cap", "capol", "card", "caus", "cd", "cd'a", "centr", "cfr", "chim", "chim ind", "chir", "ciber", "cin", "citol", "class", "cm", "cod civ", "cod pen", "cod proc civ", "cod proc pen", "coll", "com", "comm", "comp", "compar", "compl", "conc", "concl", "condiz", "confr", "cong", "congiunt", "coniug", "consec", "contab", "contr", "corr", "correl", "corrisp", "cost", "costr", "cristall", "cron", "cuc", "cvd", "D", "dC", "dat", "decoraz", "denom", "deriv", "derm", "determ", "dial", "difett", "dimin", "dimostr", "dipart", "diplom", "Dir", "dir", "Dir Amm", "Dir Can", "Dir Civ", "Dir d lav", "Dir internaz", "Dir it", "Dir pen", "Dir priv", "Dir proces", "Dir pub", "Dir rom", "disus", "Dott", "Dr", "E", "E", "eban", "ebr", "ecc", "eccl", "econ", "econ az", "econ dom", "econ pol", "ed", "edil", "edit", "egiz", "elab", "elettr", "elettron", "ellitt", "embr", "enclic", "enigm", "enol", "entom", "epigr", "es", "escl", "estens", "estr min", "etim", "etn", "etol", "eufem", "F", "f", "fam", "farm", "ferr", "fig", "filat", "filol", "filos", "fin", "fis", "fisiol", "fisiopatol", "folcl", "fon", "fotogr", "fr", "fut", "G", "g", "g", "gen", "geneal", "geod", "geofis", "geogr", "geogr antr", "geogr fis", "geol", "geom", "germ", "giorn", "gr", "gram", "H", "h", "ha", "Hz", "I", "ibid", "icon", "id", "idraul", "ig", "imp", "imper", "imperf", "impers", "ind", "ind agr", "ind alim", "ind cart", "ind chim", "ind cuoio", "ind estratt", "ind graf", "ind mecc", "ind tess", "indecl", "indef", "indeterm", "inf", "inform", "ing", "ingl", "ins", "inter", "intr", "invar", "iron", "irreg", "is", "istol", "it", "ittiol", "K", "kg", "km", "kmq", "kW", "kWh", "L", "l", "l", "lat", "lav femm", "lav pubbl", "lett", "ling", "lit", "loc", "loc div", "long", "M", "m", "m", "m°", "m²", "macch", "mar", "mat", "mater", "max", "mecc", "med", "mediev", "merc", "merid", "metall", "meteor", "metr", "metrol", "microb", "mil", "min", "miner", "mitol", "mod", "morf", "mq", "mss", "mus", "N", "N", "n", "na", "NE", "neg", "neol", "neur", "NO", "nom", "numism", "O", "O", "oc", "occ", "occult", "oculist", "od", "ogg", "oland", "onomat", "ord", "ord scol", "oref", "orient", "ornit", "orogr", "ott", "P", "p", "pa", "pag/p", "pagg/pp", "paleobot", "paleogr", "paleont", "paleozool", "paletn", "papir", "parapsicol", "part", "partic", "pass", "patol", "pedag", "pegg", "perind", "pers", "petr", "petrogr", "pitt", "pl", "poet", "pol", "popol", "port", "poss", "pr", "pref", "preist", "prep", "pres", "pret", "priv", "prof", "pron", "pronom", "propr", "prov", "prox", "psicoan", "psicol", "Q", "qlc", "qlco", "qlcu", "qualif", "R", "radiotecn", "rag", "rar", "recipr", "reg", "region", "rel", "rem", "rep", "retor", "rifl", "rit", "rom", "S", "s", "S", "s", "scherz", "scien", "scult", "SE", "sec", "secc", "seg", "segg", "sigill", "sig", "sigg", "sigra", "signa", "simb", "sin", "sing", "s/m", "SO", "sociol", "sogg", "sp", "spett", "spreg", "SS", "st", "stat", "st d arte", "st d dir", "st d filos", "st d rel", "suff", "sup", "superl", "T", "t", "t", "tav", "tecn", "tecnol", "ted", "tel", "telecom", "temp", "teol", "term", "tess", "tipogr", "top", "topog", "tosc", "tr", "trad", "trasp", "tv", "U", "ungh", "urban", "V", "v", "val", "vd", "veter", "vezz", "voc", "vol", "volg", "voll", "Z", "zool", "zoot"}));
	}
	
	/**
	 * Returns a list of {@code AnalysisEngine} objects for the given language.
	 * 
	 * @param  language The language for which the the {@code AnalysisEngine}s are built, 
	 * "all" returns language independent analysisEngines.
	 * {@code language} must be an ISO 639-1 language code.
	 * @return The engines.
	 */
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
	
	/**
	 * Returns a list of abbreviations for the given language.
	 * 
	 * @param  language The language of the abbreviations. Must be an ISO 639-1 language code.
	 * @return The abbreviations.
	 */
	public static List<String> getAbbreviations(String language) {
		List<String> abbreviations = ABBREVIATIONS.get(language);
		
		if (abbreviations == null)
			return new ArrayList<String>();
		
		return abbreviations;
	}
	
	/**
	 * Returns a list of gapping exclusion criteria for the given {@code JCas} and language.
	 * 
	 * @param  aJCas The JCas to which the exclusion criteria are going to be applied.
	 * @param  language The language to which the exclusion criteria are going to be applied. 
	 * Must be a ISO 639-1 language string.
	 * @return The exclusion criteria.
	 */
	public static List<Predicate<Token>> getExclusionRules(JCas aJCas, String language) {
		List<Predicate<Token>> rules = new ArrayList<>();
		
		rules.add(new IsTooShort());
		rules.add(new IsNumber());
		rules.add(new IsPunctuation());
		rules.add(new IsAbbreviation(getAbbreviations(language)));
		rules.add(new IsNamedEntity(aJCas));
		
		for (String lang : new String[] {"en", "fr", "fi", "it"}) {
			if (language.equals(lang))
				rules.add(new IsSimpleNamedEntity(aJCas));
		}
		
		return rules;
	}
	
	/**
	 * Returns a list of gap index finders for the given {@code JCas} and language.
	 * 
	 * @param  aJCas The JCas to which the index findesrs are going to be applied.
	 * @param  language The language to which index finders are going to be applied. 
	 * Must be a ISO 639-1 language string.
	 * @return The index finders.
	 */
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
	
	/**
	 * Returns a list of languages, currently supported by the {@code CTestBuilder} Service. 
	 */
	public static List<String> getSupportedLanguages() {
		return SUPPORTED_LANGUAGES;
	}
	
	/*
	 * Returns AnalysisEnginges for the given language. 
	 * Engines are first created and then added to the AnalysisEngine Store.
	 * In this way, engines only need to be created once, reducing processing times on following runs.
	 */
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
			String[] nerVariants = new String[] { "date", "money", "organization", "location", "percentage", "person", "time" };
			for (String variant : nerVariants)
				engines.add(createEngine(OpenNlpNamedEntityRecognizer.class, 
						OpenNlpNamedEntityRecognizer.PARAM_VARIANT, variant, 
						OpenNlpNamedEntityRecognizer.PARAM_LANGUAGE, language));
			analysisEngines.put(language, engines);
		}
		
		if (language.equals("es")) {
			String[] nerVariants = new String[] { "location", "misc", "person", "organization" };
			for (String variant : nerVariants)
				engines.add(createEngine(OpenNlpNamedEntityRecognizer.class, 
						OpenNlpNamedEntityRecognizer.PARAM_VARIANT, variant, 
						OpenNlpNamedEntityRecognizer.PARAM_LANGUAGE, language));
			analysisEngines.put(language, engines);
		}
		
		return engines;
	}
	
	/*
	 * Returns the list of abbreviations for the given language. 
	 * Abbreviations are read from file and then stored for future use.
	 * In this way, the abbreviations only need to be read once.
	 */
	private static List<String> createAndStoreAbbreviations(String language) {
		List<String> abbreviations = new ArrayList<>();
		
		if (SUPPORTED_LANGUAGES.contains(language)) {
			//FIXME: Location on Webapp Server must be different.
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
	
	private CTestResourceProvider() {};
}
