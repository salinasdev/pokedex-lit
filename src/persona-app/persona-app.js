import { html, LitElement } from "lit";
import '../persona-header/persona-header.js';
import '../persona-main/persona-main.js';
import '../persona-footer/persona-footer.js';
import '../persona-sidebar/persona-sidebar.js';

class PersonaApp extends LitElement {

    render(){
        return html`
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <persona-header></persona-header>
            <div class="row">
                <persona-sidebar @new-person="${this.newPerson}" class="col-2"></persona-sidebar>
                <persona-main class="col-10"></persona-main>
            </div>
            
            <persona-footer></persona-footer>
        `;
    }

    newPerson(e){
        console.log("newPerson en persona-app");

        this.shadowRoot.querySelector("persona-main").showPersonForm = true;
    }
}

customElements.define('persona-app', PersonaApp);