package de.unidue.ltl.ctestbuilder.service.preprocessing;

import org.apache.uima.UIMAException;
import org.apache.uima.fit.factory.JCasBuilder;
import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.jcas.JCas;
import org.junit.Test;

import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import junit.framework.TestCase;

public class IsNumberTest extends TestCase {

	@Test
	public void testNumbers() throws UIMAException {
		JCas jcas = JCasFactory.createJCas();

		JCasBuilder jcasBuilder = new JCasBuilder(jcas);

		Token number = jcasBuilder.add("1234", Token.class);
		jcasBuilder.add(" ");

		Token isbn = jcasBuilder.add("123-4578-1315", Token.class);
		jcasBuilder.add(" ");

		Token ip = jcasBuilder.add("123.456.7", Token.class);
		jcasBuilder.add(" ");

		Token word = jcasBuilder.add("Two", Token.class);
		jcasBuilder.add(" ");

		Token embedded = jcasBuilder.add("Number1", Token.class);
		jcasBuilder.add(" ");

		jcasBuilder.close();

		IsNumber criterion = new IsNumber();

		assertFalse(criterion.test(word));

		assertTrue(criterion.test(number));
		assertTrue(criterion.test(isbn));
		assertTrue(criterion.test(ip));
		assertTrue(criterion.test(embedded));
	}
}
