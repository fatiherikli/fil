import * as Actions from 'constants/ActionTypes';

export function setPreference(key, value) {
  return { type: Actions.SET_PREFERENCE, key, value };
}
