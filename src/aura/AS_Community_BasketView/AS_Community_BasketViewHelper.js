({
    getOpportunityProducts: function (component, event) {
        const action = component.get('c.getOpportunityProducts');

        action.setCallback(this, function (response) {

            const status = response.getState();
            if (status === 'SUCCESS') {
                let oppProducts = response.getReturnValue();
                component.set('v.opportunityProducts', oppProducts);

            } else {
                this.handleErrors(component, event, response);
            }
        });
        $A.enqueueAction(action);
        this.countSum(component, event);
    },

    countSum: function (component, event) {
        const action = component.get('c.countSum');
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let priceSum = response.getReturnValue();
                console.log('Price: ' + priceSum);
                component.set('v.priceSum', priceSum);
                if (priceSum <= 0) {
                    this.hideButton(component);
                }
            } else if (state === "ERROR") {
                this.handleErrors(component, event, response);
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

    handleErrors: function (component, event, response) {
        this.handleShowToast(component, event, 'Error', 'Error', 'Error while processing loading data');
        let errors = response.getError();
        if (errors) {
            if (errors[0] && errors[0].message) {
                console.log("Error message: " +
                    errors[0].message);
            }
        } else {
            console.log("Unknown error");
        }
    },

    handleEvent: function (component, event) {
        this.countSum(component, event);

    },

    hideButton: function (component) {
        let element = component.find('buyBtn');
        let cartIsEmpty = component.find('cart-is-empty');
        $A.util.toggleClass(element, "hideElement");
        $A.util.removeClass(cartIsEmpty, "hideElement");

    },

    hideEmptyCartText: function (component) {
        let cartIsEmpty = component.find('cart-is-empty');
        $A.util.toggleClass(cartIsEmpty, "hideElement");
    }

})