document.addEventListener('DOMContentLoaded', function () {
    const addItemForm = document.getElementById('addItemForm');
    const main = document.getElementById('cards-toy');

    // Função para carregar todas as bonecas ao carregar a página
    function carregarTodasBonecas() {
        // Solicita todas as bonecas ao servidor
        fetch('http://localhost:3000/bonecas')
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

        if (valorTitulo && valorSubTitulo && valorPreco && valorSubPreco) {
            const novaBoneca = {
                nome: valorTitulo,
                subnome: valorSubTitulo,
                preco: valorPreco,
                subpreco: valorSubPreco
            };

            fetch('http://localhost:3000/bonecas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novaBoneca)
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
            alert('Preencha todos os campos antes de adicionar o item.');
        }
    });

    // Função para criar um elemento HTML para exibir uma boneca
    function criarElementoBoneca(boneca) {
        const novoItem = document.createElement('div');
        novoItem.classList.add('cardContent');

        novoItem.innerHTML = `
            <h2>${boneca.nome}</h2>
            <p class="second-text-description">${boneca.subnome}</p>
            <p class="full-price">R$${boneca.preco}</p>
            <p class="parceled-price">3X de ${boneca.subpreco}</p>
            <button class="buttom-cards" onclick="comprarBoneca()"><img src="./img/whatsapp.png"> <span>Compre pelo WhatsApp</span></button>
        `;

        return novoItem;
    }
});

document.getElementById("deleteItemForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nome = document.getElementById("nomeExcluir").value;
    // Você pode adicionar alguma validação aqui para garantir que o campo nome não esteja vazio

    // Aqui você pode enviar uma solicitação para o servidor para executar a exclusão
    // Por exemplo, usando o fetch para enviar uma solicitação DELETE para a rota do servidor

    fetch('http://localhost:3000/bonecas', {
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

function comprarBoneca() {
    window.location.href = 'https://api.whatsapp.com/send?phone=5551992776015&text=Ol%C3%A1,%20vim%20atrav%C3%A9s%20do%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20as%20bonecas!%20%F0%9F%A5%B0';

}

function irFacebbok() {
    window.location.href = 'https://www.facebook.com/';

}

function irInstagram() {
    window.location.href = 'https://www.instagram.com/agulha_e_linha/';

}

/*
    ////////////// PROCURAR SOLUÇÃO PARA A PESQUISA //////////////

function VerificarBoneca() {
    let nome = document.getElementById("searchBoneca").value.toLowerCase(); // Obtém o valor do input

    var divsProdutos = document.querySelectorAll(".cardContent");

    switch (nome) {
        case "duda":
            exibirDiv("duda");
            document.getElementById("teste").innerHTML = "";
            clearBoneca.style.display = "block";
            break;

        case "maria":
            exibirDiv("maria");
            document.getElementById("teste").innerHTML = "";
            clearBoneca.style.display = "block";

            break;

        case "roberta":
            exibirDiv("roberta");
            document.getElementById("teste").innerHTML = "";
            clearBoneca.style.display = "block";


            break;

        case "claudia":
            exibirDiv("claudia");
            document.getElementById("teste").innerHTML = "";
            clearBoneca.style.display = "block";


            break;

        case "luiza":
            exibirDiv("luiza");
            document.getElementById("teste").innerHTML = "";
            clearBoneca.style.display = "block";


            break;

        case "edlen":
            exibirDiv("edlen");
            document.getElementById("teste").innerHTML = "";
            clearBoneca.style.display = "block";


            break;

        default:
            // Nome não encontrado, mostra todas as divs de produtos
            divsProdutos.forEach(function (div) {
                div.style.display = "block";

            });

            clearBoneca.style.display = "none";

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

function LimparBoneca() {
    var divsProdutos = document.querySelectorAll(".cardContent");

    // Mostra todas as divs de produtos
    divsProdutos.forEach(function (div) {
        div.style.display = "block";

    });

    clearBoneca.style.display = "none";

    // Limpa o campo de pesquisa
    document.getElementById("searchBoneca").value = "";

    // Limpa a mensagem "Não encontrado..."
    document.getElementById("teste").innerHTML = "";
}

// lock orientation to portrait
window.screen.lockOrientationUniversal = window.screen.lockOrientation || window.screen.mozLockOrientation || window.screen.msLockOrientation;

if (window.screen.lockOrientationUniversal("portrait")) {
    console.log("Orientation locked to portrait");
} else {
    console.log("Orientation lock failed.");
}

/*function Mudarcor() {

    var cor = document.getElementById("corcor")

        cor.style.display = "block";
        cor.style.width = "300px"; // Define a margem superior de volta para 0
}*/
