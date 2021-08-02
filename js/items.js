/* ======================== ITEMS ========================*/

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
cameraListBuilder()