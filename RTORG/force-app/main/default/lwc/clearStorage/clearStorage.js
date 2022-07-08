import { LightningElement, track,wire } from 'lwc';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import increaseStorage from '@salesforce/apex/ClearStorage.increaseStorage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class ClearStorage extends LightningElement {

    showpopup = false;
    value = [''];
    @track selectedObject = [];
    channelName = '/event/ForEmpApi__e';
    //data to be shown
    objectName='Blackthorn Log';
    status='In progress';
    totalJobs=0;
    completedJobs=0;
    jobList = [];
    //test
    ongoing = false
    completed = false;
    get options() {
        return [
             { label: 'Webhook', value: 'bt_stripe__Webhook_Event__c' },
            { label: 'Blackthorn Log', value: 'bt_stripe__Blackthorn_Log__c' },
            { label: 'Transaction', value: 'bt_stripe__Transaction__c' }
        ];
    }
    

    doStorageClear(){
        console.log(this.jobList);
        this.jobList = new Array();
        this.showpopup = true;
        this.handleSubscribe();

    }

    closemodal(){
        this.showpopup = false;
    }

    handleChange(e){
        this.selectedObject = e.detail.value;
    }

    startClearingStorage(){
        console.log('=======');
        this.showpopup = false;
        this.showNotification();
        increaseStorage({selectedObject:JSON.stringify(this.selectedObject)}).then((result)=>{

            // console.log(result.JobDetails);
            // console.log(JSON.stringify(result));
        })

    }

     // Handles subscribe button click
     handleSubscribe() {
        // Callback invoked whenever a new event message is received
        this.jobList = [];
        console.log('=============57')
        let self =  this;
        const messageCallback = function(response) {
            try {
                self.updateJobDetails(self,response);
            } catch (error) {
                console.log(error)
            }            
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
        });
    }

    updateJobDetails(self,response){

        let parsedJson = JSON.parse(JSON.stringify(response));
        let payLoad = JSON.parse(parsedJson.data.payload.Payload__c);
        self.status = payLoad.job.Status;
        self.completedJobs = payLoad.job.JobItemsProcessed;
        self.totalJobs = payLoad.job.TotalJobItems;
        self.objectName = payLoad.currentObj;
        self.ongoing = payLoad.job.Status=='Completed'?false:true;

        if(payLoad.job.Status == 'Completed'){
            self.jobList.push({
                'object':payLoad.currentObj,
                'JobItemsProcessed':payLoad.job.JobItemsProcessed,
                'TotalJobItems': payLoad.job.TotalJobItems,
                'status':payLoad.job.Status

            })
        }
        
        self.completed = self.jobList.length>0?true:false;            
    }

    showNotification() {
        const evt = new ShowToastEvent({
            title: 'Started',
            message: 'Job Started Successfully',
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }

}