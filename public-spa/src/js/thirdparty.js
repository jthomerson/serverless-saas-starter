'use strict';
var _ = require('underscore'),
    $ = require('jquery'),
    Class = require('class.extend');

// Export necessary items to the global name space
window._ = _;
window.jQuery = window.$ = $;
window.Class = Class;

// adds all the bootstrap jQuery plugins:
require('bootstrap');
