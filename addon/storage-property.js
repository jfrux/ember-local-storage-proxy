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

function supportsStorageType(storageType) {
  return window[storageType] !== undefined;
}

function storageProperty(storageType, propertyName, defaultValue) {
  if (!supportsStorageType(storageType)) {
    console.warn('Browser does not support %s', storageType);
    window[storageType] = {};
  }

  return {
    get() {
      if (window[storageType][propertyName] === undefined) {
        window[storageType][propertyName] = JSON.stringify(defaultValue);
      }
      return JSON.parse(window[storageType][propertyName]);
    },
    set(key, value) {
      window[storageType][propertyName] = JSON.stringify(value);
      return value;
    }
  };
}

export const supportsLocalStorage = supportsStorageType('localStorage');
export const localStorageProperty =
  storageProperty.bind(window, 'localStorage');
export const supportsSessionStorage = supportsStorageType('sessionStorage');
export const sessionStorageProperty =
  storageProperty.bind(window, 'sessionStorage');
