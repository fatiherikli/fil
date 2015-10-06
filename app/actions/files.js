import * as Actions from 'constants/ActionTypes';

export function saveFile(path, text) {
  return { type: Actions.SAVE_FILE, path, text };
}

export function createFile(path, text = '') {
  return { type: Actions.CREATE_FILE, path, text };
}

export function deleteFile(path) {
  return { type: Actions.DELETE_FILE, path };
}

export function renameFile(path, newPath) {
  return { type: Actions.RENAME_FILE, path, newPath };
}

export function openFile(path, text) {
  return { type: Actions.OPEN_FILE, path };
}
