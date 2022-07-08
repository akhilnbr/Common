public with sharing class ClearStorageBatch implements Database.batchable<sobject>, Database.stateful {

    public String query='';
    public String objName;
    public ClearStorageBatch(String obj){
        objName  = obj;
        query = 'select id from ' +obj;
    }

    public Database.QueryLocator start(Database.BatchableContext bc) {
        System.debug(query);
        return Database.getQueryLocator(query);
    }

    public  void execute(Database.BatchableContext bc, List<sObject> scope){
        // jobStarted = true;
        AsyncApexJob job = [SELECT Status,JobItemsProcessed,TotalJobItems
                            FROM AsyncApexJob
                            WHERE Id = :bc.getJobId()];
    
        JobStore jObj = new JobStore();
        jObj.job = job;
        jObj.currentObj = objName;
        ForEmpApi__e objEvent = new ForEmpApi__e( Payload__c =JSON.serialize(jObj) );
        EventBus.publish( objEvent ); 
        DELETE scope;
    }

    public void finish(Database.BatchableContext bc){
        AsyncApexJob job = [SELECT Status,JobItemsProcessed,TotalJobItems
                            FROM AsyncApexJob
                            WHERE Id = :bc.getJobId()];
        JobStore jObj = new JobStore();
        jObj.job = job;
        jObj.currentObj = objName;
        ForEmpApi__e objEvent = new ForEmpApi__e( Payload__c =JSON.serialize(jObj) );
        EventBus.publish( objEvent ); 
    }
    
    Class JobStore{

        public AsyncApexJob job;
        public String currentObj;
    }

    
}