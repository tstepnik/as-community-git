public with sharing class AS_Community_BasketListController {

    @auraEnabled
    public static List<OrderItem> getOpportunityProducts() {
        return AS_Order_Service.getOrderItems();
    }

    @AuraEnabled
    public static Decimal countSum() {
        return AS_Order_Service.countOrderAmount();
    }

    @AuraEnabled
    public static List<OrderItem> getBasketElements() {
        return AS_Order_Service.getBasketElements();
    }

    @auraEnabled
    public static Order createNewOrder() {
        return AS_Order_Service.createNewOrder();
    }

    @AuraEnabled
    public static Order getBasketOrder() {
      return AS_Order_Service.getBasketOrder();
    }

}