/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Copyright 2016 Chuan Ji                                                   *
 *                                                                           *
 * Permission is hereby granted, free of charge, to any person obtaining a   *
 * copy of this software and associated documentation files (the             *
 * "Software"), to deal in the Software without restriction, including       *
 * without limitation the rights to use, copy, modify, merge, publish,       *
 * distribute, sublicense, and/or sell copies of the Software, and to permit *
 * persons to whom the Software is furnished to do so, subject to the        *
 * following conditions:                                                     *
 *                                                                           *
 * The above copyright notice and this permission notice shall be included   *
 * in all copies or substantial portions of the Software.                    *
 *                                                                           *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS   *
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF                *
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN *
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,  *
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR     *
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE *
 * USE OR OTHER DEALINGS IN THE SOFTWARE.                                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function isStorageTypeSupported(storageType) {
  return window[storageType] !== undefined;
}

function storageProxy(storageType, storageKey, defaultValue) {
  if (!isStorageTypeSupported(storageType)) {
    console.warn('Browser does not support %s', storageType);
    window[storageType] = {};
  }

  return {
    get(propertyName) {
      var key = storageKey === undefined ? propertyName : storageKey;
      if (!(key in window[storageType])) {
        window[storageType][key] = JSON.stringify(defaultValue);
      }
      if (window[storageType][key] === 'undefined') {
        return undefined;
      }
      return JSON.parse(window[storageType][key]);
    },
    set(propertyName, value) {
      var key = storageKey === undefined ? propertyName : storageKey;
      window[storageType][key] = JSON.stringify(value);
      return value;
    }
  };
}

export const isLocalStorageSupported =
  isStorageTypeSupported('localStorage');
export const localStorageProxy =
  storageProxy.bind(window, 'localStorage');

export const isSessionStorageSupported =
  isStorageTypeSupported('sessionStorage');
export const sessionStorageProxy =
  storageProxy.bind(window, 'sessionStorage');
