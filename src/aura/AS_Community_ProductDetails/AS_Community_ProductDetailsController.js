({

    onInit: function (component, event, helper) {
        helper.loadPrice(component, event, helper);
    },
    addToBasket: function(component, event, helper){
        helper.addProductToOrder(component,event,helper);
    },

})