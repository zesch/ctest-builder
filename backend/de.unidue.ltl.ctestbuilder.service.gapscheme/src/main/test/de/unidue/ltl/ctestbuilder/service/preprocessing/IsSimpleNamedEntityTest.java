package de.unidue.ltl.ctestbuilder.service.preprocessing;

import org.apache.uima.UIMAException;
import org.apache.uima.fit.factory.JCasBuilder;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.jcas.JCas;
import org.junit.Test;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import junit.framework.TestCase;

public class IsSimpleNamedEntityTest extends TestCase {

	@Test
	public void testIsSimpleNamedEntity() throws UIMAException {
		JCas jcas = JCasFactory.createJCas();
		JCasBuilder jcasBuilder = new JCasBuilder(jcas);

		Token ne1 = jcasBuilder.add("Walter", Token.class);
		jcasBuilder.add(" ");
		
		Token word = jcasBuilder.add("is", Token.class);
		jcasBuilder.add(" ");

		jcasBuilder.add("rad", Token.class);
		jcasBuilder.add(".", Token.class);
		
		Token word2 = jcasBuilder.add("Dinosaurs", Token.class);
		jcasBuilder.add(" ");
		
		Token ne2 = jcasBuilder.add("Álastair", Token.class);
		jcasBuilder.add(" ");
		
		jcasBuilder.close();

		IsSimpleNamedEntity criterion = new IsSimpleNamedEntity(jcas);

		assertTrue(criterion.test(ne1));
		assertTrue(criterion.test(ne2));
		
		assertFalse(criterion.test(word));
		assertFalse(criterion.test(word2));
	}
}
