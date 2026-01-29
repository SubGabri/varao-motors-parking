// js/main.js
import { calcularPagamento, formatarMoeda } from "./core.js";
import { lerBanco, adicionarCarro, atualizarCarro } from "./storage.js";

// --- SELEÇÃO DE ELEMENTOS ---
const formEntrada = document.getElementById("formEntrada");
const inpEntrada = document.getElementById("placaEntrada");

const inpPagamento = document.getElementById("placaPagamento");
const btnConsultar = document.getElementById("btnConsultar");

const inpSaida = document.getElementById("placaSaida");
const btnSair = document.getElementById("btnSair");

// Elementos de Exibição
const tabelaPatio = document.getElementById("tabelaCorpo");
const tabelaHistorico = document.getElementById("tabelaHistorico");
const displayFaturamento = document.getElementById("valorFaturamento");

// --- FUNÇÕES AUXILIARES ---

const validarPlaca = (placa) => {
  const regex = /^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/;
  return regex.test(placa);
};

// --- EVENTOS ---

const registrarEntrada = (e) => {
  if (e) e.preventDefault();
  const placa = inpEntrada.value.toUpperCase().replace("-", "");

  if (!validarPlaca(placa)) {
    return alert("Placa inválida! Use o formato ABC1234 ou ABC1D23.");
  }

  try {
    adicionarCarro(placa);
    alert(`Bem-vindo, ${placa}!`);
    inpEntrada.value = "";
    atualizarTelas();
  } catch (erro) {
    alert(erro.message);
  }
};

const consultarPagamento = () => {
  const placa = inpPagamento.value.toUpperCase().replace("-", "");
  const patio = lerBanco();
  const carro = patio.find((c) => c.placa === placa && !c.saiu);

  if (!carro) return alert("Veículo não encontrado ou já saiu!");
  if (carro.pago) return alert("Este veículo já está pago!");

  const info = calcularPagamento(carro.entrada);

  const aceitar = confirm(
    `Placa: ${placa}\nTempo: ${info.minutos} min\nTarifa: ${info.resumo}\nValor: ${formatarMoeda(info.valor)}\n\nConfirmar Pagamento?`,
  );

  if (aceitar) {
    carro.pago = true;
    carro.valorPago = info.valor;
    atualizarCarro(carro);
    alert("Pagamento Confirmado! 15 min de tolerância para sair.");
    inpPagamento.value = "";
    atualizarTelas();
  }
};

const registrarSaida = () => {
  const placa = inpSaida.value.toUpperCase().replace("-", "");
  const patio = lerBanco();
  const carro = patio.find((c) => c.placa === placa && !c.saiu);

  if (!carro) return alert("Veículo não está no pátio.");

  const infoAtual = calcularPagamento(carro.entrada);

  if (carro.pago || infoAtual.valor === 0) {
    carro.saiu = true;
    carro.saida = new Date().getTime();
    // Se saiu na carência (grátis), garantimos que valorPago seja 0
    if (!carro.valorPago) carro.valorPago = 0;

    atualizarCarro(carro);
    alert(`Saída liberada para ${placa}. Volte sempre!`);
    inpSaida.value = "";
    atualizarTelas();
  } else {
    alert(
      `CANCELA TRAVADA! Pagamento pendente: ${formatarMoeda(infoAtual.valor)}`,
    );
  }
};

// Função Mestra que chama todas as outras
function atualizarTelas() {
  renderizarPatio();
  renderizarHistorico();
  calcularFaturamento();
  renderizarRelatorioMensal();
}

function renderizarPatio() {
  const patio = lerBanco();
  const carrosNoPatio = patio.filter((c) => !c.saiu);

  if (carrosNoPatio.length === 0) {
    tabelaPatio.innerHTML = `<tr><td colspan="4" style="text-align:center">Pátio vazio.</td></tr>`;
    return;
  }

  tabelaPatio.innerHTML = carrosNoPatio
    .map((carro) => {
      const info = calcularPagamento(carro.entrada);
      const statusClass = carro.pago ? "success" : "warning";
      const statusText = carro.pago ? "PAGO" : "PENDENTE";

      // MUDANÇA AQUI: Formata para mostrar "28/01 10:30"
      const dataFormatada = new Date(carro.entrada).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      return `
            <tr>
                <td>${carro.placa}</td>
                <td>${dataFormatada}</td>
                <td>${info.minutos} min</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    })
    .join("");
}

function renderizarHistorico() {
  const patio = lerBanco();
  const carrosSairam = patio.filter((c) => c.saiu).reverse();

  if (carrosSairam.length === 0) {
    tabelaHistorico.innerHTML = `<tr><td colspan="4" style="text-align:center">Nenhum histórico.</td></tr>`;
    return;
  }

  const ultimos10 = carrosSairam.slice(0, 10);

  tabelaHistorico.innerHTML = ultimos10
    .map((carro) => {
      // MUDANÇA AQUI TAMBÉM: Data na entrada e na saída
      const entradaFormatada = new Date(carro.entrada).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      const saidaFormatada = new Date(carro.saida).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      return `
            <tr>
                <td>${carro.placa}</td>
                <td>${entradaFormatada}</td>
                <td>${saidaFormatada}</td>
                <td><strong>${formatarMoeda(carro.valorPago || 0)}</strong></td>
            </tr>
        `;
    })
    .join("");
}
// 2. Calcula o Lucro do Dia
function calcularFaturamento() {
  const patio = lerBanco();

  const hoje = new Date().toLocaleDateString();

  const total = patio
    .filter((c) => c.saiu && c.valorPago) // Só quem saiu e pagou
    .filter((c) => new Date(c.saida).toLocaleDateString() === hoje) // Só quem saiu HOJE
    .reduce((acumulador, carro) => acumulador + carro.valorPago, 0); // Soma tudo

  displayFaturamento.innerText = formatarMoeda(total);
}

// --- EVENT LISTENERS ---

if (formEntrada) formEntrada.addEventListener("submit", registrarEntrada);
btnConsultar.addEventListener("click", consultarPagamento);
btnSair.addEventListener("click", registrarSaida);

// --- INICIALIZAÇÃO ---

atualizarTelas();
setInterval(renderizarPatio, 60000); // Atualiza só o pátio a cada min

// ... (suas importações e variáveis existentes)

// --- NOVA FUNÇÃO DE RELATÓRIO ---
function renderizarRelatorioMensal() {
  const patio = lerBanco();
  const tabelaRelatorio = document.getElementById("tabelaRelatorioMensal");

  // 1. Filtra só quem já saiu e pagou
  const carrosPagos = patio.filter((c) => c.saiu && c.valorPago);

  // 2. Agrupa por dia (O Segredo!)
  // O resultado será algo tipo: { "28/01/2026": {qtd: 5, total: 100}, "27/01/2026": ... }
  const dadosPorDia = {};

  carrosPagos.forEach((carro) => {
    const dataSaida = new Date(carro.saida).toLocaleDateString("pt-BR");

    // Se esse dia ainda não existe no nosso grupo, cria ele zerado
    if (!dadosPorDia[dataSaida]) {
      dadosPorDia[dataSaida] = { qtd: 0, total: 0 };
    }

    // Soma os valores
    dadosPorDia[dataSaida].qtd += 1;
    dadosPorDia[dataSaida].total += carro.valorPago;
  });

  // 3. Transforma o Objeto de volta em Array para poder ordenar e exibir
  // Object.keys pega as datas ["28/01/2026", "27/01/2026"]
  const diasOrdenados = Object.keys(dadosPorDia).sort((a, b) => {
    // Truque para ordenar datas string (DD/MM/YYYY) corretamente
    const [diaA, mesA, anoA] = a.split("/");
    const [diaB, mesB, anoB] = b.split("/");
    return (
      new Date(`${anoB}-${mesB}-${diaB}`) - new Date(`${anoA}-${mesA}-${diaA}`)
    );
  });

  // 4. Renderiza na tela
  if (diasOrdenados.length === 0) {
    tabelaRelatorio.innerHTML = `<tr><td colspan="3" style="text-align:center">Sem dados este mês.</td></tr>`;
    return;
  }

  tabelaRelatorio.innerHTML = diasOrdenados
    .map((data) => {
      const dados = dadosPorDia[data];
      return `
            <tr>
                <td><strong>${data}</strong></td>
                <td>${dados.qtd} carros</td>
                <td style="color: var(--success); font-weight: bold;">
                    ${formatarMoeda(dados.total)}
                </td>
            </tr>
        `;
    })
    .join("");
}

// --- Lógica do "Olhinho" do Saldo ---
const btnOlho = document.getElementById("btnOlho");
const displayValor = document.getElementById("valorFaturamento");

const alternarVisibilidadeSaldo = () => {
  displayValor.classList.toggle("texto-borrado");

  if (displayValor.classList.contains("texto-borrado")) {
    btnOlho.innerText = "👁️"; // Olho aberto (para clicar e ver)
  } else {
    btnOlho.innerText = "🙈"; // Macaquinho tapando o olho (para esconder)
  }
};

// Evento de clique no botão e também no próprio texto borrado
btnOlho.addEventListener("click", alternarVisibilidadeSaldo);
displayValor.addEventListener("click", alternarVisibilidadeSaldo);
