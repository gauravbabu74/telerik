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
$(document).ready(function(){
    $("#datepicker").kendoDatePicker({
       value: new Date(),
       min: new Date(1950, 0, 1),
       max: new Date(2049, 11, 31),
       
    })
    $('#datepicker').attr('disabled','disabled');
    $("#timepicker").kendoTimePicker();
    $('#timepicker').attr('disabled','disabled');
   // $( ".km-loader").wrap( "<div class='km-loader-new'></div>" );
});