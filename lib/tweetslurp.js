var events      = require('events'),
    fs          = require('fs'),
    querystring = require('querystring'),
    util        = require('util'),

    bignum      = require('bignum'),
    pkg         = require('../package.json'),
    request     = require('request'),
    _           = require('underscore'),

    URL_TIMELINE = 'http://api.twitter.com/1/statuses/user_timeline.json';

request.defaults({
    headers: {
        'User-Agent': pkg.name + '/' + pkg.version
    }
});

function TweetSlurp() {
    events.EventEmitter.call(this);
}

util.inherits(TweetSlurp, events.EventEmitter);

// -- Public Methods -----------------------------------------------------------

TweetSlurp.prototype.getDefaultMetadata = function (user) {
    return {
        user   : user,
        firstId: null,
        lastId : null,
        version: pkg.version,
        tweets : []
    };
};

TweetSlurp.prototype.getTweets = function (user, params, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options  = {};
    } else if (typeof params === 'function') {
        callback = params;
        params   = {};
        options  = {};
    }

    params = _.defaults(params, {
        count           : 200,
        exclude_replies : 0,
        include_entities: 1,
        include_rts     : 1,
        trim_user       : 1
    });

    params.screen_name = user;

    if (options.lastId) {
        params.since_id = options.lastId;
    }

    this._requestTweets(params, options, callback);
};

TweetSlurp.prototype.loadBackup = function (filename, user, callback) {
    var self = this;

    fs.exists(filename, function (exists) {
        if (!exists) {
            callback(null, self.getDefaultMetadata());
            return;
        }

        fs.readFile(filename, 'utf8', function (err, data) {
            if (err) {
                callback(err);
                return;
            }

            try {
                callback(null, JSON.parse(data));
            } catch (ex) {
                callback(ex);
            }
        });
    });
};

TweetSlurp.prototype.sortTweets = function (tweets) {
    return tweets.sort(function (a, b) {
        return bignum(a.id_str).cmp(b.id_str);
    });
};

TweetSlurp.prototype.writeBackup = function (filename, data, callback) {
    fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8', callback);
};

// -- Protected Methods --------------------------------------------------------

TweetSlurp.prototype._requestTweets = function (params, options, callback) {
    var self   = this,
        tweets = options.tweets || [],
        uri    = URL_TIMELINE + '?' + querystring.stringify(params);

    this.emit('request', {
        params: params,
        uri   : uri
    });

    request({
        uri    : uri,
        json   : true,
        timeout: 30000
    },

    function (err, res, body) {
        if (err) {
            self.emit('error', err);
            return callback && callback(err);
        }

        if (res.statusCode !== 200) {
            err = Error('Error: HTTP ' + res.statusCode);

            self.emit('error', err, {
                body  : body,
                status: res.statusCode
            });

            return callback && callback(err);
        }

        if (body.length) {
            // Sort the tweets in ascending order by date (by default they come
            // back in descending order).
            body = self.sortTweets(body);

            // Prepend the sorted tweets onto the full buffer of tweets. We
            // prepend instead of appending because tweets are returned in
            // reverse order, so we'll always see newer tweets first.
            Array.prototype.unshift.apply(tweets, body);

            // Emit an event containing the current batch of tweets.
            self.emit('tweets', {
                params: params,
                tweets: body,
                uri   : uri
            });

            // Continue making requests tweets older than the first known tweet id
            // until we don't get any back.
            delete params.since_id;

            params.max_id = bignum(options.firstId || body[0].id_str).sub('1').toString();
            options.tweets = tweets;

            self._requestTweets(params, options, callback);
        } else {
            self.emit('complete', {
                tweets: tweets
            });

            callback && callback(null, tweets);
        }
    });
};

module.exports = TweetSlurp;
