/**
 * Created by tomas on 02.12.2020.
 */

public with sharing class AS_Service {

        public static FirstQueryInfo getFirstQueryInfo(String searchPhrase, Integer queryLimit, Integer offset) {

            List<ProductInfoWrapper> wrappers = productInfoWrappers(searchPhrase, queryLimit, offset);

            Integer numberOfProducts = countProducts(searchPhrase);

            return new FirstQueryInfo(wrappers, numberOfProducts,queryLimit,searchPhrase,offset);
        }

        public static List<ProductInfoWrapper> productInfoWrappers(String phrase, Integer queryLimit, Integer offset) {

            List<PricebookEntry> productsInfo = new List<PricebookEntry>();

            productsInfo = Database.query(pricebookEntryQuery(phrase, queryLimit, offset));

            System.debug(pricebookEntryQuery(phrase, queryLimit, offset));

            return convertToInfoWrappers(productsInfo);

        }

        private static List<ProductInfoWrapper> convertToInfoWrappers(List<PricebookEntry> pbEntries) {

            List<ProductInfoWrapper> wrappers = new List<ProductInfoWrapper>();

            for (PricebookEntry p : pbEntries) {
                ProductInfoWrapper wrapper = new ProductInfoWrapper(p.Product2Id, p.Product2.mainPictureId__c, p.Product2.Name, String.valueOf(p.UnitPrice));
                wrappers.add(wrapper);
            }

            return wrappers;
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

        public class FirstQueryInfo {
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

            public FirstQueryInfo(List<ProductInfoWrapper> wrappers, Integer numberOfProducts, Integer queryLimit, String queryPhrase, Integer offset) {
                this.wrappers = wrappers;
                this.numberOfProducts = numberOfProducts;
                this.queryLimit = queryLimit;
                this.queryPhrase = queryPhrase;
                this.offset = offset;
            }
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
    
    }