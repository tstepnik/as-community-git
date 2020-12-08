public with sharing class AS_Community_BasketListController {

    @AuraEnabled
    public static void createComplaint(String productName, String orderNumber, String caseSubject, String description) {
        AS_Case_Service.createCase(productName,orderNumber,caseSubject,description);
    }

    @auraEnabled
    public static List<OrderItem> getOpportunityProducts() {
        return AS_Order_Service.getOrderItems();
    }

    @auraEnabled
    public static List<AS_Order_Service.OrderItemWrapper> getOrderItemWrappers(String orderId){
        return AS_Order_Service.getOrderItemWrappers(orderId);
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

    @AuraEnabled
    public static void completeTransaction(){
        AS_Order_Service.completeExistingOrder();
    }

}