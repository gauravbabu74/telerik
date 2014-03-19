var i=0;
    var docsdata = new kendo.data.DataSource({
    transport: {
    read: function(options) {
        var max = i + 5;
        var data = [];
        for (; i < max; i ++) {
        	data.unshift({ name: "record" + i, modified: +new Date() });
    	}
        options.success(data);
        }
}
});
function viewInit(e)
{
    e.view.element.find("#listView").kendoMobileListView({
    dataSource: [ "foo", "bar" ],
    filterable: true
    }); 
}
function homeInit(e)
{
    if(sessionStorage.getItem("isLoggedIn") === true){
        
         kendo.history.navigate("#tabstrip-home");
         apps.navigate("#tabstrip-home");
    }else{
        
        kendo.history.navigate("#tabstrip-login");
        apps.navigate("#tabstrip-login");
    }
    
}