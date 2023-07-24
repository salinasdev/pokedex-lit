import { html, LitElement, css} from "lit";

class PokedexFooter extends LitElement {

    static get properties(){
        return {

        };

    }

    constructor(){
        super();
    }
    static styles = css`
    .mifooter {
        text-align: center;
        max-width: 540px;
        margin: -50px auto 0;
        color: white;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 55px;
      }
    `;

    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <div class="mifooter">
  <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <div class="col-md-4 d-flex align-items-center">
      <a href="/" class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
        <svg class="bi" width="30" height="24"><use xlink:href="#bootstrap"></use></svg>
      </a>
      <span class="text-muted">© 2021 salinasdev</span>
    </div>

    <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
      <li class="ms-3"><a class="text-muted" target="_blank" href="#"><img src="../img/twitter.svg" alt="Bootstrap" width="32" height="32"><use xlink:href="#twitter"></use></img></a></li>
      <li class="ms-3"><a class="text-muted" target="_blank" href="https://es.linkedin.com/in/v%C3%ADctor-salinas-villarrubia-b8a0b1132"><img src="../img/linkedin.svg" alt="Bootstrap" width="32" height="32"><use xlink:href="#instagram"></use></img></a></li>
      <li class="ms-3"><a class="text-muted" target="_blank" href="https://github.com/salinasdev"><img src="../img/github.svg" alt="salinasdev" width="32" height="32"><use xlink:href="https://github.com/salinasdev"></use></img</a></li>
      
    </ul>
  </footer>
</div>
        `;
    }
    
}



customElements.define('pokedex-footer', PokedexFooter);