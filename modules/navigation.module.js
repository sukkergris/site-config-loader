// wwwroot/modules/navigation.module.js

/**
 * Sets the browser's current URL.
 * Abstracted for easier mocking in tests.
 * @param {string} href The new URL to navigate to.
 */
export function setLocationHref(href) {
  window.location.href = href;
}

// You might also add other navigation-related functions here if needed
export function reloadPage() {
  window.location.reload();
}

export function getCurrentHostname() {
  console.log('Getting current hostname in module', window.location.hostname);
  return window.location.hostname;
}
