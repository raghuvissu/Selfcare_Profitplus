InterswitchIntegrationController = function(scope, RequestSender,location, localStorageService,$timeout,routeParams,dateFilter) {  
	
		 scope.screenName 			= routeParams.screenName;
		 scope.clientId 			= routeParams.clientId;
		 scope.planId 				= routeParams.planId;
		 scope.priceId 				= routeParams.priceId;
		 scope.amount 				= routeParams.amount;
		 scope.productId 			= routeParams.productId;
		 scope.payItemId 			= routeParams.payItemId;
		 var selfcareAppUrl			= selfcareModels.selfcareAppUrl;
		 
		 //getting values from constants.js file
		 scope.currency				= selfcareModels.interswitchCurrencyType;
		 
		 if(scope.amount){
			if(scope.amount.match(".") != "."){
				scope.amount = scope.amount+"00";
			}
		 }
		 
		 if(selfcareAppUrl){
			 if(selfcareAppUrl.match("index.html")=="index.html"){
				 var jspPage = selfcareModels.interswitchJspPage
				 scope.siteRedirectURL = selfcareAppUrl;
				 scope.siteRedirectURL = scope.siteRedirectURL.replace("index.html",jspPage);
				 scope.siteRedirectURL = scope.siteRedirectURL+"?url="+selfcareAppUrl;
			 }
		 }
		
		 var randomFun = function() {
				var chars = "0123456789";
				var string_length = 6;
				var randomstring = dateFilter(new Date(),'yyMMddHHmmss');
				
				for (var i=0; i<string_length; i++) {
					var rnum = Math.floor(Math.random() * chars.length);
					randomstring += chars.substring(rnum,rnum+1);	
				}	
				scope.txnref = randomstring;
				
			};randomFun();	

			/*$timeout(function() {
				  $("#submitGlobalPayIntegration").click();
			}, 1000);*/
		  
    };
    
selfcareApp.controller('InterswitchIntegrationController', ['$scope', 
                                                          'RequestSender',
                                                          '$location', 
                                                          'localStorageService',
                                                          '$timeout',
                                                          '$routeParams',
                                                          'dateFilter',
                                                          InterswitchIntegrationController]);
