---
layout: post
title: "Test Gardening Report Week 11-12"
date: 2013-09-08 18:18
comments: true
categories: [opw, mozilla, gnome, socorro, code, bug, test]
---

### Configman

<a href=http://configman.readthedocs.org/en/latest/>Configman</a> it is a great tool for setting up configuration options. It is a new style of configuration used by Socorro, catching options of environment variables is way better than using a ``commonconfig.ini``. The main code contributors are @twobraids and @peterbe :)

@peterbe assign me an issue on Configman related to make ``+include somefile.ini`` relative to the source file, instead of the current working directory of the executable. The issue was the <a href=https://github.com/mozilla/configman/issues/88>88</a> and my <a href=https://github.com/mozilla/configman/pull/89>Pull Request 89</a> fixed it.

<!-- more -->

***

### Removing old config style

Socorro Project is migrating from using configuration options to Configman, the project I cited above. So now it was designated to me to remove old config style from tests. By first I had to search for what were the tests using it and I ended with a list with postgresql, elasticsearch and middleware tests.

<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=913584>Bug 913584</a> is related to remove uses of commonconfig at unittest/external/postgresql/*. This was a hard one to do, because each file I touched was interacting with many others. I also took to standardize variables like ``databaseHost`` for ``dabase_host``, for example. My patch is in <a href=https://github.com/mozilla/socorro/pull/1479>Pull Request 1479</a>.

***

### Statsd

<a href=https://pypi.python.org/pypi/statsd>Statsd</a> is a Python client for the statsd daemon (front-end to <a href=http://graphite.wikidot.com/>Graphite</a> (Scalable Realtime Graphing)).

<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=853920>Bug 853920</a> iss related to implement statsd on the internal middleware. The main difficulty of solving it was that the place where the requisition and response needed to be catch was unclear. Knowing that, I tried 3 different ways: <a href=https://github.com/GabiThume/socorro/commit/24a09a7d056c2c8bb3564628876f1c222bf5c6cf>statsd in models using a middleware</a>, <a href=https://github.com/GabiThume/socorro/commit/9b9bc1b1f19860c7aabd1bf56c2bbc4f3e256164>statsd in middleware_app</a> and finally, statsd in models using a function to catch the parameters worked! <a href=https://github.com/mozilla/socorro/pull/1465>Pull Request 1465</a>

Note: just an example of the <a href=https://gist.github.com/GabiThume/6373561>output</a> if the metrics were printed. And a good source for wgsi python is <a href=http://pythonpaste.org/do-it-yourself-framework.html>http://pythonpaste.org/do-it-yourself-framework.html</a>

Still related to statsd, I fixed Bug 912552 with <a href=https://github.com/mozilla/socorro/pull/1468>Pull Request 1468</a>. It was about having metrics working with non-ascii characters like ッ or シ.

***

### Miscellany

<a href=https://bugzilla.mozilla.org/show_bug.cgi?id=874648>Bug 874648</a> - Evict unittests that touch external resources: <a href=https://github.com/mozilla/socorro/pull/1473>Pull Request 1473</a>
No bug, just removing one of two psycopg2 requirements in Socorro installation: <a href=https://github.com/mozilla/socorro/pull/1466>Pull Request 1466</a>

There is an awesome Laura Thomson's brownbag on Air Mozilla, where she discusses about the management of a huge project like Socorro: <a href=https://air.mozilla.org/minimum-viable-bureaucracy/?>Minimum Viable Bureaucracy</a>