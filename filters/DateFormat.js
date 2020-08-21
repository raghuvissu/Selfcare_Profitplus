selfcareApp.filter('DateFormat', function(dateFilter,localStorageService) {
  return function(input) {
	  if(input){
          /*var tDate = new Date(input);
          return dateFilter(tDate,localStorageService.get('localeDateFormat'));*/
		var inputValue=input.toString();
      	var splitValue=inputValue.split(",");
      	if(splitValue.length==3){
      		 var tDate = new Date(splitValue[0],splitValue[1]-1,splitValue[2]);
      	}else{
      		var tDate = new Date(input);
      	}
         
        return dateFilter(tDate,localStorageService.get('localeDateFormat'));
      }

  };
});


