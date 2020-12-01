public with sharing class AS_ProductViewController {


    @auraEnabled
    public static List<AS_Community_Service.documentContentWrapper> getProductPictures(String productId) {
        return AS_Community_Service.getProductPictures(productId);
    }

    @auraEnabled
    public static String getProductPrice_apex(String productId) {
        System.debug('WCHODZ IDO APEX CONTROLLER');
        return AS_Community_Service.getProductPrice(productId);
    }
}