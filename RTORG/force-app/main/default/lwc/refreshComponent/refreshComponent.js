import { LightningElement, wire } from 'lwc';
import loadAccount from   '@salesforce/apex/RefreshTask.loadAccount';
import updateAccountData from '@salesforce/apex/RefreshTask.updateAccountData';
import {refreshApex} from '@salesforce/apex';
export default class RefreshComponent extends LightningElement {



    wiredResult;
    record
    @wire(loadAccount)accountList(wiredData){

        this.wiredResult = wiredData;
        const {data,error} = wiredData;
        if(data){
            this.record = data
        } 
        else if(error){
            console.log(error);
        }
        
        
    }


    
}