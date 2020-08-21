ChangePasswordController = function(scope,RequestSender,rootScope,localStorageService,sessionManager) {
		 
		  
		  scope.formData = {};scope.pwdData = {};
		  if(rootScope.selfcare_sessionData){
			RequestSender.clientResource.get({clientId: rootScope.selfcare_sessionData.clientId} , function(data) {
			  scope.email = data.selfcare.uniqueReference;
			  scope.userName = data.selfcare.userName;
			  scope.password = data.selfcare.password;
		    });
		  }
		  
		  scope.passwordCheck = function(){
			 if(scope.pwdData.newPassword && scope.pwdData.confirmPassword){
				 if(scope.pwdData.newPassword === scope.pwdData.confirmPassword){
					 scope.retype_pwd_valid = false;
				 }
				 else{
					 scope.retype_pwd_valid = true;
				 }
			 }
		  };
		  
		  scope.currentPasswordCheck = function(){
			  if(scope.currentPassword === scope.password){
				  scope.retype_currentpwd_valid = false;
			  }
			  else{
				  scope.retype_currentpwd_valid = true;
			  }
		  };
		  scope.submit = function(){
			  if(scope.retype_pwd_valid == false && scope.retype_currentpwd_valid==false){
				  rootScope.infoMsgs  =[];
				  scope.formData.password = scope.pwdData.newPassword;
				  scope.formData.uniqueReference = scope.email;
				  scope.formData.userName = scope.userName;
				  RequestSender.changePwdResource.update(scope.formData,function(data){
					  var sessionData = localStorageService.get('loginHistoryId');
					  if(sessionData){
				          RequestSender.logoutResource.save({logout:'logout',id:sessionData},function(data){
				        	  rootScope.currentSession = sessionManager.clear();
				        	  rootScope.infoMsgs.push({
				        		  'image' : '../images/info-icon.png',
				        		  'names' : [{'name' : 'title.password.changed'}]
				        	  });
			              });
					  }
				  });
			  }
		  };
		  
    };

 selfcareApp.controller('ChangePasswordController',['$scope',
                                                    'RequestSender',
                                                    '$rootScope',
                                                    'localStorageService',
                                                    'SessionManager',
                                                    ChangePasswordController]);
