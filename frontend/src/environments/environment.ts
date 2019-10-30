import { HttpHeaders } from "../../node_modules/@angular/common/http";
import * as Color from 'color';
const colormap = require('colormap');
const colorInterpolate = require('color-interpolate');


// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const colors = {
  easy: 'rgb(0, 172, 51)',
  mediumEasy: 'rgb(154, 184, 163)',
  medium: 'rgb(172, 172, 172)',
  mediumHard: 'rgb(209, 140, 157)',
  hard: 'rgb(255, 0, 51)',
};

const palette: string[] = [
  colors.easy,
  colors.mediumEasy,
  colors.medium,
  colors.mediumHard,
  colors.hard
];

/**
 * Turns given color string into an RGBa color string with given alpha.
 */
const transparent = (color: string, alpha = 0.14) => Color(color).alpha(alpha).string();

const mapToColor: (x: number, opaque?: boolean) => string = (x: number, opaque = true) => {
  const index = Math.min(Math.floor(x * palette.length), palette.length - 1);
  const color = palette[index];
  return opaque ? color : transparent(color);
};

export const environment = {
  colors: {
    transparent,
    difficulty: {
      colors: {
        normal: colors,
      },
      map: mapToColor,
      palette: {
        normal: palette,
        transparent: palette.map(color => transparent(color))
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
