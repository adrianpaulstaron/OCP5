/* ======================== GENERAL ========================*/

let params = (new URL(document.location)).searchParams;

// on crée une classe Camera
class Camera {
    constructor(id, name, price, description, imageUrl) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }
}

// la classe ApiConnector attend une url en argument, qui sera l'url générale de l'API
class ApiConnector {
    constructor (url) {
        this.url = url
    }
    // on crée une méthode asynchrone pour récupérer la liste des appareils de photo
    async getCameras() {
        // on fait une première promesse, un fetch qui va se connecter à l'API et ramener ce qu'il y a dans /cameras
        const result = await fetch(this.url + "/cameras")
            // on attend la réponse, puis on la transforme en objet json
            .then(response => response.json())
            // on attend que l'objet json soit créé, et on le return
            .then(data => data)
        return result
    }
    // on crée une méthode asynchrone pour récupérer un appareil de photo donné
    async getSelectedCamera(id){
        const result = await fetch(this.url + "/cameras/" + id)
            .then(response => response.json())
            .then(data => data)
        return result
    }
    async sendBasket(data){
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");    
        const result = await fetch(this.url + "/cameras/order", {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => data)
            // console.log(result.orderId)
        return result.orderId
    }
}

const apiConnection = new ApiConnector("http://localhost:3000/api")

// on crée une fonction qui va ajouter un espace aux nombres supérieurs à 999 pour les mettre au format
function addSpace(number){
    // on transforme le nombre en string
    number = number.toString()
    // si le nombre est supérieur à 999, on veut ajouter un espace
    if(number.length > 3) {
        // on déclare une variable contenant les 3 derniers chiffres du nombre
        let endOfNumber = number.substring(number.length, number.length-3)
        // on déclare une variable contenant les autres chiffres du nombre
        let beginningOfNumber = number.substring(number.length-3, 0)
        // on retourne les les autres chiffres du nombre, concaténés à un espace, concaténé aux 3 derniers chiffres du nombre
        return beginningOfNumber + " " + endOfNumber
    }else{
        return number
    }
}