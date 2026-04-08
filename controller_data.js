// controller_data.js - O Caos Lógico

let formContainer;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializa o banco globalmente definido em db.js
    try {
        await initDB();
        console.log("Banco de dados pronto para o caos.");
    } catch (e) {
        console.error("Erro no IndexedDB", e);
    }

    formContainer = document.querySelector('.container');

    setupDiaCaotico();
    setupMesCaotico();
    setupAnoCaotico();
    setupBotaoSalvar();
});

// -- Dia: Uma grid onde os botões trocam de número aleatoriamente quando o mouse passa em cima
function setupDiaCaotico() {
    const diaGrid = document.getElementById('dia-grid');
    const inputOcultoDia = document.getElementById('dia');
    
    // Cria 31 dias
    for (let i = 1; i <= 31; i++) {
        const span = document.createElement('span');
        span.className = 'dia-grid-item';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'dia-radio';
        radio.value = i;
        
        const label = document.createElement('label');
        label.textContent = String(i).padStart(2, '0');
        
        span.appendChild(radio);
        span.appendChild(label);
        diaGrid.appendChild(span);
        
        // A frustração em forma de código
        span.addEventListener('mouseover', (e) => {
            // 70% de chance de trocar de valor com outro item aletório!
            if (Math.random() > 0.3) {
                const allSpans = document.querySelectorAll('.dia-grid-item');
                const p2 = allSpans[Math.floor(Math.random() * allSpans.length)];
                
                const label1 = span.querySelector('label');
                const radio1 = span.querySelector('input');
                
                const label2 = p2.querySelector('label');
                const radio2 = p2.querySelector('input');
                
                // Swap Texts and Values
                const tempText = label1.textContent;
                const tempVal = radio1.value;
                
                label1.textContent = label2.textContent;
                radio1.value = radio2.value;
                
                label2.textContent = tempText;
                radio2.value = tempVal;
            }
        });
        
        radio.addEventListener('change', (e) => {
            inputOcultoDia.value = e.target.value;
            // Mostra alert e tira seleção as vezes só pra ofender
            if (Math.random() > 0.6) {
                alert('Opa! Escorregou. Tente clicar com mais pontaria na próxima.');
                radio.checked = false;
                inputOcultoDia.value = "";
            }
        });
    }
}


// -- Mês: Fica mudando a ordem a cada 2 segundos e meio
const meses = [
    { value: '01', text: 'Janeiro' },
    { value: '02', text: 'Fevereiro' },
    { value: '03', text: 'Março' },
    { value: '04', text: 'Abril' },
    { value: '05', text: 'Maio' },
    { value: '06', text: 'Junho' },
    { value: '07', text: 'Julho' },
    { value: '08', text: 'Agosto' },
    { value: '09', text: 'Setembro' },
    { value: '10', text: 'Outubro' },
    { value: '11', text: 'Novembro' },
    { value: '12', text: 'Dezembro' }
];

function setupMesCaotico() {
    const selectMes = document.getElementById('mes');
    
    function renderMeses() {
        const oldValue = selectMes.value;
        selectMes.innerHTML = '';
        
        // Embaralha o array de forma não determinística
        const embaralhado = [...meses].sort(() => Math.random() - 0.5);
        
        embaralhado.forEach(m => {
            const option = document.createElement('option');
            option.value = m.value;
            option.textContent = m.text;
            selectMes.appendChild(option);
        });
        
        // Mesmo mantendo o valor antigo visualmente as vezes, a aleatoriedade reina
        if (oldValue && Math.random() > 0.5) selectMes.value = oldValue;
    }

    renderMeses();
    
    // Ignora o que o usuário quer e escolhe outro mês ao selecionar
    selectMes.addEventListener('change', (e) => {
        const randomTarget = meses[Math.floor(Math.random() * meses.length)].value;
        selectMes.value = randomTarget;
        alert('Aqui é roleta-russa! O sistema decidiu que você fará aniversário em outro mês.');
    });

    // Re-embaralha de tempo em tempo, e as vezes muda a seleção passivamente!
    setInterval(() => {
        renderMeses();
        if (Math.random() > 0.6) {
           selectMes.value = meses[Math.floor(Math.random() * meses.length)].value;
        }
    }, 2000);
}

// -- Ano: Input substitui teclas por aleatório e botão sofre um pouco
function setupAnoCaotico() {
    const inputAno = document.getElementById('ano');
    const btnIncrementar = document.getElementById('btn-incrementar-ano');
    let anoAtual = 1900;
    
    inputAno.value = ""; // Começa vazio
    
    inputAno.addEventListener('keydown', (e) => {
        if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
            return; // Deixa ele apagar se quiser
        }
        
        e.preventDefault(); // Impede de digitar o número real
        
        // Digita um numero completamente aleatório com regras cruéis
        if (inputAno.value.length < 4 && !isNaN(e.key) && e.key.trim() !== '') {
            let randomNum;
            const currentLen = inputAno.value.length;
            
            do {
                randomNum = Math.floor(Math.random() * 10);
            } while (
                // Primeira posição nunca é 2
                (currentLen === 0 && randomNum === 2) || 
                // Segunda posição nunca é 9
                (currentLen === 1 && randomNum === 9)
            );
            
            inputAno.value += randomNum;
        } else if (inputAno.value.length >= 4) {
            // Em caso de desespero, se já tem 4 dígitos, começa a apagar no final ou no inicio
            if (Math.random() > 0.5) {
                inputAno.value = inputAno.value.substring(1); // Remove o primeiro
            } else {
                inputAno.value = inputAno.value.substring(0, 3); // Remove o ultimo
            }
        }
    });

    // O botão da esperança: Adiciona ano 1 por 1
    btnIncrementar.addEventListener('click', () => {
        anoAtual++;
        inputAno.value = anoAtual;
        
        // Pequena chance de regredir 10 anos só de raiva
        if (Math.random() < 0.05) {
             anoAtual -= 10;
        }
    });

    // O botão agora SEMPRE foge do mouse, ficando inclicável com o ponteiro
    btnIncrementar.addEventListener('mouseover', () => {
        const containerRect = formContainer.getBoundingClientRect();
        const novoX = Math.floor(Math.random() * (containerRect.width - 150));
        
        btnIncrementar.style.position = 'absolute';
        btnIncrementar.style.left = novoX + 'px';
        btnIncrementar.style.top = Math.floor(Math.random() * (containerRect.height - 50)) + 'px';
    });

    inputAno.addEventListener('wheel', (e) => e.preventDefault());
}

// -- Salvar Data - Captura a confusão e envia pro BD
function setupBotaoSalvar() {
    const btnSalvar = document.getElementById('btn-salvar');
    
    let pontoSecreto = null;

    // Função para rodar e obter um ponto aleatório do botão
    function randomizarPontoSecreto() {
        const width = btnSalvar.offsetWidth || 300;
        const height = btnSalvar.offsetHeight || 150;
        const tamanho = 20; // 20x20 pixels apertados
        pontoSecreto = {
            x: Math.random() * Math.max(1, width - tamanho),
            y: Math.random() * Math.max(1, height - tamanho),
            size: tamanho
        };
    }

    // Inicializa o primeiro ponto secreto depois que renderizar
    setTimeout(randomizarPontoSecreto, 100);

    btnSalvar.addEventListener('click', async (e) => {
        const clickX = e.offsetX;
        const clickY = e.offsetY;

        // Se clicou fora do buraquinho de "furo" elusivo
        if (
            pontoSecreto && (
                clickX < pontoSecreto.x || clickX > pontoSecreto.x + pontoSecreto.size ||
                clickY < pontoSecreto.y || clickY > pontoSecreto.y + pontoSecreto.size
            )
        ) {
            alert('❌ Você bateu na blindagem do botão e errou o ponto fraco escodido (área de 20x20)! A brecha mudou de lugar. Tente novamente clicando em outro lugar do botão.');
            randomizarPontoSecreto(); // Muda de lugar a cada erro para não ser previsível!
            return;
        }

        const diaRaw = document.getElementById('dia').value;
        if (!diaRaw) {
             alert('Você esqueceu ou derrubou o dia pelo caminho. Ache a bolinha e clique de novo!');
             return;
        }
        
        const diaStr = String(diaRaw).padStart(2, '0');
        const mesStr = document.getElementById('mes').value;
        const anoStr = document.getElementById('ano').value;

        if (!mesStr) {
            alert('Você piscou e o mês fugiu. Tente novamente.');
            return;
        }
        
        if (anoStr.length !== 4 || isNaN(anoStr)) {
             alert(`Ano inválido: [ ${anoStr} ]. Continue lutando ou clique mais no botão!`);
             // Limpa o ano pra fustigar ainda mais
             document.getElementById('ano').value = "";
             return;
        }

        const dataSelecionada = `${anoStr}-${mesStr}-${diaStr}`;
        const isValidDateStr = !isNaN(new Date(dataSelecionada).getTime());

        if(!isValidDateStr) {
            alert(`A data ${diaStr}/${mesStr}/${anoStr} é amaldiçoada (não parece uma data real). Tente outra.`);
            return;
        }

        const obj = {
            dataNascimentoStr: dataSelecionada,
            timestampSessao: new Date().toISOString(),
            nivelDeEstresse: 'Altíssimo',
            diaObtido: diaStr,
            mesObtido: mesStr,
            anoObtido: anoStr
        };

        try {
            await saveDate(obj);
            
            // Mostrar vitória
            formContainer.style.display = 'none';
            const msg = document.getElementById('mensagem');
            msg.style.display = 'block';
            msg.innerHTML = `🌟 VITÓRIA! 🌟<br>Sua data salva: <b>${diaStr}/${mesStr}/${anoStr}</b><br><br>Você sobreviveu à pior UX do mundo! <br>Abra o Console > Application > IndexedDB para conferir.`;
        } catch (e) {
            alert('Erro salvando no IndexedDB... Tente de novo! Sério.');
        }
    });
}
