import { html, LitElement } from "lit";

class EmisorEvento extends LitElement {

    static get properties(){
        return {

        };

    }

    constructor(){
        super();
    }

    render(){
        return html`
            <h3>Emisor Evento</h3>
            <button @click="${this.sendEvent}">No pulsar</button>
        `;
    }

    sendEvent(e){
        console.log("Pulsado el botón");
        console.log(e);

        this.dispatchEvent(
            new CustomEvent(
                "text-event",
                {
                    "detail" : {
                        "course" : "TechU",
                        "year" : 2021
                    }
                }
            )
        );
    }
}

customElements.define('emisor-evento', EmisorEvento);