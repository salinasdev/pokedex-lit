import { html, LitElement } from "lit";

class PersonaData extends LitElement {

    static get properties(){
        return {
            people: {type: Array}
        };

    }

    constructor(){
        super();

        this.people = [
            {
                name: "Lewis Hamilton",
                yearsInCompany: 10,
                photo: {
                    src: "./img/hamilton-soymotor.png",
                    alt: "Lewis Hamilton"
                },
                profile: "MERCEDES AMG PETRONAS FORMULA ONE TEAM"
            }, {
                name: "Valtteri Bottas",
                yearsInCompany: 2,
                photo: {
                    src: "./img/bottas-soymotor.png",
                    alt: "Valtteri Bottas"
                },
                profile: "MERCEDES AMG PETRONAS FORMULA ONE TEAM"
            }, {
                name: "Max Verstappen",
                yearsInCompany: 5,
                photo: {
                    src: "./img/verstappen-soymotor.png",
                    alt: "Max Verstappen"
                },
                profile: "RED BULL RACING"
            }, {
                name: "Sergio Pérez",
                yearsInCompany: 1,
                photo: {
                    src: "./img/perez-soymotor.png",
                    alt: "Sergio Pérez"
                },
                profile: "RED BULL RACING"
            }, {
                name: "Lando Norris",
                yearsInCompany: 3,
                photo: {
                    src: "./img/norris-soymotor.png",
                    alt: "Lando Norris"
                },
                profile: "MCLAREN F1 TEAM"
            }
        ]
    }

    updated(changedProperties){
        console.log("updated persona-data");

        if(changedProperties.has("people")){
            console.log("Ha cambiado el valor de la propiedad people");

            this.dispatchEvent(
                new CustomEvent(
                    "people-data-updated",
                    {
                        detail : {
                            people : this.people
                        }
                    }
                )
            );
        }

    }

    
}

customElements.define('persona-data', PersonaData);