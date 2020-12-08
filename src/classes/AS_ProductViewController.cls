public with sharing class AS_ProductViewController {


    @auraEnabled
    public static List<AS_Document_Service.documentContentWrapper> getProductPictures(String productId) {
        return AS_Document_Service.getProductPictures(productId);
    }

    @auraEnabled
    public static String getProductPrice_apex(String productId) {
        return AS_Product_Service.getProductPrice(productId);
    }

    @AuraEnabled
    public static Order getBasketOrder() {
       return AS_Order_Service.getBasketOrder();
    }

    @auraEnabled
    public static String addProductToBasket(String productId) {

        return AS_Order_Service.addProductToBasket(productId);
    }
}