import { html, LitElement } from "lit";

class ReceptorEvento extends LitElement {

    static get properties(){
        return {
            course: {type: String},
            year: {type: String}

        };

    }

    constructor(){
        super();
    }

    render(){
        return html`
            <h3>Receptor Evento</h3>
            <h5>Este curso es de ${this.course}</h5>
            <h5>y estamos en el año ${this.year}</h5>
        `;
    }
}

customElements.define('receptor-evento', ReceptorEvento);