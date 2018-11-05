package de.unidue.ltl.ctestbuilder.service.gapscheme;

/**
 * An abstract class, identical to the representation of CTestTokens in the frontend. 
 * Used in responses of the GapScheme Service.
 */
public abstract class FrontendCTestToken {
	public int id;
	public String[] alternatives;
	public boolean gapStatus;
	public int offset;
	public String value;
	public boolean isNormal;
}
