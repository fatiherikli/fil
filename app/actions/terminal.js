import * as Actions from 'constants/ActionTypes';

export function write(chunk) {
  if (chunk.charCodeAt() === 10) {
    return breakLine();
  }
  return { type: Actions.WRITE_TERMINAL, chunk };
}

export function breakLine() {
  return { type: Actions.BREAK_TERMINAL };
}

export function error(line) {
  return { type: Actions.ERROR_TERMINAL, line };
}

export function flush() {
  return { type: Actions.FLUSH_TERMINAL };
}
