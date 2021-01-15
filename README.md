### Fil
Live coding in your browser with your favourite language.

<https://fatiherikli.github.io/fil/>

![fil](https://i.imgur.com/ATdVU2O.png)

### Features

- Currently supports Python, Ruby, Javascript, Brainfuck and happycalculator.
- Runs on web workers.
- Uses localStorage API for your changes.

### Implementation

- Uses Skulpt for Python interpreter.
- Uses Opal for Ruby interpreter.
- Built with React and Redux.

### Todo
- Languages
	- LiveScript
	- SibilantJS or LispyScript
	- Elm-lang
	- Any language you want
- Build electron package.

### Development

Clone the repository and run the following commands.

```
$ npm install
$ bower install
$ gulp build
```

After the installation, you can open `index.html` in your browser. Also you can run `gulp watch` command to listen and compile your changes.

### Adding a new interpreter

Fil speaks with web workers to interpret the source codes. The workers listen `message` event for source code, and stream with stringified JSON object for the output of program.

The message should be a plain text, like this:

```ruby
puts "hey".upcase
```

After the receiving, the worker will stream stringified json objects with `type` and `data` keys.

```javascript
JSON.stringify({
    type: "stdout",
    data: "HEY"
})
```

The key of the object may be:

key          | description
------------ | -------------
stdout | To print to the console
stderr | To show warning message
exit | To finish program


Lets create our worker. 

```javascript
// workers/markdown.js 
let sendMessage = (name, message) => {
  self.postMessage(JSON.stringify({
    type: name,
    data: message
  }));
}

let run = source => {
  var parser = new Markdown(),
      output;
  try {
    output = parser.parse(source)
    sendMessage('stdout', output);
  } catch (e) {
    sendMessage('stderr', {
      exception: 'ParseError',
      description: String(e)
    });
  }
  sendMessage('exit');
}

self.addEventListener('message', (e) => run(e.data));
```

After then, we should define this worker in `/interpreters.yaml`. 

```yaml
...
markdown:
  description: "Markdown"
  extension: "md"
  workerPath: "build/markdown.worker.js"
  editorMode: "markdown"
  includes:
  	- '{bowerPath}markdown-parser/src/markdow.min.js'

```

The configuration object may contains the following values:

key          | description
------------ | -------------
description | Name of your interpreter that will shown on the console.
extension | File extensions will associated with the interpreter.
workerPath | Worker file. This file will be generated with `gulp buildWorkers` command.
editorMode | The mode of ACE Editor.
includes |  The scripts will be concatenated with your worker.
parsingErrors | To keep apart the syntax errors and internal errors of interpreter.

Now we can build our new interpreter.

	$ gulp buildWorkers

	Using gulpfile ~/projects/fil/gulpfile.js
	Starting 'buildWorkers'...
	Finished 'buildWorkers' after 29 ms

That's it.




