/* ======================== CUSTOMIZATION ========================*/

// on récupère l'ID de l'appareil de photo dans l'url
let cameraId = params.get('camera');

// on crée une fonction pour lister les options de personnalisation et un bouton d'ajoût au panier
function listCustomizationOptions(camera) {
    let innerHtmlListCustomizationOptions = 
    `<select class="form-select" aria-label="Default select example">`
    for (let i = 0; i < camera.lenses.length; i++){
        innerHtmlListCustomizationOptions = innerHtmlListCustomizationOptions +
        `<option>${camera.lenses[i]}</option>`
    }
    innerHtmlListCustomizationOptions = innerHtmlListCustomizationOptions + `</select><a href='basket.html' class='btn btn-dark m-4' id='addtobasket'>
        Ajouter au Panier
    </a>`
    return innerHtmlListCustomizationOptions
}

// on crée une fonction qui génère le html affichant l'appareil de photo dans la page de personnalisation
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
    document.getElementById('addtobasket').addEventListener("click", () => {
        if(localStorage.getItem('Basket') == null || localStorage.getItem('Basket') == ""){
            // si la clef Basket n'existe pas ou qu'elle a comme valeur une string vide (ce qui arrive si jamais on vide le panier de tous ses appareils de photo), on la crée et on lui assigne l'id de l'appareil de photo qu'on veut ajouter au panier
            localStorage.setItem('Basket', selectedCamera._id)
        }else{
            // si la clef basket existe, on récupère sa valeur
            let currentBasket = localStorage.getItem('Basket');
            // on la concatène avec la l'ID du nouvel appareil de photo
            let newBasket = currentBasket + "," + selectedCamera._id
            // on remplace la valeur dans le local storage
            localStorage.setItem('Basket', newBasket)
        }
    })
}
cameraCustomizer(cameraId)
