const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// --- NOSSO BANCO DE DADOS FALSO ---
// No futuro, isso virá de um banco de dados real.
// Por agora, é uma lista de usuários que nosso sistema "conhece".
const bancoDeDadosFalso = [
  {
    id: 1,
    nome: 'Dono da Barbearia',
    email: 'admin@barber.com',
    senha: '123',
    tipo: 'admin',
  },
  {
    id: 2,
    nome: 'Carlos Barbeiro',
    email: 'carlos@barber.com',
    senha: 'abc',
    tipo: 'funcionario',
  }
];

// --- LÓGICA DE LOGIN ATUALIZADA ---
app.post('/login', (req, res) => {
  const { email, senha } = req.body; // Pegamos o email e senha do formulário

  // 1. Procurar o usuário no nosso banco de dados falso
  // O método .find() procura no array por um item que satisfaça a condição.
  const usuarioEncontrado = bancoDeDadosFalso.find(usuario => usuario.email === email);

  // 2. Verificar os resultados
  if (!usuarioEncontrado) {
    // Se o .find() não retornar nada, o usuário não existe.
    // Retornamos um status de erro 404 (Not Found) e uma mensagem.
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  if (usuarioEncontrado.senha !== senha) {
    // Se encontramos o usuário, mas a senha não bate, retornamos erro.
    // Retornamos um status de erro 401 (Unauthorized) e uma mensagem.
    return res.status(401).json({ message: 'Senha incorreta.' });
  }

  // 3. Se chegou até aqui, o usuário existe e a senha está correta!
  // Retornamos um status 200 (OK) e os dados do usuário (sem a senha!).
  // Enviar o 'tipo' do usuário na resposta é CRUCIAL para o próximo passo.
  res.status(200).json({
    message: 'Login bem-sucedido!',
    usuario: {
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email,
      tipo: usuarioEncontrado.tipo,
    }
  });
});
// --- NOVO BANCO DE DADOS FALSO PARA ATENDIMENTOS ---
const atendimentosDB = [];


// ... (rota app.post('/login', ...) aqui, sem alteração)


// --- NOVA ROTA PARA REGISTRAR ATENDIMENTOS ---
app.post('/atendimentos', (req, res) => {
    // 1. Pegamos os dados enviados pelo formulário do funcionário.
    const { servico, data, observacoes, funcionarioId } = req.body;

    // 2. Criamos um novo objeto de atendimento com os dados recebidos.
    const novoAtendimento = {
        id: Date.now(), // Usamos o timestamp como um ID único simples.
        funcionarioId: funcionarioId, // ID de quem registrou.
        servico: servico,
        data: data,
        observacoes: observacoes,
        status: 'pendente' // Todo novo atendimento começa como pendente.
    };

    // 3. Adicionamos o novo atendimento ao nosso "banco de dados".
    atendimentosDB.push(novoAtendimento);

    // 4. Exibimos no console do servidor para confirmar que recebemos.
    console.log('Novo atendimento registrado:');
    console.log(novoAtendimento);
    console.log('Todos os atendimentos:', atendimentosDB); // Mostra a lista completa

    // 5. Enviamos uma resposta de sucesso.
    res.status(201).json({ message: 'Atendimento registrado com sucesso!' });
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// ... seu código existente ...

// Rota para registrar um novo atendimento (POST)
app.post('/atendimentos', (req, res) => {
    // ... seu código existente aqui, sem alteração ...
});

// --- NOVA ROTA PARA BUSCAR OS ATENDIMENTOS (GET) ---
app.get('/atendimentos', (req, res) => {
    // Por enquanto, esta rota simplesmente retorna a lista completa
    // do nosso banco de dados falso de atendimentos.
    console.log('Enviando a lista de atendimentos para o admin.');
    res.status(200).json(atendimentosDB);
});

// Rota para buscar os atendimentos (GET)
app.get('/atendimentos', (req, res) => {
    // ... sem alteração aqui ...
});

// --- NOVA ROTA PARA APROVAR UM ATENDIMENTO (PATCH) ---
// O :id na URL é um "parâmetro". Ele nos permite passar o ID do atendimento
// que queremos aprovar diretamente no endereço da requisição.
app.patch('/atendimentos/:id/aprovar', (req, res) => {
    const idDoAtendimento = parseInt(req.params.id); // Pegamos o ID da URL e convertemos para número

    // Procuramos o atendimento no nosso "banco de dados"
    const atendimentoParaAprovar = atendimentosDB.find(at => at.id === idDoAtendimento);

    if (atendimentoParaAprovar) {
        // Se encontramos, mudamos o status
        atendimentoParaAprovar.status = 'aprovado';
        console.log('Atendimento aprovado:', atendimentoParaAprovar);
        res.status(200).json({ message: 'Atendimento aprovado com sucesso!', atendimento: atendimentoParaAprovar });
    } else {
        // Se não encontramos, retornamos um erro
        res.status(404).json({ message: 'Atendimento não encontrado.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
// ... resto do código ...