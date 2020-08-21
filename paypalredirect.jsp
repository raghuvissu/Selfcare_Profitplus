
<%
String txnId = request.getParameter("txn_id");
String paymentDate = request.getParameter("payment_date");
String amount = request.getParameter("mc_gross");
String name = request.getParameter("address_name");
String payerEmail = request.getParameter("payer_email");
String currency = request.getParameter("mc_currency");
String receiverEmail = request.getParameter("receiver_email");
String payerStatus = request.getParameter("payer_status");
String paymentStatus = request.getParameter("payment_status");
String pendingReason = request.getParameter("pending_reason");
String customData = request.getParameter("custom");

 String selfcareAppURL = customData+"#/paypalredirection?txnId="+txnId+"&payDate="+paymentDate+"&amnt="+amount+"&name="+name+"&pyrEmail="+payerEmail+"&currency="+currency+"&recvEmail="+receiverEmail+"&pyrStatus="+payerStatus+"&payStatus="+paymentStatus+"&pendingReason="+pendingReason;
	 response.sendRedirect(selfcareAppURL); 
%>
