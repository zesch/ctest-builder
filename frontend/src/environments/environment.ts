import { HttpHeaders } from "../../node_modules/@angular/common/http";
import * as Color from 'color';
const colormap = require('colormap');
const colorInterpolate = require('color-interpolate');


// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const colors = {
  easy: 'rgb(0, 163, 51)',
  medium: 'rgb(169, 169, 169)',
  hard: 'rgb(255, 0, 0)',
};

const palette: (x: number) => string = colorInterpolate([colors.easy, colors.medium, colors.hard]);
const transparent = (color: string, alpha = 0.14) => Color(color).alpha(alpha).string();

export const environment = {
  colors: {
    transparent,
    difficulty: {
      colors: {
        normal: colors,
      },
      interpolated: {
        normal: palette,
        transparent: (x: number) => transparent(palette(x)),
      }
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
