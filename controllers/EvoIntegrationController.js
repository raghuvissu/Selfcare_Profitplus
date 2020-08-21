EvoIntegrationController = function(scope, RequestSender,location, localStorageService,$timeout,rootScope,dateFilter) {  
		 
	scope.optlang 			= rootScope.localeLangCode;
	rootScope.hideFrame 		= false;
	rootScope.evoSuccesssPage = false;

	var decryptedData 		= CryptoJS.AES.decrypt(location.search().key, selfcareModels.encriptionKey).toString(CryptoJS.enc.Utf8),
		   storageData 		= angular.fromJson(decodeURIComponent(decryptedData)),
		   clientData 			= storageData.clientData;
	scope.planCode 			= storageData.planCode || "None",
	scope.firstname			= clientData.firstname;
	scope.lastname			= clientData.lastname;
	scope.fullName			= clientData.displayName;
	scope.city				= clientData.city;
	scope.state				= clientData.state;
	scope.country			= clientData.country;
	scope.addressNo			= clientData.addressNo;
	scope.zip				= clientData.zip;
	scope.email 			= clientData.email;
	scope.phone 			= clientData.phone;
	scope.numOfItems		= storageData.numOfItems;
	scope.merchantId		= storageData.merchantId;
	scope.price				= storageData.amount;
	scope.data				= storageData.data;
	scope.len				= storageData.len;

	scope.evoPG = {reviewCart:true,billingInfo:true,isFirstDisabled:true};
	
	scope.submit = function(){
		location.path('/evopayment/');
	}

	/*$timeout(function() {
		  $("#submitEvoIntegration").click();
	  }, 1000);*/


	/*scope.blockUI = true;
	$timeout(function() {
	scope.blockUI 		= false;
	rootScope.hideFrame 	= true;
	}, 2000);*/
	
    };
    
selfcareApp.controller('EvoIntegrationController', ['$scope', 
                                                    'RequestSender',
                                                    '$location', 
                                                    'localStorageService',
                                                    '$timeout',
                                                    '$rootScope',
                                                    'dateFilter',
                                                    EvoIntegrationController]);

/*//values getting form constants.js file
scope.currencyType		= selfcareModels.EVO_CurrencyType;
scope.blowfishKey			= selfcareModels.EVO_Blowfish;
scope.HMACKey				= selfcareModels.EVO_HMAC;
scope.optlang 			= rootScope.localeLangCode;
var appURL				= selfcareModels.selfcareAppUrl;
rootScope.showFrame 		= false;
rootScope.evoSuccesssPage = false;

var decryptedData 		= CryptoJS.AES.decrypt(location.search().key, selfcareModels.encriptionKey).toString(CryptoJS.enc.Utf8),
	   evoStorageData 		= angular.fromJson(decodeURIComponent(decryptedData)),
	   clientData 			= evoStorageData.clientData,
	   clientId				= clientData.id;
scope.planCode 			= evoStorageData.planCode || "None",
scope.firstname			= clientData.firstname;
scope.lastname			= clientData.lastname;
scope.fullName			= clientData.displayName;
scope.city				= clientData.city;
scope.state				= clientData.state;
scope.country				= clientData.country;
scope.addressNo			= clientData.addressNo;
scope.zip					= clientData.zip;
scope.email 				= clientData.email;
scope.phone 				= clientData.phone;
scope.price				= evoStorageData.price;
scope.merchantId			= evoStorageData.merchantId;
scope.screenName			= evoStorageData.screenName;
scope.numOfItems			= evoStorageData.numOfItems;

scope.evoPG = {reviewCart:true,billingInfo:true,paymentMethod:true,isFirstDisabled:true};

RequestSender.evoPaymentResource.save({"amount" : scope.price,"clientId":clientId,"merchantId":scope.merchantId,"currencyType":scope.currencyType},function(data){
scope.evoPrice = data.map.amount;
var MAC = data.map.macValue;

var evoData = {screenName:scope.screenName,planId:evoStorageData.planId,priceId:evoStorageData.priceId,price:evoStorageData.price,
				clientId:clientData.id,email:scope.email};
var encryptedData = CryptoJS.AES.encrypt(encodeURIComponent(angular.toJson(evoData)),selfcareModels.encriptionKey).toString();

var randomFun = function() {
		var chars = "0123456789";
		var string_length = 6;
		var randomstring = dateFilter(new Date(),'yyMMddHHmmss');
		
		for (var i=0; i<string_length; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			randomstring += chars.substring(rnum,rnum+1);	
		}	
		scope.transactionId = randomstring;
		
	};randomFun();
	
	
var macDataString = "*"+clientId+"*"+scope.merchantId+"*"+scope.evoPrice+"*"+scope.currencyType; 

var hashVal = CryptoJS.HmacSHA256(macDataString, scope.HMACKey);
var MAC = CryptoJS.enc.Hex.stringify(hashVal);

var dataString = "TransID="+clientId+"&RefNr="+scope.transactionId+"&amount="+scope.evoPrice+"&FirstName="+scope.firstname+"&" +
				"LastName="+scope.lastname+"&AddrCity="+scope.city+"&AddrState="+scope.state+"&" +
				"phone="+scope.phone+"&E-Mail="+scope.email+"&Currency="+scope.currencyType+"&OrderDesc="+scope.planCode+"&" +
				"Response=encrypt&MAC="+MAC+"&" +
				"URLSuccess="+appURL+"#/evosuccess&" +
				"URLFailure="+appURL+"#/evosuccess&" +
				"UserData="+encryptedData+"&ReqId="+scope.transactionId+"&URLBack="+appURL+"&Capture=AUTO";
if(scope.addressNo != null|| scope.addressNo !=""){
dataString = dataString+"&AddrStreet="+scope.addressNo;
}
if(scope.zip != null|| scope.zip !=""){
dataString = dataString+"&AddrZip="+scope.zip;
}

scope.len = dataString.length;
var blowfishEncData = {text:dataString,length:scope.len};

RequestSender.evoPaymentGatewayResource.save({method:'encrypt'},blowfishEncData,function(data){
scope.data = data.map.blowfishData;
$timeout(function() {
	  $("#submitEvoIntegration").click();
  }, 1000);
});
});
scope.blockUI = true;
$timeout(function() {
scope.blockUI 		= false;
rootScope.showFrame 	= true;
}, 4000);*/
//scope.submitPaymentMethodFun = function(){
//$("#submitEvoIntegration").click();
//};
