/**
 * Created by tomas on 07.12.2020.
 */

public with sharing class AS_Community_CaseController {

    @AuraEnabled
    public static void createComplaint(String productName, String orderNumber, String caseSubject, String description) {
   AS_Case_Service.createCase(productName,orderNumber,caseSubject,description);
    }

    @AuraEnabled
    public static List<AS_Case_Service.CaseWrapper> getCaseWrappers(){
       return  AS_Case_Service.getWrappers();
    }

}