<%
String clientId = request.getParameter("x_cust_id");
String cardNo = request.getParameter("x_account_number");
String amount = request.getParameter("x_amount");
String emailId = request.getParameter("x_email");
String transId = request.getParameter("x_trans_id");
String cardtype = request.getParameter("x_card_type");
String name = request.getParameter("x_first_name");
String customUrl = request.getParameter("custom");
String responseText = request.getParameter("x_response_reason_text");
int responseReasonCode = Integer.valueOf(request.getParameter("x_response_reason_code"));
int responseCode = Integer.valueOf(request.getParameter("x_response_code"));

System.out.println("*********************************************");
System.out.println(request.getParameter("x_response_reason_text"));
System.out.println(request.getParameter("x_response_reason_code"));
System.out.println(request.getParameter("x_response_code"));
System.out.println("*********************************************");

if(responseCode == 1 && responseReasonCode == 1){
 String selfcareAppURL = customUrl+"#/authorizenetredirection?clientId="+clientId+"&cardno="+cardNo+"&amount="+amount+"&emailId="+emailId+"&transId="+transId+"&cardtype="+cardtype+"&name="+name;
	 response.sendRedirect(selfcareAppURL); 
}else{
	String selfcareAppURL = customUrl+"#/authorizenetfailure?clientId="+clientId+"&cardno="+cardNo+"&amount="+amount+"&emailId="+emailId+"&transId="+transId+"&cardtype="+cardtype+"&name="+name+"&responseText="+responseText;
	 response.sendRedirect(selfcareAppURL);
}
 
 %>
