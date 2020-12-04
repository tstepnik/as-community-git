({
    getOpportunityProducts: function (component,event,helper) {
        const action = component.get('c.getOpportunityProducts');

        action.setCallback(this, function (response) {

            const status = response.getState();
            if (status === 'SUCCESS') {
                let oppProducts = response.getReturnValue();
                component.set('v.opportunityProducts', oppProducts);

            } else {
                this.handleShowToast(component, event, 'Error', 'error', 'Error while processing loading data');
                let errors = response.getError();
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    console.error(JSON.stringify(errors[0].message));
                }
            }

        });
        $A.enqueueAction(action);
        this.countSum(component,event);

    },

    countSum: function (component,event) {
        const action = component.get('c.countSum');
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let priceSum = response.getReturnValue();
                component.set('v.priceSum',priceSum);
                if(priceSum <= 0){
                    this.hideButton(component);
                }
            }      else if (state === "ERROR") {
                this.handleErrors(component,response);
            }
        });
        $A.enqueueAction(action);

    },

    handleShowToast: function (component, event, title, variant, message) {
        component.find('notification').showToast({
            "title": title,
            "variant": variant,
            "message": message
        });
    },

    handleEvent: function (component, event) {
        this.countSum(component,event);

    },

    hideButton: function (component) {
        let element = component.find('buyBtn');
        $A.util.toggleClass(element, "hideElement");
        let cartIsEmpty = component.find('cart-is-empty');
        $A.util.removeClass(cartIsEmpty, "hideElement");

    },

    showButton: function(component) {
        let element = component.find('buyBtn');
        $A.util.removeClass(element, "hideElement");
        let cartIsEmpty = component.find('cart-is-empty');
        $A.util.toggleClass(cartIsEmpty, "hideElement");
    },

    hideEmptyCartText: function (component) {
        let cartIsEmpty = component.find('cart-is-empty');
        $A.util.toggleClass(cartIsEmpty, "hideElement");
    },

    handleErrors: function (component,response) {
        let sendErrorToast = component.find('errorToastMaker');
        let errors = response.getErrors();
        sendErrorToast.handleErrors('Error', 'Error while processing loading data', 'Error', errors);
    }

})