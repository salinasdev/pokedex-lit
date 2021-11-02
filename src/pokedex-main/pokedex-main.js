import { html, LitElement } from "lit";
import '../pokemon-data/pokemon-data.js';
import '../pokemon-ficha-listado/pokemon-ficha-listado.js';
import '../pokemon-sidebar/pokemon-sidebar.js';

class PokedexMain extends LitElement {

    static get properties(){
        return {
            pokemons: {type: Array}

        };

    }

    constructor(){
        super();

        this.pokemons = [];
    }

    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <h2 class="text-center">Pokemons</h2>
            <pokemon-sidebar @next-pokes="${this.nextPokes}" @back-pokes="${this.backPokes}"></pokemon-sidebar>
            <div class="row" id="peopleList">
            <div class="row row-cols-1 row-cols-sm-4">
            ${this.pokemons.map(
                (pokemon, index) => html`<pokemon-ficha-listado 
                                fname="${this.capitalizeFirstLetter(pokemon.name)}" 
                                numPokedex="${index+1}"
                                profile="${pokemon.url}"
                                .photo="${{
                                    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + (parseInt(pokemon.url.match(/\d+/g)[1])) +".png",
                                    alt: "pokemon.name"
                                }}"
                            ></pokemon-ficha-listado>`
            )}
            </div>
            
            </div>
            <pokemon-sidebar @next-pokes="${this.nextPokes}" @back-pokes="${this.backPokes}"></pokemon-sidebar>
            <pokemon-data @pokemons-data-updated="${this.pokemonsDataUpdated}" id="pokeData"></pokemon-data>
        `;
    }

    pokemonsDataUpdated(e){
        console.log("pokemonsDataUpdated");

        this.pokemons = e.detail.pokemons;

        console.log(this.pokemons);
    }

    //Función para poner la primera letra en mayúscula
    capitalizeFirstLetter(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    nextPokes(e){
        console.log("nextPokes en pokedex-main");
        this.shadowRoot.getElementById("pokeData").adelante = !this.shadowRoot.getElementById("pokeData").adelante;
    }

    backPokes(e){
        console.log("backPokes en pokedex-main");
        this.shadowRoot.getElementById("pokeData").atras = !this.shadowRoot.getElementById("pokeData").atras;
    }
}

customElements.define('pokedex-main', PokedexMain);