/**
 * Sets the browser's current URL.
 * Abstracted for easier mocking in tests.
 * @param {string} href The new URL to navigate to.
 */
export declare function setLocationHref(href: string): void;
export declare function reloadPage(): void;
export declare function getCurrentHostname(): string;
