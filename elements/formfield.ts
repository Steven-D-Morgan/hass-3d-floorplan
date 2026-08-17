

import { FormfieldBase } from '@material/mwc-formfield/mwc-formfield-base.js';
import { styles as formfieldStyles } from '@material/mwc-formfield/mwc-formfield.css.js';
import { customElement, property } from "lit/decorators.js";

@customElement("h3d-formfield")
export class H3dFormField extends FormfieldBase {

    static get styles() {
        return formfieldStyles;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "h3d-formfield": H3dFormField;
    }
}
