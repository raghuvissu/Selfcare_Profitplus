AccountInfoController = function(scope,RequestSender,rootScope,location,paginatorService,localStorageService, API_VERSION,sessionManager,filter,routeParams,dateFilter,route) {
	
	//account profile data
	scope.clientId = routeParams.clientId;
	scope.successmsg = false;
	 if(rootScope.selfcare_sessionData){
		 scope.formData = {};
		 scope.clientData={};
		 
		 RequestSender.clientResource.get({clientId: rootScope.selfcare_sessionData.clientId} , function(data) {
			 scope.clientData.displayName		= data.displayName;
			 scope.formData.officeId			= data.officeId;
			 scope.formData.phone 				= data.phone;
			 scope.formData.homePhoneNumber		= data.homePhoneNumber;
			 scope.formData.externalId			= data.externalId;
			 scope.isautobilling				= data.selfcare.isAutoBilling == 'Y'? true:false;
			 
		  RequestSender.clientDataResource.get({clientId: scope.clientId} , function(additionalData) {
			var dataObj = angular.fromJson(angular.toJson(additionalData));
   		 Object.keys(dataObj).length == 0 ? scope.editAdditionalDatasBtn = false : scope.editAdditionalDatasBtn = true;
   		 
   		 scope.date = {};
			   RequestSender.clientDataResource.get({clientId: scope.clientId,template:'true'} , function(data) {
				 	scope.editInfoBtn 				  = true;
				 	scope.maxDate 					  = new Date(data.date);
				 	scope.nationalityDatas			  = data.nationalityDatas;
		            scope.genderDatas				  = data.genderDatas;
		            scope.ageGroupDatas 			  = data.ageGroupDatas;
		            scope.customeridentificationDatas = data.customeridentificationDatas;
		            scope.cummunitcationDatas		  = data.cummunitcationDatas;
		            scope.languagesDatas			  = data.languagesDatas;
		            
		            
       		if(data){ 
				 scope.clientData.gender				 = data.genderId;
				 scope.clientData.nationality 			 = data.nationalityId;
				 scope.clientData.jobTitle				 = data.jobTitle;
				 scope.clientData.dateOfBirth			 = dateFilter(data.dateOfBirth,'dd MMMM yyyy');
				 scope.clientData.preferredLang 		 = data.preferLanId;
				 scope.clientData.remarks				 = data.remarks;
				 scope.clientData.idType 				 = data.customerIdentificationTypeId;
				 scope.clientData.idNumber				 = data.customerIdentificationNumber;
				 scope.clientData.ageGroup				 = data.ageGroupId;
				 scope.clientData.utsCustomerId			 = data.utsCustomerId;
				 scope.clientData.financeId				 = data.financeId;
				 scope.clientData.preferredCommunication = data.preferCommId;
				 if(data.dateOfBirth){
		             var dateOfBirth = dateFilter(data.dateOfBirth,'dd MMMM yyyy');
		            scope.date.dateOfBirth = new Date(dateOfBirth);
		            }
       	  }
		    });
	    });
	   });
	 }
	//national Id validation
    scope.nationalIdvalue = true;
	 scope.nationalIdValidationFun = function(id){
		 if(id){
			 scope.nationalIdvalue = Kennitala.validate(id);
		 }
	 };
	 
	 scope.funMessage =function(){
		 scope.successmsg = false;
		 return true;
	 };
			        
	scope.submit = function() {
		scope.successmsg = true;
		var name_array = new Array();
		 name_array = (scope.clientData.displayName.split(" "));
           
         scope.formData.firstname = name_array.shift();
         scope.formData.lastname = name_array.join(' ');
           if(scope.formData.lastname == ""){
           	scope.formData.lastname=".";
           }
           scope.formData.officeId=scope.clientData.officeId;
           scope.formData.phone=scope.clientData.phone;
           scope.formData.homePhoneNumber=scope.clientData.homePhoneNumber;
           scope.formData.externalId=scope.clientData.externalId;
           scope.formData.isautobilling=scope.isautobilling;
		RequestSender.clientResource.update({clientId: scope.clientId},scope.formData, function(data) {
			location.path('/accountinfo');
			scope.successmsg=true;
	   });
	};
	
	/*scope.updateAutoBilling = function(isautobilling1){
		RequestSender.updateKortaToken.update({clientId : scope.clientId},{isautobilling: scope.isautobilling},function(data){
			location.path('/accountinfo');
		});
	};*/
	
	scope.addinfosubmit = function(){
		scope.clientData.locale = rootScope.localeLangCode;
		scope.clientData.dateFormat = 'dd MMMM yyyy';
		if(scope.date.dateOfBirth){scope.clientData.dateOfBirth = dateFilter(scope.date.dateOfBirth,'dd MMMM yyyy');}
		if(scope.editAdditionalDatasBtn){
			RequestSender.clientDataResource.update({clientId: scope.clientId},scope.clientData,function(data) {
				 route.reload();
			});
		}else{
			RequestSender.clientDataResource.save({clientId: scope.clientId},scope.clientData,function(data) {
				 route.reload();
			});
		}
	};
	   if(rootScope.selfcare_sessionData){		  
		  scope.clientId = rootScope.selfcare_sessionData.clientId;
		  sessionManager.configurationFun(function(data){
			  scope.clientData = data;
			  if(data.selfcare){
				  data.selfcare.token ? rootScope.iskortaTokenAvailable = true : rootScope.iskortaTokenAvailable = false;
				  !data.selfcare.authPin ? scope.clientData.selfcare.authPin = 'Not Available':null;
			  }
			  rootScope.selfcare_userName = data.displayName;
			  
		  });
	  }
	   
	   scope.getOneTimeSale = function () {
         scope.eventsaleC = "active";
         scope.mydeviceC = "";
         scope.cubeWareDeviceC = "";
         scope.successmsg = false;
         if(scope.displayTab == "eventOrders"){
         	scope.eventsaleC = "";
             scope.mydeviceC = "active";
             scope.cubeWareDeviceC = "";
         }
         //scope.config = webStorage.get("client_configuration").orderActions;
         RequestSender.oneTimeSaleResource.getOneTimeSale({clientId: scope.clientId}, function(data) {
         	scope.onetimesales = data.oneTimeSaleData;
             scope.eventOrders = data.eventOrdersData;
             scope.onetimedatas = [];
       		angular.forEach(scope.onetimesales,function(value,key){
       			scope.onetimedatas.push({id:value.id , saleType:value.saleType , saleDate:value.saleDate,itemCode:value.itemCode, 
       				chargeCode:value.chargeCode, quantity:value.quantity, units:value.units, totalPrice:value.totalPrice, 
       				warrantyDate:value.warrantyDate, hardwareAllocated:value.hardwareAllocated, propertyCode:value.propertyCode, serialNo:value.serialNo});
       		});
       		
       		scope.onetimedatas = _.uniq(scope.onetimedatas,function(item){
       			return item.id;
       		});
         });
     };
     
     scope.eventsaleTab = function(){
     	scope.eventsaleC = "active";
     	scope.mydeviceC = "";
     };
     
     scope.getAllOwnHardware = function () {
     	scope.eventsaleC = "";
    	 	scope.mydeviceC = "active";
    	 	scope.cubeWareDeviceC = "";
    	  RequestSender.HardwareResource.getAllOwnHardware({clientId: scope.clientId }, function(data) {
         	scope.ownhardwares = data;
         }); 
     };
     scope.downloadClientIdentifierDocument=function (identifierId, documentId){
	      console.log(identifierId, documentId);
	      window.open($rootScope.hostUrl+ API_VERSION +'/client_identifiers/'+documentId +'/documents/'+ identifierId+'/attachment?tenantIdentifier='+TENANT);
	           
	};
	
  
	if(scope.displayTab == "documents"){
		scope.indentitiesSubTab = "";
		scope.additionaldataSubTab = "";
		scope.additionaladdressdataSubTab = "";
    	scope.documnetsUploadsTab = "active";
    	scope.creditCardDetailsTab = "";
    	scope.ACHDetailsTab = "";
    	scope.ChildDetailsTab = "";
    	scope.displayTab = "";
    	scope.documnetsUploadsTabFun();
		
	}
   scope.documnetsUploadsTabFun = function(){
	   scope.successmsg = false;
   	scope.indentitiesSubTab = "";
   	scope.additionaladdressdataSubTab = "";
   	scope.documnetsUploadsTab = "active";
   	scope.additionaldataSubTab ="";
   	scope.creditCardDetailsTab = "";
   	scope.ACHDetailsTab = "";
   	scope.ChildDetailsTab = "";
   	//documents details
   		RequestSender.clientDocumentsResource.getAllClientDocuments({clientId: scope.clientId }, function(data) {
   			scope.clientdocuments = data;
   		});
   };
   scope.downloadDocument = function(documentId,index) {
   	window.open(API_VERSION +'/clients/'+ scope.clientId +'/documents/'+ documentId +'/attachment?tenantIdentifier='+selfcareModels.tenantId+'&accessToken=c2VsZmNhcmU6c2VsZmNhcmU=');
   };
     
};

selfcareApp.controller('AccountInfoController', ['$scope',
                                             'RequestSender',
                                             '$rootScope',
                                             '$location',
                                             'PaginatorService', 
                                             'localStorageService', 
                                             'API_VERSION', 
                                             'SessionManager', 
                                             '$filter', 
                                             '$routeParams',
                                             'dateFilter',
                                             '$route',
                                             AccountInfoController]);




