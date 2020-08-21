ProfileController = function(scope,RequestSender,rootScope,location,paginatorService,localStorageService, API_VERSION,sessionManager,
		                     filter,dateFilter,$modal,route) {
		  
	  	   
		 if(rootScope.selfcare_sessionData){		  
			  scope.clientId = rootScope.selfcare_sessionData.clientId;
			  sessionManager.configurationFun(function(data){
				  scope.clientData = data;
				  scope.isautoPayment = data.selfcare.isAutoBilling == 'Y'? true:false;
				scope.isWorldpayBilling = data.selfcare.isWorldpayBilling == 'Y'? true:false;
				  if(data.selfcare){
					  data.selfcare.token ? rootScope.iskortaTokenAvailable = true : rootScope.iskortaTokenAvailable = false;
					  !data.selfcare.authPin ? scope.clientData.selfcare.authPin = 'Not Available':null;
				  }
				  rootScope.selfcare_userName = data.displayName;
				  
				  
				  if(rootScope.isConfigPassport){
					  RequestSender.clientIdentifiersResource.query({clientId:scope.clientId},function(identifiersdata){
						  angular.forEach(identifiersdata,function(val,key){
							  if(angular.lowercase(val.documentType['name']) == selfcareModels.isPassport){
								  scope.passport = val.documentKey;
							  }
						  });
					  });
				  }
				
			  });
		  }

	  	
    };//end final
    
selfcareApp.controller('ProfileController', ['$scope',
                                             'RequestSender',
                                             '$rootScope',
                                             '$location',
                                             'PaginatorService', 
                                             'localStorageService', 
                                             'API_VERSION', 
                                             'SessionManager', 
                                             '$filter',
                                             'dateFilter',
                                             '$modal',
                                             '$route',
                                             ProfileController]);
