({
    doInit : function(component, event, helper) {
        
        let mapObj = component.get('v.countryFlagMap');
        let mapKey = component.get('v.mapKey');

        component.set("v.flagURL",mapObj.get(mapKey));
        
    }
})
