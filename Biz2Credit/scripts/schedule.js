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
            if (phonenumber === "") {
                navigator.notification.alert("Please enter phone number.",
                    function () { }, "Notification", 'OK');

                return;
            }
            if (!$.isNumeric(phonenumber)) {
                navigator.notification.alert("Phone Number should be numeric.");

                return;
            }
            if (phonenumber.length !== 10) {
                navigator.notification.alert("Phone Number should be 10 digits.");

                return;
            }
            if (sDate === "") {
                navigator.notification.alert("Please select date..",
                    function () { }, "Notification", 'OK');

                return;
            }
            if (sTime ==="") {
                navigator.notification.alert("Please select time.",
                    function () { }, "Notification", 'OK');

                return;
            }
            else{ 
                if(!window.connectionInfo.checkConnection()){
                	navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
                		if (confirmed === true || confirmed === 1) {
                			app.scheduleService.viewModel.validateSchedule();
                		}

                	}, 'Connection Error?', 'Retry,Cancel');
                }
                else
                {
                	app.loginService.viewModel.showloder();
                	// alert('Schedule call');
                	that.setSchedule(phonenumber,sDate,sTime); 
                }
            }
           
        },
        setSchedule:function(phonenumber,sDate,sTime)
        {
            
            var dataSource = new kendo.data.DataSource({
            transport: {
                    read: {
                            url: "https://www.biz2services.com/mobapp/api/user/",
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
                console.log(data);
            app.loginService.viewModel.hideloder();  
        	alert(data[0]['results']['faultmsg']);  
           });
        },
        ScheduleCloseModalView:function()
        {
            $("#tabstrip-scall").data("kendoMobileModalView").close();
            var that =this;
            that.set("phonenumber","");
            that.set("sDate","");
            $("#timepicker").val("");
        },
   
    });
    $(window).on('orientationchange', function () {
      app.homesetting.viewModel.closeParentPopover();
    });
    app.scheduleService = {
        viewModel: new ScheduleViewModel()	
    };
})(window);
$(document).ready(function(){
 	$("body").removeAttr("style");
    var todaysDate = new Date();
    var pastDate = new Date(2013, 1, 1);
    var dp = $("#datepicker").kendoDatePicker({
    value: pastDate,
    min: pastDate,
    format: "MM-dd-yyyy",
    open: function(e) {
        if ( dp.min() === pastDate)  {
        		dp.value(todaysDate);
        		dp.min(todaysDate);
        	}
        }
    }).data("kendoDatePicker");
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
