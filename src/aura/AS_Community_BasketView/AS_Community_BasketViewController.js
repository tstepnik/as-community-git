({
    onInit: function (component,event,helper) {
        helper.hideEmptyCartText(component);
        helper.getOpportunityProducts(component,event,helper);
    },

    handleEvent: function (component, event, helper) {
        helper.handleEvent(component,event);
    }
})