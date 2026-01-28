// js/storage.js

// js/storage.js - Versão Blindada

const DB_KEY = "varao_motors_db";

export function lerBanco() {
  try {
    const dados = localStorage.getItem(DB_KEY);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error("Erro ao ler banco de dados. Resetando...", erro);
    // Se der erro, retorna vazio para o site não travar
    return [];
  }
}

export function salvarBanco(listaCarros) {
  localStorage.setItem(DB_KEY, JSON.stringify(listaCarros));
}

export function adicionarCarro(placa) {
  const patio = lerBanco();

  // Validação de duplicidade
  if (patio.find((c) => c.placa === placa && !c.saiu)) {
    throw new Error("Veículo já está no pátio!");
  }

  patio.push({
    placa: placa,
    entrada: new Date().getTime(),
    pago: false,
    saiu: false,
  });

  salvarBanco(patio);
}

// Atualiza um carro específico
export function atualizarCarro(carroAtualizado) {
  let patio = lerBanco();
  const index = patio.findIndex(
    (c) =>
      c.placa === carroAtualizado.placa &&
      c.entrada === carroAtualizado.entrada,
  );

  if (index !== -1) {
    patio[index] = carroAtualizado;
    salvarBanco(patio);
  }
}
