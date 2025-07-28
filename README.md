
<h1 align="center">site-config-loader</h1>

<p align="center">
<em>A minimal ESM module for loading environment-specific configuration in browser-based JavaScript apps.</em><br>
Supports meta tags (e.g. injected by Nginx) and JSON config files, with automatic environment detection.
</p>

---

## 🚀 Features

- Loads base and environment-specific config from `/config/environmentVariables*.json`
- Detects environment from `<meta name="environment-name">` or hostname
- Merges configs, with environment-specific values taking precedence
- Exposes `loadEnvironmentVariables()` (async) and `getEnvironmentFromMetaTag()`
- ESM-only, browser-first, no dependencies

## 📖 Motivation

Why this module exists: [The Red Pill of Software Delivery – Unmasking Magic Code and Building for Reality](https://dev.to/sukkergris/the-red-pill-of-software-delivery-unmasking-magic-code-and-building-for-reality-1ng9)

---

## ⚡️ Usage

### 1. Place your config files

When using fallback config. Thats when your not giving any inputs to `loadEnvironmentVariables()`

- **Base config:** `/config/environmentVariables.json` (always loaded; used for production by default)
- **Environment-specific config:** `/config/environmentVariables.<environment>.json` (optional; e.g. `/config/environmentVariables.development.json`, `/config/environmentVariables.staging.json`)

#### File Naming Logic

- By default, the loader looks for files named `environmentVariables.json` and `environmentVariables.<env>.json` in the `/config` directory.
- You can specify a custom base filename by calling `loadEnvironmentVariables('myconfig')`, which will look for `/config/myconfig.json` and `/config/myconfig.<env>.json`.
- You can also specify both a custom directory and a custom base name: `loadEnvironmentVariables('my-custom-path', 'my-custom-base-name')` will look for `my-custom-path/my-custom-base-name.json` and `my-custom-path/my-custom-base-name.<env>.json`.
- If the environment is detected as `production` (either by meta tag or fallback), **only the base file** (e.g. `environmentVariables.json` or your custom base) is loaded—no environment-specific file is loaded for production. This is by design for safety and simplicity.

#### Fallback Behavior

- If the meta tag is missing or empty, the loader falls back to detecting the environment from the hostname (see below).
- If no environment-specific file exists for the detected environment, only the base config is loaded.

### 2. Inject meta tag (optional, recommended for Nginx)

```html
<meta name="environment-name" content="development">
```

### 3. Import and use in your app (ESM-only)

```js
// ESM import (recommended, works with Node, Vite, modern bundlers)
import { loadEnvironmentVariables } from 'site-config-loader';

// Default usage (uses /config/environmentVariables*.json)
const config = await loadEnvironmentVariables();
console.log(config);

// Custom path and base name usage:
// This will load from /my-custom-path/my-custom-base-name.json and /my-custom-path/my-custom-base-name.<env>.json
const customConfig = await loadEnvironmentVariables('my-custom-path', 'my-custom-base-name');
console.log(customConfig);
```

> If you are not using a package manager, you can also import directly from the file:
>
> ```js
> import { loadEnvironmentVariables } from './modules/siteEnvironmentLoader.module.js';
> ```

### 4. ⚠️ File Naming & Fallback Summary

- **Base config is always loaded.**
- **Environment-specific config is loaded if:**
  - The environment is not `production`.
  - The corresponding file exists (e.g. `/config/environmentVariables.development.json`).
- **For production:** Only the base config is loaded, even if a `/config/environmentVariables.production.json` file exists.
- **Custom base filename:** Pass a string to `loadEnvironmentVariables('myconfig')` to use `/config/myconfig.json` and `/config/myconfig.<env>.json`.
- **Custom path and base name:** Pass two strings to `loadEnvironmentVariables('my-custom-path', 'my-custom-base-name')` to use `my-custom-path/my-custom-base-name.json` and `my-custom-path/my-custom-base-name.<env>.json`.

---

---

## 🧩 API

### `async loadEnvironmentVariables()`

Loads and merges config files, returns an object with all config and these extra fields:

- `environment`: detected environment name
- `isDevelopment`: true if not production

### `getEnvironmentFromMetaTag()`

Returns the environment name from the meta tag, or `null` if not present.

---

## 🌍 Environment Detection

- Uses meta tag if present
- Falls back to hostname:
  - `localhost`/`127.0.0.1` → `local`
  - `dev.`/`-dev.` → `development`
  - `test.`/`-test.` → `testing`
  - `staging.`/`-staging.` → `staging`
  - otherwise → `production` ← **# READ THIS #**

---

## 🧪 Testing

- Use [Vitest](https://vitest.dev/) with `jsdom` for DOM-based tests

---

### 💡 Cache Busting with Custom Naming

Using a custom base name for your config files is a simple way to implement cache busting for environment variables in production. For example, you can deploy `/config/environmentVariables.20250728.json` and reference it with `loadEnvironmentVariables('environmentVariables.20250728')`. This ensures clients always fetch the latest config file after a deployment, avoiding stale config due to browser or CDN caching.

**Reminder:**
If you are serving config files via Nginx (or similar), make sure your cache headers are set appropriately. For example:

```nginx
location ^~/config/ {
    root /usr/share/nginx/html;
    try_files $uri =404;
    expires 1m;
    add_header Cache-Control "public";
}
```

This sets a short cache duration (1 minute) and ensures config files are publicly cacheable. Adjust the `expires` value to fit your deployment and cache busting strategy.

---

## 🪪 License

This project is dedicated to the public domain via the [Unlicense](../UNLICENSE). You may use it for any purpose, without restriction.
