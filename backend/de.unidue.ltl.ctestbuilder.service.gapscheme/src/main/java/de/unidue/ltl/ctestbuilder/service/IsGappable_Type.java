
/* First created by JCasGen Mon Jul 02 13:10:36 CEST 2018 */
package de.unidue.ltl.ctestbuilder.service;

import org.apache.uima.jcas.JCas;
import org.apache.uima.jcas.JCasRegistry;
import org.apache.uima.cas.impl.TypeImpl;
import org.apache.uima.cas.Type;
import org.apache.uima.cas.impl.FeatureImpl;
import org.apache.uima.cas.Feature;
import org.apache.uima.jcas.tcas.Annotation_Type;

/** 
 * Updated by JCasGen Mon Jul 02 13:10:36 CEST 2018
 * @generated */
public class IsGappable_Type extends Annotation_Type {
  /** @generated */
  @SuppressWarnings ("hiding")
  public final static int typeIndexID = IsGappable.typeIndexID;
  /** @generated 
     @modifiable */
  @SuppressWarnings ("hiding")
  public final static boolean featOkTst = JCasRegistry.getFeatOkTst("types.IsGappable");
 
  /** @generated */
  final Feature casFeat_isGappable;
  /** @generated */
  final int     casFeatCode_isGappable;
  /** @generated
   * @param addr low level Feature Structure reference
   * @return the feature value 
   */ 
  public boolean getIsGappable(int addr) {
        if (featOkTst && casFeat_isGappable == null)
      jcas.throwFeatMissing("isGappable", "types.IsGappable");
    return ll_cas.ll_getBooleanValue(addr, casFeatCode_isGappable);
  }
  /** @generated
   * @param addr low level Feature Structure reference
   * @param v value to set 
   */    
  public void setIsGappable(int addr, boolean v) {
        if (featOkTst && casFeat_isGappable == null)
      jcas.throwFeatMissing("isGappable", "types.IsGappable");
    ll_cas.ll_setBooleanValue(addr, casFeatCode_isGappable, v);}
    
  



  /** initialize variables to correspond with Cas Type and Features
	 * @generated
	 * @param jcas JCas
	 * @param casType Type 
	 */
  public IsGappable_Type(JCas jcas, Type casType) {
    super(jcas, casType);
    casImpl.getFSClassRegistry().addGeneratorForType((TypeImpl)this.casType, getFSGenerator());

 
    casFeat_isGappable = jcas.getRequiredFeatureDE(casType, "isGappable", "uima.cas.Boolean", featOkTst);
    casFeatCode_isGappable  = (null == casFeat_isGappable) ? JCas.INVALID_FEATURE_CODE : ((FeatureImpl)casFeat_isGappable).getCode();

  }
}



    