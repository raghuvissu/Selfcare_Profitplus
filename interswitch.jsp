<%
String url = request.getParameter("url");
String txnref = request.getParameter("txnref");
String payRef = request.getParameter("payRef");
String retRef = request.getParameter("retRef");
String cardNum = request.getParameter("cardNum");
String apprAmt = request.getParameter("apprAmt");
String desc = request.getParameter("desc");
System.out.println("*******url--------------->"+url);
System.out.println("*******txnref------------>"+txnref);
System.out.println("*******payRef------------>"+payRef);
System.out.println("*******retRef------------>"+retRef);
System.out.println("*******cardNum----------->"+cardNum);
System.out.println("*******apprAmt----------->"+apprAmt);
System.out.println("*******desc-------------->"+desc);
String selfcareAppURL = url+"#/profile?txnref="+txnref+"&payRef="+payRef+"&retRef="+retRef+"&cardNum="+cardNum+"&apprAmt="+apprAmt+"&desc="+desc;
	 response.sendRedirect(selfcareAppURL);
%>
 	
