
frequencia = document.getElementById('frequencia')
relatorios = document.getElementById('relatorios')
turmas = document.getElementById('turmas')

conteudo = document.getElementById('main-container')


//passando o nome dinamicamente
document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('AcessoUsuario'))
    if (usuario && usuario.nome) {
        document.querySelector('h1.nome').textContent = `Seja bem-vindo, ${usuario.nome}!`
    } else {
        document.querySelector('h1.nome').textContent = 'Seja bem-vindo!'
    }
})


async function carregarTurmas() {
    try {
        const resposta = await fetch('./db.json');
        const dados = await resposta.json();
        
        const turmas = dados.turmas;
        const mainContainer = document.getElementById('main-container');
        mainContainer.innerHTML = `
            <div class="content-geral">
                <div class="select-turma">
                    <label for="turma-select">Selecione a Turma:</label>
                    <select id="turma-select">
                        <option value="">Selecione uma turma</option>
                        ${turmas.map(turma => {
                            const turmaNome = Object.keys(turma)[0];
                            return `<option value="${turmaNome}">${turmaNome}</option>`;
                        }).join('')}
                    </select>
                </div>
                <div class="table-frenquecia">
                  
                </div>
            </div>
        `;

        const turmaSelect = document.getElementById('turma-select');
        turmaSelect.addEventListener('change', frequenciAluno);
    } catch (erro) {
        console.error('Erro ao carregar as turmas:', erro);
    }
}

async function frequenciAluno() {
    try {
        const resposta = await fetch('./db.json');
        const dados = await resposta.json();
        
        const turmaSelect = document.getElementById('turma-select');
        const turmaSelecionada = turmaSelect.value;
        
        if (!turmaSelecionada) {
            document.querySelector('.table-frenquecia').innerHTML = '';
            return;
        }
        
        const turma = dados.turmas.find(t => t[turmaSelecionada]);
        if (!turma) {
            console.error('Turma não encontrada');
            return;
        }
        
        const alunos = turma[turmaSelecionada];
        
        const tabela = document.createElement('table');
        tabela.className = 'table table-striped';
        
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">Média</th>
                <th scope="col">Status</th>
                <th scope="col">Frequência</th>
                <th scope="col">Faltas</th>
                <th scope="col">Ações</th>
            </tr>
        `;
        
        const tbody = document.createElement('tbody');
        
        alunos.forEach((aluno, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.media}</td>
                <td>${aluno.status}</td>
                <td>${aluno.frequencia || 'N/A'}</td>
                <td>${aluno.faltas || 'N/A'}</td>
                <td>
                    <button class="btn btn-success" onclick="marcarPresenca('${aluno.email}')">Presença</button>
                    <button class="btn btn-danger" onclick="marcarFalta('${aluno.email}')">Falta</button>
                
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        tabela.appendChild(thead);
        tabela.appendChild(tbody);
        
        const tableContainer = document.querySelector('.table-frenquecia');
        tableContainer.innerHTML = ''; // Limpa o conteúdo existente, se houver
        tableContainer.appendChild(tabela);
        
    } catch (erro) {
        console.error('Erro ao buscar os dados:', erro);
    }
}

window.onload = carregarTurmas;

let criar = document.getElementById('btn-cirar').addEventListener('click', criarTurma)


async function criarTurma() {
    let turma = document.getElementById('turma')

    let resposta = await fetch('./db.json',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({turma: turma.value})
    })
    let valor = await resposta.json()
    console.log(valor)
    
    
}

// document.addEventListener('DOMContentLoaded', function() {
//     // Verifica se o main-container existe antes de modificar o innerHTML
//     const container = document.getElementById('main-container');
//     if (container) {
//         // Cria o HTML dinamicamente dentro do main-container
//         container.innerHTML = `
        
           <div class="form-turma">
                <h2>Cadastro de turma</h2>
                <form id="form-cadastro-turma" class="form-cadastro-turma">
                    <div class="criar-turma">
                        <input type="text" placeholder="Criar turma" id="turma">
                    </div>
                </form>
                
                <div class="btn-turma">
                    <button id="btn-criar">CRIAR</button>
                </div>
                <div id="notificacao" class="alert" role="alert" style="display: none;"></div>

                <form action="" class="form-cadastro-aluno" id="form-cadastro-aluno">
                    <div class="box">
                        <label for="turma">turma</label>
                        <select id="turma" name="turma">
                            <option value="turma1">turma1</option>
                            <option value="turma2">turma2</option>
                        </select>
                    </div>
                    <div class="box">
                        <input type="nome" placeholder="Digite seu nome" id="nome" name="nome" required>
                    </div>
                    <div class="box">
                        <input type="email" placeholder="Digite seu email" id="email" name="email" required>
                    </div>
                </form>

                <div class="btn-aluno">
                    <button>Cadastrar</button>
                </div>
                
            </div>
//         `;

//         // Adiciona o evento de clique ao botão
//         document.getElementById('btn').addEventListener('click', criarTurma);

//         async function criarTurma() {
//             const formulario = document.getElementById('form-cadastro-turma');
//             const dados = new FormData(formulario);
//             const nomeTurma = dados.get('nomeTurma');

//             try {
//                 const resposta = await fetch('./db.json', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ nomeTurma }),
//                 });

//                 if (resposta.ok) {
//                     // Exibe notificação de sucesso
//                     exibirNotificacao('Turma criada com sucesso!', 'success');
//                 } else {
//                     // Exibe notificação de erro
//                     exibirNotificacao('Erro ao criar turma.', 'danger');
//                 }
//             } catch (error) {
//                 // Exibe notificação de erro
//                 exibirNotificacao('Erro ao criar turma.', 'danger');
//             }
//         }

//         function exibirNotificacao(mensagem, tipo) {
//             const notificacao = document.getElementById('notificacao');
//             if (notificacao) {
//                 notificacao.className = `alert alert-${tipo}`;
//                 notificacao.innerText = mensagem;
//                 notificacao.style.display = 'block';

//                 // Oculta a notificação após 3 segundos
//                 setTimeout(() => {
//                     notificacao.style.display = 'none';
//                 }, 3000);
//             }
//         }
//     }
// });





