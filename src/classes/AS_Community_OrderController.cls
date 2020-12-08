
public with sharing class AS_Community_OrderController {

    @auraEnabled
    public static List<AS_Order_Service.OrderWrapper> getOrderWrappers(){
        return AS_Order_Service.getOrderWrappers();
    }
}