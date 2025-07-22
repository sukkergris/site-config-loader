import { getCurrentHostname } from '/modules/navigation.module.js';

/**
 * Simple environment variables loader that works with Nginx-injected configuration
 * Loads base and environment-specific configuration from JSON files
 */

/**
 * Load environment variables from Nginx-injected meta tag and JSON files
 * @returns {Promise<Object>} Environment configuration object
 */
async function loadEnvironmentVariables() {
  // Use fixed configuration paths
  const baseName = 'environmentVariables';
  const configPath = '/config';

  // 1. Detect environment from Nginx-injected meta tag
  const envName =
    getEnvironmentFromMetaTag() || detectEnvironmentFromHostname();

  // 2. Load the base configuration file
  const baseConfig = await loadBaseConfig(configPath, baseName);

  // 3. Load the environment-specific configuration file
  const envConfig = await loadEnvConfig(configPath, baseName, envName);

  // 4. Merge configurations with environment-specific values taking precedence
  const mergedConfig = { ...baseConfig, ...envConfig };

  // 5. Add environment information to the configuration
  mergedConfig.environment = envName;
  mergedConfig.isDevelopment = envName !== 'production';

  return mergedConfig;
  /**
   * Load the base configuration file
   * @param {string} configPath
   * @param {string} baseName
   * @returns {Promise<Object>}
   */
  async function loadBaseConfig(configPath, baseName) {
    try {
      const baseResponse = await fetch(`${configPath}/${baseName}.json`);
      if (baseResponse.ok) {
        const baseConfig = await baseResponse.json();
        // console.log(
        //   `Loaded base configuration from ${configPath}/${baseName}.json`
        // );
        return baseConfig;
      } else {
        console.warn(
          `Base configuration file not found or couldn't be loaded`,
          baseConfig
        );
        return {};
      }
    } catch (error) {
      console.error(`Error loading base configuration: ${error.message}`);
      return {};
    }
  }

  /**
   * Load the environment-specific configuration file
   * @param {string} configPath
   * @param {string} baseName
   * @param {string} envName
   * @returns {Promise<Object>}
   */
  async function loadEnvConfig(configPath, baseName, envName) {
    try {
      console.log(`Loading environment-specific configuration for ${envName}`);
      const envFilename = `${configPath}/${baseName}.${envName}.json`;
      if (!envName | (envName === 'production')) {
        // For production, we use the base config only
        // console.log(
        //   'Using base configuration for Production environment',
        //   envName
        // );
        return {};
      }
      // console.log(`Fetching ${envFilename}`);
      const envResponse = await fetch(envFilename);
      // console.log(`Response fetching:`, envResponse);
      // If the environment-specific file exists, load it
      if (envResponse.ok) {
        const envConfig = await envResponse.json();
        console.log(`Loaded environment configuration from ${envFilename}`);
        return envConfig;
      } else {
        console.log(
          `No specific configuration found for environment "${envName}"`
        );
        return {};
      }
    } catch (error) {
      console.warn(
        `Could not load environment-specific config: ${error.message}`
      );
      return {};
    }
  }
}

/**
 * Get environment name from meta tag (injected by Nginx)
 * @returns {string|null} Environment name or null
 */
function getEnvironmentFromMetaTag() {
  const metaTag = document.querySelector('meta[name="environment-name"]');
  return metaTag ? metaTag.getAttribute('content') : null;
}

/**
 * Detect environment from hostname as fallback
 * @returns {string} Detected environment name
 */
function detectEnvironmentFromHostname() {
  console.warn(
    'No environment meta tag found, falling back to hostname detection'
  );
  const hostname = getCurrentHostname();
  console.log(`Detected hostname: ${hostname}`);
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'local';
  }
  if (hostname.includes('dev.') || hostname.includes('-dev.')) {
    return 'development';
  }
  if (hostname.includes('test.') || hostname.includes('-test.')) {
    return 'testing';
  }
  if (hostname.includes('staging.') || hostname.includes('-staging.')) {
    return 'staging';
  }
  return 'production';
}

export { getEnvironmentFromMetaTag, loadEnvironmentVariables };
