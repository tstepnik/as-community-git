public with sharing class AS_Community_SearchEngineController {

    @AuraEnabled
    public static List<AS_Product_Service.ProductInfoWrapper> getNextPageOffset(String inpTxt, Integer offset) {

        return AS_Product_Service.productInfoWrappers(inpTxt, offset);
    }

    @AuraEnabled
    public static Integer countProducts(String inpTxt) {
        return AS_Product_Service.countProducts(inpTxt);
    }

    @AuraEnabled
    public static AS_Product_Service.SearchProductsWrapper getSearchProductsWrapper(String inpTxt) {
        return AS_Product_Service.getSearchProductsWrapper(inpTxt, 0);

    }


}