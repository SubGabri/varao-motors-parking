// js/main.js
import { calcularPagamento, formatarMoeda } from "./core.js";
import { lerBanco, adicionarCarro, atualizarCarro } from "./storage.js";

// --- SELEÇÃO DE ELEMENTOS ---
const formEntrada = document.getElementById("formEntrada");
const inpEntrada = document.getElementById("placaEntrada");
const btnEntrar = document.getElementById("btnEntrar");

const inpPagamento = document.getElementById("placaPagamento");
const btnConsultar = document.getElementById("btnConsultar"); // Precisamos pegar o botão pelo ID agora

const inpSaida = document.getElementById("placaSaida");
const btnSair = document.getElementById("btnSair"); // Precisamos pegar o botão pelo ID agora

const tabelaHistorico = document.getElementById("tabelaCorpo");

// --- FUNÇÕES AUXILIARES ---

// Valida placa Mercosul (ABC1D23) ou Antiga (ABC-1234)
const validarPlaca = (placa) => {
  const regex = /^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/;
  return regex.test(placa);
};

// --- FUNÇÕES DE EVENTOS (HANDLERS) ---

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
    renderizarTabela();
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
    `Placa: ${placa}\n` +
      `Tempo: ${info.minutos} min\n` +
      `Tarifa: ${info.resumo}\n` +
      `Valor: ${formatarMoeda(info.valor)}\n\n` +
      `Confirmar Pagamento?`,
  );

  if (aceitar) {
    carro.pago = true;
    carro.valorPago = info.valor;
    atualizarCarro(carro);
    alert("Pagamento Confirmado! 15 min de tolerância para sair.");
    inpPagamento.value = "";
    renderizarTabela();
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
    atualizarCarro(carro);
    alert(`Saída liberada para ${placa}. Volte sempre!`);
    inpSaida.value = "";
    renderizarTabela();
  } else {
    alert(
      `CANCELA TRAVADA! Pagamento pendente: ${formatarMoeda(infoAtual.valor)}`,
    );
  }
};

// --- RENDERIZAÇÃO OTIMIZADA ---

function renderizarTabela() {
  const patio = lerBanco();
  const carrosNoPatio = patio.filter((c) => !c.saiu);

  if (carrosNoPatio.length === 0) {
    tabelaHistorico.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center">Nenhum veículo no pátio.</td>
            </tr>
        `;
    return;
  }

  // Otimização: Renderização em lote para evitar reflow do DOM
  const novasLinhas = carrosNoPatio
    .map((carro) => {
      const info = calcularPagamento(carro.entrada);
      const statusClass = carro.pago ? "success" : "warning";
      const statusText = carro.pago ? "PAGO" : "PENDENTE";

      return `
            <tr>
                <td>${carro.placa}</td>
                <td>${new Date(carro.entrada).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                <td>${info.minutos} min</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    })
    .join("");

  tabelaHistorico.innerHTML = novasLinhas;
}

// --- EVENT LISTENERS ---

formEntrada.addEventListener("submit", registrarEntrada);
btnConsultar.addEventListener("click", consultarPagamento);
btnSair.addEventListener("click", registrarSaida);

// --- INICIALIZAÇÃO ---

renderizarTabela();
setInterval(renderizarTabela, 60000);
