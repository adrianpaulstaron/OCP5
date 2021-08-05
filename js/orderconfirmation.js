// on récupère l'ID de la commande
let orderId = params.get('order');

const confirmationMessage = document.getElementById('confirmationMessage');

confirmationMessage.innerHTML = `
<div>Votre commande a bien été enregistrée. Son numéro est le <b>${orderId}</b>.</div>
`