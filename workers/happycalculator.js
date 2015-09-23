let sendMessage = (name, message) => {
  self.postMessage(JSON.stringify({
    type: name,
    data: message
  }));
}

let run = source => {
  var output;
  try {
    output = JSON.stringify(happycalculator.calculateCode(source));
    sendMessage('stdout', output);
  } catch (e) {
    sendMessage('stderr', {
      exception: 'CalculateError',
      description: String(e)
    });
  }
  sendMessage('exit');
}

self.addEventListener('message', (e) => run(e.data));