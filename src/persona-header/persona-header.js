import { html, LitElement } from "lit";

class PersonaHeader extends LitElement {

    static get properties(){
        return {

        };

    }

    constructor(){
        super();
    }

    render(){
        return html`
            <h1>App Persona</h1>
        `;
    }
}

customElements.define('persona-header', PersonaHeader);