
export const environment = {
  production: false,
  api: {
    url: '134.91.18.133:8080',
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
          }
        }
      }
    },
    langid: {
      root: '/de.unidue.ltl.ctestbuilder.service.LangId/rest/',
      endpoints: {
        verify: { path: 'verify', queryParameters: false },
        service: { path: 'classifiy', queryParameters: false }
      }
    }
  }
};
