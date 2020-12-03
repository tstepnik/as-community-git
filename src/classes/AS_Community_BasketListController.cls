public with sharing class AS_Community_BasketListController {

    @auraEnabled
    public static List<OrderItem> getOpportunityProducts() {
        return AS_Service.getOpportunityProducts();
    }

    @AuraEnabled
    public static Decimal countSum() {
        return AS_Service.countSum();
    }

    @AuraEnabled
    public static List<OrderItem> getBasketElements() {
        return AS_Service.getBasketElements();
    }

    @auraEnabled
    public static Order createNewOrder() {
        return AS_Service.createNewOrder();
    }

    @AuraEnabled
    public static void removeBasketElement(String sObjectId) {
        OrderItem myOrderItem = new OrderItem(Id = sObjectId);
        delete myOrderItem;
    }

    public static String getContactId() {
        return AS_Service.getContactId();
    }

}