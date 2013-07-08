---
layout: post
title: "Mozilla Test Gardener in Mac OS X 10.8"
date: 2013-04-21 18:22
comments: true
categories: [mozilla, socorro, opw, gnome, code, crash stats]
---

<a href=https://live.gnome.org/OutreachProgramForWomen>Outreach Program for Women</a> is an amazing program to include women in Free and Open Source Software. I am really interested in applying. So I decided to start by studing the Mozilla Projects to the OPW.

Project <a href=https://wiki.mozilla.org/GNOME_Outreach_Summer2013>Test Gardener</a>: "Write unit and integration tests for Socorro related to database, backend crash storage and middleware."

My first impress by reading the OPW projects is that this project of Mozilla is the coolest one. To verify that, I want to spend some time installing, running, and maybe solving some bug of <a href=https://wiki.mozilla.org/Socorro>Socorro</a>.

<!-- more -->

<h2> Installation </h2>

<h3> Requirements </h3>

{% codeblock lang:objc %}
brew install postgresql // PostgreSQL 9.2
brew install gpp // G++ Compiler 2.24
brew install git // Git
sudo easy_install psycopg2 // PostgreSQL database adapter for the Python programming language.
{% endcodeblock %}

Here I have this <a href=https://www.enthought.com/canopy-express/?Download=Download+EPD+Free+7.3-2>Python</a>.

<h3>Configure PostgreSQL</h3>

I had a problem with PATH, so when I tried:
{% codeblock lang:objc %}
which psql
{% endcodeblock %}

I saw usr/bin/psql instead of usr/local/bin/psql, so you need to add usr/local/bin to the head of your PATH in your ~/.bash_profile:
{% codeblock lang:objc %}
export PATH=/usr/local/bin:$PATH
{% endcodeblock %}

Modify postgresql config to UTC timezone:

{% codeblock lang:objc %}
sudo emacs /usr/local/pgsql/data/postgresql.conf
timezone = 'UTC'
brew service restart postgresql
{% endcodeblock %}

Then, I received:
<h6>"Could not connect to server: Permission denied

  Is the server running locally and accepting

  connections on Unix domain socket "/var/pgsql_socket/.s.PGSQL.5432"?</h6>

To deal with that, I checked where the target was, created the pgsql_socket directory and a symlink:

{% codeblock lang:objc %}
sudo find / -name .s.PGSQL.5432
mkdir /var/pgsql_socket/
ln -s /private/tmp/.s.PGSQL.5432 /var/pgsql_socket/
{% endcodeblock %}

<!--
// initdb /usr/local/var/postgres -E utf8
// postgres -D /usr/local/var/postgres
//createuser -s -r postgres
-->


Then I booted the PostgreSQL, created a superuser account for myself, and the breakpad_rw account for Socorro:
{% codeblock lang:objc %}
initdb -D /usr/local/pgsql/data -E utf8
postgres -D /usr/local/pgsql/data
createuser -s $USER
psql -c "CREATE USER breakpad_rw" template1
psql -c "ALTER USER breakpad_rw WITH ENCRYPTED PASSWORD 'aPassword'" template1
{% endcodeblock %}

<h2> Socorro </h2>

{% codeblock lang:objc %}
git clone https://github.com/mozilla/socorro
{% endcodeblock %}

<h2> CrashStats </h2>

{% codeblock lang:objc %}
git clone https://github.com/mozilla/socorro-crashstats
cd socorro-crashstats
git submodule update --init --recursive
{% endcodeblock %}

<h4> LESS Preprocessor </h4>

Node:
{% codeblock lang:objc %}
git clone https://github.com/joyent/node.git
cd node
git checkout v0.8.2 (latest stable version today - https://github.com/joyent/node/wiki/Installation)
node -v
export PATH=$HOME/local/node/bin:$PATH
{% endcodeblock %}

NPM:
{% codeblock lang:objc %}
curl http://npmjs.org/install.sh | sh
npm -v
{% endcodeblock %}

{% codeblock lang:objc %}
npm install -g less
{% endcodeblock %}

<!--
//cd socorro
//sudo pip install -r requirements/dev.txt
-->

<h4> Creating virtualenv and populate it: </h4>
{% codeblock lang:objc %}
brew install tcl-tk
sudo easy_install install virtualenv
sudo easy_install install virtualenvwrapper
virtualenv --python=python2.6 .virtualenv
source .virtualenv/bin/activate
cd socorro-crashstats
pip install -r requirements/compiled.txt
pip install -r requirements/dev.txt
cp crashstats/settings/local.py-dist crashstats/settings/local.py
{% endcodeblock %}

<h2> Running tests: </h2>
{% codeblock lang:objc %}
cd socorro
make test
{% endcodeblock %}

At this point, I have everything working: The CrashStats Server, the PostgreSQL, the virtual environment... But I am getting this problem below and I really don't know how to solve:

{% gist 5440281 %}

To solve this, I ran:
{% codeblock lang:objc %}
psql -d postgres -f sql/roles.sql 
{% endcodeblock %}

Then, I received an error about "jenkins-pg92" and I fixed it using <a href=https://groups.google.com/forum/?fromgroups=#!topic/mozilla.tools.socorro/DDvCjTDQwo8>this topic</a>:

In socorro/unittest/config/commonconfig.py switch:

<strong>databaseHost.default = 'jenkins-pg92' to 
databaseHost.default = 'localhost'</strong>
        
After that, I got an error of "permission denied":

{% gist 5440840 %}

And the command below fix that:

{% codeblock lang:objc %}
"psql -c 'alter user breakpad_rw superuser template1"
{% endcodeblock %}
 
Then I get "Ran 588 tests in 27.220s" and a big OK :)

The reported errors can be found at:

https://bugzilla.mozilla.org/show_bug.cgi?id=864070

https://bugzilla.mozilla.org/show_bug.cgi?id=864854

After that, when running "make minidump_stackwalk", I got the error "cc1plus: error: -Werror=vla: No option -Wvla", so I fixed by commenting the line 85 on file <strong>socorro/google-breakpad/Makefile.in</strong>:
{% codeblock lang:objc %}
#@GCC_TRUE@	-Werror=vla
{% endcodeblock %}

After following the steps to populate database and running Socorro in dev mode (both servers, even the middleware), I got <code>Page not found (404)</code> when pointing Firefox to <code>http://localhost:8000/home/products/WaterWolf</code>. I updated the cvs files and it seems working. Right now, instead of using cvs, it is possible to populate the database PostgreSQL with fakedata: 
{% codeblock lang:objc %}
$ ./socorro/external/postgresql/setupdb_app.py --database_name=breakpad \
--fakedata --dropdb --database_superusername=your_superuser \
--database_superuserpassword=bPassword</code> 
{% endcodeblock %}


<!--
sudo dscl . -create /Users/postgres UserShell /usr/bin/false
brew uninstall postgresql
brew install postgresql

psql -c 'alter user breakpad_rw superuser'

And after this stage, all the commands did not work.

Well, maybe I will try to install all this again in Linux.

-->