// @vitest-environment jsdom
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { getEnvironmentFromMetaTag, loadEnvironmentVariables } from '../modules/siteEnvironmentLoader.module.js';
import { handlers } from './mswHandlers.js'; // Your MSW handlers

// 1. Set up the MSW server
const server = setupServer(...handlers);


describe('siteEnvironmentLoader.module.js', () => {
  // Test for getEnvironmentFromMetaTag (unchanged, just here for context)
  describe('getEnvironmentFromMetaTag', () => {
    beforeEach(() => {
      document.head.innerHTML = ''; // Clear document head before each test
    });

    it('returns the environment from the meta tag', () => {
      const meta = document.createElement('meta');
      meta.name = 'environment-name';
      meta.content = 'testing';
      document.head.appendChild(meta);

      expect(getEnvironmentFromMetaTag()).toBe('testing');
    });

    it('returns null if meta tag is missing', () => {
      expect(getEnvironmentFromMetaTag()).toBeNull();
    });
  });

  // Tests for loadEnvironmentVariables with MSW mocking
  describe('loadEnvironmentVariables', () => {
    // Start MSW server before all tests in this describe block
    beforeAll(() => server.listen());

    // Reset handlers after each test to ensure test isolation
    // This is crucial if you modify handlers dynamically in tests (e.g., for error states)
    afterEach(() => server.resetHandlers());

    // Close MSW server after all tests in this describe block
    afterAll(() => server.close());

    it('should load JSON configuration for "clientconfig"', async () => {
      const config = await loadEnvironmentVariables('clientconfig');

      expect(config).toBeDefined();
      expect(config).not.toBeNull();
      expect(config.apiUrl).toBe('https://api.mocked-client.com');
      expect(config.featureToggles.newDashboard).toBe(true);
      expect(config.logLevel).toBe('debug');
    });

    it('should return null if the configuration file is not found (404)', async () => {
      // Override the handler for /clientconfig.json specifically for this test
      // to simulate a 404 response.
      server.use(
        http.get('/config/clientconfig.json', () => {
          return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
        })
      );

      const config = await loadEnvironmentVariables('config','clientconfig');
      expect(config).toBeDefined();
      expect(config.__baseLoaderMsg).toBeDefined();
      expect(config.__baseLoaderMsg.error).toBeDefined();
      expect(config.__loadingDetails).toBeDefined();
      expect(config.__loadingDetails.environment).toBeDefined();
      expect(config.__loadingDetails.environment).toBe('local');
    });

    it('should return null on network errors (e.g., fetch throws)', async () => {
      // Override the handler to simulate a network error (e.g., DNS error, no connection)
      server.use(
        http.get('/config/clientconfig.json', () => {
          // MSW's passthrough() will cause the original fetch to fail if no real server
          // responds, or you can simulate by explicitly throwing if your MSW version supports it,
          // or by returning an empty response with no content and a bad status.
          // For a true network error, you might need to mock `fetch` directly or use MSW's
          // error utilities if available for your version.
          // A common way is to make `HttpResponse` behave like a broken network:
          throw new Error('Simulated network error');
        })
      );

      const config = await loadEnvironmentVariables('config','clientconfig');
      expect(config.__baseLoaderMsg.error).toBeDefined();
    });


    it('should load different JSON configuration if requested by name', async () => {
      const config = await loadEnvironmentVariables('config','anotherconfig');

      expect(config).toBeDefined();
      expect(config).not.toBeNull();
      expect(config.theme).toBe('dark');
      expect(config.widgetsEnabled).toBe(true);
      expect(config).not.toHaveProperty('apiUrl'); // Ensure it's the correct config
    });
  });
});

describe('getEnvironmentFromMetaTag', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('returns the environment from the meta tag', () => {
    const meta = document.createElement('meta');
    meta.name = 'environment-name';
    meta.content = 'testing';
    document.head.appendChild(meta);

    expect(getEnvironmentFromMetaTag()).toBe('testing');
  });

  it('returns null if meta tag is missing', () => {
    expect(getEnvironmentFromMetaTag()).toBeNull();
  });

});