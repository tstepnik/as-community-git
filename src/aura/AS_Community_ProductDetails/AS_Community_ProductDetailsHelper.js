({

    loadPrice: function (component, event, helper) {
        const action = component.get('c.getProductPrice_apex');
        action.setParams({productId: component.get('v.recordId')});
        action.setCallback(this, function (response) {

            const status = response.getState();
            if (status === 'SUCCESS') {
                let apexPrice = response.getReturnValue();
                component.set('v.price', apexPrice);
            } else {
                let errors = response.getError();
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    console.error(JSON.stringify(errors[0].message));
                }
            }
        });
        $A.enqueueAction(action);
    }
})