// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCurrentHostname, reloadPage, setLocationHref } from '../modules/navigation.module.js';

describe('navigation.module.js', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.restoreAllMocks();
  });

  it('setLocationHref sets window.location.href', () => {
    const href = 'https://example.com';
    const originalHref = window.location.href;
    Object.defineProperty(window, 'location', {
      value: { ...window.location, href: originalHref },
      writable: true,
    });
    setLocationHref(href);
    expect(window.location.href).toBe(href);
  });

  it('reloadPage calls window.location.reload', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload: reloadMock },
      writable: true,
    });
    reloadPage();
    expect(reloadMock).toHaveBeenCalled();
  });

  it('getCurrentHostname returns window.location.hostname', () => {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, hostname: 'myhost.test' },
      writable: true,
    });
    expect(getCurrentHostname()).toBe('myhost.test');
  });
});
