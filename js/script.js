document.getElementById('btn').addEventListener('click', enviar);

async function enviar() {
    let formulario = document.getElementById('form');
    const dados = new FormData(formulario);
    const dadosObj = {};
    
    for (let [chave, valor] of dados.entries()) {
        dadosObj[chave] = valor;
    }

    try {
        const resposta = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosObj)
        });

        const resultado = await resposta.json();
        console.log(resultado)

        if (resultado.success) {
            console.log('Login bem-sucedido!');
            localStorage.setItem('AcessoUsuario', JSON.stringify(resultado.usuario));
            window.location.href = 'dashboard.html';
        } else {
            console.error('Acesso inválido: ', resultado.message);
            alert('Acesso inválido');
        }
    } catch (erro) {
        console.error('Erro ao enviar solicitação:', erro);
    }
}