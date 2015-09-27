/*! brainfuck.js 1.1.0 James Frost <hello@jamesfrost.me> 2015-08-30 */
var BrainfuckParser=function(){this.byteCells=new Array(3e4)};BrainfuckParser.prototype.reset=function(){this.code="",this.dataPointer=0,this.instructionPointer=0,this.output="",this.input="";for(var a=0;a<this.byteCells.length;++a)this.byteCells[a]=0},BrainfuckParser.prototype._62=function(){++this.dataPointer},BrainfuckParser.prototype._60=function(){--this.dataPointer},BrainfuckParser.prototype._43=function(){++this.byteCells[this.dataPointer],this.byteCells[this.dataPointer]=this.validateByte(this.byteCells[this.dataPointer])},BrainfuckParser.prototype._45=function(){--this.byteCells[this.dataPointer],this.byteCells[this.dataPointer]=this.validateByte(this.byteCells[this.dataPointer])},BrainfuckParser.prototype._46=function(){this.output+=String.fromCharCode(this.byteCells[this.dataPointer])},BrainfuckParser.prototype._44=function(){this.byteCells[this.dataPointer]=this.input.shift().charCodeAt()},BrainfuckParser.prototype._91=function(){if(0===this.byteCells[this.dataPointer]){for(var a=[this.instructionPointer];0!==a.length;)switch(++this.instructionPointer,this.code[this.instructionPointer]){case"]":a.pop();break;case"[":a.push(this.instructionPointer)}return this.instructionPointer}},BrainfuckParser.prototype._93=function(){if(0!==this.byteCells[this.dataPointer]){for(var a=[this.instructionPointer];0!==a.length;)switch(--this.instructionPointer,this.code[this.instructionPointer]){case"]":a.push(this.instructionPointer);break;case"[":a.pop()}return this.instructionPointer}},BrainfuckParser.prototype.validateByte=function(a){return this.byteValue>255?0:this.byteValue<0?255:a},BrainfuckParser.prototype.parse=function(a,b){this.reset(),this.code=a.trim().replace(/ /g,"").replace(/(\r\n|\n|\r)/gm,"").split(""),"undefined"!=typeof b&&(this.input=b.split(""));do{if("undefined"==typeof this["_"+this.code[this.instructionPointer].charCodeAt(0)])throw"Syntax Error - Invalid Symbol";this["_"+this.code[this.instructionPointer].charCodeAt(0)]()}while(++this.instructionPointer<this.code.length);return this.output};
'use strict';

var sendMessage = function sendMessage(name, message) {
  self.postMessage(JSON.stringify({
    type: name,
    data: message
  }));
};

var run = function run(source) {
  var parser = new BrainfuckParser(),
      output;
  try {
    output = parser.parse(source);
    sendMessage('stdout', output);
  } catch (e) {
    sendMessage('stderr', {
      exception: 'ParseError',
      description: String(e)
    });
  }
  sendMessage('exit');
};

self.addEventListener('message', function (e) {
  return run(e.data);
});