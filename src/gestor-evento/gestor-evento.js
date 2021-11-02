import { html, LitElement } from "lit";
import '../emisor-evento/emisor-evento.js';
import '../receptor-evento/receptor-evento.js';

class GestorEvento extends LitElement {

    static get properties(){
        return {

        };

    }

    constructor(){
        super();
    }

    render(){
        return html`
            <h1>Gestor Evento</h1>
            <emisor-evento @text-event="${this.processEvent}"></emisor-evento>
            <receptor-evento id="receiver"></receptor-evento>
        `;
    }

    processEvent(e){
        console.log("Capturado evento del emisor");
        console.log(e.detail.course);

        this.shadowRoot.getElementById("receiver").course = e.detail.course;
        this.shadowRoot.getElementById("receiver").year = e.detail.year;
    }
}

customElements.define('gestor-evento', GestorEvento);