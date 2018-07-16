package de.unidue.ltl.ctestbuilder.service.preprocessing;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

import java.util.Collection;
import java.util.Map;
import java.util.function.Predicate;

import org.apache.uima.jcas.JCas;
import org.apache.uima.jcas.tcas.Annotation;
import org.apache.uima.analysis_engine.AnalysisEngineDescription;

//TODO: Remove. May be used later, but has no purpose at the moment.
public interface Criterion extends Predicate<Token>{
	public Collection<Class<? extends Annotation>> getRequiredAnnotations();
	public AnalysisEngineDescription getEngineDescription(Class<? extends Annotation> requiredClass);
}
