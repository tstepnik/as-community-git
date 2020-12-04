/**
 * Created by tomas on 26.11.2020.
 */
({

    onInit: function (component, event, helper) {
        helper.setDetails(component, event, helper);
    },
    increase: function (component, event, helper) {
        helper.increaseProductsNumber(component, event, helper);
    },

    decrease: function (component, event, helper) {
        helper.decreaseProductsNumber(component, event, helper);
    },
    changeNumber: function (component,event,helper) {
        helper.changeNumber(component,event);
    },

    pressBasket: function (component, event, helper) {
        helper.removeProductFromBasket(component,event,helper);
        helper.pressBasket(component,event);
    }

})