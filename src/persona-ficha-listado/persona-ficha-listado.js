import { html, LitElement } from "lit";

class PersonaFichaListado extends LitElement {

    static get properties(){
        return {
            fname: {type: String},
            yearsInCompany: {type: Number},
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
            <img src="${this.photo.src}" alt="${this.photo.alt}"  class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${this.fname}</h5>
                <p class="card-text">${this.profile}</p>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">${this.yearsInCompany} años en la empresa.</li>
                </ul>
            </div>
            <div class="card-footer">
                <button @click="${this.deletePerson}" class="btn btn-danger col-5"><strong>X</strong></button>
                <button @click="${this.moreInfo}" class="btn btn-info col-5 offset-1"><strong>Info</strong></button>
            </div>
        </div>
        `;
    }

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

    moreInfo(e){
        console.log("moreInfo en persona-ficha-listado");
        console.log("Se a actualizar la persona de nombre " + this.fname);

        this.dispatchEvent(
            new CustomEvent(
                "update-person",
                {
                    "detail" : {
                        name : this.fname
                    }
                }
            )
        );
    }
}

customElements.define('persona-ficha-listado', PersonaFichaListado);