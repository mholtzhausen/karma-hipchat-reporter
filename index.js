var _ = require('lodash');
var options = {
    'auth_token': '<auth_token>',
    'room_id'   : '<room_id>',
    'from'      : 'Karma Hipchat',
    'format'    : 'html',
    'color'     : 'yellow',
    'notify'    : 0
};

var Hipchat = require('hipchat-message');

var HipchatReporter = function (logger, config) {
    var allMessages = [];
    var log = logger;

    if (_.isObject(config)) {
        config = _.assign({}, options, config);
    } else {
        config = options;
    }

    var hipchat = new Hipchat(config);

    this.adapters = [function (msg) {
        allMessages.push(msg);
    }];

    this.onBrowserComplete = function (browser) {
        hipchat.notify({message: 'testmessage', color: 'purple', notify: 1});
        hipchat.info('hello',true);
        hipchat.error('ERROR...',true);
    };

};

HipchatReporter.$inject = ['logger', 'config.hipchatReporter'];


module.exports = {
    'reporter:hipchat': ['type', HipchatReporter]
}