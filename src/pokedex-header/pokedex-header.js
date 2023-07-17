import { html, LitElement, css } from "lit";

class PokedexHeader extends LitElement {

    static get properties(){
        return {
          inputDisabled: {type: Boolean}

        };

    }

    constructor(){
        super();

        this.inputDisabled = true;
    }

    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <header class="p-3 mb-3 border-bottom" style="background-color: #ef5350;">

      <div class="cabecera">
        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
          <img src="../img/logo.png" alt="mdo" width="124" height="42">
        </a>




      </div>

  </header>

        `;
    }

    static styles = css`
    .cabecera {
        text-align: center;
        max-width: 540px;
        margin: -50px auto 0;
        color: white;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 55px;
      }
    `;

    updated(changedProperties){
      console.log("updated pokedex-header");

      if(changedProperties.has("inputDisabled")){
        if (this.inputDisabled){
          console.log("Desactivamos el boton buscar");
          this.shadowRoot.getElementById("botonBuscar").setAttribute("disabled","disabled");
        }else{
          console.log("Activamos el boton buscar");
          this.shadowRoot.getElementById("botonBuscar").removeAttribute("disabled");
        }

      }
    }
}

customElements.define('pokedex-header', PokedexHeader);