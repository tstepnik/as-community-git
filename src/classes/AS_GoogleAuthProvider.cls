global class AS_GoogleAuthProvider implements Auth.RegistrationHandler {

    global User createUser(Id portalId, Auth.UserData data) {

        if (data.attributeMap.containsKey('sfdc_networkid')) {
            Account account = [SELECT Id FROM account WHERE name = :AS_Utils.authSetting().accountName__c];
            Contact contact = new Contact();
            contact.accountId = account.Id;
            contact.email = data.email;
            contact.firstName = data.firstName;
            contact.lastName = data.lastName;
            try {
                insert contact;
            } catch (Exception exc) {
                System.debug(exc);
            }
            return createUser(data, contact, true);
        } else {
            return createUser(data, null, false);
        }
    }

    global void updateUser(Id userId, Id portalId, Auth.UserData data) {
        User user = new User(id = userId);
        user.email = data.email;
        user.lastName = data.lastName;
        user.firstName = data.firstName;
        update(user);
    }

    private User createUser(Auth.UserData data, Contact contact, Boolean isCommunity) {
        User user = new User();
        Profile profile;
        String alias;
        if (isCommunity) {
            profile = [SELECT Id FROM profile WHERE name = :AS_Utils.authSetting().userCommunityProfile__c];
            user.username = data.email + AS_Utils.authSetting().communityUsernameSuffix__c;
            user.contactId = contact.Id;
            alias = data.firstName + data.lastName;
        } else {
            profile = [SELECT Id FROM profile WHERE name = :AS_Utils.authSetting().standardUserProfile__c];
            user.username = data.username + AS_Utils.authSetting().standardUsernameSuffix__c;
            alias = data.username;
        }
        user.email = data.email;
        user.lastName = data.lastName;
        user.firstName = data.firstName;
        user.alias = alias.length() > 8 ? alias.substring(0, 8) : alias;
        user.languagelocalekey = UserInfo.getLanguage();
        user.localesidkey = UserInfo.getLocale();
        user.emailEncodingKey = 'UTF-8';
        user.timeZoneSidKey = AS_Utils.authSetting().timeZoneSidKey__c;
        user.profileId = profile.Id;
        return user;
    }
}