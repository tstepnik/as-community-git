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
                this.handleErrors(component,response);
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
                let sendToast = component.find('toastMaker');
                sendToast.sendResultToast('Success', responseMessage, 'Success');
            } else if (state === "ERROR") {
               this.handleErrors(component,response);
            }
        });
        $A.enqueueAction(action);
    },

    handleErrors: function (component,response) {
        let sendErrorToast = component.find('errorToastMaker');
        let errors = response.getErrors();
        sendErrorToast.handleErrors('Error', 'Error while processing loading data', 'Error', errors);
    }
})