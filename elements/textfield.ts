/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TextFieldBase } from '@material/mwc-textfield/mwc-textfield-base.js';
import { styles as textfieldStyles } from '@material/mwc-textfield/mwc-textfield.css';
import { customElement, property } from "lit/decorators.js";

@customElement("h3d-textfield")
export class H3dTextField extends TextFieldBase {

    static get styles() {
        return textfieldStyles;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "h3d-textfield": H3dTextField;
    }
}
