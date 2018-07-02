package de.unidue.ltl.ctestbuilder.service.preprocessing;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

import java.util.Collection;
import java.util.Map;

import org.apache.uima.jcas.tcas.Annotation;
import org.apache.uima.analysis_engine.AnalysisEngineDescription;

public interface Criterion {
	public boolean applies(Token toCheck);
	public Collection<Class<? extends Annotation>> getPrerequisites();
	public Map<Class<? extends Annotation>, AnalysisEngineDescription> getAnnotationMap();
	public AnalysisEngineDescription getEngineDescription(Class<? extends Annotation> requiredClass);
}
