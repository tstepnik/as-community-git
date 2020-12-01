({

    onInit: function (component, event, helper) {
        console.log('WCHODZI DO CONTROLLERA');
        helper.loadPrice(component, event, helper);
    }

})