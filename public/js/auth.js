// Selecionamos o formulário do HTML pelo seu ID 'login-form'
const loginForm = document.getElementById('login-form');

// Adicionamos um "ouvinte de eventos". Ele vai ficar esperando o formulário ser enviado.
loginForm.addEventListener('submit', async (event) => {

  
  // 1. Impede o comportamento padrão do formulário (que é recarregar a página).
  event.preventDefault();

  // 2. Pegamos os valores que o usuário digitou nos campos de email e senha.
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  console.log('Enviando para o servidor:', { email, senha });

  // 3. Usamos a API "Fetch" para enviar os dados para o nosso backend.
  try {
    const response = await fetch('/login', {
      method: 'POST', // Estamos fazendo uma requisição POST
      headers: {
        'Content-Type': 'application/json', // Estamos avisando que os dados estão em formato JSON
      },
      body: JSON.stringify({ email, senha }), // Convertemos nosso objeto JavaScript para uma string JSON
    });

    // 4. Pegamos a resposta do servidor e a transformamos em um objeto JavaScript.
    const data = await response.json();

    if (response.ok){
      alert(data.message);
    }
    localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
    if(data.usuario.tipo === 'admin'){
      window.location.href = '/admin.html';
    } else if(data.usuario.tipo === 'funcionario'){
      window.location.href = '/funcionario.html';
    }
    // 5. Mostramos a mensagem de resposta do servidor no console do navegador.
    console.log('Resposta do servidor:', data);
    alert(data.message); // Mostra um alerta na tela para o usuário.

  } catch (error) {
    console.error('Erro ao tentar fazer login:', error);
    alert('Ocorreu um erro. Tente novamente.');
  }
});