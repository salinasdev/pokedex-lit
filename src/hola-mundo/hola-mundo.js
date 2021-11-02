import { html, LitElement } from "lit-element";

class HolaMundo extends LitElement {

    render(){
        return html`
            <div>Hola Mundo</div>
        `;
    }
}

customElements.define('hola-mundo', HolaMundo);