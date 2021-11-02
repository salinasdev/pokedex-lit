import { html, LitElement } from "lit";

class PersonaForm extends LitElement {

    static get properties(){
        return {
            person: {type: Object},
            editingPerson: {type: Boolean}

        };

    }

    constructor(){
        super();

        //Inicializamos la persona
        this.resetFormData();

        
    }

    render(){
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <div>
            <form>
                <div class="form-group">
                    <label>Nombre completo</label>
                    <input @input="${this.updateName}" 
                           type="text" class="form-control" 
                           placeholder="Nombre completo" 
                           .value="${this.person.name}" 
                           ?disabled="${this.editingPerson}"/>
                </div>
                <div class="form-group">
                    <label>Perfil</label>
                    <textarea  @input="${this.updateProfile}" class="form-control" placeholder="Perfil" rows="5" .value="${this.person.profile}"></textarea>
                </div>
                <div class="form-group">
                    <label>Años en la empresa</label>
                    <input @input="${this.updateYearsInCompany}" type="text" class="form-control" placeholder="Años en la empresa" .value="${this.person.yearsInCompany}"/>
                </div>
                <button @click="${this.goBack}" class="btn btn-primary"><strong>Atrás</strong></button>
                <button @click="${this.storePerson}" class="btn btn-success"><strong>Guardar</strong></button>
            </form>
        </div>
        `;
    }

    goBack(e){
        console.log("goBack");
        //Quitamos el submit del formulario:
        e.preventDefault();
        //Inicializamos la persona
        this.resetFormData(); 
        this.dispatchEvent(new CustomEvent("persona-form-close",{}));
    }

    resetFormData(){
        console.log("resetFormData");
        this.person = {};
        this.person.name = "";
        this.person.profile = "";
        this.person.yearsInCompany = "";
        this.editingPerson = false;
    }

    updateName(e){
        console.log("updateName");
        console.log("Actualizando la propiedad name con el valor " + e.target.value);

        this.person.name = e.target.value;
    }

    updateProfile(e){
        console.log("updateProfile");
        console.log("Actualizando la propiedad profile con el valor " + e.target.value);

        this.person.profile = e.target.value;
    }

    updateYearsInCompany(e){
        console.log("updateYearsInCompany");
        console.log("Actualizando la propiedad yearsInCompany con el valor " + e.target.value);

        this.person.yearsInCompany = e.target.value;
    }

    storePerson(e){
        console.log("storePerson");

        //Quitamos el submit del formulario:
        e.preventDefault();

        console.log("La propiedad name vale           " + this.person.name);
        console.log("La propiedad profile vale        " + this.person.profile);
        console.log("La propiedad yearsInCompany vale " + this.person.yearsInCompany);

        this.person.photo = {
            src: "./img/stig.png",
            alt: "Persona"
        }

        this.dispatchEvent(
            new CustomEvent(
                "persona-form-store", {
                    detail: {
                        person: {
                            name: this.person.name,
                            profile: this.person.profile,
                            yearsInCompany: this.person.yearsInCompany,
                            photo: this.person.photo
                        },
                        editingPerson : this.editingPerson
                    }
                }
                
            )
        );
    }
}

customElements.define('persona-form', PersonaForm);