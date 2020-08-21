	 
	var locationOrigin = window.location.origin;
	var locationPathname = window.location.pathname;
	
	if(window.location.href.match('/evosuccess') == '/evosuccess'){
		   window.top.location.href = window.location.href;
	 }
	
	Langs = [{"name" : "English" , "code" : "en"},
            {"name" : "íslenska", "code":"is"}];
	
	
	
	 
   selfcareModels =  {
	   
	   obs_username 				: "selfcare",
	   obs_password 				: "selfcare",
	   tenantId		 				: "default",
	   OBS_URL		 				: "/obsplatform/api/v1",
	   returnURL 					: locationOrigin+locationPathname+"#/active",
	   selfcareAppUrl 				: locationOrigin+locationPathname,
	   additionalKortaUrl 			: locationOrigin+locationPathname+"#/kortasuccess",
	   encriptionKey 				: "Hugo Technologys",
	   kortaServer 					: "TEST",//or LIVE
	   kortaAmountField 			: "amount",
	   kortaclientId  				: 'clientId',
	   kortaPaymentMethod			: "PaymentMethodType",
	   kortaTokenValue				: "kortaToken",
	   kortaCurrencyType    		: "ISK",
	   kortaDoActionMsg		   		: "STORAGE",
	   changeKortaTokenDoActionMsg	: "STNOCAP",
	   locale   					: "en",
	   registerPlan		    		: "register-plan",
	   registrationRequiresDevice	: "registration-requires-device",
	   deviceAgrementType			: "device-agrement-type",
	   isPassport					: "passport",
	   isRedemption					: "is-redemption",
	   isClientAdditionalData		: "client-additional-data",
	   isLogoutCache				: "is-logout-cache",
	   globalPayCurrencyType		: "NGN",
	   netellerCurrencyType			: "EUR",
	   interswitchCurrencyType		: "566",
	   interswitchJspPage			: "interswitch.jsp",
	   EVO_CurrencyType				: "GBP",
	   
	   webtvURL						: locationOrigin+"/webtv/index.html#/",
		   
   	};
   
   paymentGatewayNames  = {
		   
		   korta 					: 'korta',
		   dalpay 					: 'dalpay',
		   globalpay 				: 'globalpay',
		   paypal 					: 'paypal',
		   neteller 				: 'neteller',
		   internalPayment 			: 'internalPayment',
		   two_checkout 			: '2checkout',
		   interswitch	 			: 'interswitch',
		   evo	 					: 'evo',
		   autherizeNet	 			: 'authorizenet',
		   echeck	 			    : 'echeck',
	      worldpay                             : 'worldpay',
   };
   
   paymentGatewaySourceNames  = {
		   
		   korta 					: 'korta',
		   dalpay 					: 'dalpay',
		   globalpay 				: 'globalpay',
		   paypal 					: 'paypal',
		   neteller 				: 'neteller',
		   internalPayment 			: 'internalPayment',
		   two_checkout 			: '2checkout',
		   evo			 			: 'evo',
		   autherizeNet	 			: 'authorizenet',
		   echeck	 			    : 'echeck',
		   worldpay                 : 'worldpay',
   };
