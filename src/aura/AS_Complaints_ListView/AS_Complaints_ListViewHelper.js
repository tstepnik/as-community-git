/**
 * Created by tomas on 07.12.2020.
 */
({
    doInit: function (component, event) {
        console.log('wchodzi do helpera');
        const action = component.get('c.getCaseWrappers');
        console.log('22');
        action.setCallback(this, function(response) {
            console.log('33');
            const status = response.getState();
            if (status === 'SUCCESS') {
                console.log('WCHODZI DO SUCCESS');
                let caseWrapperList = response.getReturnValue();
                component.set('v.caseWrappers',caseWrapperList);
                let sendToast = component.find('toastMaker');
                // sendToast.sendResultToast('Success', 'Case Successfully Created. Our agent will contact you soon.', 'Success');
            } else {
                console.log('WCHODZI DO ERROR');
                // this.handleErrors(component,response);
            }
        });
        $A.enqueueAction(action);
    }

    // handleErrors: function (component,response) {
    //     let sendErrorToast = component.find('errorToastMaker');
    //     let errors = response.getErrors();
    //     sendErrorToast.handleErrors('Error', 'Error while processing loading data', 'Error', errors);
    // }

})