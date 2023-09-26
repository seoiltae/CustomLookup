public class CustomLookupControllerMe {    
    // 검색기능
    @Auraenabled
    public static List<ObjectSet> searchQuery(String searchField, String searchText, String objectName,String defaultField,String additionalField,String searchLimit, String targetSortColum, String sortCondition) {
        List<Sobject> searchLayoutList = new List<Sobject>();
        List<ObjectSet> objList = new List<ObjectSet>();
        try{ 
            String selectQuery = 'SELECT ';
            String fieldQuery = ' Id, ' + defaultField +', ' + additionalField;
            
            String fromQuery = ' FROM ' + objectName;
            String whereQuery = ' WHERE ' +searchField+ ' LIKE ' + '\'%' + searchText + '%\'' + ' Order by ' + targetSortColum + ' ' + sortCondition + ' ' + searchLimit;
            System.debug(selectQuery+fieldQuery+fromQuery+whereQuery + ' < --');
            searchLayoutList = database.query(selectQuery+fieldQuery+fromQuery+whereQuery);
            
            for(Sobject o : searchLayoutList) {
                ObjectSet obj = new ObjectSet();
                obj.id = String.valueOf(o.get('Id'));
                obj.filedValue = String.valueOf(o.get(defaultField));
                obj.filedValue2 = String.valueOf(o.get(additionalField));
                objList.add(obj);
            }
            System.debug('objList ==>' + objList);
        } catch(Exception e) {
            System.debug(e.getMessage()); 
        } 
        return objList;
    }
	
    
    // 추후에 공통으로 쓸 수 있게 하기 위해 클래스에 감싸서 전달
    public class ObjectSet{
        @Auraenabled
        public String filedValue{set;get;}
        @Auraenabled
        public String filedValue2{set;get;}
        @Auraenabled
        public String id{set;get;}
    }

}