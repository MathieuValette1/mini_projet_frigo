///URL d'accès à l'api. Mathieu Valette = rang 46
const mon_id = "46";
const url_api = "https://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigo/public/"+mon_id+"/produits";

///const url_api_test =  "https://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigo/public/1/produits";
////Variables globales

var produits;
var tableau_creer = false;


///GET

let bouton_affiche_prod = document.getElementById("affiche_prod");

bouton_affiche_prod.addEventListener("click", affiche_produits);

function affiche_produits(event){

    let fetchOptions = {method:'GET'};
    ///empeche le rechargement de la page
    event.preventDefault();
    /// req ajax

    fetch(url_api, fetchOptions)
        .then((response)=>{
            return response.json();
        })
        .then((dataJSON)=>{

            produits = dataJSON;
            console.log("Liste des produits: ",produits);
            creation_element_tableau();
            document.getElementById("rows_produits").innerHTML="";
            for(produit of produits){
                creation_cellule(produit);
            }
        })
        .catch((error)=>{
            console.log(error)
        })
}

///POST

let bouton_ajouter_prod = document.getElementById("ajouter_prod");
bouton_ajouter_prod.addEventListener("click", ajouter_produit);
bouton_ajouter_prod.addEventListener("click", affiche_produits);

function ajouter_produit(event){
    /**
     * Requete ajax ajoutant un nouveau produit
     */
    if (document.getElementById("ecrire_produit").value){
        let nom_produit = capitalizePremiereLettre(document.getElementById("ecrire_produit").value);
        var qte_produit = document.getElementById("ecrire_qte_produit").value;  
        let produit={"nom": nom_produit, "qte": qte_produit};
        let nouveau = true;
        try {
            if (produits.includes(produit)){
                nouveau = false;
                console.log(nouveau);
            }
        
        } catch (error) {
            
        }
       
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let fetchOptions={
            method:'POST',
            headers: myHeaders,
            body: JSON.stringify(produit)   
        }
        fetch(url_api, fetchOptions)
        .then((response)=>{
            if (nouveau){
                creation_cellule(produit);
            }
            else{
                document.getElementById('qte_'+produit.nom).textContent=parseInt(document.getElementById('qte_'+produit.nom).textContent)+qte_produit;
            }
            
            return response.json();
        })
        .then((dataJSON)=>{
            
        })
        .catch((error)=>{
            console.log(error);})
    }
}

///DELETE

let bouton_supprimer_prod = document.getElementById("supprimer_prod");
bouton_supprimer_prod.addEventListener("click", supprimer_produit)
bouton_supprimer_prod.addEventListener("click", affiche_produits)
document.addEventListener("click", affiche_produits)

function supprimer_produit(event){
    /**
     * Requête ajax supprimant totalement un produit de l'api
     */

    if (document.getElementById("ecrire_produit").value){
        let id_produit;
        let produit_suppr;
        try {
            let nom_produit = capitalizePremiereLettre(document.getElementById("ecrire_produit").value);
        
            for (produit of produits){
                if(nom_produit == produit.nom){
                    id_produit=produit.id;
                    produit_suppr = produit;
                    console.log(produit_suppr);
                }
            }
            console.log("id:",id_produit, nom_produit);
        } catch (error) {
            console.log("Regardez ce qu'il y a dans le figo avant de vouloir supprimer!")
        }
        
        let myHeaders = new Headers();
        let url_produit_a_supprimer = url_api+"/"+id_produit;
        myHeaders.append("Content-Type", "application/json");
        let fetchOptions={
            method:'DELETE',
            headers: myHeaders,   
        }
        fetch(url_produit_a_supprimer, fetchOptions)
        .then((response)=>{
            suppression_cellule(id_produit);
            return response.json();
        })
        .then((dataJSON)=>{
            console.log(dataJSON);
        })
        .catch((error)=>{
            console.log(error);})
    }
}

///PUT
/**
function modifier_qte_produit(event){
    let nom_produit = event.target.id.split("_")[1];
    let qte_produit = event.target.id.split("_")[2];

    let input = "<input type=\"number\" required value=\""+qte_produit+"\"/>"
   
    document.getElementById("qte_"+nom_produit+'_'+qte_produit).textContent="";
    document.getElementById("qte_"+nom_produit+'_'+qte_produit).innerHTML = input;
}*/

///SEARCH

document.getElementById('rechercher_prod').addEventListener("click", rechercher_prod)

function rechercher_prod(event){
    let recherche = document.getElementById("ecrire_produit").value;
    let fetchOptions = {method:'GET'};
    ///empeche le rechargement de la page
    event.preventDefault();
    /// req ajax
    let url_search = url_api+"?search="+document.getElementById("ecrire_produit").value;
    fetch(url_search, fetchOptions)
        .then((response)=>{
            return response.json();
        })
        .then((dataJSON)=>{

            let div = document.getElementById("result");
            div.textContent="";
            resultats = dataJSON;
            if (resultats.length >0){
                console.log("Résultat pour: ",document.getElementById("ecrire_produit").value, resultats);
                let txt_resultat = "Résultat pour " + recherche +" :\n " 
                for(produit of resultats){
                     txt_resultat+= produit.nom +" en quantité " + produit.qte + "\n";
                }
                div.textContent = txt_resultat;
            }
            else{
                div.textContent = "Aucun résultat. Le produit n'est peut-être pas dans le frigo."
            }
            
        })
        .catch((error)=>{
            console.log(error)
        })
}


/**  Fonctions utilitaires*/
function capitalizePremiereLettre(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function creation_element_tableau(){
    /**
     * Créé un tableau si celui ci n'a pas déjà été créé
     */
    if (!tableau_creer){
        ///Le tableau
        let elt_tableau = document.createElement("table")
        elt_tableau.id = "tableau_recap_produits";
        elt_tableau.style.border="solid";
        document.getElementById("gestion_produits").appendChild(elt_tableau);

        ///Entete
        let caption = document.createElement("caption");
        caption.textContent = "Produits présents dans le frigo";


        document.getElementById("tableau_recap_produits").appendChild(caption);

        ///head
        let head = document.createElement("thead");
        head.innerHTML = "<tr><th>Produit</th><th>Quantité</th><th>Gestion</th></tr>";
        document.getElementById("tableau_recap_produits").appendChild(head);    

        ///body
        let body = document.createElement("tbody");
        body.id = "rows_produits";
        document.getElementById("tableau_recap_produits").appendChild(body);  

        tableau_creer=true;
    }
}

function creation_cellule(produit){
    /**
     * creer une ligne
     */

    let row = document.createElement("tr");
    row.id = produit.id;
    row.innerHTML ="<td>"
                    +produit.nom
                    +"</td><td id=\"qte_"
                    +produit.nom+'_'+produit.qte
                    +"\">"
                    +produit.qte
                    +"</td><td>"
                    +creation_bouton_plus(produit)+creation_bouton_moins(produit)+creation_bouton_supprimer()
                    +"</td>";
    document.getElementById("rows_produits").appendChild(row);
    document.getElementById("ajouter_"+produit.nom+"_"+produit.id).addEventListener("click", ajouter_produit_bouton);
    document.getElementById("enlever_"+produit.nom+"_"+produit.id+"_"+produit.qte).addEventListener("click", enlever_produit_bouton);
    document.getElementById("supprimer_"+produit.nom+"_"+  produit.id).addEventListener("click", supprimer_produit_bouton);
    ///document.getElementById("qte_"+produit.nom+'_'+produit.qte).addEventListener("click", modifier_qte_produit);
}

function suppression_cellule(id_produit){
    /**
     * Supprimer une ligne
     */
    document.getElementById("rows_produits").removeChild(document.getElementById(id_produit));
}

function creation_bouton_plus(produit){
    /**
     * Création d'un bouton "plus + 1" sur une ligne. 
     */
    return "<input class=\"btn_clic\" id=\"ajouter_"+produit.nom+"_"+ produit.id+"\" type =\"button\" value=\"+1\"/>";
}

function creation_bouton_moins(produit){
    /**
     * Création d'un bouton "moins - 1" sur une ligne. L'id contient la quantité pour pouvoir être utilisée facilement dans la fonction de suppression.
     */
    return "<input class=\"btn_clic\" id=\"enlever_"+produit.nom+"_"+  produit.id+"_"+produit.qte+"\" type =\"button\" value=\"-1\"/>";
}

function creation_bouton_supprimer(){
    /**
     * Création d'un bouton "moins - 1" sur une ligne. L'id contient la quantité pour pouvoir être utilisée facilement dans la fonction de suppression.
     */
    return "<input class\"suppr\"  id=\"supprimer_"+produit.nom+"_"+  produit.id+"\" type =\"image\" src=\"D:/mathi/Documents/Ecole/techno_web/mini_projet/theme/images/icon/poubelle.png\"/>";

}

/** GESTION des produits à partir des boutons du tableau*/

function ajouter_produit_bouton(event){
    /**
     *Pour ajouter 1 seule unité d'un produit s'il y en a plus que 1

     */
    let id_bouton = event.target.id;
    let nom = id_bouton.split("_")[1];
    let nom_produit = capitalizePremiereLettre(nom); 
    let produit={"nom": nom_produit, "qte": 1};

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let fetchOptions={
        method:'POST',
        headers: myHeaders,
        body: JSON.stringify(produit)   
    }
    fetch(url_api, fetchOptions)
    .then((response)=>{
        document.getElementById('qte_'+nom_produit).textContent=parseInt(document.getElementById('qte_'+nom_produit).textContent)+1;
        return response.json();
    })
    .then((dataJSON)=>{
        
    })
    .catch((error)=>{
        console.log(error);})
    
}


function enlever_produit_bouton(event){
    /**
     *Pour supprimer 1 seule unité d'un produit. On enlève 1 s'il y en a plus que 1, sinon on supprime tout
     */

    let id_bouton = event.target.id;
    let nom = id_bouton.split("_")[1];
    let id = id_bouton.split("_")[2];
    let qte = id_bouton.split("_")[3];
    if (qte>1){
        let nom_produit = capitalizePremiereLettre(nom); 
        let produit={"nom": nom_produit, "qte": -1};

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let fetchOptions={
            method:'POST',
            headers: myHeaders,
            body: JSON.stringify(produit)   
        }
        fetch(url_api, fetchOptions)
        .then((response)=>{
            document.getElementById('qte_'+nom).textContent=parseInt(document.getElementById('qte_'+nom).textContent)-1;
            return response.json();
        })
        .then((dataJSON)=>{
            
        })
        .catch((error)=>{
            console.log(error);})
    }
    else{


        let myHeaders = new Headers();
        let url_produit_a_supprimer = url_api+"/"+id;
        myHeaders.append("Content-Type", "application/json");
        let fetchOptions={
            method:'DELETE',
            headers: myHeaders,   
        }
        fetch(url_produit_a_supprimer, fetchOptions)
        .then((response)=>{
            suppression_cellule(id);
            return response.json();
        })
        .then((dataJSON)=>{
            console.log(dataJSON);
        })
        .catch((error)=>{
            console.log(error);})
    }
}

function supprimer_produit_bouton(event){
    let id_produit = event.target.id.split('_')[2];

    let myHeaders = new Headers();
    let url_produit_a_supprimer = url_api+"/"+id_produit;
    myHeaders.append("Content-Type", "application/json");
    let fetchOptions={
        method:'DELETE',
        headers: myHeaders,   
    }
    fetch(url_produit_a_supprimer, fetchOptions)
    .then((response)=>{
        suppression_cellule(id_produit);
        return response.json();
    })
    .then((dataJSON)=>{
        console.log(dataJSON);
    })
    .catch((error)=>{
        console.log(error);})
}

