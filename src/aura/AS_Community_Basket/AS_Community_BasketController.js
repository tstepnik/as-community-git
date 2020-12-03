({

    redirect: function(component, event, helper){
        let eUrl= $A.get("e.force:navigateToURL");
        eUrl.setParams({
            "url": "/cart"
        });
        eUrl.fire();
    },

    showModal: function (component, event, helper) {
         helper.showModal(component,event,helper);
    },
    hideModal: function(component,event,helper){
        helper.hideModal(component);
    },
    onInit: function (component,event,helper) {
        helper.onInit(component,event,helper);
    },

})