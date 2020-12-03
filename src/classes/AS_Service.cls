public with sharing class AS_Service {

    public static String getContactId() {

        Id userId = UserInfo.getUserId();
        User loggedUser = [SELECT ContactId FROM User WHERE Id = :userId limit 1];

        return loggedUser.ContactId;
    }

    public static Order getBasketOrder() {
        Id contactId = getContactId();
        Order basketOrder;
        System.debug('x');
        try {//todo still testing
            basketOrder = [
                    select Id,
                            Status
                    from order
                    where BillToContactId = :contactId
                    and Status = 'Draft'
                    order by
                            CreatedDate desc
                    limit 1
            ];
            System.debug('x');
        } catch (QueryException e) {
            basketOrder = createNewOrder();
        }
        return basketOrder;
    }

    public static List<OrderItem> getBasketElements() {
        Id contactId = getContactId();
        Order basketOrder = getBasketOrder();
        List<OrderItem> basketItems = [
                select Product2.Id,Product2.mainPictureId__c,Product2.Family,
                        Product2.Name, Product2.Description, Quantity, ListPrice
                from OrderItem
                where OrderId = :basketOrder.Id
        ];
        return basketItems;
    }

    public static List<OrderItem> getOpportunityProducts() {
        List<OrderItem> orderItems = new List<OrderItem>();
        orderItems = getBasketElements();

        return orderItems;
    }

    public static Decimal countSum() {
        Decimal sum = 0;

        Order basketOrder = getBasketOrder();

        List<OrderItem> items = [
                select Id,
                        ListPrice,
                        Quantity
                from OrderItem
                where OrderId = :basketOrder.Id
        ];

        if (items.isEmpty() || items == null) {
            return 0;
        }

        for (OrderItem item : items) {
            sum += (item.Quantity * item.ListPrice);
        }

        return sum.setScale(2, RoundingMode.HALF_UP);
    }

    public static Order createNewOrder() {
        Id contactId = getContactId();
        Contract myContract = [select id, StartDate from Contract where id = :contactId];
        Order newOrder = new Order(BillToContactId = contactId, ContractId = myContract.Id, Status = 'Draft', AccountId = '0017R00002GUT1OQAX', EffectiveDate = myContract.StartDate, Pricebook2Id = getStandardPricebook().Id);
        upsert newOrder;
        return newOrder;
    }

    public static pricebook2 getStandardPricebook() {
        return [select id from pricebook2 where name = 'Standard'];
    }

    public static void removeItemFromOrder(String productId) {
        Order basketOrder = getBasketOrder();
        List<OrderItem> items = [
                select Id,
                        Product2Id,
                        Product2.Name
                from OrderItem
                where OrderId = :basketOrder.Id
        ];
        for (OrderItem item : items) {
            if (item.Product2Id.equals(productId)) {
                delete item;
            }
        }
    }
}