import { html, LitElement } from "lit";
import '../pokedex-header/pokedex-header.js';
import '../pokedex-footer/pokedex-footer.js';
import '../pokedex-main/pokedex-main.js';

class PokedexApp extends LitElement {

    static get properties(){
        return {

        };

    }

    constructor(){
        super();
    }

    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <pokedex-header></pokedex-header>
        <pokedex-main></pokedex-main>
        <pokedex-footer></pokedex-footer>
        `;
    }
}

customElements.define('pokedex-app', PokedexApp);