import { html, LitElement, css } from "lit";

class PokemonFichaListado extends LitElement {

    static get properties(){
        return {
            fname: {type: String},
            numPokedex: {type: Number},
            photo: {type: Object},
            profile: {type: String},
            isCaptured: {type: Boolean},
            pokemonId: {type: Number}
        };

    }

    constructor(){
        super();
        this.isCaptured = false;
        this.pokemonId = 0;
    }


    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        
            <div class="pokemon-card">
                <button @click="${this.toggleCapture}" class="capture-button ${this.isCaptured ? 'captured' : ''}" title="${this.isCaptured ? 'Pokémon capturado' : 'Capturar Pokémon'}">
                    <div class="pokeball">
                        <div class="pokeball-top"></div>
                        <div class="pokeball-middle">
                            <div class="pokeball-button"></div>
                        </div>
                        <div class="pokeball-bottom"></div>
                    </div>
                </button>
                
                <button @click="${this.moreInfo}" class="pokemon-button">
                    <div class="pokemon-image-container">
                        <img class="pokemon-image" src="${this.photo.src}" alt="${this.fname}">
                    </div>
                    <div class="pokemon-info">
                        <span class="pokemon-number">#${this.numPokedex}</span>
                        <span class="pokemon-name">${this.fname}</span>
                    </div>
                </button>
            </div>
        
        `;
    }

    static styles = css`
        .pokemon-card {
            width: 100%;
            max-width: 280px;
            margin: 0.5rem;
            position: relative;
        }

        .capture-button {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            width: 48px;
            height: 48px;
            transition: transform 0.3s ease;
        }

        .capture-button:hover {
            transform: scale(1.15) rotate(10deg);
        }

        .capture-button:active {
            transform: scale(0.95);
        }

        .pokeball {
            width: 48px;
            height: 48px;
            position: relative;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
            transition: all 0.3s ease;
            border-radius: 50%;
            overflow: hidden;
        }

        .capture-button.captured .pokeball {
            animation: captureShake 0.6s ease;
        }

        @keyframes captureShake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-15deg); }
            75% { transform: rotate(15deg); }
        }

        .pokeball-top {
            width: 100%;
            height: 50%;
            background: linear-gradient(180deg, #ff1a1a 0%, #cc0000 100%);
            border-radius: 48px 48px 0 0;
            border-left: 2px solid #1a1a1a;
            border-right: 2px solid #1a1a1a;
            border-top: 2px solid #1a1a1a;
            position: absolute;
            top: 0;
            left: 0;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }

        .capture-button:not(.captured) .pokeball-top {
            background: linear-gradient(180deg, #ffffff 0%, #e6e6e6 100%);
            opacity: 0.4;
        }

        .pokeball-bottom {
            width: 100%;
            height: 50%;
            background: linear-gradient(0deg, #ffffff 0%, #f0f0f0 100%);
            border-radius: 0 0 48px 48px;
            border-left: 2px solid #1a1a1a;
            border-right: 2px solid #1a1a1a;
            border-bottom: 2px solid #1a1a1a;
            position: absolute;
            bottom: 0;
            left: 0;
            box-sizing: border-box;
        }

        .pokeball-middle {
            width: 100%;
            height: 6px;
            background: #1a1a1a;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
        }

        .pokeball-button {
            width: 14px;
            height: 14px;
            background: radial-gradient(circle at 30% 30%, #ffffff 0%, #cccccc 100%);
            border: 2px solid #1a1a1a;
            border-radius: 50%;
            position: relative;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }

        .pokeball-button::before {
            content: '';
            position: absolute;
            width: 5px;
            height: 5px;
            background: white;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            opacity: 0.8;
        }

        .capture-button.captured .pokeball-button {
            background: radial-gradient(circle at 30% 30%, #ffff00 0%, #ffcc00 100%);
            box-shadow: 0 0 12px rgba(255, 204, 0, 0.8);
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }

        .pokemon-button {
            background: white;
            border: none;
            border-radius: 16px;
            box-sizing: border-box;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            width: 100%;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            text-align: center;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            overflow: hidden;
            padding: 0;
        }
        
        .pokemon-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .pokemon-button:active {
            transform: translateY(-2px);
        }

        .pokemon-image-container {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 180px;
        }

        .pokemon-image {
            width: 120px;
            height: 120px;
            object-fit: contain;
            transition: transform 0.3s ease;
        }

        .pokemon-button:hover .pokemon-image {
            transform: scale(1.15);
        }

        .pokemon-info {
            padding: 1rem 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
        }

        .pokemon-number {
            color: #666;
            font-size: 0.9rem;
            font-weight: 600;
        }

        .pokemon-name {
            color: #1a1a1a;
            font-size: 1.2rem;
            font-weight: 700;
        }
        
        @media (max-width: 768px) {
            .pokemon-card {
                max-width: 100%;
            }

            .pokemon-image {
                width: 100px;
                height: 100px;
            }

            .pokemon-image-container {
                min-height: 150px;
                padding: 1rem;
            }
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

    toggleCapture(e) {
        e.stopPropagation();
        console.log("Toggle capture para Pokémon #" + this.pokemonId);
        
        this.dispatchEvent(
            new CustomEvent(
                "toggle-capture",
                {
                    "detail": {
                        pokemonId: this.pokemonId
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