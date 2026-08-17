

import { ButtonBase } from '@material/mwc-button/mwc-button-base.js';
import { styles as buttonStyles } from '@material/mwc-button/styles.css.js';
import { customElement, property } from "lit/decorators.js";

@customElement("h3d-button")
export class H3dButton extends ButtonBase {

    static get styles() {
        return buttonStyles;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "h3d-button": H3dButton;
    }
}
