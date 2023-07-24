import { html, LitElement, css } from "lit";

class PokemonFichaListado extends LitElement {

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
        
            <div class="resultado">
                <button @click="${this.moreInfo}" class="button-81">
                <img class="micon" src="${this.photo.src}" alt="${this.fname}" >
                <strong>#: ${this.numPokedex}. ${this.fname}</strong>
                
                </button>
            </div>
        
        `;
    }

    static styles = css`
    .mipoke {
        background-color: #1b252f;
        margin: 0 4px 4px 4px;
        font-size: 115%;
        display: block;
        text-decoration: none;
        color: white;
        position: relative;
        border-radius: 100px;
      }
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
        width: 540px;
      }
      
      .button-81:hover {
        background-color: #1e293b;
        color: #fff;
      }
      .micon {
        padding-right: 10px;
      }
      @media (min-width: 768px) {
        .button-81 {
          font-size: 1.125rem;
          padding: 1rem 0rem;
        }
      }
      .resultado{
        align-items: baseline;
    max-width: 540px;
    margin: -50px auto 0px;
    color: white;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 55px;
      }
    `;

    deletePerson(e){
        console.log("deletePerson en persona-ficha-listado");
        console.log("Se va a borrar la persona de nombre " + this.fname);

        this.dispatchEvent(
            new CustomEvent(
                "delete-person",
                {
                    "detail" : {
                        name : this.fname
                    }
                }
            )
        );
    }

    moreInfo(e){
        console.log("moreInfo en pokemon-ficha-listado");
        console.log("Consultando a " + this.fname + "con numero " + this.numPokedex);

        this.dispatchEvent(
            new CustomEvent(
                "consulta-pokemon",
                {
                    "detail" : {
                        name : this.fname,
                        idp  : this.numPokedex
                    }
                }
            )
        );
    }
}

customElements.define('pokemon-ficha-listado', PokemonFichaListado);