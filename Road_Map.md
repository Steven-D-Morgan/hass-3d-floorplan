# Road Map

A living backlog for **hass-3d-floorplan**. Items are tagged `impact · effort` (`high/med/low` · `small/med/large`) and grouped by priority. Checkboxes track status; move items to **Shipped** as they land.

Two constraints shape everything below:
- **Single-file HACS bundle.** HACS ships exactly one asset (`dist/hass-3d-floorplan.js`), so Rollup output must stay one file. This constrains *distribution*, not the *source* — module splits and refactors are free at build time. Real code-splitting (lazy editor chunk) requires migrating `hacs.json` to `zip_release`, which changes every install's update path — a deliberate release, not a side effect.
- **Backward compatibility.** Existing dashboards must keep working; new behaviour should be opt-in with sensible defaults.

Most items came from a multi-perspective code audit (Aug 2026); the rest are additional suggestions marked _(added)_.

---

## ✅ Recently shipped (for context)

- **v2.3.0** — Draco/meshopt compressed GLB, on-device model caching + revalidation, mobile pixel-ratio cap, high-performance WebGL hint.
- **v2.3.1** — light color/brightness comparison bug, event-driven visibility (IntersectionObserver + visibilitychange), WebGL context-loss recovery.
- **v2.4.0** — per-entity error isolation, null-safe panel/sidebar detection, `eval`→scoped `new Function`, `debug`-gated logging, editor fields (`max_pixel_ratio`/`model_cache`/`draco_decoder_path`/`debug`), localized loading/error strings, ESLint `no-cond-assign`, committed browser harness + Playwright smoke test + CI.
- **v2.4.1** — `entity_template` injection fix (bind `$entity` as data), CanvasTexture reuse (GPU leak), scene/renderer teardown on rerender, entity-array alignment for missing entities, `sun.sun` guard, shadow-caster cap, `setConfig` validation.

---

## 🎯 Next up — quick wins (small effort, high value)

Do these first: all are small, and together they would have *caught* several bugs already fixed by hand.

- [ ] **Lockfile + `npm ci` + lint/typecheck gates in CI** `high · small` — only `yarn.lock` is tracked but every workflow runs `npm install`, so builds of the same tag can ship different transitive code; `build.yml` also bypasses the lint step, so the `no-cond-assign` rule never gates a PR. Commit one lockfile, switch to `npm ci`, add `npm run lint` + `tsc --noEmit`.
- [ ] **Smoke test drives live state** `high · small` — the Playwright test never re-assigns `card.hass`, so state-reactive bindings (the card's whole point) are untested. Add a spec that flips rgb/brightness and a binary_sensor and samples a canvas pixel.
- [ ] **Unit runner for pure logic** `high · small` — extract `_TemperatureToRGB`, `_RGBToHex`, template evaluation, and the `helpers.ts` config transforms into exported pure functions and unit-test them (incl. a test asserting all 5 language JSONs share `en`'s key set). No WebGL boot required.
- [ ] **Throttle `shadowMap.needsUpdate`** `med · small` — the animation loop flags it every frame; only flag when a shadow-caster actually moved. _(Deferred from the v2.4.1 shadow-cap fix.)_
- [ ] **Make `logarithmicDepthBuffer`/`antialias` configurable, default log-depth off** `med · small` — log-depth writes `gl_FragDepth` per fragment (kills early-Z on mobile) and is rarely needed at near=0.1/far=10000.
- [ ] **Compile each template once + state-diff early-out** `med · small` — templates recompile a `Function` on every hass push and the setter loops all entities with no diff vs the previous state. Compile at `setConfig`; short-circuit when nothing bound changed.
- [ ] **De-duplicate the HA shadow-DOM walk** `med · small` — the brittle `home-assistant → … → hui-view` descent is copied in `_ispanel`, `_issidebar`, and `getLovelace()`. Extract one `resolveHuiView()` helper so the most HA-version-fragile code has one place to fix.
- [ ] **HACS validation workflow** `med · small` — add the official `hacs/action` job (category `plugin`) that validates `hacs.json`/structure before users hit a broken install.
- [ ] **Single-source the version** `med · small` — inject `CARD_VERSION` from `package.json` at build (`@rollup/plugin-replace`) and add a CI guard that the release tag matches. Removes the 3-place hand-sync.
- [ ] **dependabot + `.nvmrc`/`engines` + CONTRIBUTING.md** `med · small` — standard repo hygiene; Node 18 is duplicated across three workflows with no single source.

---

## 🚀 Features (entity bindings & UX)

- [ ] **Numeric threshold + gradient color conditions** `high · med` — every state binding matches by *exact string equality*, so continuous sensors (temp/humidity/battery/CO₂/power) can't drive color or a gradient. Add operators (`>`, `>=`, `<`, `<=`, `between`) and optional min/max interpolation, plus a numeric-aware editor field. Keep exact-string as default. _The single biggest sensor-visualization gap._
- [ ] **Paint `entity_picture` onto a mesh** `high · large` — one binding maps an entity's picture onto a material, unlocking camera walls, TV screens (media_player art), and person avatars. Ship snapshot-refresh first; live MJPEG/HLS is CORS/auth-heavy.
- [ ] **First-class `climate`/thermostat type** `med · med` — read `current_temperature`/`hvac_action` for a temp-driven room tint + setpoint label. Pairs with numeric color conditions.
- [ ] **`gesture` service data/target** `med · small` — `gesture` only sends `{ entity_id }`; an optional `data`/`target` field unlocks `scene.turn_on`, script variables, `vacuum.send_command`, `cover.set_position`, etc.
- [ ] **Full HA `tap_action`/`hold_action` schema** `med · med` — per-object interaction is a 3-option dropdown; users expect navigate/url/call-service/toggle/assist/none. `handleAction` is already imported but bypassed, and a long-press path exists but isn't surfaced in the editor.
- [ ] **Object-ID discovery helper** `med · med` _(added)_ — the #1 onboarding friction is finding object names. Add a mode that overlays/echoes the object name on hover (not just click), or a one-click "export object list" so bindings are easy to author.
- [ ] **Weather-driven sky** `low · med` — link the sky to a `weather.*` entity for overcast dimming/cloud, instead of only `sun.sun`.

---

## 🩹 Correctness & robustness (remaining)

- [ ] **Route OBJ/MTL load failures through `_showError` + share the model cache** `med · med` — the OBJ path still `throw`s inside async loader callbacks (often "Error: undefined"), never wires to the existing `_onLoadError`, and gets none of the GLB path's on-device caching.
- [ ] **Load-generation token** `med · med` — `rerender()` re-enters `display3dmodel()` without cancelling an in-flight fetch/parse; a stale `onLoad` can re-add duplicate lights/objects or touch a nulled renderer. Increment a `_loadToken` and bail stale callbacks.
- [ ] **Extract one `readEntitySnapshot()` for init vs update paths** `med · med` — the hass setter resolves each entity's display value twice with independently-maintained logic that already differs (the `uom.pop()` fixup exists only in the init path) — exactly how drift bugs start.

---

## 🏗️ Architecture & tech debt

_The single-file constraint is on the bundle, not the source — these are "free" at distribution time; the cost is diff size/review risk. Land incrementally._

- [ ] **Split the two monoliths into ES modules** `high · large` — clean seams in the 3.5k-line card: model loading/caching, scene/light/sky setup, per-type builders/updaters, HA shadow-DOM helpers. Extract pure helpers first.
- [ ] **Collapse the ~23 parallel per-entity arrays into one `EntityRuntime[]`** `high · large` — hand-synced lock-step arrays are the root cause of the misalignment/`_position` bugs; one record per entity makes misalignment structurally impossible.
- [ ] **Discriminated config types** `high · med` — replace the ~100-field grab-bag `any` interface with a `CardConfig` + `EntityConfig[]` carrying discriminated `LightConfig`/`DoorConfig`/etc. This is what turns the `type3d` drift into a compile error.
- [ ] **One entity-type registry for `type3d`** `high · med` — the 11 types are re-encoded in ~7 places that already disagree (`types.ts` lists only 4 of 11). A single `ENTITY_TYPES` + per-type `{init, update}` handler map makes "add a type" one entry.
- [ ] **Data-driven editor** `high · large` — ~half of `editor.ts` is mechanical repetition (15 near-identical option objects, 13 `_create*Element` builders). A field-descriptor table + one generic builder removes ~1.5k lines and fixes a shallow-copy bug where expanding one entity's sub-panel toggles it for all.

---

## 🔐 Security & supply chain (non-injection)

- [ ] **Bundle the Draco decoder locally** `med · med` — `draco_decoder_path` defaults to gstatic; `DRACOLoader` fetches *and executes* JS+WASM from that origin with no SRI (remote-code dependency + privacy beacon of the user's IP to Google on every compressed-model load + offline breakage). Bundle it and default to a path relative to the card's own URL; keep the override.
- [ ] **Document the `unsafe-eval` requirement + surface template failures** `low · small` — even after the injection fix, `new Function` needs `script-src 'unsafe-eval'`; a hardened proxy makes templates throw silently. Document it and add a debug-gated failure indicator.
- [ ] **Model cache-purge control** `low · small` — the persisted model (which reveals the home's layout) has no eviction/size bound and survives card removal; expose a clear-cache action and delete the bucket when `model_cache: no`.
- [ ] **Replace edit-mode `window.prompt`** `low · small` — object-name/camera-YAML popups use deprecated, focus-stealing `window.prompt`; use an `ha-dialog`/toast or the debug log.

---

## 🧪 Testing (beyond the quick-win runner)

- [ ] **Test the model-cache revalidation / 304 path** `med · med` — `dev/serve.js` already implements `If-Modified-Since`/304 and the harness plumbs `?cache=`, but no spec exercises cache-hit, 304-keeps-bytes, changed-file-updates, or `cache=no`.
- [ ] **Test WebGL context-loss recovery** `med · small` — force it deterministically via `WEBGL_lose_context`, then sample a center pixel. _(Already proven manually in-session; make it a committed spec.)_
- [ ] **Editor config round-trip + OBJ path** `med · med` — one round-trip test (feed config → drive a field → assert re-ingestible output); add a tiny committed `.obj/.mtl` fixture so the OBJ branch runs in CI.
- [ ] **Visual-regression snapshots** `med · med` _(added)_ — Playwright screenshot baselines; essential before the three.js upgrade (color-management flip) and cheap insurance against silent rendering changes.
- [ ] **Playwright traces + mobile-viewport project** `med · small` — add `trace: 'on-first-retry'`, screenshot-on-failure, `upload-artifact`, and a `devices['Pixel 5']` project so the mobile/DPR paths are actually exercised.
- [ ] **Bundle-size budget check in CI** `low · small` _(added)_ — fail the build if `dist` grows past a threshold; catches accidental bloat (e.g. a dependency pulling in more than expected).

---

## ✨ Additional suggestions _(added — beyond the audit)_

- [ ] **Performance/debug HUD** `med · small` — with `debug: yes`, overlay `renderer.info` (draw calls, triangles, textures, geometries) + FPS so users can diagnose slow models themselves. Extends the existing debug option.
- [ ] **Respect `prefers-reduced-motion`** `low · small` — pause `rotate` animations for users who set the OS reduced-motion preference (accessibility + battery).
- [ ] **Screen-reader text fallback** `med · med` — the card is an opaque `<canvas>`; add an `aria-label`/visually-hidden summary of bound entity states so the card conveys information non-visually.
- [ ] **Example-config library** `low · small` — ship a handful of small, focused annotated YAMLs (`just lights`, `doors & covers`, `rooms`) alongside the full sample home, so newcomers can copy one pattern at a time.
- [ ] **Friendly empty/error states** `low · small` — a clear first-run message when no model/entities are configured, and a styled in-canvas error rather than raw text.
- [ ] **Editor label localization** `low · med` — the runtime strings are translated but the editor UI is English-only; route its labels through `localize()` too.
- [ ] **Deprecation warnings** `low · small` — when a removed/renamed option is used, emit a one-time console warning pointing at the replacement (e.g. statement-style templates).

---

## 🛰️ Big bets (major versions)

- [ ] **three.js r130 → current** `med · large` — unlocks **KTX2 GPU-compressed textures** (the biggest *remaining* mobile load/VRAM lever now that geometry compression shipped) and worker-thread decoders. Real regression risk: r152's color-management default flip visibly shifts every existing user's colors unless `outputColorSpace`/tone-mapping is reconciled; `examples/jsm` import paths and some APIs change. Scope as **v3.0.0** with visual-regression baselines and a re-verified single-file bundle.
- [ ] **`zip_release` migration + real lazy editor** `med · med` — the editor is ~28% of the bundle and evaluated for every viewer because a static `import './editor'` defeats the lazy `getConfigElement()` import. Migrating `hacs.json` to `zip_release` enables a genuine lazy chunk. Changes the distributed asset — update README + release workflow in lockstep.

---

_Last updated: 2026-08-11 (post v2.4.1). Ratings are guidance, not gospel — revisit as the code changes._
