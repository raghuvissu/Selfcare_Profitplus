	  EditAddressController = function(scope, RequestSender, routeParams,location, dateFilter,localStorageService,rootScope) {
            
		     scope.clientId 			= routeParams.clientId;
			 if(rootScope.selfcare_sessionData){
				 scope.formData = {};
				 scope.addressTypeData = [];
				 scope.cityDatas = [];
				 RequestSender.addressEditResource.getAll({clientId: scope.clientId} , function(data) {	
                    scope.formData=data.datas[0]; 
                    scope.formData.zipCode = scope.formData.zip;
                    delete scope.formData.id;
                    delete scope.formData.zip;
                    scope.addressTypeData=data.addressOptionsData;
                    scope.cityDatas=data.cityData;
				});	
			 }

			 scope.getStateAndCountry=function(city){
				delete scope.formData.state;
        		delete scope.formData.country;
		      	  RequestSender.addressTemplateResource.get({city : scope.formData.city}, function(data) {
		          		scope.formData.state = data.state;
		          		scope.formData.country = data.country;
		      	  });
		     };
			 
			scope.submit = function() {
				RequestSender.addressResource.update({clientId: scope.clientId},scope.formData, function(data) {
					location.path('/profile');
			   });
			};
    };

selfcareApp.controller('EditAddressController', ['$scope', 
                                                  'RequestSender',
                                                  '$routeParams',
                                                  '$location',
                                                  'dateFilter', 
                                                  'localStorageService', 
                                                  '$rootScope', 
                                                  EditAddressController]);

