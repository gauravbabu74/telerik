(function (global,$) {
    var MatchespageViewModel,
        app = global.app = global.app || {};

    MatchespageViewModel = kendo.data.ObservableObject.extend({
       
       homeShow: function () {
        var matchesData = new kendo.data.DataSource({
            transport: {
                read: function(options) {
                  // console.log(options);
                    
                var i = 0;
                var max = i + 5;
                var data = [];
                for (; i < max; i ++) {
                	data.unshift({ name: "record" + i, modified: +new Date() });
                }
                    console.log(data);
                	options.success(data);
                    //console.log(options);
                }
            },
           
        });
        matchesData.fetch(function(){
            var that = this;
            var data = that.data();
            console.log(data);
           
           
        });
        
        },
   
    });
    app.matchsetting = {

		viewModel: new MatchespageViewModel(),     	
    };
 
})(window,jQuery);