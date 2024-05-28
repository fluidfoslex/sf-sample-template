import { LightningElement, api, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import OWNER_FIELD from '@salesforce/schema/Case.OwnerId';
import CURRENT_USER_ID from '@salesforce/user/Id';
import ID_FIELD from '@salesforce/schema/Case.Id';

export default class caseAssignToMe extends LightningElement {
    @api recordId;

    onButtonClick() {
        this.handleSetOwner();
    }

    handleSetOwner() {
        const fields = {};
        fields[OWNER_FIELD.fieldApiName] = CURRENT_USER_ID;
        fields[ID_FIELD.fieldApiName] = this.recordId;

        const recordInput = {
            fields: fields
        };

        updateRecord(recordInput)
            .then(() => {
                // Refresh the record
                getRecordNotifyChange([{ recordId: this.recordId }]);
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}
