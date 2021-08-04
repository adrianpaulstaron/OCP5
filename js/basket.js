/* ======================== PANIER ========================*/
// localStorage.clear();
// on crée une fonction qui récupère le panier
function getBasket() {
    // on récupère la valeur de la clef Basket, c'est donc une string
    let stringBasket = localStorage.getItem('Basket')
    // on transforme cette string en array contenant les IDs des appareils de photo
    let basket = stringBasket.split(","); 
    return basket
}
let basket = getBasket()
let totalPrice = 0
let camerasInBasket = []
async function basketListBuilder() {
    const itemsListBasket = document.getElementById('basketList');
    let basketIds = getBasket()
    let basketIdsObjects = []
    // on déclare une fonction pour trouver les IDs déjà existants dans un array
    function idFinder(array, id) {
        array.find(element => element === id);
        if(array.find(element => element === id)){
            // elle retourne true si elle trouve l'id cherché
            return true
        }
    } 
    let foundId
    for (let i = 0; i < basketIds.length; i++) {
        // on déclare une fonction pour trouver les IDs déjà existants dans un array
        function search(nameKey, array){
            for (var i=0; i < array.length; i++) {
                if (array[i].id === nameKey) {
                    return [i];
                }
            }
        }
        // on crée une variable qui exécute cette fonction dans un array que l'on va peupler avec des objets ayant pour attribut les IDs des appareils de photo et leur quantité
        foundId = search(basketIds[i], basketIdsObjects)
        if(!foundId){
            // si l'objet de l'appareil de photo courant n'existe pas, on push un objet dans l'array basketIdsList, ayant pour attributs l'id, et la quantité, qui est donc à 1.
            basketIdsObjects.push(
                {id : basketIds[i],
                quantity: 1}
            )
        }else{
            // si l'objet de l'appareil de photo courant existe, on incrémente sa quantité
            basketIdsObjects[foundId].quantity ++
        }
    } 
    let namesInBasket = []

    let currentCameraPriceSum = 0
    for (let i = 0; i < basketIdsObjects.length; i++) {
        let currentCamera = await apiConnection.getSelectedCamera(basketIdsObjects[i].id)
        let cameraPrice = addSpace(currentCamera.price)

        // on multiplie le prix de l'appareil de photo par sa quantité
        currentCameraPriceSum = currentCamera.price * basketIdsObjects[i].quantity
        // puis on l'ajoute à la variable contenant le prix total du panier
        totalPrice = totalPrice + currentCameraPriceSum

        itemsListBasket.innerHTML = itemsListBasket.innerHTML +
        `<div class="card mb-3 mx-3" style="max-width: 500px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${currentCamera.imageUrl}" class="img-fluid rounded-start" alt="cameraImg">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${currentCamera.name}</h5>
                        <p class="card-text">${currentCamera.description}</p>
                        <p class="card-text"><small class="text-muted">${cameraPrice} €</small></p>
                        <form id="quantityForm-${currentCamera._id}">
                        <input id="quantity-${basketIdsObjects[i].id}" name="quantity" type="number" class="form-control my-1 quantityFields" value=${basketIdsObjects[i].quantity} required>
                        </form>
                        <a href='#' class='btn btn-dark' id='${currentCamera._id}'>
                            Valider la quantité
                        </a>
                    </div>
                </div>
            </div>
        </div>`
        namesInBasket.push(currentCamera.name)
        camerasInBasket.push(currentCamera)
    }
    for (let i = 0; i < basketIdsObjects.length; i++) {
        document.getElementById(basketIdsObjects[i].id).addEventListener("click", () => {
            console.log("clic")
            // on met dans une variable la quantité entrée dans le formulaire
            let quantityValue = document.getElementById(`quantity-${basketIdsObjects[i].id}`).value
            let currentCameraId = basketIdsObjects[i].id
            // on édite la quantité de l'appareil de photo dans notre array
            basketIdsObjects[i].quantity = quantityValue
            console.log("quantité éditée dans l'array à : " + basketIdsObjects[i].quantity)
            // on récupère l'array panier
            console.log("=> panier récupéré du local storage (avant modification) : " + basket)
            // on en supprime toutes les occurences de l'appareil de photo courant
            temporaryBasket = basket.filter(function(element) {
                return element !== currentCameraId
            })
            basket = temporaryBasket
            console.log("=> panier après le filter : " + basket)
            // on boucle autant que la quantité de l'appareil de photo courant
            for (let j = 0; j < basketIdsObjects[i].quantity; j++){
                console.log("======== tour de boucle " + [j] + " ========")
                // et on push son ID à chaque tour de boucle
                basket.push(currentCameraId)
                console.log("contenu de basket : " + basket)
                localStorage.setItem('Basket', basket)
            }
            // on recharge la page
            window.location.reload();
        })
    }

    const totalPriceDiv = document.getElementById('totalPriceDiv')
    totalPriceDiv.innerHTML = `Prix total : <b>${
        addSpace(totalPrice)
        // totalPrice
    } €</b>`


    // for (let i = 0; i < basketIds.length; i++) {
    //     document.getElementById(basketIds[i]).addEventListener("click", () => {
    //         localStorage.removeItem(namesInBasket[i]);
    //         console.log("clic !")
    //         window.location.reload();
    //     })    
    // }
}
basketListBuilder()

document.getElementById('placeOrder').addEventListener("click", 
// on crée une fonction asynchrone pour traiter l'envoi de la commande
async () => {
    // on met dans deux variables les données à envoyer
    let contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value
    }
    let productsInBasket = getBasket()
    // on respecte la mise en forme demandée par l'API:
    // contact: {
    //     firstName: string,
    //     lastName: string,
    //     address: string,
    //     city: string,
    //     email: string
    // }
    // products: [string] <-- array of product _id
    let data = {
        contact: {
            firstName: contact.firstName,
            lastName: contact.lastName,
            address: contact.address,
            city: contact.city,
            email: contact.email
        },
        products: productsInBasket
    }
    // on attend la réponse du serveur pour récupérer l'ID de la commande
    let orderId = await apiConnection.sendBasket(data);
    const informationDiv = document.getElementById('informationDiv')
    // si l'API renvoie un numéro de commande, c'est qu'on lui a envoyé une requête satisfaisante, on vérifie donc la truthiness de notre variable orderId avant de vider le localStorage et de passer à la page de confirmation
    if(orderId){
        localStorage.clear();
        location.href = `orderconfirmation.html?order=${orderId}`
    }
    // si le localStorage a une longueur de 0, c'est qu'il n'y a rien dans le panier
    if(localStorage.length == 0){
        informationDiv.innerHTML = `Votre panier est vide.`
    }
    // si orderId est undefined et que localStorage n'a pas une longueur de 0, c'est que le formulaire n'a pas été rempli
    else{
        informationDiv.innerHTML = `Veuillez remplir la totalité des champs du formulaire.`
    }; 
})