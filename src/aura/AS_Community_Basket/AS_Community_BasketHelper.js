({
    onInit: function(component,event,helper){
        this.hideModal(component);
        this.getOpportunityProducts(component,event,helper);
        this.countSum(component,event);
    },


    getOpportunityProducts: function (component) {
        this.showSpinner(component);
        const action = component.get('c.getOpportunityProducts');

        action.setCallback(this, function (response) {

            const status = response.getState();
            if (status === 'SUCCESS') {
                let oppProducts = response.getReturnValue();
                component.set('v.opportunityProducts', oppProducts);

            } else {
                this.handleErrors(component,response);
            }
            this.hideSpinner(component);

        });
        $A.enqueueAction(action);

    },

    showModal: function(component,event,helper){
        this.getOpportunityProducts(component,event,helper);
        this.countSum(component,event);
        let modal = component.find('basket-modal');
        $A.util.removeClass(modal, "hideElement");

    },

    hideModal: function(component){
        let modal = component.find('basket-modal');
        $A.util.toggleClass(modal, "hideElement");
    },

    countSum: function (component,event) {
        const action = component.get('c.countSum');
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let priceSum = response.getReturnValue();
                component.set('v.priceSum',priceSum);
            }      else if (state === "ERROR") {
                this.handleErrors(component,response);
            }
        });
        $A.enqueueAction(action);

    },

    showSpinner: function(component) {
        component.find('spinner').showSpinner();
    },
    hideSpinner: function(component) {
        component.find('spinner').hideSpinner();
    },

    handleErrors: function (component,response) {
        let sendErrorToast = component.find('errorToastMaker');
        let errors = response.getErrors();
        sendErrorToast.handleErrors('Error', 'Error while processing loading data', 'Error', errors);
    }

})