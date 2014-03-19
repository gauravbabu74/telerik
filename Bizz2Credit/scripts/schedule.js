(function (global) {
    var ScheduleViewModel,
        app = global.app = global.app || {};

    ScheduleViewModel = kendo.data.ObservableObject.extend({
   
        
    });
    
    app.scheduleService = {
        viewModel: new ScheduleViewModel()	
    };
})(window);