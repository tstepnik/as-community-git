({

    searchOperations: function (component, event, helper) {
        let inputText = component.get('v.inputText');
        const action = component.get('c.getSearchProductsWrapper');
        action.setParams({inpTxt: inputText});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let productsToStorage = JSON.stringify(response.getReturnValue());
                const sessionKey = 'productWrappers';
                sessionStorage.setItem(sessionKey, productsToStorage);

                this.redirect();
            } else {
                let error = response.getError();
            }
        });
        $A.enqueueAction(action);
    },

    redirect: function () {
        let eUrl = $A.get("e.force:navigateToURL");
        eUrl.setParams({
            "url": "/global-search/t"
        });
        eUrl.fire();
    },

})