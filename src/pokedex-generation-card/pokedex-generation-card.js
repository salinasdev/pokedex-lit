import { html, LitElement } from "lit";

class PokedexGenerationCard extends LitElement {

    static get properties(){
        return {
          fname: {type: String},
          url: {type: String}
        };

    }

    constructor(){
        super();
    }

    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <div class="card h-100">
            <img src="../img/${this.fname.toLowerCase()}.png" alt="${this.fname}"   class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${this.getName(this.fname)}</h5>
                <p class="card-text">${this.profile}</p>
            </div>
            <div class="card-footer">
                <button @click="${this.getPokedex}" class="btn btn-info col-12"><strong>Pokedex</strong></button>
            </div>
        </div>
        `;
    }

    getPokedex(e){
        console.log("Nos vamos a " + this.url);

        this.dispatchEvent(
          new CustomEvent(
              "get-generation",
              {
                  "detail" : {
                      url : this.url
                  }
              }
          )
      );
    }




    getName(string){
      let cadena = "";

      switch (string){
        case "Generation-i":
              cadena = "Primera generación";
            break;
        case "Generation-ii":
            cadena = "Segunda generación";
            break;
        case "Generation-iii":
            cadena = "Tercera generación";
            break;
        case "Generation-iv":
            cadena = "Cuarta generación";
            break;
        case "Generation-v":
            cadena = "Quinta generación";
            break;
        case "Generation-vi":
            cadena = "Sexta generación";
            break;
        case "Generation-vii":
            cadena = "Séptima generación";
            break;
        case "Generation-viii":
            cadena = "Octava generación";
        break;
    }
      return cadena;
    }
}

customElements.define('pokedex-generation-card', PokedexGenerationCard);