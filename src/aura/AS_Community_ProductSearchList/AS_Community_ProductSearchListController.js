({

    doInit: function (component, event, helper) {
        helper.loadProducts(component);
    },

    pressPreviousButton: function(component,event,helper){
        helper.pressPreviousButton(component,event,helper);
    },
    pressNextButton: function(component,event,helper){
        helper.pressNextButton(component,event,helper);
    },

    choosePage: function (component,event,helper) {
        helper.choosePage(component,event);
    }
})