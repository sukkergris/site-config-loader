/**
 * Simple environment variables loader that works with Nginx-injected configuration
 * Loads base and environment-specific configuration from JSON files
 */
/**
 * Load environment variables from Nginx-injected meta tag and JSON files
 * @param {string} [basePath] Base path of the configuration files
 * @param {string} [baseFileName] Base file name without extension
 * @returns {Promise<Record<string, any>>} Environment configuration object
 */
declare function loadEnvironmentVariables(basePath?: string, baseFileName?: string): Promise<Record<string, any>>;
/**
 * Get environment name from meta tag (injected by Nginx)
 * @returns {string|null} Environment name or null
 */
declare function getEnvironmentFromMetaTag(): string | null;
/**
 * Detect environment from hostname as fallback
 * @returns {string} Detected environment name
 */
declare function detectEnvironmentFromHostname(): string;
export { detectEnvironmentFromHostname, getEnvironmentFromMetaTag, loadEnvironmentVariables };
