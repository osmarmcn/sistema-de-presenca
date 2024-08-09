


document.addEventListener('DOMContentLoaded', () => {
    
    const frequencia = document.getElementById('frequencia');
    const relatorios = document.getElementById('relatorios');
    const turmas = document.getElementById('turmas');

   
    const usuario = JSON.parse(localStorage.getItem('AcessoUsuario'))

    // Verificar se o objeto 'usuario' existe e tem a propriedade 'cargo'
    if (usuario && usuario.cargo) {
        // Configurar o nome do usuário
        document.querySelector('h1.nome').textContent = usuario.nome ? `Seja bem-vindo, ${usuario.nome}!` : 'Seja bem-vindo!'

        // Configurar o acesso baseado no cargo
        switch (usuario.cargo) {
            case 'monitor':
                frequencia.removeAttribute('disabled')
                relatorios.setAttribute('disabled', 'true')
                turmas.setAttribute('disabled', 'true')
                break;
            case 'professor':
                frequencia.removeAttribute('disabled')
                relatorios.removeAttribute('disabled')
                turmas.setAttribute('disabled', 'true')
                break;
            case 'academico':
                frequencia.removeAttribute('disabled')
                relatorios.removeAttribute('disabled')
                turmas.removeAttribute('disabled')
                break;
            default:
                frequencia.setAttribute('disabled', 'true')
                relatorios.setAttribute('disabled', 'true')
                turmas.setAttribute('disabled', 'true')
                break;
        }
    } else {
        frequencia.setAttribute('disabled', 'true')
        relatorios.setAttribute('disabled', 'true')
        turmas.setAttribute('disabled', 'true')
    }

    //tabela de frequência
    function mostrarFrequencia() {
        const mainContainer = document.getElementById('main-container')
        mainContainer.innerHTML = `
            <h2>Frequência</h2>
            <div class="content-geral">
                <div class="select-turma">
                    <label for="turma-select">Selecione a Turma:</label>
                    <select id="turma-select">
                        <option value="">Selecione uma turma</option>
                        <option value="turma1">Turma 1</option>
                        <option value="turma2">Turma 2</option>
                    </select>
                </div>
                <div class="table-frequencia"></div>
            </div>
        `

        // Configurar o evento para seleção de turma
        const turmaSelect = document.getElementById('turma-select')
        turmaSelect.addEventListener('change', frequenciAluno)
    }

    // frequência dos alunos
    async function frequenciAluno() {
        const turmaSelect = document.getElementById('turma-select')
        const turmaSelecionada = turmaSelect.value

        if (!turmaSelecionada) {
            document.querySelector('.table-frequencia').innerHTML = ''
            return
        }

        const endpoint = `http://localhost:8080/${turmaSelecionada}`

        try {
            const resposta = await fetch(endpoint);
            if (!resposta.ok) {
                throw new Error('Erro ao buscar os dados: ' + resposta.statusText)
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
            `
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
                `
                tbody.appendChild(tr);
            });
            tabela.appendChild(tbody);

            // Atualizar o container da tabela
            const tableContainer = document.querySelector('.table-frequencia')
            tableContainer.innerHTML = ''
            tableContainer.appendChild(tabela)

            // Adicionar event listeners para os botões de presença e falta
            document.querySelectorAll('.btn-presenca').forEach(button => {
                button.addEventListener('click', () => {
                    const alunoId = parseInt(button.getAttribute('data-id'), 10)
                    marcarPresenca(alunoId)
                });
            });

            document.querySelectorAll('.btn-falta').forEach(button => {
                button.addEventListener('click', () => {
                    const alunoId = parseInt(button.getAttribute('data-id'), 10)
                    marcarFalta(alunoId)
                });
            });

        } catch (erro) {
            console.error('Erro ao buscar os dados:', erro)
            document.querySelector('.table-frequencia').innerHTML = 'Erro ao carregar os dados.'
        }
    }

    // marcar presença
    async function marcarPresenca(alunoId) {
        const turmaSelect = document.getElementById('turma-select')
        const turmaSelecionada = turmaSelect.value

        if (!turmaSelecionada) {
            console.error('Nenhuma turma selecionada')
            return
        }

        console.log(`Marcando presença para aluno ID: ${alunoId}`)
        try {
            const resposta = await fetch(`http://localhost:8080/${turmaSelecionada}/marcar-presenca/${alunoId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tipo: 'presenca' }),
            })

            if (!resposta.ok) {
                throw new Error('Erro ao marcar presença: ' + resposta.statusText)
            }

            const dados = await resposta.json();
            console.log('Presença marcada com sucesso:', dados)

            atualizarTabela()

        } catch (erro) {
            console.error('Erro ao marcar presença:', erro)
        }
    }

    //  marcar falta
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

            atualizarTabela();

        } catch (erro) {
            console.error('Erro ao marcar falta:', erro);
        }
    }

    //  atualizar a tabela com os novos dados
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

    // mostrar turmas e formulário de cadastro
    function mostrarTurmas() {
        const mainContainer = document.getElementById('main-container')
        mainContainer.innerHTML = `
        <div class="container-turma">
            <div class="form-turma">
                <h2>Cadastro de aluno</h2>
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
                 <div id="notificacao" class="alert" role="alert" style="display: none;"></div>
            </div>
        </div>
        `
    
        // Adicionar event listener para o botão "Cadastrar"
        const btnCadastrarAluno = document.getElementById('btn-cadastrar-aluno')
        if (btnCadastrarAluno) {
            btnCadastrarAluno.addEventListener('click', cadastrarAluno)
        } else {
            console.error('Botão #btn-cadastrar-aluno não encontrado')
        }
    }
    
    async function cadastrarAluno() {
        const turmaSelecionada = document.getElementById('turma-selecionada').value
        const nomeAluno = document.getElementById('nome-aluno').value
        const emailAluno = document.getElementById('email-aluno').value
    
        if (!turmaSelecionada || !nomeAluno || !emailAluno) {
            mostrarNotificacao('Por favor, preencha todos os campos.', 'danger')
            return
        }
    
       
        try {
            const resposta = await fetch('http://localhost:8080/cadastrar-aluno', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ turma: turmaSelecionada, nome: nomeAluno, email: emailAluno })
            })
    
            if (!resposta.ok) {
                throw new Error('Erro ao cadastrar o aluno: ' + resposta.statusText)
            }
    
            mostrarNotificacao('Aluno cadastrado com sucesso!', 'success')
            
        } catch (erro) {
            console.error('Erro ao cadastrar o aluno:', erro);
            mostrarNotificacao('Erro ao cadastrar o aluno.', 'danger')
        }
    }

    function mostrarNotificacao(mensagem, tipo) {
        const notificacao = document.getElementById('notificacao')
        notificacao.textContent = mensagem;
        notificacao.className = `alert alert-${tipo}`
        notificacao.style.display = 'block'
        
      
        setTimeout(() => {
            notificacao.style.display = 'none'
        }, 5000)
    }

    
    // Função para carregar e mostrar os gráficos
    function mostrarGraficos() {
        const mainContainer = document.getElementById('main-container')
        mainContainer.innerHTML = ''

        
        carregarGrafico('turma1');
        carregarGrafico('turma2');
    }

// carregar gráficos de uma turma específica
    async function carregarGrafico(turma) {
    const containerId = `container-grafico-${turma}`
    const canvasId = `meuGrafico-${turma}`

    // Verificar se o gráfico já foi adicionado
    if (document.getElementById(containerId)) {
        console.log(`O gráfico para ${turma} já foi carregado.`)
        return
    }

    try {
        const response = await fetch(`http://localhost:8080/grafico-dados/${turma}`)
        const data = await response.json()

        console.log(`Dados recebidos para ${turma}:`, data)

        // Verifica se o container já foi adicionado para evitar múltiplas inserções
        const mainContainer = document.getElementById('main-container')
        if (!document.getElementById(containerId)) {
            mainContainer.innerHTML += `
                <div style="width: 40%; margin: 0 auto;" id="${containerId}">
                    <h3>Gráfico para ${turma}</h3>
                    <canvas id="${canvasId}"></canvas>
                </div>
            `
        }

        const chartData = {
            labels: ['Presenças', 'Faltas'],
            datasets: [{
                label: `Quantidade de Alunos - ${turma}`,
                data: [parseInt(data.totalPresencas, 10), parseInt(data.totalFaltas, 10)],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', 
                    'rgba(255, 99, 132, 0.6)' 
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        };

        const config = {
            type: 'doughnut', 
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.label || ''
                                if (label) {
                                    label += ': '
                                }
                                if (context.raw !== null) {
                                    label += context.raw + ' alunos'
                                }
                                return label
                            }
                        }
                    }
                }
            }
        }

        // Verifica se o gráfico já foi criado para evitar múltiplos gráficos no mesmo canvas
        const canvas = document.getElementById(canvasId)
        if (canvas) {
            new Chart(canvas, config)
        } else {
            console.error(`Canvas ${canvasId} não encontrado.`)
        }
    } catch (error) {
        console.error(`Erro ao carregar os dados do gráfico para ${turma}:`, error)
    }
    }




    document.getElementById('relatorios').addEventListener('click', function() {
        mostrarGraficos();
    });
    
    frequencia.addEventListener('click', mostrarFrequencia)


    turmas.addEventListener('click', mostrarTurmas)
})
