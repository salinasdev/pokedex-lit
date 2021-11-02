import { html, LitElement } from "lit";

class PersonaFooter extends LitElement {

    static get properties(){
        return {

        };

    }

    constructor(){
        super();
    }

    render(){
        return html`
            <h5>@PersonaApp 2021</h5>
        `;
    }
}

customElements.define('persona-footer', PersonaFooter);