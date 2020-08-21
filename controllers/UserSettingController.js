UserSettingController = function(scope,rootScope,translate,localStorageService,tmhDynamicLocale) {
		 
		  scope.dateformat=localStorageService.get('localeDateFormat');	
		  
		  scope.langs = Langs;
	    	if (localStorageService.get('localeLang')) {
	            var localeLang = localStorageService.get('localeLang');
	            for (var i in Langs) {
	                if (Langs[i].code == localeLang) {
	                	rootScope.localeLang = Langs[i];
	                    tmhDynamicLocale.set(localeLang);
	                    translate.uses(localeLang);
	                }
	            }
	        } else {
	        	for(var i in scope.langs){ 
	        		if(scope.langs[i].code == selfcareModels.locale){ 
	        			scope.localeLang = scope.langs[i];
	        			tmhDynamicLocale.set(scope.langs[i].code);
	        		}
	        	}
	        }
	        
	        scope.changeLang = function (lang) {
	        	rootScope.localeLang = lang;
	            localStorageService.add('localeLang', lang.code);
	            tmhDynamicLocale.set(lang.code);
	            translate.uses(lang.code);
	        };
	        
	        scope.dates = [
	                       'dd MMM yyyy',
	                       'dd MMMM yyyy',
	                       'dd/MMM/yyyy',
	                       'dd/MMMM/yyyy',
	                       'dd-MMM-yyyy',
	                       'dd-MMMM-yyyy',
	                       'MMM-dd-yyyy',
	                       'MMMM-dd-yyyy',
	                       'MMM dd yyyy',
	                       'MMMM dd yyyy',
	                       'MMM/dd/yyyy',
	                       'MMMM/dd/yyyy'
	                       
	                   ];
	        
           scope.$watch(function () {
               return scope.dateformat;
           }, function () {
               localStorageService.add('localeDateFormat', scope.dateformat);
               scope.df = scope.dateformat;
           });
	        
		  
    };

selfcareApp.controller('UserSettingController',['$scope',
                                                '$rootScope',
                                                '$translate',
                                                'localStorageService',
                                                'tmhDynamicLocale',
                                                UserSettingController]);
