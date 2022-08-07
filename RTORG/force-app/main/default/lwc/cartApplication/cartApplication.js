import { LightningElement } from 'lwc';

const API_URL = "https://api.thecatapi.com/v1/breeds";

export default class CartApplication extends LightningElement {

    //private variable
    dataCollection=[];
    dataStore=[];
    cartStorage = [];
    tempStorage = [];
    defaultCount= 1;
    
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
        this.template.querySelector(`[data-input="${e.currentTarget.dataset.key}"]`).value = 1;
        console.log('element',element);
        //element.setAttribute('value',1);
        console.log(choosenItem);

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
                
                const tempStorage = this.cartStorage.filter(x=>x!=targetKey);
                console.log('tempStorage',tempStorage);
                this.cartStorage = [];
                this.cartStorage = tempStorage;
                //c/cartApplication
            break;
            case 'decrementCount':
                if(element.value==1)
                    return
                element.value = parseInt(element.value) - 1;
            break
        }
       

    }
}