import { html, LitElement, css } from "lit";

class PokedexHeader extends LitElement {

    static get properties(){
        return {
          inputDisabled: {type: Boolean},
          darkMode: {type: Boolean}
        };

    }

    constructor(){
        super();

        this.inputDisabled = true;
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        this.applyTheme();
    }

    applyTheme() {
        if (this.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }

    toggleTheme() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        this.applyTheme();
    }

    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <header class="header-container">
                <div class="cabecera">
                    <button class="theme-toggle" @click="${this.toggleTheme}" title="Cambiar tema">
                        ${this.darkMode ? html`
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                            </svg>
                        ` : html`
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/>
                            </svg>
                        `}
                    </button>
                    <a href="/" class="logo-link">
                        <img src="../img/logo.png" alt="VicDex" class="logo-img">
                    </a>
                    <p class="header-subtitle">Tu compañero definitivo para explorar, coleccionar y batallar con Pokémon</p>
                </div>
            </header>
        `;
    }

    static styles = css`
        .theme-toggle {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            color: white;
            z-index: 10;
        }

        .theme-toggle:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(20deg) scale(1.1);
        }

        .theme-toggle svg {
            width: 24px;
            height: 24px;
        }

        .header-container {
            background: linear-gradient(135deg, var(--header-gradient-start, #EF5350) 0%, var(--header-gradient-end, #E53935) 100%);
            padding: 2rem 1rem 3rem;
            box-shadow: 0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.15));
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