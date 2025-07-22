// site-config-loader: ESM-based JSON config loader

/**
 * Loads a JSON config file from the given path.
 * @param {string} path - Path to the JSON config file.
 * @returns {Promise<any>} The parsed config object.
 */
export async function loadConfig(path) {
  const url = new URL(path, import.meta.url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
