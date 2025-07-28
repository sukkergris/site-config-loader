// test/mswHandlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Handler for /clientconfig.json
  http.get('/config/clientconfig.json', () => {
    return HttpResponse.json({
      apiUrl: 'https://api.mocked-client.com',
      featureToggles: {
        newDashboard: true,
        experimentalSearch: false
      },
      logLevel: 'debug'
    }, { status: 200 }); // Explicitly set status 200
  }),

  // Handler for a different config name, e.g., /anotherconfig.json
  http.get('/config/anotherconfig.json', () => {
    return HttpResponse.json({
      theme: 'dark',
      widgetsEnabled: true
    }, { status: 200 });
  }),

  // Generic handler for any .json file that isn't specifically mocked
  // This helps ensure unmocked files don't accidentally succeed.
  http.get('/*.json', ({ request }) => {
    const url = new URL(request.url);
    console.warn(`MSW: Unhandled JSON request for ${url.pathname}`);
    return new HttpResponse(null, { status: 404, statusText: 'Not Found by MSW' });
  })
];