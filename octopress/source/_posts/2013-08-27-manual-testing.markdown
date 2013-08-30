---
layout: post
title: "Manual Testing"
date: 2013-08-27 16:17
comments: true
categories: [test, code]
---


### What is it?


It is the process of an manually test the software to see if it works as expected. The key is to find correct behavior even when doing unexpected use of the software (like filling a wrong username). It is really important to do before release to end users.

For small projects, the test can be done in a exploratory way by not following any set of rules, testing the software behavior given what the tester thinks it is important. This works well when you have a software that does not have a variability of different behaviors. For example: you have a code that calculates the sum of two numbers. You need to test what happens if you insert different data types of numbers, if works with integers and floats, negative numbers, large numbers and if the result is correct.

<!-- more -->

Also, important exploratory tests are done at Mozilla by QA team. They are exploratory but involve large projects and lot of tester (even the community), so they provide a set of test cases with the purpose of the tester explore the app as a user might. As an example, there are the <a href=https://etherpad.mozilla.org/testday-2013-08-30>test days</a>, where the community is invited to test some particular project using those test cases.

Henceforth in large projects (or at least larger than small ones) it is important to have a test plan and test cases!

<strong>Test Case</strong> is a set of variables or conditions which will be used for test the software. A small example of a test case is the <a href=https://moztrap.allizom.org/manage/cases/>Clear active logins</a> provided by Mozilla:

{% codeblock lang:objc %}
Goal: Clear login session cookies and logout any active logins

1 Go to bugzilla.mozilla.org and sign in using a valid Persona/Login   
  account     
   -> The user can sign in

2 Go to "Clear private data"     
   -> The Clear private data dialog is displayed

3 Uncheck all options except "Browsing&download history" and tap the   
  "Clear data" button     
   -> The dialog is displayed and after a few seconds a toast    
      notification displays "Private data cleared"

4 Go back to bugzilla.mozilla.org and reload the page      
   -> The user is logged out
{% endcodeblock %}


The <strong>Test Plan/Strategy</strong> defines the approach to testing the software. Describes what is being tested to validate the quality before the release. An example is the <a href=https://wiki.mozilla.org/Releases/Firefox_23/Test_Plan>test plan for Firefox 23</a>

### Why use it?

It is specially useful in softwares that change frequently, so it is hard to make it automatically. It is commonly used when the tests are not so hard (does not have millions of database values to evaluate, for example) or it needs to be run just a few times. The manual test can also aim testing like a everyday user.

### References

<a href=https://quality.mozilla.org/teams/web-qa/#Manual>https://quality.mozilla.org/teams/web-qa/#Manual</a>  
<a href=http://en.wikipedia.org/wiki/Manual_testing>http://en.wikipedia.org/wiki/Manual_testing</a>   
<a href=https://quality.mozilla.org/2012/11/exploratory-testing-on-moztrap-job-board-posting-1/>https://quality.mozilla.org/2012/11/exploratory-testing-on-moztrap-job-board-posting-1/</a>    