(function (global) {
    var ScheduleViewModel,
        app = global.app = global.app || {};

    ScheduleViewModel = kendo.data.ObservableObject.extend({
        phonenumber:'',
        sDate:'',
        sTime:'',
        closeModal:function()
        {
            //var that = this,
            $("#tabstrip-scall").data("kendoMobileModalView").close();
           
        },
        validateSchedule:function()
        {
            var that = this,
            phonenumber = that.get("phonenumber").trim(),
            sDate = kendo.toString(that.get("sDate"), "MM-dd-yyyy");
            sTime = $("#timepicker").val();
            if (phonenumber === "" || sDate === "" || sTime ==="") {
                navigator.notification.alert("All fields are required!",
                    function () { }, "Schedule failed", 'OK');

                return;
            }
            else{
                
               app.loginService.viewModel.showloder();
               // alert('Schedule call');
               that.setSchedule(phonenumber,sDate,sTime);  
            }
           
        },
        setSchedule:function(phonenumber,sDate,sTime)
        {
            
            var dataSource = new kendo.data.DataSource({
            transport: {
                    read: {
                            url: "http://biz2services.com/mobapp/api/user/",
                            type:"POST",
                            dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            data: { apiaction:"callschedule",userid:localStorage.getItem("userID"),name:localStorage.getItem("userFName"),email:localStorage.getItem("userEmail"),appid:"",phone:phonenumber ,calldate:sDate,calltime:sTime}
                    },
                },
                    schema: {
                        data: function(data)
                    	{
                        	return [data];
                    	}
                    }
               
            });
            dataSource.fetch(function(){
            var that = this;
            var data = that.data();
            app.loginService.viewModel.hideloder();  
        	alert(data[0]['results']['faultmsg']);  
           });
        }
      
        
    });
    
    app.scheduleService = {
        viewModel: new ScheduleViewModel()	
    };
})(window);
$(document).ready(function(){
    $("#datepicker").kendoDatePicker({
       min: new Date(1950, 0, 1),
       max: new Date(2049, 11, 31),
       format: "MM-dd-yyyy",
       
    });
    $('#datepicker').attr('disabled','disabled');
    $("#timepicker").kendoTimePicker();
    $('#timepicker').attr('disabled','disabled');
    var listOfTimes = $("#timepicker_timeview");
    listOfTimes.empty();
    listOfTimes.append('<li tabindex="-1" role="option" class="k-item" selectable="on">08AM - 10AM</li>');
    listOfTimes.append('<li tabindex="-1" role="option" class="k-item" selectable="on">10AM - 12PM</li>');
    listOfTimes.append('<li tabindex="-1" role="option" class="k-item" selectable="on">12PM - 02PM</li>');
    listOfTimes.append('<li tabindex="-1" role="option" class="k-item" selectable="on">02PM - 04PM</li>');
    listOfTimes.append('<li tabindex="-1" role="option" class="k-item" selectable="on">04PM - 06PM</li>');
    listOfTimes.append('<li tabindex="-1" role="option" class="k-item" selectable="on">06PM - 08PM</li>');
});