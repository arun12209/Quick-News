/**
 * @description NewsSourceCls class / get the news source and country from custom metadata type 
 */
public  with sharing class NewsSourceCls {
    /**
     * @description getNewsSource method to get the new source from custom metadata type.
     * @return Map<string,News_Source__mdt>
     */
    public static Map<string,News_Source__mdt> getNewsSource(){
        
        Map<String,News_Source__mdt> sourceMap = new Map<String,News_Source__mdt>();

        //iterate over news source custom metadata type
        for(News_Source__mdt source : News_Source__mdt.getAll().values()){
            //put custom metadata "Label" => object
            sourceMap.put(source.Label, source);
        }
        //return source map
        return sourceMap;
    }
    /**
     * @description getcountryMap method to get the countries from custom metadata type.
     */
    public static Map<string,Country__mdt> getcountryMap(){

        Map<String,Country__mdt> countryMap = new Map<String,Country__mdt>();

        //iterate over country custom metadata type
        for(Country__mdt country : Country__mdt.getAll().values()){
            //put custom metadata "Label" => object
            countryMap.put(country.Label, country);
        }

        //return country map
        return countryMap;
    }
}