import * as Color from 'color';

const colors = {
  easy: '#fff0f5',
  mediumEasy: '#f0b9cf',
  medium: '#f23f87',
  mediumHard: '#ab0547',
  hard: '#590024',
  invalid: 'rgba(63,81,181,0.66)'
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
  if (x < 0 || x > 1) {
    return colors.invalid;
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
    url: 'http://134.91.18.133:9001',
    services: {
      gapscheme: {
        root: 'gapscheme/rest',
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
                'Content-Type' : 'application/json',
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
        }
      },
      langid: {
        root: 'langid/rest',
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
