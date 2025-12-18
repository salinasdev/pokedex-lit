import { html, LitElement, css } from "lit";
import '../pokedex-header/pokedex-header.js';
import '../pokedex-footer/pokedex-footer.js';
import '../pokedex-main/pokedex-main.js';
// import '../pokemon-events/pokemon-events.js'; // TEMPORALMENTE DESHABILITADO

class PokedexApp extends LitElement {

    static get properties(){
        return {

        };

    }

    constructor(){
        super();
    }

    static styles = css`
        :host {
            display: block;
            min-height: 100vh;
            background-color: var(--bg-primary, #f5f7fa);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            flex-direction: column;
        }
    `;

    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <pokedex-header></pokedex-header>
        <pokedex-main></pokedex-main>
        <pokedex-footer></pokedex-footer>
        <!-- <pokemon-events></pokemon-events> TEMPORALMENTE DESHABILITADO -->
        `;
    }
}

customElements.define('pokedex-app', PokedexApp);