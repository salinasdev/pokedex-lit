import { html, LitElement } from "lit";

class PokemonFichaDetalle extends LitElement {

    static get properties(){
        return {
            fname: {type: String},
            numPokedex: {type: Number},
            photo: {type: Object},
            profile: {type: String}

        };

    }

    constructor(){
        super();
    }


    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <div class="card h-100">
            <img src="${this.photo.src}" alt="${this.fname}"   class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${this.fname}</h5>
                <p class="card-text">${this.profile}</p>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Pokemón numero: ${this.numPokedex}.</li>
                </ul>
            </div>
            <div class="card-footer">
                <button @click="${this.moreInfo}" class="btn btn-info col-12"><strong>Info</strong></button>
            </div>
        </div>
        `;
    }
}

customElements.define('pokemon-ficha-detalle', PokemonFichaDetalle);