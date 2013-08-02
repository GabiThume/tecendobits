---
layout: post
title: "Test Gardening Report Week 1-2"
date: 2013-06-30 10:13
comments: true
categories: [opw, mozilla, gnome, socorro, code, bdd, test, crash-stats]
---


The Outreach Program has began on June 17th. Those were two really cool weeks!

One of my favorite things in the whole world is coding, so I think I am in the right project :) Although i didn't properly code during this time, it was filled with learning (super needed).
I had contact with a lot of stuff that I had never imagined before. First of all: I followed in a daily basis the work of a development team. They have to deal with a lot of releases and to maintain a huge system that collects, processes, stores and displays crash reports from clients (this is really a hard work!). Besides that, curently they are also migrating some tools (like PHP to Django), work that requer a lot of team work! Which they do brightly :)

I am going to describe here some of the relevant things that happened in these first weeks. If you are curious about knowing everything that is happening, go check my OPW diary: <a href=https://etherpad.mozilla.org/opw2013>https://etherpad.mozilla.org/opw2013</a>.

<!-- more -->
***

### Socorro Installation

The first thing I did was <a href=https://socorro.readthedocs.org/en/latest/installation.html#installation-requirements>installing</a> socorro and socorro-crashstats in my Ubuntu VirtualMachine, instead of Mac OS. I found some problems with the installation:

First, I received an error <code>Peer authentication failed for user "test"</code> when i tried to run tests inside socorro. To solve that, I edited the postgresql file <code>/etc/postgresql/9.2/main/pg_hba.conf</code> changing every connection method field to <code>trust</code>.

Then i got <code>psql: FATAL:  role "test" does not exist</code>. So I created the test user:
{% codeblock lang:objc %}
$ createuser -s test    
{% endcodeblock %}

A new error was a little bit weird for me: <code>type "citext" does not exist</code>. But I remembered an error fix made by @selenamarie to a database problem: 
{% codeblock lang:objc %}
$ "psql -c 'alter user breakpad_rw superuselr' template1"
{% endcodeblock %}

After that, I ran <code>make test</code> that returned <code>role "breakpad_ro" does not exist</code>, so I fixed it with: 
{% codeblock lang:objc %}
"psql -d postgres -f sql/roles.sql".
{% endcodeblock %}

New instructions at installation say to install json_enhancementes to use in PostgreSQL: <code>make json_enhancements_pg_extension</code>. But I got an error when running the following command:  
{% codeblock lang:objc %}
$ socorro-virtualenv/bin/python -c "from pgxnclient import cli; cli.main(['install', 'json_enhancements'])"
{% endcodeblock %}

After talking with @selenamarie and @rhelmer, it became clear that a dev package was needed:
{% codeblock lang:objc %}
$ sudo aptitude install postgresql-server-dev-9.2
{% endcodeblock %}

And then the tests finally ran! 

After that, it was needed to <a href=https://socorro.readthedocs.org/en/latest/installation.html#populate-postgresql-database>populate the database</a>. At that time, <code>name</code> was missing at <code>--database_superuser</code> in the command that populate the breakpad database using fakedata at Socorro Install page.

In the end, I had some problems while running the server of socorro-crashstats because I didn't install <a href=http://www.thefourtheye.in/2013/04/installing-python-ldap-in-ubuntu.html>some libraries needed to LDAP</a>.

***

### Git Update

I am always making changes in my fork to test something or by accident. Sometimes I need to reset it. To ignore all modifications and pull to overwrite local changes, you have to clean the working tree (carefully):
{% codeblock lang:objc %}
$ git reset --hard
$ git pull
{% endcodeblock %}

And to update your fork based on the original repository:
{% codeblock lang:objc %}
$ git remote add moz https://github.com/mozilla/socorro.git
$ git fetch moz
$ git merge moz/master
$ git push origin
{% endcodeblock %}

***

### Test Development Research

After that, @selenamarie and I started reading and discussing about <a href=https://etherpad.mozilla.org/socorro-testing>Socorro testing</a>.

By first, I tried to understand the difference between state and behaviour verification tests:

Tests double objects are used instead of real objects mostly when we want to test without change the real environment. Let me make myself clear with an example from the <a href=http://martinfowler.com/articles/mocksArentStubs.html>mocksArentStubs</a> page: <strong>*"We wanted to send an email message if we failed to fill an order. The problem is that we don't want to send actual email messages out to customers during testing. So instead we create a test double of our email system, one that we can control and manipulate"*</strong>. That is a really good and complex reference, which the author presents that a test double object can be of four kinds:

<strong>Dummy</strong>: "are around but never actually used"

<strong>Fake</strong>: "have working implementations, but usually take some shortcut which makes them not suitable for production"

<strong>Stubs</strong>: "provide canned answers to calls made during the test"

<strong>Mocks</strong>: "objects pre-programmed with expectations which form a specification of the calls they are expected to receive"

But what is the real different between mocks and stubs?    
Both are test doubles, which means that they are not calling a real service (like mail or database), but mocks uses behavior verification rather than stubs, which uses state verification.

<strong>State verification</strong>: only cares about the final state - and not how that state was derived.

<strong>Behaviour verification</strong>: makes you stay focused about what you are testing, it is related to "how should this behave".

There are already mocks in socorro project, so I studied to know more about it and also to understand <a ref=http://dannorth.net/introducing-bdd/>Behavior Driven Development (BDD)</a>, that can be a really great development style. But it can be hard for a team to go from a <code><strong>code => test</strong></code> to a <code><strong>test => code</strong></code> timeline.

<strong>Behavior Driven Development (BDD)</strong>:     

It is a development style oriented by testing. Like in the traditional TDD, consists in creating a failing test to some new feature, and then implementing the functional feature. The main difference between TDD and BDD is on verification, which is state and behavior respectively.

In BDD we might have a language for feature file named <strong>Gherkin</strong>: "a natural language format describing a feature or part of a feature with representative examples of expected outcomes":
  
{% blockquote %}
Given some initial context,    
When an event occurs,   
Then ensure some outcomes. 
{% endblockquote %}

In other words:    
=> <strong>given</strong> a system known state before the user or external system perform some action,    
=> <strong>when</strong> the user or the external system interacts (key actions),    
=> <strong>then</strong> observe the outcomes.        

Which tools can help us?  
<a href=http://lettuce.it/>Lettuce</a>
<a href=https://github.com/rlisagor/freshen>Freshen</a>
<a href=http://behave.readthedocs.org/>Behave</a>

So I tried to write an unit test with <a href=http://behave.readthedocs.org/en/latest/tutorial.html>behave</a>, considering files of feature, environment and a test:
{% codeblock lang:objc %}
$ sudo pip install behave
{% endcodeblock %}

And I did a test using <code>selenium+behave</code>:
{% gist 5880058 %}

There are already tests in socorro-crashstats with selenium, but they still didn't consider Django tests. In a near future, I might study how that works and create tests for it. For now, those kind of tests are in QA hands at <a href=https://github.com/mozilla/Socorro-Tests/pull/210>Socorro-Tests</a>, so the team is concerned about the idea of bringing those tests inside socorro (in dev hands). A video about socorro tests (dev's and QA's) is presented by Matt Brandt: <a href=http://www.youtube.com/watch?v=usqxFxsmg4o>#SFSE: Continuous Deployment At Mozilla</a>

Some usefull links about selenium + django:    
<a href=http://www.tdd-django-tutorial.com/tutorial/1/>http://www.tdd-django-tutorial.com/tutorial/1/</a>    
<a href=http://theintern.io/#>http://theintern.io/#</a>    
<a href=http://lincolnloop.com/blog/2012/nov/2/introduction-django-selenium-testing/>http://lincolnloop.com/blog/2012/nov/2/introduction-django-selenium-testing/</a>    
<a href=http://thecodachi.blogspot.com.br/2012/08/django-factory-boy-better-test.html>http://thecodachi.blogspot.com.br/2012/08/django-factory-boy-better-test.html</a>    
<a href=http://www.shiningpanda.com/blog/2012/08/14/selenium-tests-django-14/>http://www.shiningpanda.com/blog/2012/08/14/selenium-tests-django-14/</a>

What is better for socorro project in test terms?   
I think it is impossible to have this answer without actually creating some BDD for a socorro module and receiving the team feedback.

***

### Unit test Development

I searched for some module that I could implement a test for. Then I realized that mostly of the untested lines are related to exceptions. So I decided to learn more about that.

With <a href=http://docs.python.org/2/library/unittest.html>unittest</a> it is possible to test exceptions using <a href=http://docs.python.org/2/library/unittest.html#unittest.TestCase.assertRaises>assertRaise</a>.
In this function, if the exception is not raised, it gives a failure test.

To understand how to implement an exception test like that, I read <code>test_crash_data.py</code>, which is currently 100% tested, and I found some tests like this:
            # Test 5: crash cannot be found
            self.assertRaises(
                ResourceNotFound,
                service.get,
                **{'uuid': 'c44245f4-c93b-49b8-86a2-c15dc3a695cb',
                    'datatype': 'processed'}
            )

So, we can say that an exception test have the following format:    
<code>assertRaises(nameOfException, functionCalled, *{arguments}, **{keywords})</code>      

After that, I was reading tests when I found an easy one (I changed a calling function). I implemented it and chant <code>nose coverage</code>. 2 lines are now covered!
             self.assertRaises(CrashIDNotFound,
                               crashstorage.get_raw_dumps,
                               '114559a5-d8e6-428c-8b88-1c1f22120314')

***

### Socorro Coverage

There are unit tests on socorro that need more coverage. To know the coverage of socorro files, I ran:
{% codeblock lang:objc %}
$ ../../socorro-virtualenv/bin/nosetests --with-coverage --cover-package=socorro
{% endcodeblock %}

Which gave me the following coverage: <a href=https://gist.github.com/GabiThume/5938460>Gist 5938460</a>

After that, I was reading the source files searching for uncoverage tests, and then I created a <a href=https://github.com/mozilla/socorro/pull/1306>Pull Request 1306</a> for one file 20% uncovered, but @lars unfortunately reported that the file was deprecated, so I changed my focus to search deprecated files first then cover unit tests. 

To known exactly which are the files that need coverage, we need to find out which are deprecated, so we created an <a href=https://etherpad.mozilla.org/socorro-deprecation-station>etherpad</a> where we put information collected by a script, then I filled in <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=885411>bug #885411</a> about untested files and we asked for the responsable person of the module to help us to indicate the deprecated ones. Considering the team comments, maybe just <code> /socorro/collector/submitter_app.py</code> and <code>/socorro/cron/jobs/buggy.py</code> files should be tested.

Script to search uncovered modules <strong>at all</strong>, considering the whole socorro package:
{% gist 5808574 %}

So I decided to try to exclude directories on nosetests (at least, the ones we know that are deprecated and the unittest directory as well). I used nose-exclude plugin for it:
{% codeblock lang:objc %}
$ pip install --use-mirrors --download-cache=./pip-cache nose-exclude==0.1.9
{% endcodeblock %}

Then I had a <a href=https://bitbucket.org/kgrandis/nose-exclude/issue/8/self-test-failing-on-019>problem</a>: the unittest was excluding itself (nothing was being tested). So, I decided to just choose which ones I wanted to cover, instead of exclude them.
{% codeblock lang:python %}
$ socorro-virtualenv/bin/nosetests socorro --with-coverage --cover-package=socorro.app /
--cover-package=socorro.collector --cover-package=socorro.cron --cover-package=socorro.database /
--cover-package=socorro.external --cover-package=socorro.lib --cover-package=socorro.middleware /
--cover-package=socorro.monitor --cover-package=socorro.processor --cover-package=socorro.services /
--cover-package=socorro.storage --cover-package=socorro.webapi
{% endcodeblock %}

This is a job that will be retaken later.

***

### Other things

I cleaned the <a href=https://github.com/mozilla/socorro-crashstats/pull/335>Pull Request #335</a> that creates a failling test to <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=533628>bug #533628</a> (I implemented it for the application).

And started to think about how to solve bug <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=888520>#888520</a>

In the next week I will start a template test for unittest, those are usefull links about it:
<a href=https://wiki.mozilla.org/QA/Execution/Web_Testing/Docs/Automation/StyleGuide>https://wiki.mozilla.org/QA/Execution/Web_Testing/Docs/Automation/StyleGuide</a>     
<a href=https://github.com/mozilla/mozwebqa-test-templates>https://github.com/mozilla/mozwebqa-test-templates</a>

***

### Meetings

I was presented for the team in <a href=https://wiki.mozilla.org/Breakpad/Status_Meetings/2013-June-19>Socorro Weekly Meeting on June 19th</a>. And on <a href=https://air.mozilla.org/the-monday-meeting-20130624/>Mozilla Monday Meeting Day on June 24th</a> I was introduced to the whole Mozilla YAY! :)    
I was not able to watch live streaming, so I filled in bug <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=886462>#886462</a> reporting that. The agenda for that meeting can be found at <a href=https://wiki.mozilla.org/WeeklyUpdates/2013-06-24>https://wiki.mozilla.org/WeeklyUpdates/2013-06-24</a>    
And I also called in Weekly meeting on <a href=https://wiki.mozilla.org/Breakpad/Status_Meetings/2013-June-26>June 26</a> during this time.