document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA EXISTENTE PARA BOAS-VINDAS ---
    const usuarioString = localStorage.getItem('usuarioLogado');

    if (!usuarioString) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '/index.html';
        return;
    }

    const usuario = JSON.parse(usuarioString);

    const h1BoasVindas = document.getElementById('mensagem-boas-vindas');
    if (h1BoasVindas) {
        h1BoasVindas.textContent = `Bem-vindo, ${usuario.nome}!`;
    }

    // VERIFICA SE O USUÁRIO É ADMIN PARA CARREGAR OS ATENDIMENTOS
    if (usuario.tipo === 'admin') {
        carregarAtendimentos();
    }
    
    // LÓGICA PARA O FORMULÁRIO DE ATENDIMENTO DO FUNCIONÁRIO
    const formAtendimento = document.getElementById('form-atendimento');
    
    if (formAtendimento) {
        formAtendimento.addEventListener('submit', async (event) => {
            event.preventDefault();

            const servico = document.getElementById('servico').value;
            const data = document.getElementById('data').value;
            const observacoes = document.getElementById('observacoes').value;

            const dadosAtendimento = {
                servico,
                data,
                observacoes,
                funcionarioId: usuario.id
            };

            try {
                const response = await fetch('/atendimentos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosAtendimento)
                });

                const result = await response.json();
                alert(result.message);

                if (response.ok) {
                    formAtendimento.reset();
                }

            } catch (error) {
                console.error('Erro ao registrar atendimento:', error);
                alert('Falha ao registrar atendimento.');
            }
        });
    }
});


// FUNÇÃO PARA BUSCAR E EXIBIR OS ATENDIMENTOS PARA O ADMIN
async function carregarAtendimentos() {
    try {
        const response = await fetch('/atendimentos');
        const atendimentos = await response.json();
        const listaContainer = document.getElementById('lista-atendimentos');
        listaContainer.innerHTML = ''; 

        if (atendimentos.filter(at => at.status === 'pendente').length === 0) {
            listaContainer.innerHTML = '<p>Nenhum atendimento pendente.</p>';
            return;
        }

        atendimentos.forEach(atendimento => {
            if (atendimento.status === 'pendente') {
                const atendimentoDiv = document.createElement('div');
                atendimentoDiv.className = 'atendimento-item';
                // --- ALTERAÇÃO AQUI: Adicionamos data-id e classes aos botões ---
                atendimentoDiv.innerHTML = `
                    <p><strong>Serviço:</strong> ${atendimento.servico}</p>
                    <p><strong>Data:</strong> ${new Date(atendimento.data).toLocaleDateString()}</p>
                    <p><strong>Observações:</strong> ${atendimento.observacoes || 'Nenhuma'}</p>
                    <button class="btn-aprovar" data-id="${atendimento.id}">Aprovar</button>
                    <button class="btn-reprovar" data-id="${atendimento.id}">Reprovar</button>
                `;
                listaContainer.appendChild(atendimentoDiv);
            }
        });

    } catch (error) {
        console.error('Erro ao carregar atendimentos:', error);
    }
}


// --- ADICIONANDO O "OUVINTE DE CLIQUES" DELEGADO ---
// Coloque este código no final do seu arquivo dashboard.js

const listaContainer = document.getElementById('lista-atendimentos');

if (listaContainer) {
    listaContainer.addEventListener('click', async (event) => {
        // Verificamos se o item clicado foi um botão de "Aprovar"
        if (event.target.classList.contains('btn-aprovar')) {
            const atendimentoId = event.target.dataset.id; // Pegamos o ID que "carimbamos" no botão

            try {
                const response = await fetch(`/atendimentos/${atendimentoId}/aprovar`, {
                    method: 'PATCH', // Usamos o método PATCH para atualizar
                });

                const result = await response.json();
                alert(result.message);

                if (response.ok) {
                    // Se a aprovação deu certo, recarregamos a lista para que o item aprovado suma.
                    carregarAtendimentos();
                }

            } catch (error) {
                console.error('Erro ao aprovar atendimento:', error);
            }
        }

        // Futuramente, podemos adicionar a lógica para o botão de reprovar aqui
        // if (event.target.classList.contains('btn-reprovar')) { ... }
    });
}