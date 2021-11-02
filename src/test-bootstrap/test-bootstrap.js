import { html, LitElement, css } from "lit";

class TestBootstrap extends LitElement {

    static get styles(){
        return  css`
            .redbg {
                background-color: red;
            }
            .greenbg {
                background-color: green;
            }
            .bluebg {
                background-color: blue;
            }
            .greybg {
                background-color: grey;
            }
        `;
    }

    constructor(){
        super();
    }

    render(){
        return html`
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <h3>Test Bootstrap</h3>
            <div class="row greybg">
                <div class="col-2 offset-1 redbg">Col 1</div>
                <div class="col-3 col-sm-1 greenbg">Col 2</div>
                <div class="col-4 col-sm-1 bluebg">Col 3</div>
            </div>
        `;
    }
}

customElements.define('test-bootstrap', TestBootstrap);