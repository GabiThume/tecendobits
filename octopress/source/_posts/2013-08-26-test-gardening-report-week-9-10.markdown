---
layout: post
title: "Test Gardening Report Week 9-10"
date: 2013-08-25 15:30
comments: true
categories: [opw, mozilla, gnome, socorro, code, bug, test, documentation]
---


This week closed a cycle of 2 months in this amazing OPW experience. I am so glad to be part of an incredible team like Socorro. I was reflecting about our hopes and expectations, sometimes we feel that we don't have to dream huge because the risk of the dream come true is little, but if we always dream at the lower limit, we never are going to experience the happiness of doing something that really challenges you. I know that doing challenging things all the time can be frustrating, but the gratification is so much higher than the fear of do not getting whatever you want.

I am digressing into this because I have just one month till the end of the OPW and I am enjoying so much that I don't want it to end. But I am sure that because of this awesome experience I am rethinking a lot of thoughts that I have about myself, like my capability of doing what I really want (maybe sometimes I feel a little about getting into the impostor syndrome).

<!-- more -->

***

### Test for postgresql/utils.py

I wrote the tests for this code related to <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=904238>Bug</a> in <a href=https://github.com/mozilla/socorro/pull/1398>Pull Request 1398</a>.

***

### Middleware service

The middleware facilitates communications with a database from an application. So we can create a new service and then "call" it from the Socorro Public API by uri. I created a simple service that calls some "backfill_(.*)" function in PostgreSQL according to its parameters and the tests to check if the service is working well. The main problem was in the treatment of the parameters passed to the service. 

To link the new service in the middleware, I had to edit some files and create test in the middleware to see if it works as expected. The Bug related is the <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=906962>906962</a> and all the code can be found at the <a href=https://github.com/mozilla/socorro/pull/1413>Pull Request 1413</a>. The files needed to create a new service in middleware are:

{% codeblock lang:objc %}
docs/middleware.rst
scripts/config/webapiconfig.py.dist
socorro/external/postgresql/backfill.py
socorro/middleware/backfill_service.py
socorro/middleware/middleware_app.py
socorro/unittest/external/postgresql/test_backfill.py
{% endcodeblock %}

***

### When your branch has to be rebased

The following commands can be used to update the master branch and then rebase your branch with the master branch:

{% codeblock lang:objc %}
git checkout master
git fetch moz
git merge moz/master
git push origin master
git status
git checkout your_branch 
git fetch origin        
git rebase origin/master
git push origin your_branch 
{% endcodeblock %}

***

### Work week

The team was located at Mountain View for a (what seems *awesome*) work week:

<a href=https://etherpad.mozilla.org/StabilityWeek2013-Notes>https://etherpad.mozilla.org/StabilityWeek2013-Notes</a>     
<a href=https://etherpad.mozilla.org/ux-stability-workweek>https://etherpad.mozilla.org/ux-stability-workweek</a>         
<a href=https://etherpad.mozilla.org/StabWeek-SocorroBreakouts>https://etherpad.mozilla.org/StabWeek-SocorroBreakouts</a>     