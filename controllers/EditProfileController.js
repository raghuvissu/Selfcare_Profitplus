	  EditProfileController = function(scope, RequestSender, routeParams,location, dateFilter,
	  	localStorageService,rootScope, $upload, API_VERSION) {
            
		     scope.clientId 			= routeParams.clientId;
			 if(rootScope.selfcare_sessionData){
				 scope.formData = {};
				 scope.clientData={};
				 RequestSender.clientResource.get({clientId: scope.clientId} , function(data) {
					 scope.formData.officeId			= data.officeId;
					 scope.formData.firstname			= data.firstname;
					 scope.formData.lastname			= data.lastname;
					 scope.formData.phone 				= data.phone;
					 scope.formData.email				= data.email;
					 scope.formData.userName			= data.selfcare ? data.selfcare.userName : "";
					 scope.formData.password			= data.selfcare ? data.selfcare.password : "";
			   });
			 }

			scope.submit = function() {
		        scope.formData.locale = rootScope.localeLangCode;
				scope.formData.dateFormat = 'dd MMMM yyyy';
				RequestSender.clientResource.update({clientId: scope.clientId},scope.formData, function(data) {
					console.log(scope.myFile);
					//location.path('/profile');
					if (scope.myFile) {
	            	  $upload.upload({
	                  url: rootScope.hostUrl+ API_VERSION +'/clients/'+scope.clientId+'/images', 
	                  data: {},
	                  file: scope.myFile
	                }).then(function(imageData) {
	                  // to fix IE not refreshing the model
	                  if (!scope.$$phase) {
	                    scope.$apply();
	                  }
	                  location.path('/profile')
	                });
	              } else{
	                location.path('/profile')
	              }
			   });
			};
    };

selfcareApp.controller('EditProfileController', ['$scope', 
                                                  'RequestSender',
                                                  '$routeParams',
                                                  '$location',
                                                  'dateFilter', 
                                                  'localStorageService', 
                                                  '$rootScope', 
                                                  'Upload',
                                                  'API_VERSION',
                                                  EditProfileController]);

