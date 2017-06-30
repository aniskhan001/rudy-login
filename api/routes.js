var express     = require('express');
var apiRoutes   = express.Router();
var passport    = require('passport');
var mongoose    = require('mongoose');
var jwt         = require('jwt-simple');
var bodyParser  = require('body-parser');

var config      = require('./../config/database'); // db config file
var User        = require('./../api/models/user'); // db model

mongoose.connect(config.database);
require('./../config/passport')(passport);

// Singup
apiRoutes.post('/signup', function(req, res) {
    if (!req.body.name || !req.body.password) {
        res.json({success: false, msg: 'Please neter name and password'});
    } else {
        var newUser = new User({
            name: req.body.name,
            password: req.body.password
        });

        newUser.save(function(err) {
            if (err) {
                res.json({sucess: false, msg: 'user already exists!'});
            } else {
                res.json({success: true, msg: 'user created'});
            }
        });
    }
});

// Login
apiRoutes.post('/login', function(req, res) {
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'user not found'});
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // create a token on successful login
                    var token = jwt.encode(user, config.secret);
                    res.json({success: true, msg: 'login successful', token: 'JWT ' + token});
                } else {
                    res.send({success: false, msg: 'password incorrect'});
                }
            });
        }
    });
});

// access to a restricted page if logged in
apiRoutes.get('/secret', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'user not found.'});
            } else {
                res.json({success: true, msg: 'Welcome to SECRET AREA, ' + user.name + '!'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'token not found'});
    }
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        
        if (parted.length === 2) return parted[1];
        else return null;

    } else {
        return null;
    }
};

module.exports = apiRoutes;