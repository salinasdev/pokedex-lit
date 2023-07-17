import { html, LitElement, css, unsafeCSS } from "lit";

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
        <link rel="stylesheet" src="../css/estilo.css">
        <div class="card h-100">
            
            <div class="card-footer">
                <button @click="${this.getPokedex}" class="button-81" role="button"><strong>${this.getName(this.fname)}</strong></button>
            </div>
        </div>
        `;
    }

    static styles = css`
    .button-81 {
        background-color: #fff;
        border: 0 solid #e2e8f0;
        border-radius: 1.5rem;
        box-sizing: border-box;
        color: #0d172a;
        cursor: pointer;
        display: inline-block;
        font-family: "Basier circle",-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
        font-size: 1.1rem;
        font-weight: 600;
        line-height: 1;
        padding: 1rem 1.6rem;
        text-align: center;
        text-decoration: none #0d172a solid;
        text-decoration-thickness: auto;
        transition: all .1s cubic-bezier(.4, 0, .2, 1);
        box-shadow: 0px 1px 2px rgba(166, 175, 195, 0.25);
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
      }
      
      .button-81:hover {
        background-color: #1e293b;
        color: #fff;
      }
      
      @media (min-width: 768px) {
        .button-81 {
          font-size: 1.125rem;
          padding: 1rem 9rem;
        }
      }
    `;

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
        case "Generation-ix":
            cadena = "Novena generación";
        break;
    }
      return cadena;
    }
}

customElements.define('pokedex-generation-card', PokedexGenerationCard);