# Release Notes

User-facing notes for each release, newest first. For the full terse history see [CHANGELOG.md](CHANGELOG.md); notes for releases before v2.4.1 are on the [GitHub Releases](https://github.com/Steven-D-Morgan/hass-3d-floorplan/releases) page.

---

## v2.4.1 — Security & correctness fixes

This is a recommended upgrade for all users — it includes a security fix for `entity_template`.

### 🔒 Security
- **`entity_template` no longer executes entity state as code.** Previously the live entity state was substituted directly into an evaluated expression, so an entity whose state can be influenced by an outside source (scrape/REST/MQTT/webhook feeds, media titles, etc.) bound to a template could run arbitrary JavaScript in your dashboard. `$entity` is now passed in as a **sandboxed value**, not code. Exploiting the old behavior required a template configured on such an entity, but the fix is free and closes the hole regardless.

### 🐛 Fixed
- **GPU memory leak on every sensor update.** `text` and `room` labels created a brand-new canvas texture on each state change without freeing the old one — a slow memory climb on always-on wall tablets. The texture is now reused.
- **WebGL contexts leaked while editing.** The visual editor rebuilds the scene on every change but never released the old renderer, so tuning a card could exhaust the browser's WebGL contexts and blank other floorplan cards. Added proper teardown/disposal.
- **Entities unavailable at startup could scramble bindings.** If a bound entity was missing at boot (renamed, or a slow-to-start integration), every later entity's binding could shift by one. Bindings now stay correctly aligned and bind normally once the entity appears.
- **`sky: yes` crashed on installs without the Sun integration** — now falls back to a default sun position.
- **Invalid configuration crashed instead of explaining itself** — a missing or wrong-typed `path`/`objfile` now shows Home Assistant's normal config-error card.
- **String-valued `entity_template` results** (e.g. comparing text states) no longer silently fail.

### ⚙️ Changed
- Shadow-casting lights are now capped to a safe budget so setups with many shadow lights don't corrupt rendering.
- `entity_template` is now a JavaScript **expression** (`$entity` is bound as a number when numeric, otherwise a string).

### ⚠️ Upgrade note — entity templates
Templates must now be single expressions. If you used a statement-style template, rewrite it with the ternary operator:

```yaml
# before
entity_template: '[[[ if ($entity > 25) { "hot" } else { "cool" } ]]]'
# after
entity_template: '[[[ $entity > 25 ? "hot" : "cool" ]]]'
```

Numeric templates like `[[[ $entity * 2 ]]]` are unchanged.

### 📝 Notes
No changes to models, entities, or the card layout — drop-in for existing dashboards (aside from the template syntax note above). Found via a code audit of the card.

**Upgrading from v2.3.x?** You also pick up everything in [v2.4.0](https://github.com/Steven-D-Morgan/hass-3d-floorplan/releases/tag/v2.4.0): compressed-model (Draco/meshopt) support, on-device model caching, the mobile pixel-ratio cap, new editor fields, and localized loading/error messages.
