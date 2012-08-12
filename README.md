TweetSlurp
==========

TweetSlurp backs up your tweets to a JSON file. It only downloads tweets that
it hasn't already seen, so you can run it in a cron job to ensure that your
latest tweets are always backed up.

The JSON format is simply the raw JSON returned by Twitter's
[user_timeline API](https://dev.twitter.com/docs/api/1/get/statuses/user_timeline),
with a small amount of TweetSlurp metadata at the top. This makes it easily
parseable by existing code that deals with Twitter data.


Installing
----------

```bash
$ npm i -g tweetslurp
```


Usage
-----

    tweetslurp -u <twitter username> [-o <output file>] [options]

For example, to automatically back up all my tweets, I run the following
command.

```bash
$ tweetslurp -u yaypie -o tweets.json
```

Run `tweetslurp -h` to see additional options.


Bugs
----

Probably. I wrote this thing in a couple of hours and barely tested it. Good
luck.


Contributing
------------

To contribute a patch, please fork this repo, create a topic branch for your
change, then open a pull request describing what your change does and why I
should pull it. Be warned that I'm super picky about code quality and style.

Before contributing any big changes, please check with me to see whether I'm
interested. Otherwise, you may end up wasting your time.


License
-------

Copyright (c) 2012 by Ryan Grove (ryan@wonko.com).

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
