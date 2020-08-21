	  SignInFormController = function(scope,localStorageService,RequestSender,authenticationService,rootScope,location,SessionManager,$window) {
		  
		  //set the default values
		  scope.loginCredentials = {};
		//login functionality
	      scope.login = function() {
	    	  
	    	  rootScope.signupErrorMsgs = [];rootScope.loginErrorMsgs = [];rootScope.infoMsgs = [];
	    	  
	    	  if(scope.loginCredentials.username && scope.loginCredentials.password){
	    		  
	    		  authenticationService.authenticateWithUsernamePassword(function(data){
	    			  scope.isProcessing = true;
	    			  RequestSender.loginUser.save(scope.loginCredentials,function(successData){
	    				rootScope.selfcare_sessionData ={clientId: successData.clientId, authenticationKey: data.base64EncodedAuthenticationKey};
	    				 localStorageService.add("selfcare_sessionData", rootScope.selfcare_sessionData);
	    				  rootScope.currentSession= {user :successData.clientData.displayName||"selfcare"};
	    				  scope.loginCredentials = {};rootScope.signUpCredentials = {};
	            		  rootScope.signupErrorMsgs  =[];rootScope.loginErrorMsgs  =[];rootScope.infoMsgs  =[];
	        	    	  scope.isProcessing  = false;
	        	    	  //adding web tv url
	        	    	  rootScope.webtvURL = selfcareModels.webtvURL+"?id="+successData.clientId;
	        			  localStorageService.add("selfcareAppUrl",selfcareModels.selfcareAppUrl);
	        			  localStorageService.add("loginHistoryId", successData.loginHistoryId);
	        			  $window.sessionStorage.setItem("myaccountKey","myaccountLoginSession");
	            		  location.path('/shops');
	            	  },function(errorData){
	            		  scope.isProcessing = false;
	            		  if(errorData.data.userMessageGlobalisationCode == "error.msg.not.authenticated"){
		            	  		rootScope.loginErrorMsgs.push({'name' : 'error.login.failed'});
		            	  	  }else{
		            	  		rootScope.loginErrorMsgs.push({'name' : errorData.data.errors[0].userMessageGlobalisationCode});
		            	  	  }
	            	  });//end of request
	    		  });//end of authentication request
	    	  }else {
	    		  rootScope.loginErrorMsgs.push({'name' : 'title.fill.alldetails'});
	    	  }
	        
	      };//login fun end
	      
	      $('#pwd').keypress(function(e) {
	          if(e.which == 13) {
	              scope.login();
	          }
	        });
	      
		  
    };
  selfcareApp.controller('SignInFormController', [ '$scope',
                                                   'localStorageService',
                                                   'RequestSender',
                                                   'AuthenticationService',
                                                   '$rootScope', 
                                                   '$location', 
                                                   'SessionManager', 
                                                   '$window', 
                                                   SignInFormController]);
