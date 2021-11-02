import { html, LitElement } from "lit";

class PokemonSidebar extends LitElement {

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
                
                <div class="card-footer">
                    <button @click="${this.buttonBack}" class="btn btn-info col-5 "><strong>Atrás</strong></button>
                    <button @click="${this.buttonNext}" class="btn btn-info col-5 offset-1"><strong>Siguiente</strong></button>
                </div>
            </section>
        </aside>
        `;
    }

    buttonNext(e){
        console.log("buttonNext");

        //Evento que no manda info, simplemente el hecho de que se ha pulsado el boton
        this.dispatchEvent(new CustomEvent("next-pokes",{}));
    }

    buttonBack(e){
        console.log("buttonBack");

        //Evento que no manda info, simplemente el hecho de que se ha pulsado el boton
        this.dispatchEvent(new CustomEvent("back-pokes",{}));
    }
}

customElements.define('pokemon-sidebar', PokemonSidebar);