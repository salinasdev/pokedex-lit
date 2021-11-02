import { html, LitElement } from "lit";

class PokedexFooter extends LitElement {

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
            <h5>@PokedexFooter 2021</h5>
        `;
    }
}

customElements.define('pokedex-footer', PokedexFooter);