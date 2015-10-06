import _ from "underscore";

import * as Actions from 'constants/ActionTypes';

const initialState = {
  liveCoding: true
};

export function preferences(state = initialState, action) {
  switch (action.type) {
    case Actions.SET_PREFERENCE:
      return _.assign({}, state, {
        [action.key]: action.value
      });

    default:
      return state;
  }
}