package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.uima.UimaContext;
import org.apache.uima.analysis_engine.AnalysisEngineProcessException;
import org.apache.uima.analysis_engine.AnalysisEngine;
import org.apache.uima.fit.component.JCasAnnotator_ImplBase;
import org.apache.uima.fit.descriptor.ConfigurationParameter;
import org.apache.uima.fit.descriptor.TypeCapability;
import org.apache.uima.fit.factory.AnalysisEngineFactory;
import org.apache.uima.fit.util.JCasUtil;
import org.apache.uima.jcas.JCas;
import org.apache.uima.jcas.tcas.Annotation;
import org.apache.uima.resource.ResourceInitializationException;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import de.unidue.ltl.ctestbuilder.service.IsGappable;

@TypeCapability(
		inputs = { "de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Lemma" },
		outputs = { "de.unidue.ltl.ctestbuilder.service.types.IsGappable" })
public class IsGappableAnnotator extends JCasAnnotator_ImplBase {
	
	public static final String PARAM_LANGUAGE = "language";
    @ConfigurationParameter(name = PARAM_LANGUAGE, mandatory = false)
    String language;
	
    private List<Criterion> exclusionCriteria;
    private IsGappable isGappableAnnotation;
    
	@Override
    public void initialize(UimaContext context)
        throws ResourceInitializationException
    {
        super.initialize(context);
    }
	
	@Override
	public void process(JCas aJCas) throws AnalysisEngineProcessException {
		if (language == null)
			language = aJCas.getDocumentLanguage();
		
		if (exclusionCriteria == null)
			exclusionCriteria = new ArrayList<>();
		
		verifyPrerequisites(aJCas);
		
		for (Token token : JCasUtil.select(aJCas, Token.class)) {
			isGappableAnnotation = new IsGappable(aJCas, token.getBegin(), token.getEnd());
			isGappableAnnotation.setIsGappable(true);

			for (Criterion exclusionCriterion : exclusionCriteria) {
				if (exclusionCriterion.applies(token)) {
					isGappableAnnotation.setIsGappable(false);
					break;
				}
			}
			
			isGappableAnnotation.addToIndexes();
		}
	}
	
	private List<Criterion> getExclusionCriteria() {
		return exclusionCriteria;
	}
	
	private void setExclusionCriteria(Collection<Criterion> criteria) {
		exclusionCriteria.addAll(criteria);
	}
	
	private void verifyPrerequisites(JCas aJCas) {
		List<Criterion> invalidCriteria = new ArrayList<>();
		for (Criterion criterion : exclusionCriteria) {
			for (Class<? extends Annotation> annotation : criterion.getPrerequisites()) {
				if (!JCasUtil.exists(aJCas, annotation)) {
					try {
						AnalysisEngine ae = AnalysisEngineFactory.createEngine(criterion.getEngineDescription(annotation));
						ae.process(aJCas);
					} catch (Exception e) {
						e.printStackTrace();
						invalidCriteria.add(criterion);
					}
				}
			}
		}
		exclusionCriteria.removeAll(invalidCriteria);
	}

}
