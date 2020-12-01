public with sharing class AS_Community_SearchEngineController {

    @AuraEnabled
    public static List<AS_Community_Service.ProductInfoWrapper> getNextPageOffset(String inpTxt,Integer offset) {

        return AS_Community_Service.productInfoWrappers(inpTxt,12,offset);
    }

    @AuraEnabled
    public static Integer countProducts(String inpTxt) {

        return AS_Community_Service.countProducts(inpTxt);
    }


    @AuraEnabled
    public static AS_Community_Service.FirstQueryInfo getFirstQueryInfo(String inpTxt){
        return AS_Community_Service.getFirstQueryInfo(inpTxt,12,0);

    }
}