import { html, LitElement, css } from "lit";
import '../persona-ficha-listado/persona-ficha-listado.js';
import '../persona-form/persona-form.js';
import '../persona-data/persona-data.js';



class PersonaMain extends LitElement {


    static get properties(){
        return {
           people: {type: Array},
           showPersonForm: {type: Boolean}

        };

    }

    constructor(){
        super();

        this.people = [];

        this.showPersonForm = false;
    }



    render(){
        return html`
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <h2 class="text-center">Personas</h2>
            <div class="row" id="peopleList">
                <div class="row row-cols-1 row-cols-sm-4">
                ${this.people.map(
                    person => html`<persona-ficha-listado 
                                    fname="${person.name}" 
                                    yearsInCompany="${person.yearsInCompany}"
                                    profile="${person.profile}"
                                    .photo="${person.photo}"
                                    @delete-person="${this.deletePerson}"
                                    @update-person="${this.moreInfo}"
                                ></persona-ficha-listado>`
                )}
                </div>
            </div>
            <div class="row">
                <persona-form @persona-form-store="${this.personaFormStore}" 
                              @persona-form-close="${this.goBack}" 
                              class="d-none border rounded border-primary" 
                              id="personForm">
                </persona-form>
            </div>
            <persona-data @people-data-updated="${this.peopleDataUpdated}"></persona-data>
            
        `;
    }
    //la funcion updated(changedProperties) se ejecuta siempre que cambia el valor de una propiedad
    updated(changedProperties){
        console.log("updated");

        if (changedProperties.has("showPersonForm")){
            console.log("Ha cambiado el valor de la propiedad showPersonForm en persona-main");

            if (this.showPersonForm === true){
                this.showPersonformData();
            }else{
                this.showPersonformList();
            }
        }



    }

    peopleDataUpdated(e){
        console.log("peopleDataUpdated");

        this.people = e.detail.people;
    }

    showPersonformData(){
        console.log("showPersonformData");
        console.log("Mostrando Formulario de persona");

        this.shadowRoot.getElementById("personForm").classList.remove("d-none");
        this.shadowRoot.getElementById("peopleList").classList.add("d-none");

    }

    showPersonformList(){
        console.log("showPersonformList");
        console.log("Mostrando listado de personas");
        this.shadowRoot.getElementById("personForm").classList.add("d-none");
        this.shadowRoot.getElementById("peopleList").classList.remove("d-none");
    }

    deletePerson(e){
        console.log("deletePerson en persona-main");
        console.log("Se va a borrar " + e.detail.name);

        //Borrar un elemento de array filtrando por el nombre que nos llega de persona-ficha-listado
        this.people = this.people.filter(
            person => person.name != e.detail.name
        );
    }

    goBack(e){
        console.log("goBack desde persona-main");
        this.showPersonForm = false;

    }

    personaFormStore(e){
        console.log("personaFormStore en persona-main");
        console.log("Se va almacenar una persona");
        console.log(e.detail.person);
        
        if(e.detail.editingPerson === true){
            console.log("Se va a actualizar la persona de nombre " + e.detail.person.name);

            //Devuelve el INDICE (numerico) del elemento que ha encontrado. Si no lo encuentra vale -1
            let indexOfPerson = this.people.findIndex(
                person => person.name === e.detail.person.name
            );

            if (indexOfPerson >= 0){
                console.log("Persona encontrada");

                this.people[indexOfPerson] = e.detail.person;
            }
        }else{
            console.log("Se va a almacenar una persona nueva ");
            this.people.push(e.detail.person);
        }

        console.log("Proceso terminado");

        

        this.showPersonForm = false;
    }

    moreInfo(e){
        console.log("moreInfo en persona-main");
        console.log("Se pide mas info de " + e.detail.name);
        
        //Buscamos la persona en el array:
        let chosenPerson = this.people.filter(
            person => person.name == e.detail.name  
        );
        //OJOO! Esto no devuelve el objeto, si no un array con el objeto dentro
        //console.log(chosenPerson);
        //Habria que acceder al primer elemento del array, y luego acceder a las propiedades del objeto:
        //console.log(chosenPerson[0].name);
        
        //Creamos un objeto y le asignamos los atributos:
        let person = {};
        person.name = chosenPerson[0].name;
        person.profile = chosenPerson[0].profile;
        person.yearsInCompany = chosenPerson[0].yearsInCompany;

        console.log(person);
        
        //Mandamos a persona-form el objeto que acabamos de crear:
        this.shadowRoot.getElementById("personForm").person = person;

        //Mandamos a persona-form el boolean que tiene en la propiedad
        this.shadowRoot.getElementById("personForm").editingPerson = true;

        //Mostramos el formulario:
        this.showPersonForm = true;
    }
}

customElements.define('persona-main', PersonaMain);
