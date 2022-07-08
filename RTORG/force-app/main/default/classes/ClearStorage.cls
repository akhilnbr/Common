public with sharing class ClearStorage {


   
    public String currentObject='';
    @AuraEnabled(cacheable=true)
    public static String increaseStorage(String selectedObject){

        try{

            List<String> objectList = (List<String>)JSON.deserialize(selectedObject,List<String>.Class);

            for(String objName:objectList){
                ClearStorageBatch obj = new ClearStorageBatch(objName);
                Database.executeBatch(obj,150);
            }
            
        }catch(Exception e){
            System.debug('===='+e);
        }
        return 'haha';
    }


}