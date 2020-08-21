SignUpFormController = function(scope,RequestSender,rootScope,authenticationService,$modal, dateFilter, $upload, API_VERSION) {
		  
		  //set the default values
		  rootScope.registerParams = {
                          "entryType":"IND",
                          "clientCategory":20,
                          "locale":"en",
                          "active":true,
                          "dateFormat":"dd MMMM yyyy",
                          "activationDate":dateFilter(new Date(),'dd MMMM yyyy'),
                          "flag":false
     	  };

		  scope.cafIdChange = function(cafId){
	          delete scope.displayName;
	          if(cafId){
		          RequestSender.getClientwithCafIdResource.get({cafId : cafId}, function(data) {
		                var clientData = data.clientData;
		                scope.displayName = clientData.displayName;
		                scope.registerParams.officeId = clientData.officeId;
		                scope.registerParams.addressNo = clientData.addressNo;
		                scope.registerParams.city = clientData.city;
		                scope.registerParams.state = clientData.state;
		                scope.registerParams.country = clientData.country;
		                if(clientData.zip) scope.registerParams.zipCode = clientData.zip;
		         },function(errorData){
		         		delete rootScope.registerParams.cafId;
		         		rootScope.popUpMsgs = [];
				        	  $modal.open({
	  		  	                templateUrl: 'messagespopup.html',
	  		  	                controller: approve,
	  		  	                resolve:{}
	  		  	            });
	  		            	function  approve($scope, $modalInstance) {
	  		            	  rootScope.popUpMsgs.push({
			  						'image' : '../images/warning-icon.png',
			  						'names' : [{'name' : errorData.data.errors[0].developerMessage}]
		                     });
	  		      		     $scope.approve = function () {
	  		      		    	 $modalInstance.dismiss('cancel');
	  		      		     };
	  		              }    
				        });
	      		}
	      }

	      function registerSuccessFun(){
	      	//rootScope.registerParams = {};
	      	delete rootScope.registerParams.cafId;
	      	delete rootScope.registerParams.firstname;
	      	delete rootScope.registerParams.lastname;
	      	delete rootScope.registerParams.phone;
	      	delete rootScope.registerParams.email;

	      	delete scope.displayName;
	      	delete rootScope.clientImage;
	        //popUp open
			  $modal.open({
		  	                templateUrl: 'messagespopup.html',
		  	                controller: approve,
		  	                resolve:{}
		  	         });
		      	function  approve($scope, $modalInstance) {
		      		rootScope.popUpMsgs.push({
		      			'image' : '../images/info-icon.png',
		      			'names' : [{'name' : 'title.thankyou'},
		      			           {'name' : 'Credentials mail has been sent to your mail id'},
		      			           {'name' : 'title.conformation.email'},
		      			           {'name' : 'Login with your Credentials.'}]
		      		});
		      		$scope.approve = function () { 
		      			 $modalInstance.dismiss('cancel');
		      		};
		        }
	      }


		  //submit functionality
          scope.register = function(){
        	  rootScope.signupErrorMsgs = [];rootScope.loginErrorMsgs = [];rootScope.infoMsgs = [];rootScope.popUpMsgs = [];
        	  console.log(rootScope.registerParams);
        	  scope.isProcessing  = true;
	          if(scope.clientId){
	            if (rootScope.clientImage) {
	                $upload.upload({
	                  url: $rootScope.hostUrl+ API_VERSION +'/clients/'+scope.clientId+'/images', 
	                  data: {},
	                  headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=' },
	                  file: rootScope.clientImage
	                }).then(function(imageData) {
	                  // to fix IE not refreshing the model
	                  if (!scope.$$phase) {
	                    scope.$apply();
	                  }
	                  scope.isProcessing  = false;
	                  registerSuccessFun();
	                  //location.path('/clients');
	                });
	              } else{
	                 scope.isProcessing  = false;
	                 registerSuccessFun();
	                  //location.path('/clients');
	              }

	          } else {
	              RequestSender.clientResource.create(rootScope.registerParams,function(data){
	                        scope.clientId = data.clientId;
	                        console.log(rootScope.clientImage);
	                        if (rootScope.clientImage) {
	                          $upload.upload({
	                            url: $rootScope.hostUrl+ API_VERSION +'/clients/'+data.clientId+'/images', 
	                            data: {},
	                            headers: { 'Authorization': 'Basic YWRtaW46YWRtaW4=' },
	                            file: rootScope.clientImage
	                          }).then(function(imageData) {
	                            // to fix IE not refreshing the model
	                            if (!scope.$$phase) {
	                              scope.$apply();
	                            }
	                            scope.isProcessing  = false;
	                            registerSuccessFun();
	                            //location.path('/clients');
	                          });
	                        } else{
	                           scope.isProcessing  = false;
	                           registerSuccessFun();
	                            //location.path('/clients');
	                        }
	                      },function(errorData){
	                        scope.isProcessing  = false;
	                        $modal.open({
	  		  	                templateUrl: 'messagespopup.html',
	  		  	                controller: approve,
	  		  	                resolve:{}
	  		  	            });
	  		            	function  approve($scope, $modalInstance) {
	  		            	  rootScope.popUpMsgs.push({
			  						'image' : '../images/warning-icon.png',
			  						'names' : [{'name' : errorData.data.errors[0].developerMessage}]
		                     });
	  		      		     $scope.approve = function () {
	  		      		    	 $modalInstance.dismiss('cancel');
	  		      		     };
	  		      		 }
	              });
	          }
        	  /*if(rootScope.signUpCredentials.userName){
        		  rootScope.signUpCredentials.returnUrl = selfcareModels.returnURL+"/"+rootScope.signUpCredentials.userName+"/";
	        	  
	        	  authenticationService.authenticateWithUsernamePassword(function(data){
	        		  
	        		  scope.isProcessing  = true;
	    		  	 RequestSender.registrationResource.save(rootScope.signUpCredentials,function(successData){
	        			  scope.isProcessing  = false;
	        			  rootScope.signUpCredentials = {};
	        		 //popUp open
	        			  $modal.open({
	        		  	                templateUrl: 'messagespopup.html',
	        		  	                controller: approve,
	        		  	                resolve:{}
	        		  	         });
	        		      	function  approve($scope, $modalInstance) {
	        		      		rootScope.popUpMsgs.push({
	        		      			'image' : '../images/info-icon.png',
	        		      			'names' : [{'name' : 'title.thankyou'},
	        		      			           {'name' : 'title.conformation.registration'},
	        		      			           {'name' : 'title.conformation.email'},
	        		      			           {'name' : 'title.conformation.activation.link'}]
	        		      		});
	        		      		$scope.approve = function () { 
	        		      			 $modalInstance.dismiss('cancel');
	        		      		};
	        		        }  
	        			  
			          },function(errorData){
			        	  scope.isProcessing  = false;
			        	  rootScope.registerParams = {};
			        	  $modal.open({
  		  	                templateUrl: 'messagespopup.html',
  		  	                controller: approve,
  		  	                resolve:{}
  		  	            });
  		            	function  approve($scope, $modalInstance) {
  		            	  rootScope.popUpMsgs.push({
		  						'image' : '../images/warning-icon.png',
		  						'names' : [{'name' : 'title.conformation.alreadyregistration'},
		  						           {'name' : 'title.login.msg'}]
	                     });
  		      		     $scope.approve = function () {
  		      		    	 $modalInstance.dismiss('cancel');
  		      		     };
  		              }    
			        });//end of request
	    		  });//end of authentication request
        	  }else{
				  rootScope.signupErrorMsgs.push({"name":'title.fill.emailid'});
        	  }*/
          };//submit fun end
          
          $('#emailId').keypress(function(e) {
              if(e.which == 13) {
                  scope.submitEmail();
              }
           });
         
    };
selfcareApp.controller('SignUpFormController', ['$scope',
                                                'RequestSender',
                                                '$rootScope',
                                                'AuthenticationService',
                                                '$modal',
                                                'dateFilter',
                                                'Upload',
                                                'API_VERSION',
                                                SignUpFormController]);
