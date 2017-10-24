package com.nlpuni.demo;

public class TokenDTO {
	private Integer id;
	private String value;
	private String[] altValue;
	private Integer offset;
	private boolean isGap;
	private boolean isSpecial;
	
	
	public TokenDTO(Integer id, String value, String[] altValue, Integer offset, boolean isGap, boolean isSpecial) {
		super();
		this.id = id;
		this.value = value;
		this.altValue = altValue;
		this.offset = offset;
		this.isGap = isGap;
		this.isSpecial = isSpecial;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String[] getAltValue() {
		return altValue;
	}
	public void setAltValue(String[] altValue) {
		this.altValue = altValue;
	}
	public Integer getOffset() {
		return offset;
	}
	public void setOffset(Integer offset) {
		this.offset = offset;
	}
	public boolean isGap() {
		return isGap;
	}
	public void setGap(boolean isGap) {
		this.isGap = isGap;
	}
	public boolean isSpecial() {
		return isSpecial;
	}
	public void setSpecial(boolean isSpecial) {
		this.isSpecial = isSpecial;
	}
	
	
}
