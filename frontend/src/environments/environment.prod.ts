
export const environment = {
  production: false,
  api: {
    url: 'http://134.91.18.133:8080',
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
          }
        }
      }
    },
    langid: {
      root: '/langid/rest/',
      endpoints: {
        verify: { path: 'verify', queryParameters: false },
        service: { path: 'classifiy', queryParameters: false }
      }
    }
  }
};
