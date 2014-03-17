(function (global) {
    var HomepageViewModel,
        app = global.app = global.app || {};

    HomepageViewModel = kendo.data.ObservableObject.extend({
        
        title:'test',
        description:'gaurav',
        
    });
     app.homesetting = {
        viewModel: new HomepageViewModel()	
    };
})(window);