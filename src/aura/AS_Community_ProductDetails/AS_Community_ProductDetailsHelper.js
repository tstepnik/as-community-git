({

    loadPrice: function (component, event) {
        const action = component.get('c.getProductPrice_apex');
        action.setParams({productId: component.get('v.recordId')});
        action.setCallback(this, function (response) {

            const status = response.getState();
            if (status === 'SUCCESS') {
                let apexPrice = response.getReturnValue();
                component.set('v.price', apexPrice);
            } else if (status === "ERROR") {
            this.handleErrors(component,event,response);
            }
        });
        $A.enqueueAction(action);
    },

    addProductToOrder: function (component, event) {
        let productId = component.get('v.recordId');
        const action = component.get('c.addProductToBasket');
        action.setParams({productId: productId});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let responseMessage = response.getReturnValue();
                this.handleShowToast(component, event, 'Success', 'Success', responseMessage);

            } else if (state === "ERROR") {
           this.handleErrors(component,event,response);
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

    handleErrors: function (component,event,response) {
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
    }
})