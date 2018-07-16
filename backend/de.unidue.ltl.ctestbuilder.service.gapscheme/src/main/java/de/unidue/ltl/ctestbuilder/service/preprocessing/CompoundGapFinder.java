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

/**
 * A {@link GapIndexFinder} for compound words. 
 * If a word is a compound word (as tested by the {@code test} method,
 * the gap, where a gap may be placed is set to the start of the last compound.
 * For instance, for the word "hyphen-craze", the start of the gappable range would be set to "c".
 * <p>
 * <b>NOTE:</b> Since this implementation uses the <a href="https://dkpro.github.io/dkpro-core/">DKPro Framework</a> to find compounds, 
 * a {@code JCas} object is required by the constructor.
 * 
 * @see org.apache.uima.jcas.JCas
 * @see de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token
 * @see de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Compound
 */
public class CompoundGapFinder implements GapIndexFinder {

	private Map<Token, Collection<Compound>> index;
	
	/**
	 * Creates a new {@code CompoundGapFinder}, using the specified {@code JCas}.
	 * The {@code JCas} should contain {@code Compound} and {@code Token} Annotations.
	 * 
	 * @return The created {@code CompoundGapFinder}.
	 * 
	 * @see org.apache.uima.jcas.JCas
	 * @see org.apache.uima.jcas.tcas.Annotation
	 * @see de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token
	 * @see de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Compound
	 */
	public CompoundGapFinder(JCas jcas) {
		index = JCasUtil.indexCovering(jcas, Token.class, Compound.class);
	}
	
	/**
	 * Tests whether a given token is a compound word.
	 */
	@Override
	public boolean test(Token token) {
		if (index.get(token).isEmpty())
			return false;
		return true;
	}
	
	/**
	 * Returns the start index of the gappable area for the given token.
	 * The index is equal to the start of the last compound part of the given token.
	 * 
	 * @param  token The token.
	 * @return The start index of the gappable area of {@code token}.
	 */
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
