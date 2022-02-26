/**
 * @description NewsJSONParser class to parse the JSON data received from NewsAPI.org
 */
public with sharing class NewsJSONParser{
        //Status
        @AuraEnabled
        public String status;
        //News source
        @AuraEnabled
        public String source;
        //Sort by
        @AuraEnabled
        public String sortBy;
        //Articles details
        @AuraEnabled
        public List<Articles> articles;
        //Article inner class
        public class Articles {
            //Auther details
            @AuraEnabled
            public String author;
            //Article title
            @AuraEnabled
            public String title;
            //Article description
            @AuraEnabled
            public String description;
            //Article url
            @AuraEnabled
            public String url;
            //Article image url
            @AuraEnabled
            public String urlToImage;
            //Publish details
            @AuraEnabled
            public String publishedAt;
        }
        /**
         * @description parse method is to parse the json data and it will return the apex objects type
         * @param json
         * @return NewsJSONParser
         */
        public static NewsJSONParser parse(String json) {
            //return deserialize object 
            return (NewsJSONParser) System.JSON.deserialize(json, NewsJSONParser.class);
        }
}