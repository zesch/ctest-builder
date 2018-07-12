package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.apache.uima.fit.util.JCasUtil;
import org.apache.uima.jcas.JCas;
import org.apache.uima.jcas.tcas.Annotation;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Compound;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.CompoundPart;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import groovyjarjarantlr.collections.List;

public class CompoundGapFinder implements GapIndexFinder {

	private Map<Token, Collection<Compound>> index;
	
	public CompoundGapFinder(JCas jcas) {
		index = JCasUtil.indexCovering(jcas, Token.class, Compound.class);
	}
	
	@Override
	public boolean test(Token t) {
		if (index.get(t).isEmpty())
			return false;
		return true;
	}

	@Override
	public int getGapIndex(Token token) {
		CompoundPart gapTarget = getLastCompoundPart(token);
		int tokenLength = getLength(token);
		int targetLength = getLength(gapTarget);
		return tokenLength - targetLength;
	}
	
	private CompoundPart getLastCompoundPart(Token token) {
		Compound compound = new ArrayList<>(index.get(token)).get(0);
		int index = compound.getSplits().size() - 1;
		return (CompoundPart) compound.getSplits().get(index);
	}
	
	private int getLength(Annotation annotation) {
		return annotation.getEnd() - annotation.getBegin();
	}

}
