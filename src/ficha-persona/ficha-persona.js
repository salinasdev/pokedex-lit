import { html, LitElement } from "lit-element";

class FichaPersona extends LitElement {

    static get properties(){
        return {
            name: {type: String},
            yearsInCompany: {type: Number},
            personInfo: {type: String}
        }
    }

    constructor(){
        super();

        this.name = "Prueba";
        this.yearsInCompany = 2;

        //this.updatePersonInfo();
        
    }

    updated(changedProperties){
        console.log("updated");

        changedProperties.forEach((oldValue, propName) => {
            console.log("Propiedad " + propName + " cambia valor, anterior era " + oldValue);
        });

        if (changedProperties.has("name")){
            console.log("Propiedad name cambia valor anterior era " + changedProperties.get("name") + " nuevo es " + this.name);
        }

        if(changedProperties.has("yearsInCompany")){
            console.log("Propiedad yearsInCompany cambia valor anterior era " + changedProperties.get("yearsInCompany") + " nuevo es " + this.yearsInCompany);
            this.updatePersonInfo();
        }
    }

    render(){
        return html`
            <div>
                <label>Nombre Completo</label>
                <input type="text" id="fname" value="${this.name}" @change="${this.updateName}"></input>
                <br />
                <label>Años en la empresa</label>
                <input type="number" value="${this.yearsInCompany}" @change="${this.updateYearsInCompany}"></input>
                <br />
                <label>Categoria:</label>
                <input type="text" value="${this.personInfo}" disabled></input>
                <br />
                <button>Enviar</button>
            </div>
        `;
    }

    updateName(e){
        console.log("updateName");

        this.name = e.target.value;
    }

    updateYearsInCompany(e){
        console.log("updateYearsInCompany");

        this.yearsInCompany = e.target.value;

    }

    updatePersonInfo() {
        console.log("updatePersonInfo");

        if (this.yearsInCompany >= 7) {
            this.personInfo = "lead";
        }
        else if (this.yearsInCompany >= 5) {
            this.personInfo = "senior";
        }
        else if (this.yearsInCompany >= 3) {
            this.personInfo = "team";
        }
        else {
            this.personInfo = "junior";
        }
    }
}

customElements.define('ficha-persona', FichaPersona);