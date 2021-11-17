import { html, LitElement } from "lit";
import '../pokemon-data/pokemon-data.js';
import '../pokemon-ficha-listado/pokemon-ficha-listado.js';
import '../pokemon-sidebar/pokemon-sidebar.js';
import '../pokedex-generation-card/pokedex-generation-card.js';

class PokedexMain extends LitElement {

    static get properties(){
        return {
            pokemons: {type: Array},
            generations: {type: Array},
            muestra: {type: String},
            fichaPokemon: {type: Object},
            types: {type: Array},
            encounters: {type: Array}
        };

    }

    constructor(){
        super();

        this.pokemons = [];
        this.generations = [];
        this.muestra = "listGens";
        this.fichaPokemon = {};
        this.types = [];
        this.encounters = [];
        
    }

    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <div id="listGens">
                <div class="row row-cols-1 row-cols-sm-4">
                    ${this.generations.map(
                        (generation, index) => html`<pokedex-generation-card
                                                    fname="${this.capitalizeFirstLetter(generation.name)}"
                                                    url="${generation.url}"
                                                    @get-generation="${this.getGeneration}" 
                                                   ></pokedex-generation-card>`
                    )}
                </div>
            </div>
            <div id="listPokemon" class="d-none">
                <div class="row" id="peopleList">
                    <div class="row row-cols-1 row-cols-sm-4">
                    ${this.pokemons.map(
                        (pokemon, index) => html`<pokemon-ficha-listado 
                                fname="${this.capitalizeFirstLetter(pokemon.name)}" 
                                numPokedex="${pokemon.idp}"
                                profile="${pokemon.url}"
                                .photo="${{
                                    src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + (parseInt(pokemon.url.match(/\d+/g)[1])) +".png",
                                    alt: "pokemon.name"
                                }}"
                                @consulta-pokemon="${this.consultaPokemon}"
                                ></pokemon-ficha-listado>`
                    )}
                    </div>
                </div>
            </div>
            <div id="fichaPokemon" class="d-none">
                <div class="row mb-2">
                    <div class="col-3 themed-grid-col-cab bg-light">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.fichaPokemon.idp}.png" alt="${this.capitalizeFirstLetter(this.fichaPokemon.name)}"   class="card-img-top">
                    </div>
                    <div class="col-8 themed-grid-col-cab bg-light">
                        <div class="row ">
                            <div class="col themed-grid-col-cab bg-light"><strong>Datos de ${this.capitalizeFirstLetter(this.fichaPokemon.name)}</strong>
                        </div>
                        <div class="row ">
                            <div class="col-4 themed-grid-col-cab bg-light"><strong>Número de Pókemon:</strong></div>
                            <div class="col themed-grid-col-cab bg-light">${this.fichaPokemon.idp}</div>
                        </div>
                        <div class="row ">
                            <div class="col-4 themed-grid-col-cab bg-light"><strong>Nombre:</strong></div>
                            <div class="col themed-grid-col-cab bg-light">${this.capitalizeFirstLetter(this.fichaPokemon.name)}</div>
                        </div>
                        <div class="row ">
                            <div class="col-4 themed-grid-col-cab bg-light"><strong>Peso:</strong></div>
                            <div class="col themed-grid-col-cab bg-light">${this.mascaraNum(this.fichaPokemon.weight)} kg.</div>
                        </div>
                        <div class="row ">
                            <div class="col-4 themed-grid-col-cab bg-light"><strong>Altura:</strong></div>
                            <div class="col themed-grid-col-cab bg-light">${this.mascaraNum(this.fichaPokemon.height)} m.</div>
                        </div>
                        <div class="row ">
                            <div class="col-4 themed-grid-col-cab bg-light"><strong>Tipos:</strong></div>
                            <div class="col themed-grid-col-cab bg-light">
                            
                            ${this.types.map(
                                (type, index) => html`<img src="../img/types/${type.type.name}.png">`
                            )}
                            
                            </div>
                        </div>
                    </div>
                
                </div>
                </div>
                <div class="row mb-2">
                    ${this.encounters.map(
                        (encounter, index) => html`<img src="../img/areas/${encounter.location_area.name}.png" class="col-3 themed-grid-col-cab bg-light">
                        <div class="col-8 themed-grid-col-cab bg-light">
                        <div class="row ">
                            <div class="col themed-grid-col-cab bg-light"><strong>${this.getLugar(encounter.location_area.name)}</strong></div>
                        </div>
                        <div class="row ">
                            <div class="col themed-grid-col-cab bg-light"><strong>Juegos: </strong></div>
                            ${encounter.version_details.map(
                                (vdetail, index) => html`
                                <div class="col themed-grid-col-cab bg-light"><img src="../img/versions/${vdetail.version.name}.png">${this.capitalizeFirstLetter(vdetail.version.name)}</div>
                                
                                `
                            )
                            
                            
                            }
                            
                        </div>
                        </div>
                        
                        
                        `
                    )}
                </div>
            </div>
            <pokemon-data @pokemons-data-updated="${this.pokemonsDataUpdated}" 
                          @generations-data-updated="${this.generationsDataUpdated}"
                          @mipokemon-data-updated="${this.mipokemonDataUpdate}"
                          id="pokeData"></pokemon-data>
            <style>
                .themed-grid-col-cab {
                    padding-top: .75rem;
                    padding-bottom: .75rem;
                    background-color: rgba(86, 61, 124, .15);
                    border: 1px solid rgba(86, 61, 124, .2);
                }
            </style>
        `;
    }

    updated(changedProperties){
        console.log("updated de tienda-main");

        if (changedProperties.has("muestra")){
            console.log("Ha cambiado el valor de la propiedad muestra en pokedex-main");
            console.log("muestra vale " + this.muestra);

            switch (this.muestra){
                case "listGens":
                        console.log("entro en listGens updated");
                        this.shadowRoot.getElementById("listGens").classList.remove("d-none");
                        this.shadowRoot.getElementById("listPokemon").classList.add("d-none");
                        this.shadowRoot.getElementById("fichaPokemon").classList.add("d-none");
                    break;
                case "listPokemon":
                        console.log("entro en listPokemon updated");
                        this.shadowRoot.getElementById("listGens").classList.add("d-none");
                        this.shadowRoot.getElementById("listPokemon").classList.remove("d-none");
                        this.shadowRoot.getElementById("fichaPokemon").classList.add("d-none");
                    break;
                case "fichaPokemon":
                        console.log("entro en listPokemon updated");
                        this.shadowRoot.getElementById("listGens").classList.add("d-none");
                        this.shadowRoot.getElementById("listPokemon").classList.add("d-none");
                        this.shadowRoot.getElementById("fichaPokemon").classList.remove("d-none");
                    break;
            }


        }
    }


    pokemonsDataUpdated(e){
        console.log("pokemonsDataUpdated");

        this.pokemons = e.detail.pokemons;
        
        for (let i = 0; i < this.pokemons.length; i++) {
            this.pokemons[i].idp = parseInt(this.pokemons[i].url.match(/\d+/g)[1]);
        }

        this.pokemons.sort(((a, b) => a.idp - b.idp));

        console.log(this.pokemons);
    }

    //Función para poner la primera letra en mayúscula
    capitalizeFirstLetter(s) {
        if (s != null)
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

    generationsDataUpdated(e){
        console.log("generationsDataUpdated");

        this.generations = e.detail.generations;

        console.log(this.generations);
    }

    getGeneration(e){
        console.log("pokedex-main "+ e.detail.url);
        this.shadowRoot.getElementById("pokeData").urlGeneration = e.detail.url;
        this.muestra = "listPokemon";
    }

    consultaPokemon(e){
        console.log("consultaPokemon en pokedex-main " + e.detail.idp);
        this.muestra = "fichaPokemon";
        this.shadowRoot.getElementById("pokeData").idPokemon = e.detail.idp;
    }

    mipokemonDataUpdate(e){
        console.log("mipokemonDataUpdate");
        console.log(e.detail);
        this.fichaPokemon = e.detail;
        this.types = this.fichaPokemon.types;
        this.encounters = this.fichaPokemon.encounters;
        console.log("AQUIII");
    }
    mascaraNum(n){
        if(n != null)
            return n/10;
    }



    getLugar(string){

        let arrayDeCadenas = this.dividirCadena(string,"-");
        
        //Rutas
        switch(arrayDeCadenas[0]){
            case "johto":
            case "sinnoh":
            case "kalos":
                return "Ruta " + arrayDeCadenas[2] + " - " + this.capitalizeFirstLetter(arrayDeCadenas[0]);
            case "unova":
                    return "Ruta " + arrayDeCadenas[2] + " - " + "Teselia";
            case "kanto":
                if (arrayDeCadenas[1] === "sea"){
                    return "Ruta " + arrayDeCadenas[3] + " - " + this.capitalizeFirstLetter(arrayDeCadenas[0]);
                }else{
                    return "Ruta " + arrayDeCadenas[2] + " - " + this.capitalizeFirstLetter(arrayDeCadenas[0]);
                }
        }

        //Lugares
        switch (string){
            case "pallet-town-area":
                return "Pueblo Paleta";
            case "cerulean-city-area":
                return "Ciudad Celeste";
            case "lumiose-city-area":
                return "Ciudad Luminalia";
            case "eterna-forest-area":
                return "Bosque Vetusto";
            case "ilex-forest-area":
                return "El Encinar";
            case "national-park-area":
                return "Parque Nacional";
            case "unknown-all-bugs-area":
                return "Zona Desconocida, Bugs";
            case "lake-of-rage-area":
                return "Lago de la Furia";
            case "viridian-forest-area":
                return "Bosque Verde";
            case "pattern-bush-area":
                return "Bosquejo - Isla Extra";
            case "santalune-forest-area":
                return "Bosque de Novarte";
            case "azalea-town-area":
                return "Pueblo Azalea";
            case "berry-forest-area":
                return "Bosque Baya";
            case "bond-bridge-area":
                return "Puente Unión";
            case "five-isle-meadow-area":
                return "Prado Isla Inta";
        }

        return string;
    }

    dividirCadena(cadenaADividir,separador) {
        var arrayDeCadenas = cadenaADividir.split(separador);
     
        return arrayDeCadenas;
     }
}

customElements.define('pokedex-main', PokedexMain);