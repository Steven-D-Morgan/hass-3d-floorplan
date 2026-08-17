// Minimal, self-contained replacements for the handful of Home Assistant types
// and the fireEvent helper the card previously imported from custom-card-helpers.
// Dropping that dependency also drops the @formatjs/intl-utils code it dragged
// into the bundle (and silences the "this has been rewritten to undefined"
// Rollup warning that came from it).
import { HassEntity } from 'home-assistant-js-websocket';

export interface HomeAssistant {
  states: { [entity_id: string]: HassEntity };
  callService(domain: string, service: string, serviceData?: Record<string, unknown>): Promise<void>;
  // The card touches many other hass members loosely; keep this permissive so
  // existing access patterns type-check without re-declaring all of HA's API.
  [key: string]: any;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  isPanel?: boolean;
  setConfig(config: any): void;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: any): void;
}

export type LovelaceConfig = any;
export type ActionConfig = any;

// Dispatch a composed, bubbling CustomEvent — the behaviour the card relied on
// from custom-card-helpers' fireEvent. `composed: true` is what lets events like
// 'hass-more-info' and 'config-changed' cross the shadow-DOM boundary and reach
// Home Assistant.
export function fireEvent<T>(
  node: HTMLElement | Window,
  type: string,
  detail?: T,
  options?: { bubbles?: boolean; cancelable?: boolean; composed?: boolean },
): CustomEvent<T> {
  options = options || {};
  const event = new CustomEvent<T>(type, {
    detail: detail as T,
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
  });
  node.dispatchEvent(event);
  return event;
}
