import _ from "underscore";

import {SAVE_FILE, CREATE_FILE, DELETE_FILE, 
        OPEN_FILE, RENAME_FILE} from 'actions/files';

const initialState = {
  'hello.py': require('examples/hello.py'),
  'hello.rb': require('examples/hello.rb'),
  'hello.js': require('examples/hello._js'),
  'hey.bf': require('examples/hey.bf'),
  'sum.hpc': require('examples/sum.hpc'),
};

export function files(state=initialState, action) {
  switch (action.type) {
  case SAVE_FILE:
    return _.assign({}, state, {
      [action.path]: action.text
    });

  case DELETE_FILE:
    return _.omit(state, action.path)

  case CREATE_FILE:
    return _.assign({}, state, {
      [action.path]: action.text
    });

  case RENAME_FILE:
    return _.assign(
      {}, 
      _.omit(state, action.path), 
      {[action.newPath]: state[action.path]}
    );
  
  default:
    return state;
  }
};

export function currentFile(state='hello.py', action) {
  switch (action.type) {
    case OPEN_FILE:
      return action.path;
    default:
      return state;
  }
}