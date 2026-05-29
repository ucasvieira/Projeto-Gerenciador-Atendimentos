import { useEffect, useMemo, useRef, useState } from "react";

import AtendimentoModal from "./components/AtendimentoModal";
import ListaAtendimentos from "./components/ListaAtendimentos";
import PainelAnalitico from "./components/PainelAnalitico";
import PainelFiltros from "./components/PainelFiltros";
import PainelTopo from "./components/PainelTopo";
import {
  API_URL,
  baixarArquivo,
  criarCsv,
  criarEstadoInicial,
  criarEventoHistorico,
  descreverAlteracoes,
  horasEntre,
  gerarId,
  normalizarAtendimento,
  obterSerieUltimosDias,
  prioridadePeso,
  validarWhatsApp,
} from "./lib/atendimentos";

export default function App() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroPrioridade, setFiltroPrioridade] = useState("Todas");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [ordenacao, setOrdenacao] = useState("recentes");
  const [form, setForm] = useState(criarEstadoInicial());
  const fileInputRef = useRef(null);

  useEffect(() => {
    carregarAtendimentos();
  }, []);

  const atendimentosNormalizados = useMemo(() => atendimentos.map((atendimento) => normalizarAtendimento(atendimento)), [atendimentos]);

  const atendimentosFiltrados = useMemo(() => {
    const consulta = busca.trim().toLowerCase();

    const resultado = atendimentosNormalizados.filter((atendimento) => {
      const combinaBusca =
        !consulta ||
        [atendimento.cliente, atendimento.whatsapp, atendimento.problema, atendimento.responsavel, atendimento.categoria]
          .join(" ")
          .toLowerCase()
          .includes(consulta);

      const combinaStatus = filtroStatus === "Todos" || atendimento.status === filtroStatus;
      const combinaPrioridade = filtroPrioridade === "Todas" || atendimento.prioridade === filtroPrioridade;
      const combinaCategoria = filtroCategoria === "Todas" || atendimento.categoria === filtroCategoria;

      return combinaBusca && combinaStatus && combinaPrioridade && combinaCategoria;
    });

    return resultado.sort((a, b) => {
      if (ordenacao === "antigos") {
        return new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime();
      }

      if (ordenacao === "prioridade") {
        return prioridadePeso(a.prioridade) - prioridadePeso(b.prioridade) || new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime();
      }

      if (ordenacao === "status") {
        return a.status.localeCompare(b.status) || new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime();
      }

      return new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime();
    });
  }, [atendimentosNormalizados, busca, filtroCategoria, filtroPrioridade, filtroStatus, ordenacao]);

  const totalAtendimentos = atendimentosNormalizados.length;
  const chamadosAbertos = atendimentosNormalizados.filter((atendimento) => atendimento.status === "Aberto").length;
  const chamadosAndamento = atendimentosNormalizados.filter((atendimento) => atendimento.status === "Em andamento").length;
  const chamadosResolvidos = atendimentosNormalizados.filter((atendimento) => atendimento.status === "Resolvido").length;
  const chamadosUrgentes = atendimentosNormalizados.filter((atendimento) => atendimento.prioridade === "Urgente").length;
  const chamadosVencidos = atendimentosNormalizados.filter((atendimento) => {
    const aberto = atendimento.status !== "Resolvido";
    const idadeHoras = horasEntre(atendimento.atualizadoEm, new Date());
    return aberto && idadeHoras >= 72;
  }).length;

  const tempoMedioResolucao = useMemo(() => {
    const resolvidos = atendimentosNormalizados.filter((atendimento) => atendimento.resolvidoEm);

    if (resolvidos.length === 0) {
      return 0;
    }

    const totalHoras = resolvidos.reduce((acumulado, atendimento) => {
      return acumulado + horasEntre(atendimento.criadoEm, atendimento.resolvidoEm);
    }, 0);

    return totalHoras / resolvidos.length;
  }, [atendimentosNormalizados]);

  const categoriasResumo = useMemo(() => {
    const mapa = new Map();

    atendimentosNormalizados.forEach((atendimento) => {
      mapa.set(atendimento.categoria, (mapa.get(atendimento.categoria) ?? 0) + 1);
    });

    return Array.from(mapa.entries())
      .map(([label, valor]) => ({ label, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);
  }, [atendimentosNormalizados]);

  const clientesResumo = useMemo(() => {
    const mapa = new Map();

    atendimentosNormalizados.forEach((atendimento) => {
      mapa.set(atendimento.cliente, (mapa.get(atendimento.cliente) ?? 0) + 1);
    });

    return Array.from(mapa.entries())
      .map(([label, valor]) => ({ label, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);
  }, [atendimentosNormalizados]);

  const serieDias = useMemo(() => obterSerieUltimosDias(atendimentosNormalizados), [atendimentosNormalizados]);

  async function carregarAtendimentos() {
    setCarregando(true);
    setErro("");

    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error(`Falha ao carregar atendimentos (${res.status})`);
      }

      const data = await res.json();
      setAtendimentos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setErro("Não foi possível carregar os atendimentos.");
    } finally {
      setCarregando(false);
    }
  }

  function abrirNovo() {
    setModoEdicao(false);
    setEditandoId(null);
    setForm(criarEstadoInicial());
    setModalAberto(true);
  }

  function abrirEdicao(atendimento) {
    setModoEdicao(true);
    setEditandoId(atendimento.id);
    setForm({
      cliente: atendimento.cliente,
      whatsapp: atendimento.whatsapp,
      problema: atendimento.problema,
      status: atendimento.status,
      prioridade: atendimento.prioridade,
      categoria: atendimento.categoria,
      responsavel: atendimento.responsavel,
      observacoes: atendimento.observacoes,
    });
    setModalAberto(true);
  }

  async function salvarAtendimento(e) {
    e.preventDefault();

    if (!form.cliente.trim() || !form.problema.trim()) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    if (form.whatsapp && !validarWhatsApp(form.whatsapp)) {
      alert("Informe um WhatsApp válido com DDD e 10 ou 11 dígitos.");
      return;
    }

    const agora = new Date().toISOString();

    if (modoEdicao) {
      const original = atendimentosNormalizados.find((atendimento) => atendimento.id === editandoId);

      if (!original) {
        alert("Atendimento não encontrado.");
        return;
      }

      const atualizado = {
        ...original,
        ...form,
        atualizadoEm: agora,
        resolvidoEm: form.status === "Resolvido" ? original.resolvidoEm ?? agora : null,
        historico: [...original.historico, criarEventoHistorico("update", descreverAlteracoes(original, { ...original, ...form }))],
      };

      await fetch(`${API_URL}/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atualizado),
      });
    } else {
      const novoAtendimento = {
        id: gerarId(),
        ...form,
        criadoEm: agora,
        atualizadoEm: agora,
        resolvidoEm: form.status === "Resolvido" ? agora : null,
        historico: [criarEventoHistorico("create", "Atendimento criado")],
      };

      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoAtendimento),
      });
    }

    setForm(criarEstadoInicial());
    setModalAberto(false);
    setModoEdicao(false);
    setEditandoId(null);
    await carregarAtendimentos();
  }

  async function remover(id) {
    if (!confirm("Deseja excluir este atendimento?")) {
      return;
    }

    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    await carregarAtendimentos();
  }

  async function atualizarStatus(chamado) {
    const novoStatus = chamado.status === "Resolvido" ? "Aberto" : "Resolvido";
    const agora = new Date().toISOString();
    const chamadoAtualizado = {
      ...chamado,
      status: novoStatus,
      atualizadoEm: agora,
      resolvidoEm: novoStatus === "Resolvido" ? agora : null,
      historico: [...chamado.historico, criarEventoHistorico("status", `Status alterado para ${novoStatus}`)],
    };

    await fetch(`${API_URL}/${chamado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chamadoAtualizado),
    });

    await carregarAtendimentos();
  }

  function exportarJson() {
    const conteudo = JSON.stringify(atendimentosNormalizados, null, 2);
    baixarArquivo(conteudo, `backup-atendimentos-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
  }

  function exportarCsv() {
    const conteudo = criarCsv(atendimentosFiltrados);
    baixarArquivo(conteudo, `atendimentos-filtrados-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8");
  }

  async function importarBackup(event) {
    const arquivo = event.target.files?.[0];
    event.target.value = "";

    if (!arquivo) {
      return;
    }

    try {
      const texto = await arquivo.text();
      const dados = JSON.parse(texto);
      const lista = Array.isArray(dados) ? dados : dados.atendimentos;

      if (!Array.isArray(lista)) {
        throw new Error("Formato de backup inválido");
      }

      const existentes = await fetch(API_URL).then((res) => res.json());

      await Promise.all(
        (Array.isArray(existentes) ? existentes : []).map((item) => fetch(`${API_URL}/${item.id}`, { method: "DELETE" })),
      );

      await Promise.all(
        lista.map((item) =>
          fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(normalizarAtendimento(item)),
          }),
        ),
      );

      await carregarAtendimentos();
    } catch (error) {
      console.error(error);
      alert("Não foi possível importar o backup.");
    }
  }

  function limparFiltros() {
    setBusca("");
    setFiltroStatus("Todos");
    setFiltroPrioridade("Todas");
    setFiltroCategoria("Todas");
    setOrdenacao("recentes");
  }

  const taxaResolucao = totalAtendimentos > 0 ? Math.round((chamadosResolvidos / totalAtendimentos) * 100) : 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

      <AtendimentoModal
        aberto={modalAberto}
        modoEdicao={modoEdicao}
        form={form}
        setForm={setForm}
        onClose={() => setModalAberto(false)}
        onSubmit={salvarAtendimento}
      />

      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={importarBackup} />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <PainelTopo
          totalAtendimentos={totalAtendimentos}
          chamadosAbertos={chamadosAbertos}
          chamadosAndamento={chamadosAndamento}
          chamadosResolvidos={chamadosResolvidos}
          chamadosUrgentes={chamadosUrgentes}
          chamadosVencidos={chamadosVencidos}
          taxaResolucao={taxaResolucao}
          tempoMedioResolucao={tempoMedioResolucao}
          erro={erro}
          onNovo={abrirNovo}
          onBackupJson={exportarJson}
          onExportCsv={exportarCsv}
          onImportBackup={() => fileInputRef.current?.click()}
        />

        <PainelAnalitico
          chamadosAbertos={chamadosAbertos}
          chamadosAndamento={chamadosAndamento}
          chamadosResolvidos={chamadosResolvidos}
          categoriasResumo={categoriasResumo}
          clientesResumo={clientesResumo}
          serieDias={serieDias}
        />

        <PainelFiltros
          busca={busca}
          setBusca={setBusca}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
          filtroPrioridade={filtroPrioridade}
          setFiltroPrioridade={setFiltroPrioridade}
          filtroCategoria={filtroCategoria}
          setFiltroCategoria={setFiltroCategoria}
          ordenacao={ordenacao}
          setOrdenacao={setOrdenacao}
          quantidadeResultados={atendimentosFiltrados.length}
          onLimparFiltros={limparFiltros}
        />

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Fila ativa</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Atendimentos em andamento</h2>
            </div>
            <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              Atualize, resolva, edite ou remova chamados
            </span>
          </div>

          <ListaAtendimentos
            atendimentos={atendimentosFiltrados}
            carregando={carregando}
            onResolver={atualizarStatus}
            onEditar={abrirEdicao}
            onExcluir={remover}
          />
        </section>
      </main>
    </div>
  );
}