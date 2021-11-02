import { html, LitElement } from "lit";

class PokemonData extends LitElement {

    static get properties(){
        return {
            pokemons: {type: Array},
            next: {type: String},
            back: {type: String},
            url: {type: String},
            atras: {type: Boolean},
            adelante: {type: Boolean}
        };

    }

    constructor(){
        super();
        this.next = "";
        this.back = "";
        this.atras = false;
        this.adelante = false;
        
        this.url = "https://pokeapi.co/api/v2/pokemon/";

        this.getPokemons(this.url);
    }

    updated(changedProperties){
        console.log("updated pokemon-data");

        if(changedProperties.has("pokemons")){
            console.log("Ha cambiado el valor de la propiedad pokemons");

            this.dispatchEvent(
                new CustomEvent(
                    "pokemons-data-updated",
                    {
                        detail : {
                            pokemons : this.pokemons
                        }
                    }
                )
            );
        }else{
            if(changedProperties.has("adelante")){
                console.log("Adelante");
                //this.adelante = false;
                if (this.next != null){
                    this.getPokemons(this.next);
                }
            }
            if(changedProperties.has("atras")){
                console.log("atras");
                //this.atras = false;
                if (this.back != null){
                    this.getPokemons(this.back);
                }
            }
        }

    }

    getPokemons(url){
        console.log("getPokemons");
        console.log(url);
        this.pokemons = [];

        let xhr = new XMLHttpRequest();

        //Propiedad de XHR que se lanza cuando obtiene un resultado de la petición
        xhr.onload = () => {
            if (xhr.status === 200){
                console.log("Petición completada correctamente");
                
                //Parseamos el JSON que nos llega para visualizarlo en la consola
                console.log(JSON.parse(xhr.responseText));

                //Metemos en APIResponde el JSON
                let APIResponse = JSON.parse(xhr.responseText);

                //Asignamos a movies el array que viene en results
                this.pokemons = APIResponse.results;

                //Guardamos la URL de siguiente y atras:
                this.next = APIResponse.next;
                this.back = APIResponse.previous;
            }
        }

        //Creamos la petición
        xhr.open("GET",url);
        //Enviamos la petición
        xhr.send();

        //console.log(this.pokemons);


        console.log("FIN getPokemons");
    }

    
}

customElements.define('pokemon-data', PokemonData);