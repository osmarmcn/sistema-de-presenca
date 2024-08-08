
frequencia = document.getElementById('frequencia')
relatorios = document.getElementById('relatorios')
turmas = document.getElementById('turmas')

conteudo = document.getElementById('main-container')


//passando o nome dinamicamente
document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('AcessoUsuario'));

    // Configurar o nome do usuário
    if (usuario && usuario.nome) {
        document.querySelector('h1.nome').textContent = `Seja bem-vindo, ${usuario.nome}!`;
    } else {
        document.querySelector('h1.nome').textContent = 'Seja bem-vindo!';
    }

    // Configurar o acesso baseado no cargo
    if (usuario && usuario.cargo) {
        configurarAcesso(usuario.cargo);
    }

    // Carregar o conteúdo inicial
    mostrarFrequencia(); // Carregar a visualização inicial (por exemplo, Frequência)
});

function configurarAcesso(cargo) {
    // Seleciona os botões
    const frequencia = document.getElementById('frequencia');
    const relatorios = document.getElementById('relatorios');
    const turmas = document.getElementById('turmas');

    // Habilita ou desabilita os botões com base no cargo
    if (cargo === 'monitor') {
        frequencia.disabled = false;
        relatorios.disabled = true;
        turmas.disabled = true;
    } else if (cargo === 'professor') {
        frequencia.disabled = false;
        relatorios.disabled = false;
        turmas.disabled = true;
    } else if (cargo === 'academico') {
        frequencia.disabled = false;
        relatorios.disabled = false;
        turmas.disabled = false;
    }

    // Adicionar event listeners para os botões
    frequencia.addEventListener('click', mostrarFrequencia);
    relatorios.addEventListener('click', mostrarRelatorios);
    turmas.addEventListener('click', mostrarTurmas);
}

function mostrarFrequencia() {
    const mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML = `
    
        <h2>Frequência</h2>
        <div class="content-geral">
            <div class="select-turma">
                <label for="turma-select">Selecione a Turma:</label>
                <select id="turma-select">
                    <option value="">Selecione uma turma</option>
                    <option value="turma1">turma1</option>
                    <option value="turma2">turma2</option>
                </select>
            </div>
            <div class="table-frequencia"></div>
        </div>
    `;

    // Configurar o evento para seleção de turma
    const turmaSelect = document.getElementById('turma-select');
    if (turmaSelect) {
        turmaSelect.addEventListener('change', frequenciAluno);
    } else {
        console.error('Elemento #turma-select não encontrado');
    }
}


async function frequenciAluno() {
    const turmaSelect = document.getElementById('turma-select');
    const turmaSelecionada = turmaSelect.value;

    if (!turmaSelecionada) {
        document.querySelector('.table-frequencia').innerHTML = '';
        return;
    }

    const endpoint = `http://localhost:8080/${turmaSelecionada}`;

    try {
        const resposta = await fetch(endpoint);
        if (!resposta.ok) {
            throw new Error('Erro ao buscar os dados: ' + resposta.statusText);
        }

        const dados = await resposta.json();
        console.log('Dados recebidos:', dados);

        // Criar a tabela
        const tabela = document.createElement('table');
        tabela.className = 'table table-striped';

        // Criar o cabeçalho da tabela
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">Média</th>
                <th scope="col">Status</th>
                <th scope="col">Presença</th>
                <th scope="col">Faltas</th>
                <th scope="col">Ações</th>
            </tr>
        `;
        tabela.appendChild(thead);

        // Criar o corpo da tabela
        const tbody = document.createElement('tbody');
        dados.forEach(aluno => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.media || 'N/A'}</td>
                <td>${aluno.status || 'N/A'}</td>
                <td>${aluno.presença || 'N/A'}</td>
                <td>${aluno.faltas || 'N/A'}</td>
                <td>
                    <button class="btn btn-success btn-presenca" data-id="${aluno.id}">Presença</button>
                    <button class="btn btn-danger btn-falta" data-id="${aluno.id}">Falta</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        tabela.appendChild(tbody);

        // Atualizar o container da tabela
        const tableContainer = document.querySelector('.table-frequencia');
        tableContainer.innerHTML = '';
        tableContainer.appendChild(tabela);

        // Adicionar event listeners para os botões de presença e falta
        document.querySelectorAll('.btn-presenca').forEach(button => {
            button.addEventListener('click', () => {
                const alunoId = parseInt(button.getAttribute('data-id'), 10);
                marcarPresenca(alunoId);
            });
        });

        document.querySelectorAll('.btn-falta').forEach(button => {
            button.addEventListener('click', () => {
                const alunoId = parseInt(button.getAttribute('data-id'), 10);
                marcarFalta(alunoId);
            });
        });

    } catch (erro) {
        console.error('Erro ao buscar os dados:', erro);
        document.querySelector('.table-frequencia').innerHTML = 'Erro ao carregar os dados.';
    }
}

async function marcarPresenca(alunoId) {
    const turmaSelect = document.getElementById('turma-select');
    const turmaSelecionada = turmaSelect.value;

    if (!turmaSelecionada) {
        console.error('Nenhuma turma selecionada');
        return;
    }

    console.log(`Marcando presença para aluno ID: ${alunoId}`);
    try {
        const resposta = await fetch(`http://localhost:8080/${turmaSelecionada}/marcar-presenca/${alunoId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tipo: 'presenca' }),
        });

        if (!resposta.ok) {
            throw new Error('Erro ao marcar presença: ' + resposta.statusText);
        }

        const dados = await resposta.json();
        console.log('Presença marcada com sucesso:', dados);

        atualizarTabela(alunoId, dados);

    } catch (erro) {
        console.error('Erro ao marcar presença:', erro);
    }
}

async function marcarFalta(alunoId) {
    const turmaSelect = document.getElementById('turma-select');
    const turmaSelecionada = turmaSelect.value;

    if (!turmaSelecionada) {
        console.error('Nenhuma turma selecionada');
        return;
    }

    console.log(`Marcando falta para aluno ID: ${alunoId}`);
    try {
        const resposta = await fetch(`http://localhost:8080/${turmaSelecionada}/marcar-falta/${alunoId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tipo: 'falta' }),
        });

        if (!resposta.ok) {
            throw new Error('Erro ao marcar falta: ' + resposta.statusText);
        }

        const dados = await resposta.json();
        console.log('Falta marcada com sucesso:', dados);

        atualizarTabela(alunoId, dados);

    } catch (erro) {
        console.error('Erro ao marcar falta:', erro);
    }
}


// Função para atualizar a tabela no frontend com os novos dados
async function atualizarTabela() {
    const turmaSelect = document.getElementById('turma-select');
    const turmaSelecionada = turmaSelect.value;

    if (!turmaSelecionada) {
        console.error('Nenhuma turma selecionada');
        return;
    }

    const endpoint = `http://localhost:8080/${turmaSelecionada}`;

    try {
        const resposta = await fetch(endpoint);
        if (!resposta.ok) {
            throw new Error('Erro ao buscar os dados: ' + resposta.statusText);
        }

        const dados = await resposta.json();
        console.log('Dados atualizados:', dados);

        // Criar a tabela
        const tabela = document.createElement('table');
        tabela.className = 'table table-striped';

        // Criar o cabeçalho da tabela
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">Média</th>
                <th scope="col">Status</th>
                <th scope="col">Presença</th>
                <th scope="col">Faltas</th>
                <th scope="col">Ações</th>
            </tr>
        `;
        tabela.appendChild(thead);

        // Criar o corpo da tabela
        const tbody = document.createElement('tbody');
        dados.forEach(aluno => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.media || 'N/A'}</td>
                <td>${aluno.status || 'N/A'}</td>
                <td>${aluno.presença || 'N/A'}</td>
                <td>${aluno.faltas || 'N/A'}</td>
                <td>
                    <button class="btn btn-success btn-presenca" data-id="${aluno.id}">Presença</button>
                    <button class="btn btn-danger btn-falta" data-id="${aluno.id}">Falta</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        tabela.appendChild(tbody);

        // Atualizar o container da tabela
        const tableContainer = document.querySelector('.table-frequencia');
        tableContainer.innerHTML = '';
        tableContainer.appendChild(tabela);

        // Adicionar event listeners para os botões de presença e falta
        document.querySelectorAll('.btn-presenca').forEach(button => {
            button.addEventListener('click', () => {
                const alunoId = parseInt(button.getAttribute('data-id'), 10);
                marcarPresenca(alunoId);
            });
        });

        document.querySelectorAll('.btn-falta').forEach(button => {
            button.addEventListener('click', () => {
                const alunoId = parseInt(button.getAttribute('data-id'), 10);
                marcarFalta(alunoId);
            });
        });

    } catch (erro) {
        console.error('Erro ao buscar os dados:', erro);
        document.querySelector('.table-frequencia').innerHTML = 'Erro ao carregar os dados.';
    }
}


// -------------------------------------------------------------------------------------------------------


function mostrarTurmas() {
    const mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML = `
        <div class="form-turma">
            <h2>Cadastro de turma</h2>
            <form id="form-cadastro-turma" class="form-cadastro-turma">
                <div class="criar-turma">
                    <input type="text" placeholder="Criar turma" id="turma-nome">
                </div>
            </form>
            
            <div class="btn-turma">
                <button id="btn-criar">CRIAR</button>
            </div>
            <div id="notificacao" class="alert" role="alert" style="display: none;"></div>

            <form action="" class="form-cadastro-aluno" id="form-cadastro-aluno">
                <div class="box">
                    <label for="turma-selecionada">Turma</label>
                    <select id="turma-selecionada" name="turma">
                        <option value="turma1">turma1</option>
                        <option value="turma2">turma2</option>
                    </select>
                </div>
                <div class="box">
                    <input type="text" placeholder="Digite seu nome" id="nome-aluno" name="nome" required>
                </div>
                <div class="box">
                    <input type="email" placeholder="Digite seu email" id="email-aluno" name="email" required>
                </div>
            </form>

            <div class="btn-aluno">
                <button id="btn-cadastrar-aluno">Cadastrar</button>
            </div>
    `;

    // Adicionar event listener para o botão "CRIAR"
    const btnCriar = document.getElementById('btn-criar');
    if (btnCriar) {
        btnCriar.addEventListener('click', criarTurma);
    } else {
        console.error('Botão #btn-criar não encontrado');
    }

    // Adicionar event listener para o botão "Cadastrar"
    const btnCadastrarAluno = document.getElementById('btn-cadastrar-aluno');
    if (btnCadastrarAluno) {
        btnCadastrarAluno.addEventListener('click', cadastrarAluno);
    } else {
        console.error('Botão #btn-cadastrar-aluno não encontrado');
    }
}

async function criarTurma() {
    const turmaNome = document.getElementById('turma-nome').value;
    if (!turmaNome) {
        mostrarNotificacao('Por favor, insira o nome da turma.', 'danger');
        return;
    }

    // Enviar a solicitação para criar a turma
    try {
        const resposta = await fetch('http://localhost:8080/criar-turma', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: turmaNome })
        });

        if (!resposta.ok) {
            throw new Error('Erro ao criar a turma: ' + resposta.statusText);
        }

        mostrarNotificacao('Turma criada com sucesso!', 'success');
        // Opcionalmente, você pode recarregar a lista de turmas aqui
    } catch (erro) {
        console.error('Erro ao criar a turma:', erro);
        mostrarNotificacao('Erro ao criar a turma.', 'danger');
    }
}

async function cadastrarAluno() {
    const turmaSelecionada = document.getElementById('turma-selecionada').value;
    const nomeAluno = document.getElementById('nome-aluno').value;
    const emailAluno = document.getElementById('email-aluno').value;

    if (!turmaSelecionada || !nomeAluno || !emailAluno) {
        mostrarNotificacao('Por favor, preencha todos os campos.', 'danger');
        return;
    }

    // Enviar a solicitação para cadastrar o aluno
    try {
        const resposta = await fetch('http://localhost:8080/cadastrar-aluno', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ turma: turmaSelecionada, nome: nomeAluno, email: emailAluno })
        });

        if (!resposta.ok) {
            throw new Error('Erro ao cadastrar o aluno: ' + resposta.statusText);
        }

        mostrarNotificacao('Aluno cadastrado com sucesso!', 'success');
        // Opcionalmente, você pode limpar os campos ou atualizar a lista de alunos aqui
    } catch (erro) {
        console.error('Erro ao cadastrar o aluno:', erro);
        mostrarNotificacao('Erro ao cadastrar o aluno.', 'danger');
    }
}

function mostrarNotificacao(mensagem, tipo) {
    const notificacao = document.getElementById('notificacao');
    notificacao.textContent = mensagem;
    notificacao.className = `alert alert-${tipo}`;
    notificacao.style.display = 'block';
    
    // Ocultar notificação após alguns segundos
    setTimeout(() => {
        notificacao.style.display = 'none';
    }, 5000);
}



// function mostrarRelatorios() {
//     const mainContainer = document.getElementById('main-container');
//     mainContainer.innerHTML = `
//         <!-- Conteúdo para Relatórios -->
//         <h2>Relatórios</h2>
//         <!-- Aqui vai o código para exibir os relatórios -->
//     `;
// }

// function mostrarTurmas() {
//     const mainContainer = document.getElementById('main-container');
//     mainContainer.innerHTML = `
//         <!-- Conteúdo para Criar Turmas -->
//         <h2>Criar Turma</h2>
//         <!-- Aqui vai o código para criar turmas -->
//     `;
// }









        // Cria o HTML dinamicamente dentro do main-container
        


