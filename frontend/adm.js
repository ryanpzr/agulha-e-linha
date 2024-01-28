document.addEventListener('DOMContentLoaded', function () {
    const addItemForm = document.getElementById('addItemForm');
    const main = document.getElementById('cards-toy');

    // Função para carregar todas as bonecas ao carregar a página
    function carregarTodasBonecas() {
        // Solicita todas as bonecas ao servidor
        fetch('https://agulha-e-linha-backend-production.up.railway.app/get', {
            method: 'GET' // Especifica o método HTTP como GET
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erro ao buscar dados do servidor.');
                }
            })
            .then(data => {
                // Renderize as bonecas na tela
                data.forEach(boneca => {
                    const novoItem = criarElementoBoneca(boneca);
                    main.appendChild(novoItem);
                });
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error.message);
            });
    }

    carregarTodasBonecas();

    function criarElementoBoneca(boneca) {
        const novoItem = document.createElement('div');
        novoItem.classList.add('cardContent');

        novoItem.innerHTML = `
            <img class="image" src="${boneca.foto}" />
            <h2>${boneca.nome}</h2>
            <p class="second-text-description">${boneca.subnome}</p>
            <p class="full-price">R$${boneca.preco},00</p>
            <p class="parceled-price">em até 5X de ${boneca.subpreco},51</p>
            <button class="buttom-cards" onclick="comprarBoneca()"><img src="./img/whatsapp.png"> <span>Compre pelo WhatsApp</span></button>
        `;

        return novoItem;
    }

});

function comprarBoneca() {
    window.location.href = 'https://api.whatsapp.com/send?phone=5551992776015&text=Ol%C3%A1,%20vim%20atrav%C3%A9s%20do%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20as%20bonecas!%20%F0%9F%A5%B0';

}

function irFacebook() {
    window.location.href = 'https://www.facebook.com/';

}

function irInstagram() {
    window.location.href = 'https://www.instagram.com/agulha_e_linha/';

}
