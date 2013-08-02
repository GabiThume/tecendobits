---
layout: post
title: "Test Gardening Report Week 5-6"
date: 2013-07-28 12:07
comments: true
categories: [opw, mozilla, socorro, code, bug, test, documentation]
---

***

### Test Documentation

I finished a first version of documentation by fixing @peterbe suggestions on my <a href=https://github.com/mozilla/socorro/pull/1336>Pull Request 1336</a> and @selena merged the code into socorro repository :)

***

### Automatic integration tests

At <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=757447>Bug 757447</a> @adrian suggested me to integrate the two test scripts of ``socorro/integrationtest/`` into our test suite. So I filled in <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=892672>Bug 892672</a>, which aims to automate those tests. 

<!-- more -->

To run automatic emails integration test:

{% codeblock lang:objc %}
python socorro/integrationtest/test_automatic_emails_app.py --test_email_address=someone@example.com --test_mode
{% endcodeblock %}

It sends an email to a specified email address and you have to manually check that the email was received. @rhelmer suggested we use restmail to make it automatic. But I cannot run properly because I don't have permission (user account) to Exact Target, and I am not going to have it. So I need to figure out a way to test restmail without this.

The elastic search integration test (``test_elasticsearch_storage_app.py``) will require some specific configuration to run on jenkins (to connect to jenkins ES instance). To test it I needed to install elastic search from <a href=http://www.elasticsearch.org/download/>http://www.elasticsearch.org/download/</a> and run the command bellow:

{% codeblock lang:objc %}
$ python socorro/integrationtest/test_elasticsearch_storage_app.py
{% endcodeblock %}

At this point, I got the following error:

``pyelasticsearch.exceptions.ElasticHttpError: (400, u'MapperParsingException[failed to parse [client_crash_date]]; nested: MapperParsingException[failed to parse date field [2012-04-08 10:52:42.0], tried both date format [yyyy-MM-dd\'T\'HH:mm:ssZZ||yyyy-MM-dd\'T\'HH:mm:ss.SSSSSSZZ], and timestamp number with locale [null]]; nested: IllegalArgumentException[Invalid format: "2012-04-08 10:52:42.0" is malformed at " 10:52:42.0"]; ')``

To run it, I needed to change ``testcrash/processed_crash.json`` date formats from ``2012-04-08 10:52:42.0`` to ``2012-04-08T10:52:42.0+00:00``. For continue those tests I need to run jenkins or at least know what are the configurations that I need to set. I still don't know how to do it, so I am going to come back to this later.

***

### Goals

I had a great meeting with @selenamarie, we discussed about <a href=https://etherpad.mozilla.org/socorro-testing>socorro-testing</a> goals:

=> I finished a version of the testing documentation: <a href=https://github.com/GabiThume/socorro/blob/test_template/docs/unittesting.rst>https://github.com/GabiThume/socorro/blob/test_template/docs/unittesting.rst</a>

=> For more coverage in crashstats, @peterbe created 2 tickets untill now and I already solved them (Pull Request <a href=https://github.com/mozilla/socorro-crashstats/pull/401>401</a> and <a href=https://github.com/mozilla/socorro-crashstats/pull/402>402</a>).

=> About testing postgres procedures, I did the first step, that was to discover how to run backfill_matviews() and @selenamarie is taking care of first steps to implement them.

=> In integration tests I had some problems when i tried to automated it. First, I will not have access to exacttarget for automatic emails, and secondly: after I ran the elasticsearch test, I didnt figure out what configurations I need to set to pass it on jenkins. I am not sure how to continue that, but I am going to see the bugs of  adrian email

=> <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=874650>Refresh Socorro Test Suite</a>:

<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=651661>Bug 651661</a> closed   
<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=817461>Bug 651661</a> closed    
<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=864854>Bug 864854</a> closed    
<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=874918>Bug 874918</a> skiped for now, if you want to/have time go ahead and add them    
<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=874653>Bug 874653</a> leaving open until August workweek     
<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=866448>Bug 866448</a> closed     
<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=713973>Bug 713973</a> what was the old config system?    
<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=820512>Bug 820512</a> go ahead and try it out   


***

### Submitter App Test

Submitter app test is related to <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=820512>Bug 820512</a>. So I wrote the test:

{% gist 6065972 %}

But Jenkins failed at my <a href=https://github.com/mozilla/socorro/pull/1368>Pull Request 1368</a>. Seems something related to ``import SubmitterApp`` (<a href=https://github.com/mozilla/socorro/pull/1368#issuecomment-21886102>here</a>). I don't know how to solve it, maybe I need to wait untill @lars can have a look at it. 

***

### Meetings

I called in Weekly Meetings on <a href=https://wiki.mozilla.org/Breakpad/Status_Meetings/2013-July-17>17th July</a> and <a href=https://wiki.mozilla.org/Breakpad/Status_Meetings/2013-July-31>31st July</a> during this time.