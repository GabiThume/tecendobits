---
layout: post
title: "Test Gardening Report Week 13"
date: 2013-09-23 21:50
comments: true
categories: [opw, mozilla, gnome, socorro, code, bug, test]
---

### Bugs

<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=913583>Bug 913583</a> - Remove commonconfig from Elastic Search tests.    
To smash this bug, I had to create a configuration using Configman very similar to the one I created in PostgreSQL tests. This bug was way easy than the first one, because there are just two tests of Elastic Search. <a href=https://github.com/mozilla/socorro/pull/1533>Pull Request 1533</a>.

But for solve <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=913581>Bug 913581</a> I subclassed middleware_app of the PostgreSQL test configuration.

<!-- more -->

Related to <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=875106>Bug 875106</a> it was asked to write integration test for a skiplist entry test. The test already existed so I just completed it to solve the bug (a minor thing). <a href=https://github.com/mozilla/socorro/pull/1531>Pull Request 1531</a>.

Too many Graphite metrics (related to statsd) were noticed from Socorro and reported in <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=916905>Bug 916905</a>. I created <a href=https://github.com/mozilla/socorro/pull/1514>Pull Request 1514</a> that excludes UUIDs and replaces dates from ``2013-09-23`` to ``XXXX-XX-XX``.

Also, @adrian asked me to "rework middleware exceptions" (<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=913428>Bug 913428</a>). This was good for the improvement of log content coming from middleware. <a href=https://github.com/mozilla/socorro/pull/1496>Pull Request 1496</a>.

***

### Future bugs

I am stuck having a look at a bug and don't knowing how to solve it <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=912727>Bug 912727</a>. I asked @rhelmer about it and I am waiting for more information.

I need some time to think better on <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=908722>Bug 908722</a>. Hopefully I will smash this one soon.

***

### OPW Wrap-up IRC Meeting 

A meeting organized by @marina at server ``irc.gnome.org`` channel ``#opw`` taked place on September 18th. It is really nice to see how the others interns dealt with this amazing experience. I sent a <a href=https://etherpad.mozilla.org/opw2013-wrapup>etherpad</a> where I put some bugs and PRs I made so far, but I still need to review the list.

***

### Miscellany

@stephend asked me to look an error so I made a <a href=https://gist.github.com/GabiThume/6617400>test</a> to check it, and I am receiving a status code 200 in dev. Unfortunately I don't have a clue of how to debug this kind of thing, besides I don't have access to stage and etc (<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=918153>Bug 918153</a>).

A interesting note it this week I was CAPABLE of creating a test that broke another test!    
And the best of all, I spend a good time trying to solve it!

September 13th was my pretty B-day!! :)    
I took the day off to enjoy it with my parents (I travelled to my mom's house for this day). A photo for you:

{% img center http://imgur.com/lOQcogU.jpg %}