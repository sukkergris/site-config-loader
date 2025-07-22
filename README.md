
# site-config-loader

A minimal ESM module for loading environment-specific configuration in browser-based JavaScript apps. Supports meta tags (e.g. injected by Nginx) and JSON config files, with automatic environment detection.

## Motivation
Why this module exists: [The Red Pill of Software Delivery – Unmasking Magic Code and Building for Reality](https://dev.to/sukkergris/the-red-pill-of-software-delivery-unmasking-magic-code-and-building-for-reality-1ng9)

## Features
- Loads base and environment-specific config from `/config/environmentVariables*.json`
- Detects environment from `<meta name="environment-name">` or hostname
- Merges configs, with environment-specific values taking precedence
- Exposes `loadEnvironmentVariables()` (async) and `getEnvironmentFromMetaTag()`
- ESM-only, browser-first, no dependencies

## Usage

### 1. Place your config files
- `/config/environmentVariables.json` (base config – this is where your production config lives – always loaded)
- `/config/environmentVariables.development.json` (optional, for specific env – overwrites base config)
- `/config/environmentVariables.staging.json`, etc.

### 2. Inject meta tag (optional, recommended for Nginx)
```html
<meta name="environment-name" content="development">
```

### 3. Import and use in your app (ESM-only)
```js
// ESM import (recommended, works with Node, Vite, modern bundlers)
import { loadEnvironmentVariables } from 'site-config-loader';

const config = await loadEnvironmentVariables();
console.log(config);
```

> If you are not using a package manager, you can also import directly from the file:
> ```js
> import { loadEnvironmentVariables } from './modules/siteEnvironmentLoader.module.js';
> ```

### 4. ⚠️ Important: Fallback Behavior
**Falls back to `production`!**

- If the meta tag isn't set, or if you add a `/config/environmentVariables.production.json` file, only the base `/config/environmentVariables.json` is loaded.
- No environment-specific config is loaded for production—this is by design for safety and simplicity.

## API

### `async loadEnvironmentVariables()`
Loads and merges config files, returns an object with all config and these extra fields:
- `environment`: detected environment name
- `isDevelopment`: true if not production

### `getEnvironmentFromMetaTag()`
Returns the environment name from the meta tag, or null if not present.

## Environment Detection
- Uses meta tag if present
- Falls back to hostname:
  - `localhost`/`127.0.0.1` → `local`
  - `dev.`/`-dev.` → `development`
  - `test.`/`-test.` → `testing`
  - `staging.`/`-staging.` → `staging`
  - otherwise → `production` ← **# READ THIS #**

## Testing
- Use [Vitest](https://vitest.dev/) with `jsdom` for DOM-based tests

## License
This project is dedicated to the public domain via the [Unlicense](../UNLICENSE). You may use it for any purpose, without restriction.
