# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.0.0

### Breaking Changes

- **Removed `EventHandlerPlugin`** — The deprecated SNS-based event handler has been completely removed. Use `WebhookEventHandlerPlugin` instead.
- **Upgraded `@hapi/hapi` to v21 and `@hapi/boom` to v10** — Consumers using these as peer dependencies will need to upgrade.
- **Replaced `@hapi/joi` with standalone `joi` package** — The `@hapi/joi` scoped package has been replaced by `joi` (^17.13.3). Consumers relying on `@hapi/joi` as a transitive dependency should switch to `joi`.

### Changed

- Debug logging in `Client` now uses `console.debug()` with a simpler format (`[Request] METHOD URL` / `[Response] STATUS METHOD URL`) instead of `axios-logger`.
- Route config merging in `WebhookEventHandlerPlugin` uses object spread instead of `@hapi/hoek`'s `applyToDefaults()`.

### Removed

- `sns-validator`, `@hapi/wreck`, `@hapi/hoek`, `axios-logger`, and `uri-tag` dependencies.

## [2.2.0]

### Added

- `WebhookEventHandlerPlugin` for HMAC-based webhook handling.
- `verifyHMac` utility export.
- New notification type schemas.

### Changed

- Reduced and updated dependencies.

### Deprecated

- `EventHandlerPlugin` (SNS-based) in favor of `WebhookEventHandlerPlugin`.

## [2.1.1] and earlier

No changelog was maintained for previous releases.
