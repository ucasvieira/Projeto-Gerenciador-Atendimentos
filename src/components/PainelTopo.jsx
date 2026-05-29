import { formatarTempoMinutos } from "../lib/atendimentos";

function CartaoResumo({ titulo, valor, className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/10 p-4 ${className}`}>
      <span className="text-sm text-slate-400">{titulo}</span>
      <strong className="mt-2 block text-3xl font-black text-white">{valor}</strong>
    </div>
  );
}

export default function PainelTopo({
  totalAtendimentos,
  chamadosAbertos,
  chamadosAndamento,
  chamadosResolvidos,
  chamadosUrgentes,
  chamadosVencidos,
  taxaResolucao,
  tempoMedioResolucao,
  erro,
  onNovo,
  onBackupJson,
  onExportCsv,
  onImportBackup,
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="space-y-6">
          <span className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Central de suporte
          </span>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Gerenciador de Atendimentos
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Organize chamados, acompanhe o que está aberto e resolva solicitações com métricas, filtros e gráficos, mantendo o fluxo baseado em JSON.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={onNovo}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30 focus:outline-none focus:ring-4 focus:ring-cyan-400/20"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2.5]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
              Novo atendimento
            </button>

            <button
              type="button"
              onClick={onBackupJson}
              className="inline-flex w-fit items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10"
            >
              Backup JSON
            </button>

            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex w-fit items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10"
            >
              Exportar CSV
            </button>

            <button
              type="button"
              onClick={onImportBackup}
              className="inline-flex w-fit items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10"
            >
              Importar backup
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <CartaoResumo titulo="Total" valor={totalAtendimentos} className="bg-slate-950/40" />
            <CartaoResumo titulo="Abertos" valor={chamadosAbertos} className="border-amber-400/20 bg-amber-400/10" />
            <CartaoResumo titulo="Em andamento" valor={chamadosAndamento} className="border-cyan-400/20 bg-cyan-400/10" />
            <CartaoResumo titulo="Resolvidos" valor={chamadosResolvidos} className="border-emerald-400/20 bg-emerald-400/10" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Indicadores</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <CartaoResumo titulo="Taxa de resolução" valor={`${taxaResolucao}%`} className="bg-white/5" />
              <CartaoResumo titulo="Tempo médio" valor={formatarTempoMinutos(tempoMedioResolucao * 60)} className="bg-white/5" />
              <CartaoResumo titulo="Urgentes" valor={chamadosUrgentes} className="bg-white/5" />
              <CartaoResumo titulo="Vencidos" valor={chamadosVencidos} className="bg-white/5" />
            </div>
          </div>

          {erro && <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">{erro}</div>}
        </div>
      </div>
    </section>
  );
}
