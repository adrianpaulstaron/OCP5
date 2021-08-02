/* ======================== PANIER ========================*/

// on crée une fonction qui récupère le panier
function getBasket() {
    // on récupère la valeur de la clef Basket, c'est donc une string
    let stringBasket = localStorage.getItem('Basket')
    // on transforme cette string en array contenant les IDs des appareils de photo
    let basket = stringBasket.split(","); 
    return basket
}
let camerasInBasket = []

async function basketListBuilder() {
    const itemsListBasket = document.getElementById('basketList');   
    let basketIds = getBasket()
    console.log("basket ids => " + basketIds)
    let namesInBasket = []
    // console.log("basket IDs : " + basketIds)
    for (let i = 0; i < basketIds.length; i++) {
        let currentCamera = await apiConnection.getSelectedCamera(basketIds[i])
        let cameraPrice = addSpace(currentCamera.price)
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
                        <a href='#' class='btn btn-dark' id='${currentCamera._id}'>
                            Retirer du Panier
                        </a>
                    </div>
                </div>
            </div>
        </div>`
        namesInBasket.push(currentCamera.name)
        camerasInBasket.push(currentCamera)
    }
    for (let i = 0; i < basketIds.length; i++) {
        document.getElementById(basketIds[i]).addEventListener("click", () => {
            localStorage.removeItem(namesInBasket[i]);
            console.log("clic !")
            window.location.reload();
        })    
    }
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