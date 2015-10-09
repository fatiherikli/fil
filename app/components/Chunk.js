import _ from 'underscore-contrib';
import React from 'react';
import classNames from 'classnames';

import {parseOrFallback} from 'helpers';

class List extends React.Component {
  render() {
    let block = "console__chunk--list",
        output = this.props.chunk;

    let classes = classNames(block, {
      "console__chunk--set": this.props.isSet
    });

    return (
      <ul className={classes}>
        {output.map((item, i) => (
          <li className={block + "__item"} key={i}>
            <Chunk className={block + "__val"} chunk={item} />
            {i < output.length -1 && (
              <span className={block + "__separator"}>,</span>
            )}
          </li>
        ))}
        {!output.length && (
          <li className={block + "__item--empty"}></li>
        )}
      </ul>
    );
  }
}

class Dict extends React.Component {
  render () {
    let block = "console__chunk--dict",
    output = this.props.chunk;

    return (
      <table className={block}>
        <tbody>
          {_.keys(output).map(key => (
            <tr key={key} className={block + "__item"}>
              <td className={block + "__key"}>{key}:</td> 
              <td className={block + "__val"}>
                <Chunk chunk={output[key]} />
              </td>
            </tr>
          ))}
          {!_.keys(output).length && (
            <tr>
              <td className={block + "__item--empty"}></td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

class Chunk extends React.Component {

  parse(output) {
    return parseOrFallback(output, _ => output);
  }

  render() {
    var output = this.parse(this.props.chunk),
        block = "console__chunk",
        isString = _.isString(output);

    if (_.isArray(output)) {
      return <List chunk={output} isSet={this.props.isSet} />;
    }
    
    if (_.isObject(output)) {
      return <Dict chunk={output} />;
    }
    
    if (isString && this.isSet()) {
      return <Chunk isSet={true}
                    chunk={this.setToIterable(output)} />;
    }

    if (isString && this.isTuple()) {
      return <Chunk className={block + "--tuple"} 
                    chunk={this.tupleToIterable(output)} />;
    }

    let classes = classNames({
      [this.props.className || block]: true,
      [block + "--builtin"]: isString && this.isBuiltin(),
      [block + "--instance"]: isString && this.isInstance(),
      [block + "--integer"]: this.isInteger(),
      [block + "--float"]: this.isFloat()
    });

    return (
      <span className={classes}>
        {output}  
      </span>
    );
  }

  isSet() {
    let chunk = this.props.chunk,
        tokens = chunk.slice(0, 4) + chunk.slice(-1);
    return tokens == 'set()';
  }

  isTuple() {
    let chunk = this.props.chunk,
        tokens = chunk[0] + chunk.slice(-1);
    return tokens == '()';
  }

  isInstance() {
    let chunk = this.props.chunk,
        tokens = chunk[0] + chunk.slice(-1);
    return tokens == '<>';
  }

  isBuiltin() {
    let builtins = ['None', 'True', 'False', 'Infinity'];
    return builtins.indexOf(this.props.chunk) > -1;
  }

  isInteger() {
    return Number.isInteger(this.props.chunk);
  }

  isFloat() {
    return !isNaN(parseFloat(this.props.chunk));
  }

  setToIterable(output) {
    return output.slice(4, -1);
  }

  tupleToIterable(output) {
    return `[${output.slice(1, -1)}]`;
  }
}

export default Chunk;