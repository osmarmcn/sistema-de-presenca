document.getElementById('btn').addEventListener('click', enviar)

async function enviar() {
    let formulario = document.getElementById('form')

    const dados = new FormData(formulario)

    const dadosObj = {}
    for (let [chave, valor] of dados.entries()) {
        dadosObj[chave] = valor
    }

    const { cargo, email, senha } = dadosObj

    try {
        const resposta = await fetch('./db.json')
        const db = await resposta.json()

        let usuario = null
        if (cargo === 'professor') {
            usuario = db.professores.find(professor => professor.email === email && professor.senha === senha)
        } else if (cargo === 'monitor') {
            usuario = db.monitores.find(monitor => monitor.email === email && monitor.senha === senha)
        } else if (cargo === 'academico') {
            usuario = db.academico.find(acad => acad.email === email && acad.senha === senha)
        }

        if (usuario) {
            console.log('Login bem-sucedido!')
            localStorage.setItem('AcessoUsuario', JSON.stringify(usuario));
            window.location.href = 'dashboard.html'
        } else {
            console.error('Acesso inválido')
         
        }
    } catch (erro) {
        console.error(erro)
    }
}
