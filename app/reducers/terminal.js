import _ from "underscore";

import * as Actions from 'constants/ActionTypes';


const initialState = {
  lines: [],
  error: null
};

export function lines(state = [], action) {
  switch (action.type) {
    case Actions.WRITE:
      let head = state.slice(0, state.length - 1),
          tail = state[state.length - 1] || [];

      return [...head, [...tail, action.chunk]];

    case BREAK:
      return [...state, []];

    default:
      return state;
  }
}

export function terminal(state = initialState, action) {
  switch (action.type) {
  case Actions.WRITE:
  case Actions.BREAK:
    return _.assign({}, state, {
      lines: lines(state.lines, action)
    });

  case Actions.ERROR:
    return _.assign({}, state, {
      error: action.line
    });

  case Actions.FLUSH:
    return initialState;

  default:
    return state;
  }
};
