public with sharing class AS_QueryBuilder {

    private String query { get; set; }

    public AS_QueryBuilder() {
        this.query = 'SELECT ';
    }

    public void selectedFields(List<String> fields) {
        Boolean firsTime = true;
        for (String field : fields) {
            if (firsTime) {
                query += field;
                firsTime = false;
            } else {
                query += ',' + field;
            }
        }
    }

    public void addWHERE() {
        query += ' WHERE ';
    }

    public void ownCondition(String additionalCondition) {
        query += ' ' + additionalCondition;
    }

    public void fromObj(String objectName) {
        query += ' FROM ' + objectName + ' ';
    }

    public String returnQuery() {
        return query;
    }

    public void printQuery() {
        System.debug(query);
    }

    public void clearQuery() {
        query = 'SELECT ';
    }



    public String whereCondition_returnIf_FieldsContainPhrase(String phrase, List<String> fields, String andOr) {
        String query = '';

        andOr = checkAndOr(andOr);

        Boolean firstQuery = true;

        for (String field : fields) {
            if (!firstQuery) {
                if (field == 'id') {
                    query += andOr + field + ' = \'' + phrase + '\'';

                } else {
                    query += andOr + field + ' LIKE \'' + phrase + '%\'';
                }
            } else {
                if (field == 'id') {
                    query += field + ' = \'' + phrase + '\'';
                } else {
                    query += field + ' LIKE \'' + phrase + '%\'';
                }
                firstQuery = false;
            }
        }
        return query;
    }

    //todo need Test
    public void void_whereCondition_returnIf_FieldsContainPhrase(String phrase, List<String> fields, String andOr) {

        andOr = checkAndOr(andOr);

        Boolean firstQuery = true;

        for (String field : fields) {
            if (!firstQuery) {
                if (field == 'id') {
                    query += andOr + field + ' = \'' + phrase + '\'';

                } else {
                    query += andOr + field + ' LIKE \'' + phrase + '%\'';
                }
            } else {
                if (field == 'id') {
                    query += field + ' = \'' + phrase + '\'';
                } else {
                    query += field + ' LIKE \'' + phrase + '%\'';
                }
                firstQuery = false;
            }
        }
    }

    //todo need Test
    public String whereCondition_returnIf_CertainFields_Contain_CertainPhrases(Map<String, Object> fieldsMap, List<String> conditions, String andOr) {
        String query = '';

        andOr = checkAndOr(andOr);

        Boolean firstQuery = true;

        for (String key : conditions) {
            if (fieldsMap.containsKey(key) && key != null) {
                if (!firstQuery) {
                    if (key == 'id') {
                        query += andOr + key + ' = \'' + fieldsMap.get(key) + '\'';

                    } else {
                        query += andOr + key + ' LIKE \'' + fieldsMap.get(key) + '%\'';
                    }
                } else {
                    if (key == 'id') {
                        query += key + ' = \'' + fieldsMap.get(key) + '\'';
                    } else {
                        query += key + ' LIKE \'' + fieldsMap.get(key) + '%\'';
                    }
                    firstQuery = false;
                }
            }
        }
        return query;
    }

    //todo need Test
    public void void_whereCondition_returnIf_CertainFields_Contain_CertainPhrases(Map<String, Object> fieldsMap, List<String> conditions, String andOr) {

        andOr = checkAndOr(andOr);

        Boolean firstQuery = true;

        for (String key : conditions) {
            if (fieldsMap.containsKey(key) && key != null) {
                if (!firstQuery) {
                    if (key == 'id') {
                        query += andOr + key + ' = \'' + fieldsMap.get(key) + '\'';

                    } else {
                        query += andOr + key + ' LIKE \'' + fieldsMap.get(key) + '%\'';
                    }
                } else {
                    if (key == 'id') {
                        query += key + ' = \'' + fieldsMap.get(key) + '\'';
                    } else {
                        query += key + ' LIKE \'' + fieldsMap.get(key) + '%\'';
                    }
                    firstQuery = false;
                }
            }
        }
    }

    //todo need Test
    public String whereCondition_returnIf_CertainFields_Contain_CertainPhrases(SObject obj, List<String> conditions, String andOr) {

        String jsonObject = JSON.serialize(obj);
        Map<String, Object> fieldsMap = (Map<String, Object>) JSON.deserializeUntyped(jsonObject);

        String query = '';

        andOr = checkAndOr(andOr);

        Boolean firstQuery = true;

        for (String key : conditions) {
            if (fieldsMap.containsKey(key) && key != null) {
                if (!firstQuery) {
                    if (key == 'id') {
                        query += andOr + key + ' = \'' + fieldsMap.get(key) + '\'';

                    } else {
                        query += andOr + key + ' LIKE \'' + fieldsMap.get(key) + '%\'';
                    }
                } else {
                    if (key == 'id') {
                        query += key + ' = \'' + fieldsMap.get(key) + '\'';
                    } else {
                        query += key + ' LIKE \'' + fieldsMap.get(key) + '%\'';
                    }
                    firstQuery = false;
                }
            }
        }
        return query;

    }

    //todo need Test
    public void void_whereCondition_returnIf_CertainFields_Contain_CertainPhrases(SObject obj, List<String> conditions, String andOr) {

        String jsonObject = JSON.serialize(obj);
        Map<String, Object> fieldsMap = (Map<String, Object>) JSON.deserializeUntyped(jsonObject);

        andOr = checkAndOr(andOr);

        Boolean firstQuery = true;

        for (String key : conditions) {
            if (fieldsMap.containsKey(key) && key != null) {
                if (!firstQuery) {
                    if (key == 'id') {
                        query += andOr + key + ' = \'' + fieldsMap.get(key) + '\'';

                    } else {
                        query += andOr + key + ' LIKE \'' + fieldsMap.get(key) + '%\'';
                    }
                } else {
                    if (key == 'id') {
                        query += key + ' = \'' + fieldsMap.get(key) + '\'';
                    } else {
                        query += key + ' LIKE \'' + fieldsMap.get(key) + '%\'';
                    }
                    firstQuery = false;
                }
            }
        }
    }

    public void addLimit(Integer queryLimit) {
        query += ' LIMIT ' + String.valueOf(queryLimit);
    }

    public void addOffset(Integer offset) {
        query += ' OFFSET ' + String.valueOf(offset);
    }

    private String checkAndOr(String andOr) {
        if (andOr != 'OR' && andOr != 'AND') {
            andOr = ' OR ';
        } else {
            andOr = ' ' + andOr + ' ';
        }
        return andOr;
    }


    public void readyQuery_returnIfFieldsContainPhrase(List<String> selectedFields, String fromObj, String phrase, List<String> where_fields, String andOr) {

        clearQuery();
        selectedFields(selectedFields);
        fromObj(fromObj);
        if (phrase != null) {
            addWHERE();
            void_whereCondition_returnIf_FieldsContainPhrase(phrase, where_fields, andOr);
        }
    }


    public void readyQuery_PricebookEntry_standardPB_returnIfFieldsContainPhrase_andIsActive(List<String> selectedFields, String fromObj, String phrase, List<String> where_fields, String andOr) {

        clearQuery();
        selectedFields(selectedFields);
        fromObj(fromObj);
        if (phrase != null) {
            addWHERE();
            ownCondition(' IsActive = true ');
            ownCondition(' AND Pricebook2.Name LIKE \'Standard\' AND ');
            query += ' ( ';
            void_whereCondition_returnIf_FieldsContainPhrase(phrase, where_fields, andOr);
            query += ' ) ';
        }else{
            addWHERE();
            ownCondition(' Pricebook2.Name LIKE \'Standard\'');

        }
    }


}