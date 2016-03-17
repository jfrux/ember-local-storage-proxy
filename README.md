# ember-local-storage-proxy

**ember-local-storage-proxy** is a library for wrapping HTML5 local storage or
session storage values as Ember properties. It is available as an Ember CLI
addon.

## Installation

```
ember install ember-local-storage-proxy
```

## Usage

The `ember-local-storage-proxy` module exports the following:

- `isLocalStorageSupported`, `isSessionStorageSupported`: Boolean consts that
  represent whether the current browser supports each type of storage.

- `localStorageProxy(key, defaultValue)`, `sessionStorageProxy(key,
  defaultValue)`: Returns an Ember computed property that is synced with
  `window.localStorage[key]` or `window.sessionStorage[key]`.
  * If not specified, `key` defaults to the name of the property it is assigned
    to.
  * If not specified, the default value will be `undefined`.

In any Ember object (e.g., service, component, controller, or route), use
`localStorageProxy` or `sessionStorageProxy` to define a proxy property
like this:

```javascript
// services/settings.js

import Ember from 'ember';
import { localStorageProxy, sessionStorageProxy }
  from 'ember-local-storage-proxy';

export default Ember.Service.extend({
  // Define a property synced with window.localStorage['settings/enableFoo'],
  // with a default value of false.
  enableFoo: Ember.computed(localStorageProxy('settings/enableFoo', false)),

  // Define a property synced with window.sessionStorage['userId'], with a default
  // value of undefined.
  userId: Ember.computed(sessionStorageProxy()),
  
  toggleFoo() {
    // This will read and write window.localStorage['settings/enableFoo']
    // transparently.
    this.set('enableFoo', !this.get('enableFoo'));
  },

  // This will be fired when enableFoo is updated, as usual.
  onFooChanged: Ember.observer('enableFoo', function() {
    console.log('Foo is %s', this.get('enableFoo') ? 'on' : 'off');
  })
});
```
To use a proxy property elsewhere, e.g., in a component:
```javascript
// components/my-component/component.js
import Ember from 'ember';
export default Ember.Component.extend({
  settings: Ember.inject.service(),
  // Optionally define an alias for ease of use.
  enableFoo: Ember.computed.alias('settings.enableFoo')
});
```
In its template:
```handlebars
<!-- components/my-component/template.hbs -->
{{#if enableFoo}}...{{/if}}
```
Note, however, that Ember cannot detect direct changes to the underlying local /
session storage value. In other words, if your code directly sets
`window.localStorage['prefs/enableFoo'] = true` instead of using
`set('enableFoo', true)`, a subsequent `get('enableFoo')` will still return the
previous value `false`, and any observers will fail to fire.  As a result, you
should always access or update the value through the proxy property defined via
`localStorageProxy` and `sessionStorageProxy`.

## Encoding / Decoding

Properties defined using `localStorageProxy` / `sessionStorageProxy`
serialize all values to strings via
[`JSON.Stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
for storage. When read back, they are deserialized via
[`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).

For builtin data types, including arrays and plain objects, the encoding and
decoding should work transparently.

For custom data types, you would need to first serialize the values to strings
or JSON objects before storing them in a proxy property.

## Compatibility

Although [browser support for HTML5 local
storage](http://caniuse.com/#feat=namevalue-storage) is pretty much universal at
this point, `ember-local-storage-proxy` will stub out `window.localStorage` and
`window.sessionStorage` with an empty object in the rare case that they're not
supported. In such cases, all the computed properties defined with
`localStorageProxy` / `sessionStorageProxy` can be read from and written
to as normal, except that the values will not be persisted.
