package de.unidue.ltl.ctestbuilder.service.preprocessing;

import org.apache.uima.UIMAException;
import org.apache.uima.fit.factory.JCasBuilder;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.jcas.JCas;
import org.junit.Test;

import de.tudarmstadt.ukp.dkpro.core.api.ner.type.NamedEntity;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import junit.framework.TestCase;

public class IsNamedEntityTest extends TestCase {

	@Test
	public void testNamedEntity() throws UIMAException {
		JCas jcas = JCasFactory.createJCas();
		JCasBuilder jcasBuilder = new JCasBuilder(jcas);

		Token hey = jcasBuilder.add("Hey", Token.class);
		Token jude = jcasBuilder.add("Jude", Token.class);
		
		jcasBuilder.close();
		
		new NamedEntity(jcas, jude.getBegin(), jude.getEnd()).addToIndexes();
		
		IsNamedEntity criterion = new IsNamedEntity(jcas);
		
		assertFalse(criterion.test(hey));
		assertTrue(criterion.test(jude));
	}
	
}
