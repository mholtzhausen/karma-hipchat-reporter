var _ = require('lodash');
var options = {
    'auth_token' : '<auth_token>',
    'room_id'    : '<room_id>',
    'from'       : 'Karma Hipchat',
    'format'     : 'html',
    'color'      : 'yellow',
    'notify'     : 0,
    'title'      : null,
    'showbrowser': false
};

var Hipchat = require('hipchat-message');

var HipchatReporter = function (logger, config) {
    var allMessages = [];
    var log = logger;
    var fail = [];
    var success = [];

    if (_.isObject(config)) {
        config = _.assign({}, options, config);
    } else {
        config = options;
    }

    var hipchat = new Hipchat(config);

    this.onSpecComplete = function (browser, result) {
        if (!result.success) {
            fail.push('<strong> Failed:</strong>' + (options.showbrowser ? '<i>[' + browser.name + ']</i> ' : ' ') + result.description);
        } else {
            success.push('<strong> Success:</strong>' + (options.showbrowser ? '<i>[' + browser.name + ']</i> ' : ' ') + result.description);
        }
    };

    this.onRunComplete = function (browsers, results) {
        var output = [];

        if (config.title) {
            output.push(config.title);
        }

        if(results.failed>0){
            output.push('<ul><li>' + fail.join('</li><li>')+'</li></ul>');
        }

        var outputString = [output.join('<br /><br />')];

        outputString.push('<br><br>');
        outputString.push('<b>Summary</b>');
        outputString.push('<ul>');
        outputString.push('<li><b>Success:</b> '+results.success+'</li>');
        outputString.push('<li><b>Failures:</b> '+results.failed+'</li>');
        outputString.push('</ul>');
        if(results.failed>0){
            hipchat.error(outputString.join(''), true);
        }else{
            hipchat.success(outputString.join(''), true);
        }
        //console.log(outputString.join(''));
    };

};

HipchatReporter.$inject = ['logger', 'config.hipchatReporter'];


module.exports = {
    'reporter:hipchat': ['type', HipchatReporter]
}