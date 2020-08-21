selfcareApp.filter('customFilter', function($filter) {
	 // Just add arguments to your HTML separated by :
	  // And add them as parameters here, for example:
	  // return function(dataArray, searchTerm, argumentTwo, argumentThree) {
	
	  return function(dataArray, searchTerm,filterArray) {
	      // If no array is given, exit.
	      if (!dataArray) {
	          return;
	      }
	      // If no search term exists, return the array unfiltered.
	      else if (!searchTerm) {
	          return dataArray;
	      }
	      // If search term an empty string, return the array unfiltered.
	      else if (searchTerm == "") {
	          return dataArray;
	      }
	     
	      // Otherwise, continue.
	      else {
	           // Convert filter text to lower case.
	           var term = angular.lowercase(searchTerm).toString();
	           // Return the array and filter it by looking for any occurrences of the search term in each items id or name. 
	           return dataArray.filter(function(item){
	        	   for(var i in filterArray){
	        		   
	        		   if(angular.lowercase(item[filterArray[i]]).toString().indexOf(term) > -1){
	        			   return true;
	        			   break;
	        		   }else{
	        			   false;
	        		   }
	        	   }
	           });
	      } 
	  };    
});


