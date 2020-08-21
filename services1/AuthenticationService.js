selfcareApp.service("AuthenticationService",['HttpService','API_VERSION',function(httpService,API_VERSION){

      this.authenticateWithUsernamePassword = function(handler) {
	        httpService.post(API_VERSION+"/authentication?username="+selfcareModels.obs_username+"&password="+selfcareModels.obs_password)
	          .success(function(data){
	        	  httpService.setAuthorization(data.base64EncodedAuthenticationKey);
	        	  handler(data);
	          })
	          .error(function(data){
	        	  
	      		alert("Main Role Authentication Failure");
	      	});

      };


}]);