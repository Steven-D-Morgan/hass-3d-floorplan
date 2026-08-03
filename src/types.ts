/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionConfig, LovelaceCard, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'hass-3d-floorplan-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// TODO Add your configuration elements here for type-checking
export interface Hass3dFloorplanConfig {
  type: string;
  path: string;
  name: string;
  font: string;
  attribute: string;
  objfile: string;
  mtlfile: string;
  objectlist: string;
  style: string;
  header: string;
  backgroundColor: string;
  globalLightPower: string;
  hideLevelsMenu: string;
  initialLevel: number;
  selectionMode: string;
  editModeNotifications: string;
  shadow: string;
  entities: any;
  lock_camera: string;
  click: string;
  action: string;
  overlay: string;
  width: number;
  height: number;
  overlay_bgcolor: string;
  overlay_fgcolor: string;
  overlay_alignment: string;
  overlay_width: string;
  overlay_height: string;
  overlay_font: string;
  overlay_fontsize: string;
  tap_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  entity: string;
  entity_template: string;
  cover: any;
  type3d: string;
  object_id: string;
  object_groups: any;
  object_group: string;
  zoom_areas: any;
  objects: any;
  lumens: number;
  decay: number;
  distance: number;
  colorcondition: any;
  light: any;
  door: any;
  doortype: string;
  extralightmode: string;
  room: any;
  zoom: string;
  elevation: number;
  transparency: number;
  show_axes: string;
  label: string;
  label_text: string;
  side: string;
  direction: string;
  degrees: number;
  percentage: number;
  hinge: string;
  pane: string;
  text: any;
  gesture: any;
  rotate: any;
  round_per_second: number;
  axis: string;
  span: string;
  vertical_alignment: string;
  textbgcolor: string;
  textfgcolor: string;
  camera_position: any;
  camera_rotate: any;
  camera_target: any;
  light_direction: any;
  light_target: string;
  radius: number;
  sky: string;
  north: any;
  x: number;
  y: number;
  z: number;
  hide: any;
  show: any;
  state: string;
  target: any;
  domain: string;
  camera: string;
  service: string;
  color: string;
  show_warning: boolean;
  show_error: boolean;
  max_pixel_ratio: string;
  draco_decoder_path: string;
  model_cache: string;
  debug: string;
}

export interface EntityHass3dFloorplanConfig {
  hide: any;
  entity: string;
  type3d: 'light' | 'color' | 'hide' | 'text';
  object_id: string;
  lumens: number;
  conditions: ConditionsHass3dFloorplanConfig[];
  state: string;
}

export interface ConditionsHass3dFloorplanConfig {
  condition: string;
  state: string;
  color: string;
}
