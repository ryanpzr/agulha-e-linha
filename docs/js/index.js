var irInstagram = document.getElementById("irInstagram");

irInstagram.addEventListener("click", function () {
    window.location.href = "https://www.instagram.com/agulha_e_linha/"

})

var irFacebbok = document.getElementById("irFacebook");

irFacebbok.addEventListener("click", function () {
    window.location.href = "https://www.facebook.com/"

})

var irWhatsapp = document.getElementById("irWhatsapp");

irWhatsapp.addEventListener("click", function () {
    window.location.href = "https://api.whatsapp.com/send?phone=5551992776015&text=Ol%C3%A1,%20vim%20atrav%C3%A9s%20do%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20as%20bonecas!%20%F0%9F%A5%B0"

})

var brownDoll = document.getElementById("brownDoll");

brownDoll.addEventListener("click", function () {
    window.location.href = "https://api.whatsapp.com/send?phone=5551992776015&text=Ol%C3%A1,%20vim%20atrav%C3%A9s%20do%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20as%20bonecas!%20%F0%9F%A5%B0"

})

var purpleDoll = document.getElementById("purpleDoll");

purpleDoll.addEventListener("click", function () {
    window.location.href = "https://api.whatsapp.com/send?phone=5551992776015&text=Ol%C3%A1,%20vim%20atrav%C3%A9s%20do%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20as%20bonecas!%20%F0%9F%A5%B0"

})

// lock orientation to portrait
window.screen.lockOrientationUniversal = window.screen.lockOrientation || window.screen.mozLockOrientation || window.screen.msLockOrientation;

if (window.screen.lockOrientationUniversal("portrait")) {
    console.log("Orientation locked to portrait");
} else {
    console.log("Orientation lock failed.");
}

/*const search = () => {

    const searchbox = document.getElementById("search-item").value.toUpperCase();
    const storeitems = document.getElementById("first-cards")
    const product = document.querySelectorAll(".cardContent")
    const pname = document.getElementsByTagName("h2")

    for (var i = 0; i < pname.length; i++) {
        let match = cardContent[i].getElementsByTagName('h2')[0];

        if (match) {
            let textvalue = match.textContent || match.innerHTML

            if (textvalue.toUpperCase().indexOf(searchbox) > -1) {
                cardContent[i].style.display = "";
            } else {
                cardContent[i].style.display = "none";
            }
        }

    }

}*/