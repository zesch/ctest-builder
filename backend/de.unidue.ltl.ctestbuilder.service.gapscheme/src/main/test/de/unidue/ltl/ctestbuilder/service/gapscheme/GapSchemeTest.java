package de.unidue.ltl.ctestbuilder.service.gapscheme;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import de.unidue.ltl.ctest.core.CTestObject;
import de.unidue.ltl.ctest.core.CTestToken;
import junit.framework.TestCase;

public class GapSchemeTest extends TestCase {
	@Test
	public void testJsonConversion() {
		CTestObject ctest = new CTestObject("de");
		
		CTestToken t1 = new CTestToken("Foo");
		t1.setId("1");
		t1.setGap(false);
		t1.setText("Foo");
		
		CTestToken t2 = new CTestToken("BarBarBar");
		t2.setId("2");
		t2.setGap(true);
		t2.setText("BarBarBar");
		
		CTestToken t3 = new CTestToken("baz");
		t3.setId("3");
		t3.setGap(false);
		t3.setText("baz");
		
		ctest.addToken(t1);
		ctest.addToken(t2);
		ctest.addToken(t3);
		
		List<String> warnings = new ArrayList<>();
		warnings.add("All your base are belong to us!");
		warnings.add("This is not an emergency!");
		
		GapScheme gs = new GapScheme();
		String jsonString = gs.toJson(ctest, warnings).toString();
		System.out.println(jsonString);
	}
}
