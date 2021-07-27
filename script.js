

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

function listCustomizationOptions(camera) {
    let innerHtmlListCustomizationOptions = 
    `<select class="form-select" aria-label="Default select example">`
    for (let i = 0; i < camera.lenses.length; i++){
        innerHtmlListCustomizationOptions = innerHtmlListCustomizationOptions +
        `<option>${camera.lenses[i]}</option>`
    }
    innerHtmlListCustomizationOptions = innerHtmlListCustomizationOptions + `</select><a href='basket.html' class='btn btn-dark m-4' id='add'>
    Ajouter au Panier
</a>`
    return innerHtmlListCustomizationOptions
}

// async function basketFiller() {
//     const fillBasket = document.getElementById('customizeCamera').addEventListener();
// }

async function cameraCustomizer(cameraId) {
    const customizeCamera = document.getElementById('customizeCamera');
    const selectedCamera = await apiConnection.getSelectedCamera(cameraId)
    let cameraPrice = addSpace(selectedCamera.price)
    customizeCamera.innerHTML = 
    `<div class='card m-2' style='width: 18rem;'><img class='card-img-top imageParams' src='${selectedCamera.imageUrl}' alt='${selectedCamera.name}'>
        <div class='card-body'>
            <h5 class='card-title'> 
                ${selectedCamera.name}
            </h5>
            <p class='card-text'> 
                ${selectedCamera.description}
            </p>
            <p> 
                ${cameraPrice} € 
            </p>
            ${listCustomizationOptions(selectedCamera)}
        </div>
    </div>`
    // for (let i = 0; i < selectedCamera.lenses.length; i++){
    //     document.getElementById('option-' + i).addEventListener("click", (e)=>{
    //         console.log("clic ! " + i)
    //     })}
    }

async function cameraListBuilder() {
    const itemsList = document.getElementById('itemsList');   
    let innerHtmlListItems    
    const cameraList = await apiConnection.getCameras()
    for (let i = 0; i < cameraList.length; i++) {
        let cameraPrice = addSpace(cameraList[i].price)
        innerHtmlListItems = innerHtmlListItems 
        + 
        `<div class='card m-2' style='width: 18rem;'><img class='card-img-top imageParams' src='${cameraList[i].imageUrl}' alt='${cameraList[i].name}'>
            <div class='card-body'>
                <h5 class='card-title'> 
                    ${cameraList[i].name}
                </h5>
                <p class='card-text'> 
                    ${cameraList[i].description}
                </p>
                <p> 
                    ${cameraPrice} € 
                </p>
                <a href='customization.html?camera=${cameraList[i]._id}' class='btn btn-dark' id='${cameraList[i]._id}'>
                    Personnaliser
                </a>
            </div>
        </div>`
    }
    // on slice 9 caractères car avant la boucle, innerHtmlList est undefined, et on ne veut pas voir "undefined" à l'affichage
    itemsList.innerHTML = innerHtmlListItems.slice(9)
}

let currentUrlArray = window.location.href.split("/")
let currentUrl = currentUrlArray[currentUrlArray.length-1].split('?')[0]
switch (currentUrl) {
    case 'index.html':
        cameraListBuilder()
        break;
    case 'customization.html':
        // récupération des données de l'url
        let params = (new URL(document.location)).searchParams;
        let cameraId = params.get('camera');
        cameraCustomizer(cameraId)
        break;
}

