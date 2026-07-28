/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SelectBase } from '@material/mwc-select/mwc-select-base.js';
import { styles as selectStyles } from '@material/mwc-select/mwc-select.css';
import { customElement, property } from "lit/decorators.js";

@customElement("h3d-select")
export class H3dSelect extends SelectBase {

    static get styles() {
        return selectStyles;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "h3d-select": H3dSelect;
    }
}

