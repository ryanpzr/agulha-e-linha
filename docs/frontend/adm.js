document.addEventListener('DOMContentLoaded', function () {
    const addItemForm = document.getElementById('addItemForm');
    const main = document.getElementById('cards-toy');

    // Função para carregar todas as bonecas ao carregar a página
    function carregarTodasBonecas() {
        // Solicita todas as bonecas ao servidor
        fetch('https://agulha-e-linha-production.up.railway.app/index.html/upload', {
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

    // Chame a função para carregar todas as bonecas após o carregamento da página
    carregarTodasBonecas();

    addItemForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const valorTitulo = document.getElementById('nome').value;
        const valorSubTitulo = document.getElementById('subnome').value;
        const valorPreco = document.getElementById('preco').value;
        const valorSubPreco = document.getElementById('subpreco').value;
        const valorFoto = document.getElementById('foto').files[0]; // Obtém o arquivo de imagem

        if (valorTitulo && valorSubTitulo && valorPreco && valorSubPreco && valorFoto) {
            const formData = new FormData();

            formData.append('nome', valorTitulo);
            formData.append('subnome', valorSubTitulo);
            formData.append('preco', valorPreco);
            formData.append('subpreco', valorSubPreco);
            formData.append('foto', valorFoto);

            fetch('https://agulha-e-linha-production.up.railway.app/adm.html/upload', {
                method: 'POST',
                body: formData // Envie o FormData que inclui a imagem
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Erro ao enviar dados para o servidor.');
                    }
                })
                .then(data => {
                    // Os dados foram enviados com sucesso, você pode atualizar a interface aqui.
                    const novoItem = criarElementoBoneca(data);
                    main.appendChild(novoItem);

                    console.log('Dados enviados com sucesso:', data);
                })
                .catch(error => {
                    console.error('Erro ao enviar dados:', error.message);
                });

            addItemForm.reset();
        } else {
            alert('Preencha todos os campos e selecione uma imagem antes de adicionar o item.');
        }
    });

    function criarElementoBoneca(boneca) {
        const novoItem = document.createElement('div');
        novoItem.classList.add('cardContent');

        // Use a URL dinâmica com base no nome da boneca
        const imageUrl = `https://agulha-e-linha-production.up.railway.app/index.html/imagem/${boneca.nome}`;

        novoItem.innerHTML = `
            <img class="image" src="${imageUrl}" />
            <h2>${boneca.nome}</h2>
            <p class="second-text-description">${boneca.subnome}</p>
            <p class="full-price">R$${boneca.preco}</p>
            <p class="parceled-price">3X de ${boneca.subpreco}</p>
            <button class="buttom-cards" onclick="comprarBoneca()"><img src="./img/whatsapp.png"> <span>Compre pelo WhatsApp</span></button>
        `;

        return novoItem;
    }

    document.getElementById("deleteItemForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const nome = document.getElementById("nomeExcluir").value;

        // Você pode adicionar alguma validação aqui para garantir que o campo nome não esteja vazio

        // Aqui você pode enviar uma solicitação para o servidor para executar a exclusão
        // Por exemplo, usando o fetch para enviar uma solicitação DELETE para a rota do servidor

        fetch('https://agulha-e-linha-production.up.railway.app/adm.html/upload', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome }),
        })
            .then(response => {
                if (response.ok) {
                    alert("Item deletado com sucesso!");
                    document.getElementById("nomeExcluir").value = "";
                } else {
                    alert("Erro ao deletar o item.");
                    document.getElementById("nomeExcluir").value = "";
                }
            })
            .catch(error => {
                console.error("Erro ao fazer a solicitação:", error);
                alert("Erro ao deletar o item.");
                document.getElementById("nomeExcluir").value = "";
            });
    });

});

function comprarBoneca() {
    window.location.href = 'https://api.whatsapp.com/send?phone=5551992776015&text=Ol%C3%A1,%20vim%20atrav%C3%A9s%20do%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20as%20bonecas!%20%F0%9F%A5%B0';

}

function irFacebbok() {
    window.location.href = 'https://www.facebook.com/';

}

function irInstagram() {
    window.location.href = 'https://www.instagram.com/agulha_e_linha/';

}
