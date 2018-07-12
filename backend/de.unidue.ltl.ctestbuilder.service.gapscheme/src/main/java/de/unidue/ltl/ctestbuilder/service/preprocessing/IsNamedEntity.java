package de.unidue.ltl.ctestbuilder.service.preprocessing;

import java.util.Collection;
import java.util.Map;
import java.util.function.Predicate;

import org.apache.uima.fit.util.JCasUtil;
import org.apache.uima.jcas.JCas;

import de.tudarmstadt.ukp.dkpro.core.api.ner.type.NamedEntity;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;

public class IsNamedEntity implements Predicate<Token> {
	
	private Map<Token, Collection<NamedEntity>> index;
	
	public IsNamedEntity(JCas aJCas) {
		index = JCasUtil.indexCovering(aJCas, Token.class, NamedEntity.class);
	}
	
	@Override
	public boolean test(Token token) {
		if (!index.get(token).isEmpty())
			System.out.println(index.get(token));
		return !index.get(token).isEmpty();
	}

}
