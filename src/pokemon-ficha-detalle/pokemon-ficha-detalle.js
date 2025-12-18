import { html, LitElement, css } from "lit";

class PokemonFichaDetalle extends LitElement {

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
        <div class="card h-100">
            <img src="${this.photo.src}" alt="${this.fname}"   class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${this.fname}</h5>
                <p class="card-text">${this.profile}</p>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Pokemón numero: ${this.numPokedex}.</li>
                </ul>
            </div>
            <div class="card-footer">
                <button @click="${this.moreInfo}" class="btn btn-info col-12"><strong>Info</strong></button>
            </div>
        </div>
        `;
    }

    static styles = css`
        .card {
            background-color: var(--bg-card, #ffffff);
            border: 1px solid var(--border-color, #e0e0e0);
            border-radius: 16px;
            box-shadow: 0 4px 15px var(--shadow-color, rgba(0, 0, 0, 0.1));
            transition: all 0.3s ease;
        }

        .card-img-top {
            background: var(--bg-image-container, linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%));
            padding: 2rem;
        }

        .card-body {
            background-color: var(--bg-pokemon-info, transparent);
            padding: 1.5rem;
        }

        .card-title {
            color: var(--text-primary, #1a1a1a);
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .card-text {
            color: var(--text-primary, #333333);
            font-size: 1rem;
            line-height: 1.6;
        }

        .list-group-item {
            background-color: var(--bg-pokemon-info, transparent);
            color: var(--text-secondary, #666666);
            border: 1px solid var(--border-color, #e0e0e0);
            font-weight: 600;
        }

        .card-footer {
            background-color: var(--bg-pokemon-info, transparent);
            border-top: 1px solid var(--border-color, #e0e0e0);
            padding: 1rem 1.5rem;
        }

        .btn {
            background: var(--button-bg, linear-gradient(135deg, #4a5568 0%, #2d3748 100%));
            color: var(--button-text, #ffffff);
            border: none;
            border-radius: 8px;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px var(--shadow-color, rgba(0, 0, 0, 0.1));
        }

        .btn:hover {
            background: var(--button-bg-hover, linear-gradient(135deg, #2d3748 0%, #1a202c 100%));
            transform: translateY(-2px);
            box-shadow: 0 4px 12px var(--shadow-hover, rgba(0, 0, 0, 0.2));
        }

        .btn:active {
            transform: translateY(0);
        }
    `;
}

customElements.define('pokemon-ficha-detalle', PokemonFichaDetalle);