
public with sharing class AS_User_Service {


    public static String getLoggedUserContactId() {
        Id userId = UserInfo.getUserId();
        User loggedUser = [SELECT ContactId FROM User WHERE Id = :userId limit 1];

//        return loggedUser.ContactId;
        return '0037R00002o0nThQAI';
    }

}