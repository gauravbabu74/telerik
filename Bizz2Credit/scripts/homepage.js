(function (global,$) {
    var HomepageViewModel,
        app = global.app = global.app || {};

    HomepageViewModel = kendo.data.ObservableObject.extend({
		Matches:[],
        dHeader:(window.localStorage.getItem("dHeader") !== null) ?  localStorage.getItem("dHeader") : '',
        dDescription:(window.localStorage.getItem("dDescription") !== null) ?  localStorage.getItem("dDescription") : '',
        dButtonText :(window.localStorage.getItem("dButtonText") !== null) ?  localStorage.getItem("dButtonText") : '',
        dButtonLink:(window.localStorage.getItem("dButtonLink") !== null) ?  localStorage.getItem("dButtonLink") : '',
        homeShow: function () {
        app.loginService.viewModel.showloder();
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://biz2services.com/mobapp/api/user/",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: { apiaction:"userdashboard",userid:sessionStorage.getItem("userID")} // search for tweets that contain "html5"
                }
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
            //console.log(data['0']['results']['data']['loan']['matchrows']);
            app.homesetting.viewModel.setMatches(data['0']['results']['data']['loan']['matchrows']);
            //console.log(data);
            var cntGetStarted = data[0]['results']['data']['cntGetStarted'];
            var matchstatus = data[0]['results']['data']['matchstatus'];
            var totmatch = data[0]['results']['data']['totmatch'];
            var creditscore = data[0]['results']['data']['creditscore'];
            var loan_total = data[0]['results']['data']['loan']['total'];
            var loan_posted = data[0]['results']['data']['loan']['posted'];
            var loan_ended = data[0]['results']['data']['loan']['ended'];
            var loan_saved = data[0]['results']['data']['loan']['saved'];
            var matches = data[0]['results']['data']['loan']['matches'];
            var matchrows =data[0]['results']['data']['loan']['matchrows'];
            var funded =data[0]['results']['data']['funded'];
            var userName= sessionStorage.getItem("userFName");
        	if(cntGetStarted === 0 && loan_total === 0){
            	pos = 1;
               
            }
            if(matchstatus === 2 && loan_total > 0){
            	pos = 2;
               
            }
            if(matchstatus === 0){
            	pos = 3;
                
            }
            if(matchstatus === 1 &&  app.homesetting.checkMatchesStatus(data[0]['results']['data']['loan']['matchrows'])){
            	pos = 3;
                
            }else if(matchstatus === 1 && funded === 0){
            	pos = 4;
              
            }
            if(matchstatus === 1 && funded === 1){
            	pos = 5;
               
            }  

            if((cntGetStarted >= 1 && loan_posted === 0)){
                    if(totmatch === 0)
                    {
                        var genmatch;
                        if(creditscore.contains("-")){
                            var tempvar = creditscore.lastIndexOf("-");
        		  	  	var idlength = creditscore.length;
        		        	var substr = creditscore.substring(tempvar+1,idlength+1);
                            genmatch = getTotalMatches(substr);
                            
                        }
                        else{
                            genmatch = getTotalMatches(creditscore);
                        }
                        dHeader ='Hi '+userName+', we have '+genmatch+' potential options for you!';
                    }
                	dHeader ='Hi '+userName+', we have '+totmatch+' potential options for you!';
                    dDescription='Please start your application in order to get matched to pre-qualified funding opportunities';
                    dButtonText = "Start an Application";
                    dButtonLink ="#tabstrip-mess-one";
                }
            if((cntGetStarted>=1 && loan_total===0) || (loan_total===loan_ended)) {
                
                    if(totmatch === 0 || totmatch === '')
                    {
                        dHeader='Hi '+userName+', We have 1200+ lenders to finance your needs';
                    }
                    else
                    {
                        dHeader ='Hi '+userName+', we have '+matches+' potential options for you!'; 
                    }
            		
            		dDescription='Please start your application in order to get matched to pre-qualified funding opportunities';
            		dButtonText = "Start an Application";
            		dButtonLink ="#tabstrip-mess-one";
                }
            if(cntGetStarted===0 && loan_total===0) {
                    dHeader='Hi '+userName+', We have 1200+ lenders to finance your needs';
                    dDescription='Please start your application in order to get matched to pre-qualified funding opportunities';
                    dButtonText = "Start an Application";
                    dButtonLink ="#tabstrip-mess-one";
				}
           /* if(loan_total === loan_saved && loan_total>0) {
					dHeader= userName+', your loan application is incomplete.';
                    dDescription='In order to see what loan offers you qualify for, you must finish the application. Please click to resume or schedule a call to receive help from a loan expert.';
                    dButtonText = "Complete Application";
                    dButtonLink ="#";
                }*/
            if(loan_posted === 0 && loan_saved >= 1){
                	dHeader= userName+', your loan application is incomplete.';
                    dDescription='In order to see what loan offers you qualify for, you must finish the application. Please click to resume or schedule a call to receive help from a loan expert.';
                    dButtonText = "Complete Application";
                    dButtonLink ="#tabstrip-mess-two";
                }
            if(matchstatus===0 && matches>=1) {
                 dHeader= userName+', you have '+matches+' pre-qualified loan matches.';
                 dDescription='Please review your matches and select your preferred financing option(s)';
                 dButtonText = "Select a Loan Product";
                 dButtonLink ="views/matches.html";
                }
            if(matchstatus===0 && matches===0) { 
                 dHeader= 'You have '+matches+' loan matches';
                 dDescription='No worries! We are here to help you.Use BizAnalyzer to find ways to improve your business\'s finances and funding opportunities.';
                 dButtonText = "Check your BizAnalyzer Score";
                 dButtonLink ="#tabstrip-mess-third";
                }
            if(matchstatus === 1 && app.homesetting.checkMatchesStatus(matchrows)){
                 dHeader= userName+', you have '+matches+' pre-qualified loan matches.';
                 dDescription='Please review your matches and select your preferred financing option(s)';
                 dButtonText = "Select a Loan Product";
                 dButtonLink ="views/matches.html";
                }
            else if(matchstatus === 1 && funded === 0)
            {
                 dHeader= userName+', the below submissions are still pending.';
                 dDescription= 'Please review these items and complete any remaining actions if necessary';
                 dButtonText = app.homesetting.viewModel.getLatestMatchStatus(matchrows);
                 dButtonLink ="views/matches.html";
            }
            if(matchstatus === 1 && funded === 1){
			
				dHeader= userName+', the below submissions are still pending.';
				dDescription= 'Please review these items and complete any remaining actions if necessary';
            	dButtonText = app.homesetting.viewModel.getLatestMatchStatus(matchrows);
            	dButtonLink ="views/matches.html";
                
		    }
            
            $('#stps ul li').removeClass();
            $('#stps ul li:eq('+(pos-1)+')').addClass('activ');
            $('#stps ul li:lt('+(pos-1)+')').addClass('dn');
            
            $("#home-call-btn").html("");
            if(dButtonLink === "views/matches.html")
            {
                var html = '<a class="btngr" href="'+dButtonLink+'" data-role="button">'+dButtonText+'</a>';
            }
            else{
                var html = '<a class="btngr" href="'+dButtonLink+'" data-rel="modalview" data-role="button">'+dButtonText+'</a>';
            }
             
             $("#home-call-btn").append(html);
             app.homesetting.viewModel.setcache(dHeader,dDescription,dButtonText,dButtonLink);
           
        });    
        },       
		setcache:function(dHeader,dDescription,dButtonText,dButtonLink)
        {
            var that = this; 
            that.set("dHeader",dHeader);
            that.set("dDescription",dDescription);
            that.set("dButtonText",dButtonText);
            that.set("dButtonLink",dButtonLink);
            app.loginService.viewModel.hideloder();
        },
        getLatestMatchStatus:function(matchrows){
            var status;
            dateArray1 =[];
            dateArray2 =[];
            $.each(matchrows , function(index, val) {
                
                if(val['statusid']>1)
                {
                    dateArray1.push(app.homesetting.viewModel.toTimestamp(val['status_date'])); 
                    dateArray2.push(val['status_name']);
                }
				             
            });
            
           status =  dateArray2[$.inArray(Math.max.apply( Math, dateArray1), dateArray1)];
           if(status === '' || typeof status === "undefined"){
               
			status = "View Matches";
               
			}
            return status;
        },
        toTimestamp:function(strDate){
       	 var datum = Date.parse(strDate);
       	 return datum/1000;
        },
        getTotalMatches: function(creditscore)
        {
            var strfoption = "";
            if(creditscore < 600) {        
            	strfoption = randumNumber(50, 55);
            } else if(creditscore >=600 && creditscore <=659){         
            	strfoption = randumNumber(56, 65);
            } else if(creditscore >=660 && creditscore <=720){        
            	strfoption = randumNumber(66, 80);
            } else if(creditscore >=721 && creditscore <=850){         
            	strfoption = randumNumber(81, 100);
            } else{
            	strfoption = "49";
            }

            return strfoption;  
        },
        randumNumber:function(m,n)
        {
            var m = parseInt(m);
            var n = parseInt(n);
            return Math.floor( Math.random() * (n - m + 1) ) + m;  
        },
        setMatches: function(data)
        { 
               var that = this;
               that.set("Matches", data);
               //console.log(data);
               //app.loginService.viewModel.hideloder();
        },
        reqDocuments: function(e)
        {
            var pdata = e.button.data();
        	app.loginService.viewModel.showloder();

            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "http://biz2services.com/mobapp/api/user/",
                        type:"POST",
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        data: { apiaction:"reqdoclist",prodid:pdata.prodid,prodtype:pdata.prodtype} // search for tweets that contain "html5"
                    }
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
                $("#tabstrip-mess-fourth p").html("");
                html ="<ol class='rdocs'>";
                for(i =0; i < data[0]['results']['docLists'].length; i ++)
                {
                   html += "<li>"+data[0]['results']['docLists'][i]+"</li>"; 
                }
				html +="</ol>";
                $(".doc-content").append(html);
                $("#tabstrip-mess-fourth").data("kendoMobileModalView").open();
                $("#tabstrip-mess-fourth").find(".km-scroll-container").css("-webkit-transform", "");
                app.loginService.viewModel.hideloder();
            });    
        },
        matchAppy:function()
        {
            app.loginService.viewModel.showloder();
            // this space for send mail
            $("#tabstrip-mess-dynamic p").html("");
            html ="To apply for this product, Please log on to the web version of Biz2credit.com";
            $("#tabstrip-mess-dynamic p").append(html);
            $("#tabstrip-mess-dynamic").data("kendoMobileModalView").open();
            
            app.loginService.viewModel.hideloder();
        }
        
    });
    app.homesetting = {
        checkMatchesStatus: function(msdata)
        {
            var ms = true;
            $.each(msdata, function( index, value ) {
                if(value.statusid > 1){
                	ms = false;
                } 
            });
            return ms;
        },
        
		viewModel: new HomepageViewModel(),     	
    };
 
})(window,jQuery);