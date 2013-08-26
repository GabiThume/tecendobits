---
layout: post
title: "Test Gardening Report Week 7-8"
date: 2013-08-11 12:52
comments: true
categories: [opw, mozilla, gnome, socorro, code, bug, test, documentation]
---

This is a short post about my seven and eight weeks contributing for Socorro. It is brief because I had problems with my etherpad-diary and I lost some of the comments, so I wrote here my code contributions during this time.

***

### Automatic elastic search tests

Thanks to @adrian I made the integration test `test_elasticsearch_storage_app.py` be automatic and I closed the <a href = https://bugzilla.mozilla.org/show_bug.cgi?id=892672>Bug 892672</a>. The Pull Request related was the <a href=https://github.com/mozilla/socorro/pull/1383>1383</a>. Basically, what I did was to call the test code inside a shell script run by Jenkins. To elastic search test works, I configured the host to be `jenkins-es20` and set up the environment before to call the test itself.

<!-- more -->

***

### Database tests

How to test code that uses database?

By first, when dealing with database values we need to populate tables we are going to use in `setUp` function. This function runs before any test, so it is the best place for doing this.

{% codeblock lang:python %}
cursor = self.connection.cursor() 
cursor.execute("""
    INSERT INTO products
    (product_name, sort, rapid_release_version, release_name)
    VALUES
    ('Firefox', 1, '8.0', 'firefox'),
    ('Fennec', 2, '11.0', 'mobile');
""")
self.connection.commit() 
{% endcodeblock %}

After populate the tables with some fake data, we can manipulate the data to test what we want. For example: we have a product name, its version and a date for which we want to know what is the latest entry related to that product before the date we provided. In following case, given the today date, the latest entry was seven days ago:

{% codeblock lang:python %}
def test_latestEntryBeforeOrEqualTo(self):

    cursor = self.connection.cursor()

    product = 'Firefox'
    version = '8.0'
    now = self.now.date()
    to_date = now - datetime.timedelta(days=1)
    lastweek = now - datetime.timedelta(days=7)

    res = tcbs.latestEntryBeforeOrEqualTo(cursor, to_date, product, version)
    self.assertEqual(res, lastweek)
{% endcodeblock %}

And at end of test, the`tearDown` method can be used to drop the tables, cleaning the database:

{% codeblock lang:python %}
def tearDown(self):
    """ Cleanup the database, delete tables and functions """

    cursor = self.connection.cursor()
    cursor.execute("""
        TRUNCATE tcbs, products, signatures
        CASCADE;
    """)
    self.connection.commit()

    super(IntegrationTestTCBS, self).tearDown() 
{% endcodeblock %}

Knowing that, it is really interesting to develop tests for functions that manipulate databases. The <a href=https://github.com/mozilla/socorro/pull/1396>Pull Request 1396</a> and <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=904243>Bug 904243</a> are related to a test of TopCrashers by Signature (TCBS).

***

### Submitter App Test

Related to <a href=https://bugzilla.mozilla.org/show_bug.cgi?id=820512>Bug 820512</a> and my <a href=https://github.com/mozilla/socorro/pull/1368>Pull Request 1368</a>, @lars solved the problem I had by asking me to insert `force=True` on required configuration for the context of `socorro/processor/processor_app.py`. Merged :)

***

### Test Documentation

Some instructions on socorro installation weren't working anymore, so I updated it at <a href=https://github.com/mozilla/socorro/pull/1381>Pull Request 1381</a> 