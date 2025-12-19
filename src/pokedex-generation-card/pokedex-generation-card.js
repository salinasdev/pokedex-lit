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
        const gradientColor = this.getGenerationGradient(this.fname);
        
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <link rel="stylesheet" src="../css/estilo.css">
        <div class="generation-card">
            <div class="card-content">
                <div class="generation-image" style="background: ${gradientColor}">
                    <img src="${this.getImageName(this.fname)}" alt="${this.getName(this.fname)}" loading="lazy">
                </div>
                <button @click="${this.getPokedex}" class="generation-button" role="button">
                    <strong>${this.getName(this.fname)}</strong>
                </button>
            </div>
        </div>
        `;
    }

    static styles = css`
        .generation-card {
            margin: 1rem;
            width: 100%;
            max-width: 500px;
        }

        .card-content {
            background: var(--bg-card, white);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px var(--shadow-color, rgba(0, 0, 0, 0.2));
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        .card-content:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px var(--shadow-hover, rgba(0, 0, 0, 0.3));
        }

        .generation-image {
            width: 100%;
            height: 250px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .generation-image::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 50%);
            pointer-events: none;
        }

        .generation-image img {
            max-width: 85%;
            max-height: 85%;
            object-fit: contain;
            filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            z-index: 1;
        }

        .card-content:hover .generation-image img {
            transform: scale(1.15) rotate(5deg);
        }

        .generation-button {
            background: var(--button-bg, linear-gradient(135deg, #4a5568 0%, #2d3748 100%));
            border: none;
            border-radius: 0;
            box-sizing: border-box;
            color: var(--button-text, white);
            cursor: pointer;
            display: block;
            width: 100%;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 1.2rem;
            font-weight: 700;
            line-height: 1.5;
            padding: 1.5rem 2rem;
            text-align: center;
            text-decoration: none;
            transition: all 0.3s ease;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
        }
        
        .generation-button:hover {
            background: var(--button-bg-hover, linear-gradient(135deg, #2d3748 0%, #1a202c 100%));
            transform: scale(1.02);
        }

        .generation-button:active {
            transform: scale(0.98);
        }
        
        @media (max-width: 768px) {
            .generation-card {
                margin: 0.5rem;
            }

            .generation-image {
                height: 150px;
            }

            .generation-button {
                font-size: 1.1rem;
                padding: 1.2rem 1.5rem;
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
                      url : this.url,
                      name: this.fname
                  }
              }
          )
      );
    }

    getImageName(string){
        // URLs de imágenes de alta calidad desde fuentes oficiales
        const imageUrls = {
            "Generation-i": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", // Pikachu
            "Generation-ii": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png", // Chikorita
            "Generation-iii": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/252.png", // Treecko
            "Generation-iv": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/387.png", // Turtwig
            "Generation-v": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/495.png", // Snivy
            "Generation-vi": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/650.png", // Chespin
            "Generation-vii": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/722.png", // Rowlet
            "Generation-viii": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/810.png", // Grookey
            "Generation-ix": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/906.png" // Sprigatito
        };
        
        return imageUrls[string] || imageUrls["Generation-i"];
    }

    getGenerationGradient(string){
        // Degradados únicos y vibrantes para cada generación
        const gradients = {
            "Generation-i": "linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%)", // Rojo (Kanto)
            "Generation-ii": "linear-gradient(135deg, #FFD93D 0%, #F6C90E 100%)", // Dorado (Johto)
            "Generation-iii": "linear-gradient(135deg, #51CF66 0%, #2B8A3E 100%)", // Verde (Hoenn)
            "Generation-iv": "linear-gradient(135deg, #748FFC 0%, #5C7CFA 100%)", // Azul (Sinnoh)
            "Generation-v": "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)", // Negro/Blanco (Unova)
            "Generation-vi": "linear-gradient(135deg, #FF8787 0%, #FA5252 100%)", // Rosa/Rojo (Kalos)
            "Generation-vii": "linear-gradient(135deg, #FFA94D 0%, #FD7E14 100%)", // Naranja (Alola)
            "Generation-viii": "linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)", // Púrpura (Galar)
            "Generation-ix": "linear-gradient(135deg, #F783AC 0%, #E64980 100%)"  // Magenta (Paldea)
        };
        
        return gradients[string] || gradients["Generation-i"];
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