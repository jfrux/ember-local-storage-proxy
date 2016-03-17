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

- `localStorageProperty(name, defaultValue)`, `sessionStorageProperty(name,
  defaultValue)`: Returns an Ember computed property that is synced with a
  key-value pair in local / session storage.

In any Ember object (e.g., service, component, controller, or route), use
`localStorageProperty` or `sessionStorageProperty` to define a synced property
like this:

```javascript
// services/settings.js

import Ember from 'ember';
import {
  localStorageProperty,
  sessionStorageProperty
} from 'ember-local-storage-proxy';

export default Ember.Service.extend({
  enableFoo: Ember.computed(localStorageProperty('enableFoo', false)),
  userId: Ember.computed(sessionStorageProperty('userId')),
  
  toggleFoo() {
    // This will read and write window.localStorage.enableFoo transparently.
    this.set('enableFoo', !this.get('enableFoo'));
  },

  // This will be fired when enableFoo is updated, as expected.
  onFooChanged: Ember.observer('enableFoo', function() {
    console.log(
      'Foo is now %s',
      this.get('enableFoo') ? 'enabled' : 'disabled');
  })
});
```
To use the synced property in, e.g., a component:
```javascript
// components/my-component/component.js
import Ember from 'ember';
export default Ember.Component.extend({
  settings: Ember.inject.service(),
  // You can also define an alias:
  enableFoo: Ember.computed.alias('settings.enableFoo')
});
```
```handlebars
<!-- components/my-component/template.hbs -->
{{#if enableFoo}}...{{/if}}
```
Note, however, that Ember cannot detect direct changes to the underlying local /
session storage value. In other words, if your code directly sets
`window.localStorage.enableFoo = true` instead of using `set('enableFoo',
true)`, a subsequent `get('enableFoo')` will still return the old value `false`,
and any observers will fail to fire.  As a result, you should always access or
update the value through the synced property defined via `localStorageProperty`
and `sessionStorageProperty`.

## Encoding / Decoding

Properties defined using `localStorageProperty` / `sessionStorageProperty`
serialize all values to strings via
[`JSON.Stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
for storage. When reading back, they are deserialized via
[`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).

For builtin data types, including arrays and plain objects, the encoding and
decoding should work transparently.

For custom data types, you would need to first serialize the values to strings
or JSON objects before storing them in a synced property.

## Compatibility

Although [browser support for HTML5 local
storage](http://caniuse.com/#feat=namevalue-storage) is pretty much universal at
this point, `ember-local-storage-proxy` will stub out `window.localStorage` and
`window.sessionStorage` with an empty object in the rare case that they're not
supported. In such cases, all the computed properties defined with
`localStorageProperty` / `sessionStorageProperty` can be read from and written
to as normal, except that the values will not be persisted.
