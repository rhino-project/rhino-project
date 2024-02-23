//Login Location History
export function setPrevPathSession(val) {
  _setStorageItem('prevPath', val);
}

export function getPrevPathSession() {
  return _getStorageItem('prevPath');
}

export function unsetPrevPathSession() {
  _unsetStorageItem('prevPath');
}

function _unsetStorageItem(id) {
  localStorage.removeItem(id);
}

//end of Login Location History

function _setStorageItem(id, val) {
  localStorage.setItem(id, val || '');
}

function _getStorageItem(id) {
  return localStorage.getItem(id);
}
