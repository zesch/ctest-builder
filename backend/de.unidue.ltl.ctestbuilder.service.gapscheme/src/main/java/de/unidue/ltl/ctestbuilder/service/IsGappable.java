

/* First created by JCasGen Mon Jul 02 13:10:36 CEST 2018 */
package de.unidue.ltl.ctestbuilder.service;

import org.apache.uima.jcas.JCas; 
import org.apache.uima.jcas.JCasRegistry;
import org.apache.uima.jcas.cas.TOP_Type;

import org.apache.uima.jcas.tcas.Annotation;


/** 
 * Updated by JCasGen Mon Jul 02 13:10:36 CEST 2018
 * XML source: C:/Users/Nev/Projects/_LangTech/ctest/ctest-builder/backend/de.unidue.ltl.ctestbuilder.service.gapscheme/desc/type/IsGappable.xml
 * @generated */
public class IsGappable extends Annotation {
  /** @generated
   * @ordered 
   */
  @SuppressWarnings ("hiding")
  public final static int typeIndexID = JCasRegistry.register(IsGappable.class);
  /** @generated
   * @ordered 
   */
  @SuppressWarnings ("hiding")
  public final static int type = typeIndexID;
  /** @generated
   * @return index of the type  
   */
  @Override
  public              int getTypeIndexID() {return typeIndexID;}
 
  /** Never called.  Disable default constructor
   * @generated */
  protected IsGappable() {/* intentionally empty block */}
    
  /** Internal - constructor used by generator 
   * @generated
   * @param addr low level Feature Structure reference
   * @param type the type of this Feature Structure 
   */
  public IsGappable(int addr, TOP_Type type) {
    super(addr, type);
    readObject();
  }
  
  /** @generated
   * @param jcas JCas to which this Feature Structure belongs 
   */
  public IsGappable(JCas jcas) {
    super(jcas);
    readObject();   
  } 

  /** @generated
   * @param jcas JCas to which this Feature Structure belongs
   * @param begin offset to the begin spot in the SofA
   * @param end offset to the end spot in the SofA 
  */  
  public IsGappable(JCas jcas, int begin, int end) {
    super(jcas);
    setBegin(begin);
    setEnd(end);
    readObject();
  }   

  /** 
   * <!-- begin-user-doc -->
   * Write your own initialization here
   * <!-- end-user-doc -->
   *
   * @generated modifiable 
   */
  private void readObject() {/*default - does nothing empty block */}
     
 
    
  //*--------------*
  //* Feature: isGappable

  /** getter for isGappable - gets 
   * @generated
   * @return value of the feature 
   */
  public boolean getIsGappable() {
    if (IsGappable_Type.featOkTst && ((IsGappable_Type)jcasType).casFeat_isGappable == null)
      jcasType.jcas.throwFeatMissing("isGappable", "types.IsGappable");
    return jcasType.ll_cas.ll_getBooleanValue(addr, ((IsGappable_Type)jcasType).casFeatCode_isGappable);}
    
  /** setter for isGappable - sets  
   * @generated
   * @param v value to set into the feature 
   */
  public void setIsGappable(boolean v) {
    if (IsGappable_Type.featOkTst && ((IsGappable_Type)jcasType).casFeat_isGappable == null)
      jcasType.jcas.throwFeatMissing("isGappable", "types.IsGappable");
    jcasType.ll_cas.ll_setBooleanValue(addr, ((IsGappable_Type)jcasType).casFeatCode_isGappable, v);}    
  }

    