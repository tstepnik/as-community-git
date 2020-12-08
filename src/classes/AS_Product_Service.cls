public with sharing class AS_Product_Service {

    public static AS_Product_Service.SearchProductsWrapper getSearchProductsWrapper(String searchPhrase, Integer offset) {
        Integer queryLimit = Integer.valueOf(System.Label.AS_Community_SearchLimit);

        List<ProductInfoWrapper> wrappers = productInfoWrappers(searchPhrase, offset);

        Integer numberOfProducts = countProducts(searchPhrase);

        return new SearchProductsWrapper(wrappers, numberOfProducts, queryLimit, searchPhrase, offset);
    }

    public static List<ProductInfoWrapper> productInfoWrappers(String phrase, Integer offset) {
        Integer queryLimit = Integer.valueOf(System.Label.AS_Community_SearchLimit);
        List<PricebookEntry> productsInfo = new List<PricebookEntry>();

        productsInfo = Database.query(pricebookEntryQuery(phrase, queryLimit, offset));

        System.debug(pricebookEntryQuery(phrase, queryLimit, offset));

        return convertToInfoWrappers(productsInfo);

    }

    private static String pricebookEntryQuery(String phrase, Integer queryLimit, Integer offset) {

        AS_QueryBuilder queryBuilder = new AS_QueryBuilder();

        List<String> providedParameters = new List<String>{
                'Product2.Name',
                'Product2.Family'
        };

        List<String> selectedFields = new List<String>{
                'Id',
                'UnitPrice',
                'Product2Id',
                'Product2.Name',
                'Product2.Family',
                'Product2.Description',
                'Product2.mainPictureId__c'
        };

        queryBuilder.readyQuery_PricebookEntry_standardPB_returnIfFieldsContainPhrase_andIsActive
                (selectedFields, 'PricebookEntry', phrase, providedParameters, 'OR');
        queryBuilder.addLimit(queryLimit);
        queryBuilder.addOffset(offset);
        System.debug('QUERY:');
        queryBuilder.printQuery();
        return queryBuilder.returnQuery();

    }

    private static List<ProductInfoWrapper> convertToInfoWrappers(List<PricebookEntry> pbEntries) {

        List<ProductInfoWrapper> wrappers = new List<ProductInfoWrapper>();

        for (PricebookEntry p : pbEntries) {
            ProductInfoWrapper wrapper = new ProductInfoWrapper(p.Product2Id, p.Product2.mainPictureId__c, p.Product2.Name, String.valueOf(p.UnitPrice));
            wrappers.add(wrapper);
        }

        return wrappers;
    }

    public static Integer countProducts(String phrase) {

        AS_QueryBuilder queryBuilder = new AS_QueryBuilder();

        List<String> providedParameters = new List<String>{
                'Product2.Name',
                'Product2.Family'
        };

        List<String> selectedFields = new List<String>{
                'count()'
        };

        queryBuilder.readyQuery_PricebookEntry_standardPB_returnIfFieldsContainPhrase_andIsActive
                (selectedFields, 'PricebookEntry', phrase, providedParameters, 'OR');

        String query = queryBuilder.returnQuery();
        return Database.countQuery(query);

    }

    public static String getProductPrice(String productId) {
        Decimal price = [
                SELECT
                        UnitPrice
                FROM PricebookEntry
                WHERE Product2Id = :productId
        ][0].UnitPrice;

        return String.valueOf(price);
    }

    public class ProductInfoWrapper {
        @auraEnabled
        public String productId { get; set; }
        @auraEnabled
        public String mainPictureId { get; set; }
        @auraEnabled
        public String productName { get; set; }
        @auraEnabled
        public String price { get; set; }

        ProductInfoWrapper(String productId, String mainPicId, String productName, String price) {
            this.productId = productId;
            this.mainPictureId = mainPicId;
            this.productName = productName;
            this.price = price;
        }
    }

    public class SearchProductsWrapper {
        @auraEnabled
        public List<ProductInfoWrapper> wrappers { get; set; }
        @auraEnabled
        public Integer numberOfProducts { get; set; }

        @auraEnabled
        public Integer queryLimit { get; set; }

        @auraEnabled
        public String queryPhrase { get; set; }

        @auraEnabled
        public Integer offset { get; set; }

        public SearchProductsWrapper(List<ProductInfoWrapper> wrappers, Integer numberOfProducts, Integer queryLimit, String queryPhrase, Integer offset) {
            this.wrappers = wrappers;
            this.numberOfProducts = numberOfProducts;
            this.queryLimit = queryLimit;
            this.queryPhrase = queryPhrase;
            this.offset = offset;
        }
    }

}