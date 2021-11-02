import { html, LitElement } from "lit";

class PersonaSidebar extends LitElement {

    static get properties(){
        return {

        };

    }

    constructor(){
        super();
    }

    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <aside>
            <section>
                <div class="mt-5">
                    <button @click="${this.newPerson}" class="w-100 btn btn-success" style="font-size: 50px"><strong>+</strong></button>
                </div>
            </section>
        </aside>
        `;
    }

    newPerson(e){
        console.log("newPerson");
        console.log("Se va a crear una nueva persona");

        //Evento que no manda info, simplemente el hecho de que se ha pulsado el boton
        this.dispatchEvent(new CustomEvent("new-person",{}));
    }
}

customElements.define('persona-sidebar', PersonaSidebar);