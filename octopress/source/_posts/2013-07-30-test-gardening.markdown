---
layout: post
title: "Test Gardening Report Week 3-4"
date: 2013-07-14 20:19
comments: true
categories: [opw, mozilla, gnome, socorro, code, bug, test, documentation]
---

I started to run deeply on Test Gardening. I initiate to understand the architecture and the behavior of Socorro Project, but it is a project that constantly is changing technologies, so it is important to keep learning about it. 

***

### Bugs

I begin these weeks smashing some bugs related to Socorro Crashstats, dealing with mocks, urls and json:

<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=888520>Bug 888520:</a> Add test for exploitable_crashes view. <a href=https://github.com/mozilla/socorro-crashstats/pull/401>Pull Request 401</a>. Was to create a ``test_exploitable_crashes`` function for ``crashstats.exploitable_crashes`` url:

<!-- more -->

{% gist 5902363 %}

<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=888952>Bug 888952:</a> Add test coverage for crontabber_state_json() view. <a href=https://github.com/mozilla/socorro-crashstats/pull/402>Pull Request 402</a>. I created a ``test_crontabber_state_json`` function to test ``crontabber_state_json``:

{% gist 6118039 %}

Socorro <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=817461>Bug 817461</a> was open, but I tested it on my computer and worked, so I searched for the test and I found that Selena had already <a href=https://github.com/mozilla/socorro/commit/ade562e91c26d6c6c2f8c28cd8297d72a77d70bf>solved</a> but not had closed yet.

In my OPW application I created a failing test for rank column in Topcrashes CSV, which was starting with 0 instead of 1 (<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=533628>Bug 533628</a>). Then on time to actually fix it I had some problems because I needed to read each file of crashstats that uses ``currentRank`` variable and test its value. But when I found it, was just one simple operation ``+1`` that fixed it (<a href=https://github.com/mozilla/socorro-crashstats/pull/418>PR 418</a>).

In <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=757447>Bug 757447</a> the fillDB.py file was already deleted. But there were some instructions in socorro/integrationtest/README.txt about running fillDB, that doesn't exist. So I deleted that readme file (<a href=https://github.com/mozilla/socorro/pull/1334>PR 1334</a>). In this bug we started a discussion about making how to automate integration tests.

***

### Git Branch

The best way to write code contribution to an external repository is by creating a ``git branch``. The modifications have more sense when they are related to bug tickets. The following commands can be used to create a branch, go inside it, add the modifications, commit and push your contribution related to some bug in remote repository:

{% codeblock lang:objc %}
git checkout -b bug_bugnumber
make your modifications
git add changed_files
git commit -am "bug_bugnumber - message"
git push origin branch_name
{% endcodeblock %}


***

### Goals

I had my first meeting with @selenamarie through Skype. She asked me to take a look at <a href=https://etherpad.mozilla.org/webtools-q32013>Q3 team goals</a> and we discussed about my goals for this quarter, so became clear that I need to focus on some points (we are writing about it at <a href=https://etherpad.mozilla.org/socorro-testing>Socorro-Testing etherpad</a>):  

=> Documentation about test (some kind of a template: mocks usage, decorators, how to run (specific ones), requirements)    
=> Testing postgres store procedures    
=> More testing in socorro-crashstats    
=> More coverage in socorro (wait for <a href=https://etherpad.mozilla.org/socorro-deprecation-station>deprecation</a>)    
=> Selenium tests + django    
=> Refresh Socorro Test Suite   

#### Testing Postgres Store Procedures Goal

The first step was to have a look at the postgres stored procedures and how to run ``backfill_matviews()``. So I read about backfills and updates on ``socorro/external/postgresql/raw_sql/procs``. Then I asked myself: what is backfill?

=> <strong>Backfill</strong> is to populate missing data from previous date when data was available. So, when we have a ``NULL`` data, we can fill it with some previous known. For example:

{% codeblock lang:objc %}
ID   Date ID    Value
id1  7/01/2013 100 
id2  7/02/2013 NULL
id3  7/03/2013 200
{% endcodeblock %}

After backfill, this table became:

{% codeblock lang:objc %}
ID   Date ID    Value
id1  7/01/2013 100 
id2  7/02/2013 100
id3  7/03/2013 200
{% endcodeblock %}

There is in socorro repository a ``backfill`` related to an update file. But how to run backfill of matviews (``socorro/external/postgresql/fakedata.py``)?     
Setupdb file will call the backfill function, which will populate the matview:

{% codeblock lang:objc %}
$ ./socorro/external/postgresql/setupdb_app.py    --database_name=breakpad --fakedata --dropdb --database_superusername=test --database_superuserpassword=bPassword
{% endcodeblock %}

Or we can directly call ``backfills_matviews``:

{% codeblock lang:objc %}
$ psql -d "breakpad" -c "SELECT backfill_matviews(date '2013-06-30', current_date)"
{% endcodeblock %}

#### Test Documentation Goal

I discovered how to run specific tests in socorro-crashstats:

{% codeblock lang:objc %}
$ virtualenv --python=python2.6 .virtualenv
$ source .virtualenv/bin/activate
$ pip install -r requirements/compiled.txt
$ pip install -r requirements/dev.txt
$ ./manage.py test crashstats/crashstats/tests/test_views.py:TestViews.test_crontabber_state_json
{% endcodeblock %}

And I started to <a href=https://github.com/GabiThume/socorro/commit/1d07aed15ed0b0a0bfa3b84355b6eb198c0c68ee>update</a> the testing documentation, which can be found at <a href=http://socorro.readthedocs.org/en/latest/unittesting.html>Socorro readthedocs</a>. I am going to publish this documentation at my blog later. It is really important for Socorro testing that it can works as a guide for write or run new tests.

***

### Miscellany

A nice blog post about Socorro crash reports can be found at <a href=http://people.mozilla.org/~sguha/species.crash.report.html>http://people.mozilla.org/~sguha/species.crash.report.html</a>. It have some graphics to show how accurate the samples are estimates, their accuracy and sample rates of the Crash Report Signatures.

***

### Meetings

I called in Weekly Meetings on <a href=https://wiki.mozilla.org/Breakpad/Status_Meetings/2013-July-03>3rd July</a> and <a href=https://wiki.mozilla.org/Breakpad/Status_Meetings/2013-July-10>10th July</a> during this time.
