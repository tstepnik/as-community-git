/**
 * Created by tomas on 02.12.2020.
 */

public with sharing class AS_Service {

    public static List<documentContentWrapper> getProductPictures(String productId) {
        try {
            System.debug(productId);
            List<ContentDocumentLink> contentDocumentLinks = getContentDocumentLinkIds(productId);
            return wrapContentDocumentLinks(contentDocumentLinks);
        } catch (Exception ex) {
            throw new AuraHandledException('Exception: ' + ex.getMessage());
        }
    }

    private static List<ContentDocumentLink> getContentDocumentLinkIds(String productId) {
        return [
                SELECT ContentDocument.LatestPublishedVersionId
                FROM ContentDocumentLink
                WHERE LinkedEntityId = :productId
                LIMIT 10
        ];
    }

    private static List<DocumentContentWrapper> wrapContentDocumentLinks(List<ContentDocumentLink> contentDocumentLinks) {
        List<DocumentContentWrapper> documentContentWrappers = new List<DocumentContentWrapper>();
        for (ContentDocumentLink contentDocumentLink : contentDocumentLinks) {
            documentContentWrappers.add(new DocumentContentWrapper(contentDocumentLink.ContentDocument.LatestPublishedVersionId));
        }
        return documentContentWrappers;
    }

    public class DocumentContentWrapper {
        @auraEnabled
        public String documentId { set; get; }

        public documentContentWrapper(String documentId) {
            this.documentId = documentId;
        }
    }
    }