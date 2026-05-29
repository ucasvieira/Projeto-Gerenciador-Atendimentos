export const API_URL = "/atendimentos";

export const STATUS_OPCOES = ["Aberto", "Em andamento", "Resolvido"];
export const PRIORIDADE_OPCOES = ["Baixa", "Média", "Alta", "Urgente"];
export const CATEGORIA_OPCOES = ["Geral", "Suporte", "Integração", "Financeiro", "Treinamento", "Outros"];
export const ORDENACAO_OPCOES = [
  { value: "recentes", label: "Mais recentes" },
  { value: "antigos", label: "Mais antigos" },
  { value: "prioridade", label: "Maior prioridade" },
  { value: "status", label: "Status" },
];

export function gerarId() {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10).toUpperCase();
}

export function formatarWhatsApp(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);

  if (digitos.length === 0) {
    return "";
  }

  if (digitos.length <= 2) {
    return `(${digitos}`;
  }

  if (digitos.length <= 6) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  }

  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }

  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export function validarWhatsApp(valor) {
  const digitos = valor.replace(/\D/g, "");
  return digitos.length === 10 || digitos.length === 11;
}

export function formatarData(data) {
  if (!data) {
    return "-";
  }

  const dataObj = new Date(data);

  if (Number.isNaN(dataObj.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(dataObj);
}

export function formatarTempoMinutos(minutos) {
  if (!Number.isFinite(minutos) || minutos < 0) {
    return "-";
  }

  if (minutos < 60) {
    return `${Math.round(minutos)} min`;
  }

  const horas = Math.floor(minutos / 60);
  const restoMinutos = Math.round(minutos % 60);

  return `${horas}h ${restoMinutos}m`;
}

export function horasEntre(inicio, fim) {
  const diff = new Date(fim).getTime() - new Date(inicio).getTime();
  return diff / (1000 * 60 * 60);
}

export function prioridadePeso(prioridade) {
  const pesos = { Urgente: 0, Alta: 1, Média: 2, Baixa: 3 };
  return pesos[prioridade] ?? 4;
}

export function normalizarAtendimento(atendimento) {
  const criadoEm = atendimento.criadoEm ?? atendimento.atualizadoEm ?? new Date().toISOString();
  const atualizadoEm = atendimento.atualizadoEm ?? criadoEm;
  const historico = Array.isArray(atendimento.historico) ? atendimento.historico : [];

  return {
    id: atendimento.id ?? gerarId(),
    cliente: atendimento.cliente ?? "",
    whatsapp: atendimento.whatsapp ?? "",
    problema: atendimento.problema ?? "",
    status: atendimento.status ?? "Aberto",
    prioridade: atendimento.prioridade ?? "Média",
    categoria: atendimento.categoria ?? "Geral",
    responsavel: atendimento.responsavel ?? "",
    observacoes: atendimento.observacoes ?? "",
    criadoEm,
    atualizadoEm,
    resolvidoEm: atendimento.resolvidoEm ?? null,
    historico,
  };
}

export function criarEventoHistorico(tipo, descricao) {
  return {
    id: gerarId(),
    tipo,
    descricao,
    data: new Date().toISOString(),
  };
}

export function descreverAlteracoes(original, atualizado) {
  const alteracoes = [];

  ["cliente", "whatsapp", "problema", "status", "prioridade", "categoria", "responsavel", "observacoes"].forEach(
    (campo) => {
      if (original[campo] !== atualizado[campo]) {
        alteracoes.push(`${campo}: ${original[campo] || "vazio"} -> ${atualizado[campo] || "vazio"}`);
      }
    },
  );

  return alteracoes.length > 0 ? alteracoes.join(" | ") : "Nenhuma alteração relevante";
}

export function criarEstadoInicial() {
  return {
    cliente: "",
    whatsapp: "",
    problema: "",
    status: "Aberto",
    prioridade: "Média",
    categoria: "Geral",
    responsavel: "",
    observacoes: "",
  };
}

export function obterSerieUltimosDias(atendimentos) {
  const hoje = new Date();
  const datas = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() - offset);
    data.setHours(0, 0, 0, 0);
    datas.push(data);
  }

  return datas.map((dataBase) => {
    const inicio = new Date(dataBase);
    const fim = new Date(dataBase);
    fim.setDate(fim.getDate() + 1);

    return {
      label: new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(dataBase),
      valor: atendimentos.filter((atendimento) => {
        const criadoEm = new Date(atendimento.criadoEm);
        return criadoEm >= inicio && criadoEm < fim;
      }).length,
    };
  });
}

export function getMaxValor(lista) {
  return Math.max(...lista.map((item) => item.valor), 1);
}

export function criarCsv(lista) {
  const cabecalho = [
    "id",
    "cliente",
    "whatsapp",
    "problema",
    "status",
    "prioridade",
    "categoria",
    "responsavel",
    "criadoEm",
    "atualizadoEm",
    "resolvidoEm",
  ];

  const linhas = lista.map((item) => cabecalho.map((campo) => `"${String(item[campo] ?? "").replaceAll('"', '""')}"`).join(","));
  return [cabecalho.join(","), ...linhas].join("\n");
}

export function baixarArquivo(conteudo, nome, tipo) {
  const blob = new Blob([conteudo], { type: tipo });
  const url = globalThis.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  link.click();
  globalThis.URL.revokeObjectURL(url);
}
