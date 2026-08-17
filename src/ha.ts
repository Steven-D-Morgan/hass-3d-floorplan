import { HassEntity } from 'home-assistant-js-websocket';

export interface HomeAssistant {
  states: { [entity_id: string]: HassEntity };
  callService(domain: string, service: string, serviceData?: Record<string, unknown>): Promise<void>;

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
