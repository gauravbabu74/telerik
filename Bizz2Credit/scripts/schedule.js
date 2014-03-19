(function (global) {
    var ScheduleViewModel,
        app = global.app = global.app || {};

    ScheduleViewModel = kendo.data.ObservableObject.extend({
     phonenumber:'7503413153',
        stime:'test',
         closeModal:function()
         {
            //var that = this,
            $("#tabstrip-scall").data("kendoMobileModalView").close();
           
        },
        
      
        
    });
    
    app.scheduleService = {
        viewModel: new ScheduleViewModel()	
    };
})(window);