({
    //load the news articles when the app loaded
    getDetails: function(component,event,helper){
        component.set('v.Spinner',true);
        //set the selected news source 
        component.set('v.selectedNewsSource',localStorage.getItem('selectedSource'));
        //apex method action
        let action = component.get("c.getNews");

        //make the picklist options visible
        component.set("v.showpicklist",true);

        //make the domain option false
        let isDomain = false;
        
        //domain names
        let domains = component.get('v.newsSourceDomainList');
       
        if(domains.includes(component.get("v.selectedNewsSource"))){
            isDomain = true;
        }

       //send the parameters to the apex method
        action.setParams({
            "sourceName":  localStorage.getItem('selectedSource'),
            "isDomainSource" : isDomain
        });

        //callback function
        action.setCallback(this, function(response) {
            component.set('v.Spinner',false);
            //get the state of callback function
            var state = response.getState();

            //if state is success
            if (state === "SUCCESS") {

                //get the reposne from apex method
                let stringItems = response.getReturnValue();
                
                if(stringItems!=null){
                    //get the status of the api call

                    let respStatus = response.getReturnValue().status;
                    //if statue is 200 ok

                    if(respStatus=='ok'){
                        //set the value in the newsData attribute
                        component.set("v.newsData", stringItems); 


                        let iconURL = component.get('v.iconMap').get(localStorage.getItem('selectedSource'));
       
                        if(iconURL!= '' && iconURL!=undefined){
                            component.set("v.iconURL",iconURL);
                        }
                        else{
                            component.set("v.iconURL",'');
                        }
                    } 
                    else {
                        component.set("v.showpicklist",false); 
                    }
                } 
            }
        });

        //enqueue the apex method action
        $A.enqueueAction(action);
    },

    //ge the news source *****************************
    getNewsSources : function(component,event,helper){

        //aex action method call
        let action = component.get("c.fetchNewsSources");

        //callback function
        action.setCallback(this,function(response){

            //get the state of callback
            let state = response.getState();

            // if callback state is success
            if(state == 'SUCCESS'){

                //get the response from callback
                let result = response.getReturnValue();
                
                //news source domain array
                let domainNames = [];

                //array to store news source labels
                let arrayOfMapKeys = [];

                //icon map to store the news source icons
                let newsSourceIconMap = new Map();

                //iterate over result map returned from apex method.
                for (let singlekey in result) {

                    if(result[singlekey].Available_by_domain__c){
                        domainNames.push(result[singlekey].Label);
                    }
                    //push the news source label in the array
                    arrayOfMapKeys.push(result[singlekey].Label);

                    //put key and value in the iconMap (NBC News=> https://www.nbcnews.com/favicon.ico )
                    if(result[singlekey].Icon_URL__c!=undefined){
                      newsSourceIconMap.set(result[singlekey].Label,result[singlekey].Icon_URL__c );
                    }
                   
                }
                //set the value in the iconMap attribute
                component.set('v.iconMap',newsSourceIconMap);
                
                //set the value in domain list attribute
                component.set('v.newsSourceDomainList',domainNames);
                
                //sort the array element in the alphabetical order
                arrayOfMapKeys.sort();

                //array declared to store the picklist options
                let options =[];

                //get the selected news source
                let selectedNewsSource = component.get("v.selectedNewsSource");

                //iterate over news source list and push the elements in the "options" array
                for (let index = 0; index < arrayOfMapKeys.length; index++) { 

                    let isSelected = false;
                    //set the selected record
                    if(selectedNewsSource == arrayOfMapKeys[index]){

                        isSelected = true;
                    }

                    //push the element in the array
                	options.push({ label: arrayOfMapKeys[index], value: arrayOfMapKeys[index], selected: isSelected});
                }
                //set the value in the "source" attrubute
                component.set("v.source",options);

                //call get details method to load the news
                helper.getDetails(component,event,helper);
            }
        });
        //enqueue the apex method action
        $A.enqueueAction(action);
    },

    //get the countries from *********************
    getCountries:function(component,event,helper){

        //apex method action
        let action = component.get("c.fetchCountries");

        //callback function
        action.setCallback(this,function(response){

            let state = response.getState();
            
            //if state is SUCCESS
            if(state == 'SUCCESS'){

                //get the response from apex method 
                let result = response.getReturnValue();

                let countriesArray = [];

                //countries flag map to store the falg url
                let countriesFlagnMap = new Map();

                //flag base url
                let baseURL = 'https://flagcdn.com/32x24/';

                for (let singlekey in result) {

                    //push the news source label in the array
                    countriesArray.push(result[singlekey].Label);

                    if(result[singlekey].Country_code__c != undefined){

                        let val = baseURL + result[singlekey].Country_code__c + '.png';

                        countriesFlagnMap.set(result[singlekey].Label,val);

                      }
                }
                //sort the array element
                countriesArray.sort();

                //put the valu in the country falg map attribute
                component.set('v.mapCountryFlag',countriesFlagnMap);
                
                //option array to store the picklist options
                let options =[];

                //get the selected news source
                let selectedNewsSource = component.get("v.selectedNewsSource");

                //iterate over result and push the elements in the "options" array
                for (let index = 0; index < countriesArray.length; index++) { 

                    //make the selected varibale false
                    let isSelected = false;

                    //make the selected source = true
                    if(selectedNewsSource == countriesArray[index]){
                       
                        isSelected = true;
                    }

                    //push the element in the array
                	options.push({ label: countriesArray[index], value: countriesArray[index], selected: isSelected});

                }

                //set the options in the country attribute
                component.set("v.country",options);
            }
        });
        $A.enqueueAction(action);
    }
})