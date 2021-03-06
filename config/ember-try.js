'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = async function () {
  return {
    scenarios: [{
        name: 'ember-lts-3.12',
        npm: {
          devDependencies: {
            'ember-source': '~3.12.0'
          }
        }
      },
      {
        name: 'ember-lts-3.16',
        npm: {
          devDependencies: {
            'ember-source': '~3.16.0'
          }
        }
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release')
          }
        }
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta')
          }
        }
      },
      {
        name: 'ember-release',
        bower: {
          dependencies: {
            'ember': 'components/ember#release'
          },
          resolutions: {
            'ember': 'release'
          }
        }
      },
      {
        name: 'ember-beta',
        bower: {
          dependencies: {
            'ember': 'components/ember#beta'
          },
          resolutions: {
            'ember': 'beta'
          }
        }
      },
      {
        name: 'ember-canary',
        bower: {
          dependencies: {
            'ember': 'components/ember#canary'
          },
          resolutions: {
            'ember': 'canary'
          }
        }
      },
      {
        name: 'ember-classic',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'application-template-wrapper': true,
            'default-async-observers': false,
            'template-only-glimmer-components': false
          })
        },
        npm: {
          ember: {
            edition: 'classic'
          }
        }
      }
    ]
  }
};
