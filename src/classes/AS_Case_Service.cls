public with sharing class AS_Case_Service {

    public static void createCase(String productName, String orderNumber, String caseSubject, String description) {
        Case c = new Case();
        c.Status = 'New';
        c.Priority = 'Medium';
        c.Origin = 'Web';
        c.ContactId = AS_Order_Service.getContactId();
        c.AccountId = '0017R00002GUT1OQAX';
        c.Subject = caseSubject;
        c.Description = description;
        c.ProductName__c = productName;
        c.OrderNumber__c = orderNumber;
        insert c;
    }

    public static List<CaseWrapper> getWrappers() {
        List<Case> cases = [
                SELECT Id,Description,Subject,CaseNumber,Status,CreatedDate,ClosedDate,OrderNumber__c,Reason,ProductName__c, (SELECT Id,Title,CreatedDate,CreatedById,Body FROM Feeds)
                FROM Case
                WHERE ContactId = :AS_Order_Service.getContactId()
        ];

        List<User> users = [SELECT Id,Name FROM User];

        Map<String, String> userNameMap = new Map<String, String>();

        for (User u : users) {
            userNameMap.put(u.Id, u.Name);
        }


        List<CaseWrapper> wrappers = new List<CaseWrapper>();
        if (cases != null && !cases.isEmpty()) {
            for (Case c : cases) {
                wrappers.add(new CaseWrapper(c, userNameMap));

            }
        }
        return wrappers;
    }

    public class ServiceResponseWrapper {

        @AuraEnabled
        public String createdAt { get; set; }
        @AuraEnabled
        public String owner { get; set; }
        @AuraEnabled
        public String message { get; set; }

        public ServiceResponseWrapper(String createdAt, String owner, String message) {
            this.createdAt = createdAt;
            this.owner = owner;
            this.message = cutString(message);
        }
        String cutString(String s) {
            s = s.replaceAll('<p>', '');
            s = s.replaceAll('</p>', '');
            s = s.replaceAll('</b>', '');
            s = s.replaceAll('<b>', '');
            return s;
        }
    }

    public class CaseWrapper {
        @AuraEnabled
        public String subject { set; get; }
        @AuraEnabled
        public String description { set; get; }
        @AuraEnabled
        public String caseNumber { set; get; }
        @AuraEnabled
        public String status { set; get; }
        @AuraEnabled
        public String caseOpen { set; get; }
        @AuraEnabled
        public String caseClosed { set; get; }
        @AuraEnabled
        public String productName { set; get; }
        @AuraEnabled
        public String caseReason { set; get; }
        @AuraEnabled
        public String comments { set; get; }
        @AuraEnabled
        public String orderNumber { get; set; }
        @AuraEnabled
        public List<ServiceResponseWrapper> serviceResponseWrappers { get; set; }


        public CaseWrapper(String description, String subject, String caseNumber, String status, String caseOpen, String caseClosed, String caseReason, String productName, String comments, List<ServiceResponseWrapper> serviceResponseWrappers) {
            this.description = Description;
            this.serviceResponseWrappers = serviceResponseWrappers;
            this.subject = subject;
            this.caseNumber = caseNumber;
            this.status = status;
            this.caseOpen = caseOpen;
            this.caseClosed = caseClosed;
            this.productName = productName;
            this.caseReason = caseReason;
            this.comments = comments;
        }
        public CaseWrapper(Case caseToWrapper, Map<String, String> userNameMap) {
            this.serviceResponseWrappers = getWrappersFromCase(caseToWrapper, userNameMap);
            this.description = cutString(caseToWrapper.Description);
            this.subject = caseToWrapper.Subject;
            this.caseNumber = caseToWrapper.CaseNumber;
            this.status = caseToWrapper.Status;
            this.caseOpen = String.valueOf(caseToWrapper.CreatedDate);
            this.caseClosed = String.valueOf(caseToWrapper.ClosedDate);
            this.caseReason = caseToWrapper.Reason;
            this.productName = caseToWrapper.ProductName__c ;
            this.orderNumber = String.valueOf(caseToWrapper.OrderNumber__c) ;
        }

        List<ServiceResponseWrapper> getWrappersFromCase(Case c, Map<String, String> userNameMap) {
            List<ServiceResponseWrapper> wrappers = new List<ServiceResponseWrapper>();
            List<CaseFeed> allWrappers = c.Feeds;


            if (allWrappers != null && !allWrappers.isEmpty()) {
                for (Integer i = allWrappers.size() - 1; i >= 0; i--) {
                    CaseFeed cf = allWrappers[i];
                    if (cf.Body != null) {
                        wrappers.add(new ServiceResponseWrapper(String.valueOf(cf.CreatedDate), userNameMap.get(cf.CreatedById), cf.Body));
                    }
                }
            }
            return wrappers;
        }

        String cutString(String s) {
            s = s.replaceAll('<p>', '');
            s = s.replaceAll('</p>', '');
            s = s.replaceAll('</b>', '');
            s = s.replaceAll('<b>', '');
            s = s.replaceAll('<br>', '');
            s = s.replaceAll('</br>', '');

            return s;
        }
    }
}