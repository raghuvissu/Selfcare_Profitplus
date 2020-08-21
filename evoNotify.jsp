<%
String data = request.getParameter("Data");
String len = request.getParameter("Len");

//String data = "dsafs";
//String len = "4";

System.out.println("*******data--------------->"+data);
System.out.println("*******len--------------->"+len);

 %>
 
 
 
 
 
 
 
 
 
 <script>
 /* function loadDoc() {
	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 && xhttp.status == 200) {
	    	console.log(xhttp.responseText);
	    }
	  };
	  xhttp.open("GET", "https://localhost/obsplatform/api/v1/clients?username=admin&password=obs@123", true);
	  xhttp.setRequestHeader("X-Obs-Platform-TenantId", "default");
	  xhttp.setRequestHeader("Content-type", "application/json");
	  var json = {data: data,length : len ,tenant : ""};
	  xhttp.send();
	}loadDoc(); */
	
	function loadDoc() {
		  var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
		    if (xhttp.readyState == 4 && xhttp.status == 200) {
		    	console.log(xhttp.responseText);
		    }
		  };
		  xhttp.open("GET", "https://localhost/obsplatform/api/v1/clients?username=admin&password=obs@123", true);
		  xhttp.setRequestHeader("X-Obs-Platform-TenantId", "default");
		  xhttp.setRequestHeader("Content-type", "application/json");
		  xhttp.send();
		}loadDoc();
 
</script>

