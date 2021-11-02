import { html, LitElement } from "lit";

class TestAPI extends LitElement {

    static get properties(){
        return {
            movies: {type: Array}

        };
    }

    constructor(){
        super();

        this.movies = [];
        this.getMovieData();

    }

    render(){
        return html`
            <h1>Test API</h1>
            ${this.movies.map(
                movie => html`<div> La pelicula ${movie.title}, fue dirigida por ${movie.director}. </div>`
            )}
            
        `;
    }

    getMovieData(){
        console.log("Estoy en getMovieData");
        console.log("Obteniendo datos de las películas");

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
                this.movies = APIResponse.results;
            }
        }

        //Creamos la petición
        xhr.open("GET","https://swapi.dev/api/films");
        //Enviamos la petición
        xhr.send();


        console.log("FIN getMovieData");
    }
}

customElements.define('test-api', TestAPI);