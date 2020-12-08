({
    onInit: function (component, event) {
        component.set('v.caseOrderNumber',' ');
        component.set('v.caseSubject',' ');
    },

    createCase: function (component, event) {
        console.log('WCHODZI DO METODY CREATECASE');
        let productName = component.get('v.caseProductName');
        let orderNumber = component.get('v.caseOrderNumber');
        let caseSubject = component.get('v.caseSubject');
        let caseMessage = component.get('v.caseMessage');

        const action = component.get('c.createComplaint');
        action.setParams({
            productName: productName,
            orderNumber: orderNumber,
            caseSubject: caseSubject,
            description: caseMessage
        });
        console.log('22');
        action.setCallback(this, function(response) {
            console.log('33');
            const status = response.getState();
            if (status === 'SUCCESS') {
                console.log('WCHODZI DO SUCCESS');
                let sendToast = component.find('toastMaker');
                sendToast.sendResultToast('Success', 'Case Successfully Created. Our agent will contact you soon.', 'Success');
            } else {
                console.log('WCHODZI DO ERROR');
                this.handleErrors(component,response);
            }
        });
        $A.enqueueAction(action);
    },

    handleErrors: function (component,response) {
        let sendErrorToast = component.find('errorToastMaker');
        let errors = response.getErrors();
        sendErrorToast.handleErrors('Error', 'Error while processing loading data', 'Error', errors);
    }
})