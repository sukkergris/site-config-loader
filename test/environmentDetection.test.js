// test/environmentDetection.test.js
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCurrentHostname } from '../modules/navigation.module.js'; // SUT dependency
import { detectEnvironmentFromHostname } from '../modules/siteEnvironmentLoader.module.js';

// Mock the 'navigation.module.js' to control getCurrentHostname
vi.mock('../modules/navigation.module.js', () => ({
  getCurrentHostname: vi.fn(), // Initialize as a mock function
}));

describe('Environment Detection', () => {
  let consoleWarnSpy, consoleLogSpy;

  beforeEach(() => {
    // Clear document.head content for each test to ensure no meta tags interfere
    document.head.innerHTML = '';
    // Clear and spy on console methods
    vi.clearAllMocks(); // Resets getCurrentHostname mock
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restores original console and getCurrentHostname
  });

  describe('detectEnvironmentFromHostname', () => {
    it('should return "local" for localhost', () => {
      getCurrentHostname.mockReturnValue('localhost');
      const env = detectEnvironmentFromHostname();
      expect(env).toBe('local');
      expect(getCurrentHostname).toHaveBeenCalledOnce();
      expect(consoleWarnSpy).toHaveBeenCalledWith('No environment meta tag found, falling back to hostname detection');
      expect(consoleLogSpy).toHaveBeenCalledWith('Detected hostname: localhost');
    });

    it('should return "local" for 127.0.0.1', () => {
      getCurrentHostname.mockReturnValue('127.0.0.1');
      const env = detectEnvironmentFromHostname();
      expect(env).toBe('local');
      expect(getCurrentHostname).toHaveBeenCalledOnce();
      expect(consoleWarnSpy).toHaveBeenCalledWith('No environment meta tag found, falling back to hostname detection');
      expect(consoleLogSpy).toHaveBeenCalledWith('Detected hostname: 127.0.0.1');
    });

    it('should return "development" for "dev.myapp.com"', () => {
      getCurrentHostname.mockReturnValue('dev.myapp.com');
      const env = detectEnvironmentFromHostname();
      expect(env).toBe('development');
      expect(getCurrentHostname).toHaveBeenCalledOnce();
      expect(consoleWarnSpy).toHaveBeenCalledWith('No environment meta tag found, falling back to hostname detection');
      expect(consoleLogSpy).toHaveBeenCalledWith('Detected hostname: dev.myapp.com');
    });

    it('should return "development" for "feature-dev.some.domain"', () => {
      getCurrentHostname.mockReturnValue('feature-dev.some.domain');
      const env = detectEnvironmentFromHostname();
      expect(env).toBe('development');
      expect(getCurrentHostname).toHaveBeenCalledOnce();
      expect(consoleWarnSpy).toHaveBeenCalledWith('No environment meta tag found, falling back to hostname detection');
      expect(consoleLogSpy).toHaveBeenCalledWith('Detected hostname: feature-dev.some.domain');
    });

    it('should return "testing" for "test.your-app.com"', () => {
      getCurrentHostname.mockReturnValue('test.your-app.com');
      const env = detectEnvironmentFromHostname();
      expect(env).toBe('testing');
      expect(getCurrentHostname).toHaveBeenCalledOnce();
      expect(consoleWarnSpy).toHaveBeenCalledWith('No environment meta tag found, falling back to hostname detection');
      expect(consoleLogSpy).toHaveBeenCalledWith('Detected hostname: test.your-app.com');
    });

    it('should return "testing" for "www.test.nu"', () => {
      getCurrentHostname.mockReturnValue('www.test.nu');
      const env = detectEnvironmentFromHostname();
      expect(env).toBe('testing');
      expect(getCurrentHostname).toHaveBeenCalledOnce();
      expect(consoleWarnSpy).toHaveBeenCalledWith('No environment meta tag found, falling back to hostname detection');
      expect(consoleLogSpy).toHaveBeenCalledWith('Detected hostname: www.test.nu');
    });

    it('should return "staging" for "staging.another.app"', () => {
      getCurrentHostname.mockReturnValue('staging.another.app');
      const env = detectEnvironmentFromHostname();
      expect(env).toBe('staging');
      expect(getCurrentHostname).toHaveBeenCalledOnce();
      expect(consoleWarnSpy).toHaveBeenCalledWith('No environment meta tag found, falling back to hostname detection');
      expect(consoleLogSpy).toHaveBeenCalledWith('Detected hostname: staging.another.app');
    });

    it('should return "production" for unknown hostnames', () => {
      getCurrentHostname.mockReturnValue('prod.mycompany.com'); // Doesn't match any specific pattern
      let env = detectEnvironmentFromHostname();
      expect(env).toBe('production');
      expect(getCurrentHostname).toHaveBeenCalledOnce();
      expect(consoleWarnSpy).toHaveBeenCalledWith('No environment meta tag found, falling back to hostname detection');
      expect(consoleLogSpy).toHaveBeenCalledWith('Detected hostname: prod.mycompany.com');

      // Test another generic hostname
      getCurrentHostname.mockClear(); // Clear mock history for the next call
      consoleWarnSpy.mockClear();
      consoleLogSpy.mockClear();
      getCurrentHostname.mockReturnValue('some-other-domain.io');
      env = detectEnvironmentFromHostname();
      expect(env).toBe('production');
      expect(getCurrentHostname).toHaveBeenCalledOnce();
      expect(consoleWarnSpy).toHaveBeenCalledWith('No environment meta tag found, falling back to hostname detection');
      expect(consoleLogSpy).toHaveBeenCalledWith('Detected hostname: some-other-domain.io');
    });
  });
});