'use strict';

var dumps = JSON.stringify;

var sendMessage = function sendMessage(name, message) {
  self.postMessage(dumps({
    type: name,
    data: message
  }));
};

var run = function run(source) {
  var console = {
    log: function log() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      args.forEach(function (output) {
        return sendMessage('stdout', dumps(output));
      });
      sendMessage('stdout', '\n');
    }
  };

  try {
    eval(source);
  } catch (e) {
    sendMessage('stderr', {
      type: e.name,
      description: String(e)
    });
  }
  sendMessage('exit');
};

self.addEventListener('message', function (e) {
  return run(e.data);
});