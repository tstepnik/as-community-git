public with sharing class AS_Order_Service {

    public static String getContactId() {

        return AS_User_Service.getLoggedUserContactId();
    }

    public static List<Order> fetchActivatedOrders() {
        Id contactId = getContactId();
        List<Order> activatedOrders = [
                select id, TotalAmount,OrderNumber,EffectiveDate, (Select id, Product2.Name, ListPrice, Quantity, Description from OrderItems)
                from Order
                where BillToContactId = :contactId and status = 'Activated'
                order by CreatedDate desc
        ];
        return activatedOrders;
    }

    public static List<OrderWrapper> getOrderWrappers() {
        List<OrderWrapper> wrappers = new List<OrderWrapper>();

        List<Order> orders = fetchActivatedOrders();

        for (Order order : orders) {
            wrappers.add(new OrderWrapper(order));
        }
        return wrappers;
    }

    public class OrderWrapper {

        @auraEnabled
        public String orderId { get; set; }

        @auraEnabled
        public String orderNumber { get; set; }

        @auraEnabled
        public String createdDate { get; set; }

        @auraEnabled
        public String sum { get; set; }

        @auraEnabled
        public Decimal numberOfProducts { get; set; }

        @auraEnabled
        public Decimal numberOfUnits { get; set; }

        public OrderWrapper(Order order) {
            this.orderId = order.Id;
            this.orderNumber = order.OrderNumber;
            this.createdDate = String.valueOf(order.EffectiveDate);
            this.sum = String.valueOf(order.TotalAmount);
            this.numberOfProducts = order.OrderItems.size();
            this.numberOfUnits = countNumberOfUnits(order.OrderItems);
        }

        private Decimal countNumberOfUnits(List<OrderItem> items) {
            Decimal sum = 0;

            for (OrderItem orderItem : items) {
                sum += orderItem.Quantity;
            }
            return sum;
        }
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

    public static List<OrderItem> getOrderItems() {
        List<OrderItem> orderItems = new List<OrderItem>();
        orderItems = getBasketElements();
        return orderItems;
    }

    public static Decimal countOrderAmount() {
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

    public static pricebook2 getStandardPricebook() {
        return [select id from pricebook2 where name = 'Standard'];
    }

    public static Order createNewOrder() {
        Id contactId = getContactId();
        Contract myContract = [select id, StartDate from Contract where id = :System.Label.AS_Community_ContractId];
        Order newOrder = new Order(BillToContactId = contactId, ContractId = myContract.Id, Status = 'Draft', AccountId = System.Label.AS_Community_AccountId, EffectiveDate = myContract.StartDate, Pricebook2Id = getStandardPricebook().Id);
        upsert newOrder;
        return newOrder;
    }

    public static Order getBasketOrder() {
        Id contactId = getContactId();
        Order basketOrder;
        try {
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
        } catch (QueryException e) {
            basketOrder = createNewOrder();
        }
        return basketOrder;
    }

    public static String addProductToBasket(String productId) {

        Boolean alreadyInBasket = false;

        Id contactId = getContactId();
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
                alreadyInBasket = true;
                return 'Product is already in basket. You can change his amount by click basket icon.';
            }
        }

        if (!alreadyInBasket) {
            PricebookEntry myPricebookEntry = [select id, UnitPrice from PricebookEntry where Product2Id = :productId and Pricebook2.Name = 'Standard'];
            OrderItem myOrderItem = new OrderItem(Product2Id = productId, OrderId = basketOrder.Id, Quantity = 1, PricebookEntryId = myPricebookEntry.Id, UnitPrice = myPricebookEntry.UnitPrice);
            upsert myOrderItem;
            return 'Product successfully added to basket. Click basket icon to change product amount.';
        }
        return 'Something wrong, contact Admin';
    }

    public static List<OrderItemWrapper> getOrderItemWrappers(String orderId) {
        List<OrderItem> orderItems = [
                select Product2.Id,Product2.mainPictureId__c,Product2.Family,
                        Product2.Name, Product2.Description, Quantity, ListPrice
                from OrderItem
                where OrderId = :orderId
        ];

        List<OrderItemWrapper> wrappers = new List<OrderItemWrapper>();
        if (orderItems == null || orderItems.isEmpty()) {
            return wrappers;
        }

        for (OrderItem item : orderItems) {
            wrappers.add(new OrderItemWrapper(item));
        }
        return wrappers;
    }


    public static void completeExistingOrder() {
        Order oldOrder = getBasketOrder();
        oldOrder.Status = 'Activated';
        upsert oldOrder;
        Order newOrder = createNewOrder();
    }


    public class OrderItemWrapper {

        @auraEnabled
        public String productName { get; set; }

        @auraEnabled
        public Decimal quantity { get; set; }

        @auraEnabled
        public Decimal price { get; set; }

        @auraEnabled
        public Decimal totalAmount { get; set; }

        public OrderItemWrapper(OrderItem item) {
            this.productName = item.Product2.Name;
            this.quantity = item.Quantity;
            this.price = item.ListPrice;
            this.totalAmount = (this.quantity * this.price).setScale(2);
        }
    }
}