({

    loadPrice: function (component, event, helper) {
        console.log('WCHODZI DO METODY Z HELPERA');
        const action = component.get('c.getProductPrice_apex');
        action.setParams({productId: component.get('v.recordId')});
        action.setCallback(this, function (response) {

            const status = response.getState();
            if (status === 'SUCCESS') {
                console.log('WCHODZI DO SUCCESS');
                let apexPrice = response.getReturnValue();
                console.log('PRICE: ' + apexPrice);
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