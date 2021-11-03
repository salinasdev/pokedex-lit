import { html, LitElement } from "lit";

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
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
          <img src="../img/logo.png" alt="mdo" width="124" height="42">
        </a>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a href="#" class="nav-link px-2 link-secondary">Home</a></li>
          <li><a href="#" class="nav-link px-2 link-dark">About</a></li>
        </ul>


      </div>
    </div>
  </header>

        `;
    }

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