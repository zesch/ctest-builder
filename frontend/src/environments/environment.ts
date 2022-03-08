import * as Color from 'color';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const pinks = {
  easy: '#fff0f5',
  mediumEasy: '#f0b9cf',
  medium: '#f23f87',
  mediumHard: '#ab0547',
  hard: '#590024',
  invalid: 'rgba(63,81,181,0.87)'
};

const traffic = {
  easy: '#02cc34',
  mediumEasy: '#9dd102',
  medium: '#f2ce02',
  mediumHard: '#ff9a03',
  hard: '#de0202',
  invalid: 'rgba(63,81,181,0.87)'
};

const scheme = traffic;

const palette: string[] = [
  scheme.easy,
  scheme.mediumEasy,
  scheme.medium,
  scheme.mediumHard,
  scheme.hard
];

/**
 * Turns given color string into an RGBa color string with given alpha.
 */
const transparent = (color: string, alpha = 0.14) => Color(color).alpha(alpha).string();

const mapToColor: (x: number, opaque?: boolean) => string = (x: number, opaque = true) => {
  if (x < 0 || x > 1) {
    return pinks.invalid;
  }
  const index = Math.min(Math.floor(x * palette.length), palette.length - 1);
  const color = palette[index];
  return opaque ? color : transparent(color);
};

export const environment = {
  colors: {
    transparent,
    difficulty: {
      colors: {
        normal: scheme,
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
        root: 'de.unidue.ltl.ctestbuilder.service.GapScheme/rest',
        endpoints: {
          verify: { path: 'verify', queryParameters: false },
          service: {
            path: 'rate-difficulty',
            queryParameters: { language: 'language' },
            options : {
              headers: { 'Content-Type' : 'application/json' }
            }
          }
        }
      }
    }
  }
};
