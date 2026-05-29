import {
  CATEGORIA_OPCOES,
  ORDENACAO_OPCOES,
  PRIORIDADE_OPCOES,
  STATUS_OPCOES,
} from "../lib/atendimentos";

export default function PainelFiltros({
  busca,
  setBusca,
  filtroStatus,
  setFiltroStatus,
  filtroPrioridade,
  setFiltroPrioridade,
  filtroCategoria,
  setFiltroCategoria,
  ordenacao,
  setOrdenacao,
  quantidadeResultados,
  onLimparFiltros,
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Filtros</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Refine a lista de atendimentos</h2>
        </div>
        <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          {quantidadeResultados} resultado(s)
        </span>
      </div>

      <div className="space-y-4">
        <input
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
          placeholder="Buscar por cliente, problema, WhatsApp ou categoria"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="Todos">Todos os status</option>
            {STATUS_OPCOES.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
            value={filtroPrioridade}
            onChange={(e) => setFiltroPrioridade(e.target.value)}
          >
            <option value="Todas">Todas as prioridades</option>
            {PRIORIDADE_OPCOES.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="Todas">Todas as categorias</option>
            {CATEGORIA_OPCOES.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
          >
            {ORDENACAO_OPCOES.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onLimparFiltros}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10"
          >
            Limpar filtros
          </button>

          <span className="inline-flex items-center rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
            Atualize os filtros para enxergar os resultados com mais clareza
          </span>
        </div>
      </div>
    </section>
  );
}
