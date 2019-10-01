import { HttpHeaders } from "../../node_modules/@angular/common/http";
const colormap = require('colormap');

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  colors: {
    difficulty: {
      normal: colormap({ colormap: 'RdBu', nshades: 100, format: 'rgbaString', alpha: 1 }) as string[],
      transparent: colormap({ colormap: 'RdBu', nshades: 100, format: 'rgbaString', alpha: 0.14 }) as string[]
    }
  },
  production: false,
  api: {
    url: 'http://localhost:8080',
    services: {
      gapscheme: {
        root: 'de.unidue.ltl.ctestbuilder.service.GapScheme/rest',
        endpoints: {
          verify: {
            path: 'verify',
            queryParameters: false,
            headers: {
              'Content-Type': 'text/plain'
            }
          },
          service: {
            path: 'gapify',
            queryParameters: { language: 'language' },
            headers: {
              'Content-Type': 'text/plain'
            }
          },
          partial: {
            path: 'gapify-partial',
            queryParameters: { language: 'language' },
            headers: {
              'Content-Type': 'text/plain'
            }
          },
          updateGaps: {
            path: 'update-gaps',
            queryParameters: { gapFirst: 'gapfirst' },
            options : {
              headers: {
                'Content-Type' : 'application/json'
              }
            }
          },
          fromJACK: {
            path: 'fromJACK',
            queryParameters: false,
            options : {
              headers: {
                'Content-Type' : 'text/plain',
              }
            }
          }
        },
      },
      langid: {
        root: 'de.unidue.ltl.ctestbuilder.service.LangId/rest',
        endpoints: {
          verify: { path: 'verify', queryParameters: false },
          service: {
            path: 'classify',
            queryParameters: false,
            options : {
              headers: { 'Content-Type' : 'text/plain' },
              responseType: 'text'
            }
          }
        }
      },
      difficulty: {
        root: 'difficulty/rest/',
        endpoints: {
          verify: { path: 'verify', queryParameters: false },
          service: {
            path: 'estimate',
            queryParameters: false,
            options : {
              headers: { 'Content-Type' : 'application/json' },
              responseType: 'text'
            }
          }
        }
      }
    }
  }
};
