let img_frigo_fermer = document.getElementById("img_frigo_fermer");
img_frigo_fermer.addEventListener("click", ouvrir_frigo);

function ouvrir_frigo(event){
    console.log("click");
    let img_frigo_ouvert = document.createElement("img");
    img_frigo_ouvert.id = "img_frigo_ouvert";
    img_frigo_ouvert.src = "theme/images/frigo/frigo_ouvert.png";
    document.getElementsByTagName("body")[0].replaceChild(img_frigo_ouvert,img_frigo_fermer );
}