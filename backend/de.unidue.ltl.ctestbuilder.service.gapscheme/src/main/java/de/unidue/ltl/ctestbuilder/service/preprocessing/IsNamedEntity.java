package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.Collection;
import java.util.Map;
import java.util.function.Predicate;

import org.apache.uima.fit.util.JCasUtil;
import org.apache.uima.jcas.JCas;

import de.tudarmstadt.ukp.dkpro.core.api.ner.type.NamedEntity;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

/**
 * A {@code Predicate}, testing whether a given {@code Token} is a named entity. 
 * 
 * @see java.util.function.Predicate
 * @see org.apache.uima.jcas.JCas
 * @see de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token
 * @see de.tudarmstadt.ukp.dkpro.core.api.ner.type.NamedEntity
 */
public class IsNamedEntity implements Predicate<Token> {
	
	private Map<Token, Collection<NamedEntity>> index;
	
	/**
	 * Creates a {@code IsNamedEntity} object, using the given {@code JCas}.
	 * The {@code JCas} should be annotated with {@code NamedEntity} annotations.
	 */
	public IsNamedEntity(JCas aJCas) {
		index = JCasUtil.indexCovering(aJCas, Token.class, NamedEntity.class);
	}
	
	/**
	 * Tests whether a given token is a named entity. 
	 */
	@Override
	public boolean test(Token token) {
		return !index.get(token).isEmpty();
	}

}
