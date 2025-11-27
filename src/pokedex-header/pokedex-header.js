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
            <header class="header-container">
                <div class="cabecera">
                    <a href="/" class="logo-link">
                        <img src="../img/logo.png" alt="Pokédex" class="logo-img">
                    </a>
                    <h1 class="header-title">Bienvenido a la Pokédex</h1>
                    <p class="header-subtitle">Explora todas las generaciones de Pokémon</p>
                </div>
            </header>
        `;
    }

    static styles = css`
        .header-container {
            background: linear-gradient(135deg, #EF5350 0%, #E53935 100%);
            padding: 2rem 1rem 3rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            position: relative;
            overflow: hidden;
        }

        .header-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.05)"/></svg>');
            background-size: 100px 100px;
            opacity: 0.3;
        }

        .cabecera {
            text-align: center;
            max-width: 1200px;
            margin: 0 auto;
            color: white;
            position: relative;
            z-index: 1;
        }

        .logo-link {
            display: inline-block;
            transition: transform 0.3s ease;
        }

        .logo-link:hover {
            transform: scale(1.05);
        }

        .logo-img {
            width: 180px;
            height: auto;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
            margin-bottom: 1rem;
        }

        .header-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 1rem 0 0.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            letter-spacing: -0.5px;
        }

        .header-subtitle {
            font-size: 1.1rem;
            opacity: 0.95;
            margin: 0;
            font-weight: 300;
        }

        @media (max-width: 768px) {
            .header-title {
                font-size: 1.8rem;
            }
            
            .logo-img {
                width: 140px;
            }
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