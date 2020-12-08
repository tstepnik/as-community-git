({
    handleNewCaseModal: function(component, event) {
        component.set('v.showNewComplainModal', true);
    },
    handleSuccess: function(component, event, helper) {
        helper.handleSuccess(component, event);

    },
    closeModal: function(component, event) {
        console.log('WCHODZI DO CLOSE MODAL');
        component.set('v.showNewComplainModal', false);
        console.log('WYCHODZI DO CLOSE MODAL');
    },

    onInit: function (component, event, helper) {
        helper.onInit(component,event);
    },
    createCase: function (component, event, helper) {
        console.log('WCHODZI DO CONTROLLERA');
        helper.createCase(component,event);
        component.set('v.showNewComplainModal',false);
    },

    closePopup: function (component) {
        component.set('v.showNewComplainModal',false);
    },

})