import { LightningElement } from 'lwc';

const API_URL = "https://api.thecatapi.com/v1/breeds";

export default class CartApplication extends LightningElement {

    //private variable
    dataCollection=[];
    dataStore=[];
    cartStorage = [];
    tempStorage = [];
    defaultCount= 1;
    isItemAdded = false;
    
    getData(){
       
        fetch(API_URL).then(response=>{
            if(response.ok){    
                console.log(response);
                return response.json();
            } else {
                throw Error(response);
            }

        }).then(catData=>{

                for(var key in catData)
                    this.dataStore.push(catData[key].name)

            this.dataCollection = this.dataStore;
            console.log('====',this.dataCollection)
        })
        .catch(error=>console.log(error))
    }

    connectedCallback(){
        this.getData();

    }

    searchRecord(e){

        let searchString  = e.detail.value;
        if(!searchString)
            this.dataCollection = this.dataStore;
        else{

            let afterFilter = this.dataStore.filter(x=>x.toLowerCase().includes(searchString.toLowerCase()));
            this.dataCollection = afterFilter;
        }
    }

    addToCart(e){
        
        const choosenItem = e
        this.tempStorage.push(e.currentTarget.dataset.key);
        this.dataCollection.reduce(x=>x == e.currentTarget.dataset.key)
        this.cartStorage = [];
        this.cartStorage = this.tempStorage;
        this.isItemAdded = true;
        this.template.querySelector(`[data-input="${e.currentTarget.dataset.key}"]`).value = 1;
    }

    performAction(e){
        //e.detail.value
        const actionName = e.currentTarget.dataset.action;
        const targetKey = e.currentTarget.dataset.key;
        const element = this.template.querySelector(`[data-input="${targetKey}"]`);

        switch(actionName){
            case 'incrementCount':
                element.value =parseInt(element.value)+1;
            break;
            case 'removefromcart':
                console.log('======');
                const index = this.cartStorage.indexOf(targetKey);
                this.cartStorage.splice(index,1);
                const temp = this.cartStorage;
                this.cartStorage = [];
                this.cartStorage  = temp;

                if(this.cartStorage.length==0)
                    this.isItemAdded = false;
            break;
            case 'decrementCount':
                if(element.value==1)
                    return
                element.value = parseInt(element.value) - 1;
            break
        }
       

    }
}