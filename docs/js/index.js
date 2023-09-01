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

function VerificarBoneca() {
    let nome = document.getElementById("searchBoneca").value.toLowerCase(); // Obtém o valor do input

    var divsProdutos = document.querySelectorAll(".cardContent");

    switch (nome) {
        case "duda":
            exibirDiv("duda");
            document.getElementById("teste").innerHTML = "";
            break;

        case "maria":
            exibirDiv("maria");
            document.getElementById("teste").innerHTML = "";

            break;

        case "roberta":
            exibirDiv("roberta");
            document.getElementById("teste").innerHTML = "";

            break;

        case "claudia":
            exibirDiv("claudia");
            document.getElementById("teste").innerHTML = "";

            break;

        case "luiza":
            exibirDiv("luiza");
            document.getElementById("teste").innerHTML = "";

            break;

        case "edlen":
            exibirDiv("edlen");
            document.getElementById("teste").innerHTML = "";

            break;

        default:
            // Nome não encontrado, mostra todas as divs de produtos
            divsProdutos.forEach(function (div) {
                div.style.display = "block";

            });
            document.getElementById("teste").innerHTML = "Não encontrado...";

            // Configura um temporizador para limpar a mensagem "Não encontrado..." após 3 segundos (3000 milissegundos)
            setTimeout(function () {
                document.getElementById("teste").innerHTML = "";
            }, 3000); // 3000 milissegundos = 3 segundos
    }
}

function exibirDiv(id) {
    var divsProdutos = document.querySelectorAll(".cardContent");
    divsProdutos.forEach(function (div) {
        if (div.id === id) {
            div.style.display = "block";

        } else {
            div.style.display = "none";
        }
    });
}

// lock orientation to portrait
window.screen.lockOrientationUniversal = window.screen.lockOrientation || window.screen.mozLockOrientation || window.screen.msLockOrientation;

if (window.screen.lockOrientationUniversal("portrait")) {
    console.log("Orientation locked to portrait");
} else {
    console.log("Orientation lock failed.");
}

