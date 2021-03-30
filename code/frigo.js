let img_frigo_fermer = document.getElementById("frigo");
document.addEventListener("click", ouvrir_frigo);

function ouvrir_frigo(event){
    console.log("click");
    document.getElementsByTagName("body")[0].style.backgroundImage= "url(D:/mathi/Documents/Ecole/techno_web/mini_projet/theme/images/frigo/frigo_ouvert_dessin_cuisine.png)";
   
}