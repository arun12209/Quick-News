({
    //doInit function called on the load of component
    doInit : function(component, event, helper) {
        
        //get selected source from localStorage and if selected selected source is undefined
        if(localStorage.getItem('selectedSource') == undefined){
            //very first time it will set selected source as 'Abc news'
            localStorage.setItem('selectedSource','ABC News');
        }
        //get the selected source from local storage and set that in "selectedNewsSource" attribute.
        component.set('v.selectedNewsSource',localStorage.getItem('selectedNewsSource'));

        helper.getNewsSources(component,event,helper);
        helper.getCountries(component,event,helper);
        
        
    },
    
    //function to close the left navigation bar
    closeNav: function(component,event,helper){
        
        let cmpTarget = component.find('mySidenav');

        //remove the css class from element
        $A.util.removeClass(cmpTarget, 'OpenNavigation');

        //add the css class to element
        $A.util.addClass(cmpTarget, 'CloseNavigation');
    },

    //hide side bar menu
    hideSidebarMenu : function(component,event,helper){
        
        let cmpTarget = component.find('mySidenav');

        //remove the css class from this element
        $A.util.removeClass(cmpTarget, 'OpenNavigation');
        
        //add the css class to this element
        $A.util.addClass(cmpTarget, 'CloseNavigation');
    },

    //open the left side navigation bar
    openNav : function(component,event,helper){
        
        component.set('v.CountryOpen',false);

        component.set('v.newsSourceOpen',true);

        //make the search word blank
        component.set('v.myEnterSearch','');

        //get the sidebar element
        let cmpTarget = component.find('mySidenav');

        //add the css class to this element
        $A.util.addClass(cmpTarget, 'OpenNavigation');
    },

    //open country navigation bar
    openCountryNav : function(component,event,helper){
        
        component.set('v.newsSourceOpen',false);
        
        component.set('v.CountryOpen',true);

        //make search word blank
        component.set('v.myEnterSearch','');

        //get the sidebar element
        let cmpTarget = component.find('mySidenav');

        //add the css class to this element
        $A.util.addClass(cmpTarget, 'OpenNavigation');
    },

    //open category modal
    OpenCategoryModal : function(component,event,helper){

        //make the country category modal visible
        component.set('v.isCategoryModalOpen',true);

    },

    //close the category modal
    closeCategoryModal : function(component,event,helper){

        //make the country category modal invisible
        component.set('v.isCategoryModalOpen',false);

    },

    //function to get the news category wise.
    onChangeCategory : function(component,event,helper){

        //ge the selected element
        let currentEl = event.currentTarget;

        //ge the selected category name
        let selectedCategory = currentEl.name;

        //make the category section visible
        component.set("v.isNewscategory",true);

        component.set("v.selectedNewscategory",selectedCategory.charAt(0).toUpperCase()+selectedCategory.slice(1));

        //call apex method to get the news by category
        let action = component.get("c.getNewsByCategory");
        
        //send the parameters to apex method
        action.setParams({
            "countryNameOrSource":component.get("v.selectedNewsSource"),
            "categoryStr" : selectedCategory
        });
        //callback function
        action.setCallback(this, function(response) {
            
            let state = response.getState();

            //if state is SUCCESS
            if (state === "SUCCESS") {

                //get the response returned from apex method
                let stringItems = response.getReturnValue();

                //set the reponse in the newsData attribute
                component.set("v.newsData", stringItems); 
                
                //make the category modal box false
                component.set('v.isCategoryModalOpen',false);
            }
        });
        //enequeue the apex action
        $A.enqueueAction(action);
    },

    //when user change the new source this function gets executed
    onChangeFunction : function(component,event){

        component.set('v.selectedNewscategory','');

        component.set('v.isNewscategory',false);

        component.set('v.isCountry',false);

        //get the selected element
        let currentEl = event.currentTarget;

        //get the selected source name
        let selected = currentEl.name;
        
        //set the selected news source in the local storage
        localStorage.setItem('selectedSource',selected);
        
        //make the domain selection false
        let isDomain = false;

        //get the icon url
        let iconURL = component.get('v.iconMap').get(selected);
       
        if(iconURL != '' && iconURL != undefined){
            component.set("v.iconURL",iconURL);
        }
        else{
            component.set("v.iconURL",'');
        }
        
        //domain names
        let domains = component.get('v.newsSourceDomainList');
       
        if(domains.includes(selected)){
            isDomain = true;
        }

        //set the selected news source in the attribute
        component.set('v.selectedNewsSource',selected);

        //get the sidebar navigation menu element
        let cmpTarget = component.find('mySidenav');

        //remove the css class from element
        $A.util.removeClass(cmpTarget, 'OpenNavigation');

        //add the css class to the element
        $A.util.addClass(cmpTarget, 'CloseNavigation');

        //apex method action to get the news
        let action = component.get("c.getNews");

        //send the parameters to apex method
        action.setParams({
            "sourceName":selected,
            "isDomainSource" : isDomain
        });

        //callback function
        action.setCallback(this, function(response) {
            
            let state = response.getState();

            //if state is SUCCESS
            if (state === "SUCCESS") {

                //get the response from apex method
                let stringItems = response.getReturnValue();

                //set the reponse in the newsData attribute
                component.set("v.newsData", stringItems); 

                //make the source true
                component.set("v.isSource",true);

                //make the country attribute false
                component.set("v.isCountry",false);
            }
        });
        //enqueue the apex method call action
        $A.enqueueAction(action);
    },

    //this function gets called when user change the country
    onCountryChangeFunction :function(component,event){

        //get the current element
        let currentEl = event.currentTarget;

        //get the selected country name
        let selected = currentEl.name;

        //set the selected new ssource
        component.set('v.selectedNewsSource',selected);

        //get the icon url
        let iconURL = component.get('v.mapCountryFlag').get(selected);
       
        if(iconURL != '' && iconURL != undefined){
               component.set("v.iconURL",iconURL);
        }
        else{
               component.set("v.iconURL",'');
        }
           
        component.set('v.selectedNewscategory','');

        component.set('v.isNewscategory',false);

        //get the side bar element
        let cmpTarget = component.find('mySidenav');

        //removed the css class from side bar element
        $A.util.removeClass(cmpTarget, 'OpenNavigation');

        //add the css class to the element
        $A.util.addClass(cmpTarget, 'CloseNavigation');

        //apex method action to get the news article based on the country
        let action = component.get("c.getNewsByCountry");

        //send the selected country name as a parameter to apex method
        action.setParams({
            "countryName":selected
        });

        //set callbak method
        action.setCallback(this, function(response) {

            let state = response.getState();

            //if state is SUCCESS
            if (state === "SUCCESS") {

                //get the reponse returned from apex method
                let stringItems = response.getReturnValue();

                //set the response returned in the newsData attribute
                component.set("v.newsData", stringItems); 

                //make the source false
                component.set("v.isSource",false);

                //make the country section visible
                component.set("v.isCountry",true);
            }
            else{

            }
        });
        
        $A.enqueueAction(action);
    },

    showSpinner: function(component, event, helper) {

        // make Spinner attribute true for display loading spinner 
        component.set("v.Spinner", true); 

    },

    // this function automatic call by aura:doneWaiting event 
    hideSpinner : function(component,event,helper){

        // make Spinner attribute to false for hide loading spinner    
        component.set("v.Spinner", false);

    },

    //search news article
    searchNews : function(component,event,helper){

        //check if search word is not undefined or blank
        if(component.get("v.searchKey") != '' && component.get("v.searchKey") != undefined){

            //make news category section invisible
            component.set('v.isNewscategory',false);

            //make country section invisible
            component.set('v.isCountry',false);

            //make selected new source blank
            component.set('v.selectedNewsSource','');

            //make icon url blank
            component.set('v.iconURL','');

            //call apex method action to find the news
            let action = component.get("c.findNews");

            //send the search key to apex method
            action.setParams({
                "searchString":  component.get("v.searchKey")
            });

            //callback method 
            action.setCallback(this, function(response) {

                let state = response.getState();

                //if state is SUCCESS
                if (state === "SUCCESS") {

                    //get the result retured from apex method
                    let data = response.getReturnValue();

                    console.log('result data : ' +JSON.stringify(data));

                    //set the result in the newsData attribute 
                    component.set("v.newsData", data); 
                }
                else{
                    
                }
            });

            $A.enqueueAction(action);
        }
    }
})