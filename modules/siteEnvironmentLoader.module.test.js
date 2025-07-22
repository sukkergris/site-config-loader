// @vitest-environment jsdom
import { getEnvironmentFromMetaTag } from './siteEnvironmentLoader.module.js';

// Vitest provides a DOM via jsdom by default
import { beforeEach, describe, expect, it } from 'vitest';

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