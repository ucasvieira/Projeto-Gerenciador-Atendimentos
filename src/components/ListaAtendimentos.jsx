import { formatarData } from "../lib/atendimentos";

function CartaoAtendimento({ chamado, onResolver, onEditar, onExcluir }) {
  const resolvido = chamado.status === "Resolvido";
  const urgente = chamado.prioridade === "Urgente";

  return (
    <article
      className={`rounded-2xl border border-white/10 p-5 shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:border-cyan-400/20 ${resolvido ? "bg-emerald-500/10" : "bg-white/5"}`}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-white">{chamado.cliente}</h3>

            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${resolvido ? "bg-emerald-400/15 text-emerald-200" : "bg-amber-400/15 text-amber-200"}`}
            >
              {chamado.status}
            </span>

            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${urgente ? "bg-rose-400/15 text-rose-200" : "bg-white/10 text-slate-300"}`}
            >
              {chamado.prioridade}
            </span>

            <span className="inline-flex items-center rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
              {chamado.categoria}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-400">WhatsApp: {chamado.whatsapp || "Não informado"}</p>

          <p className="mt-3 text-sm leading-7 text-slate-200">{chamado.problema}</p>

          <div className="mt-4 grid gap-3 text-xs text-slate-400 sm:grid-cols-2 lg:grid-cols-4">
            <span>Criado: {formatarData(chamado.criadoEm)}</span>
            <span>Atualizado: {formatarData(chamado.atualizadoEm)}</span>
            <span>Responsável: {chamado.responsavel || "-"}</span>
            <span>Histórico: {chamado.historico.length} evento(s)</span>
          </div>

          {chamado.observacoes && <p className="mt-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3 text-sm text-slate-300">{chamado.observacoes}</p>}

          {chamado.historico.length > 0 && (
            <details className="mt-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-200">Ver histórico</summary>
              <div className="mt-3 space-y-3 text-sm text-slate-400">
                {[...chamado.historico].reverse().slice(0, 5).map((evento) => (
                  <div key={evento.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="font-medium text-slate-200">{evento.descricao}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {formatarData(evento.data)} · {evento.tipo}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-3 xl:w-64 xl:grid-cols-1">
          <button
            onClick={() => onResolver(chamado)}
            className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 ${resolvido ? "bg-amber-500 shadow-amber-500/20 focus:ring-amber-400/20" : "bg-emerald-500 shadow-emerald-500/20 focus:ring-emerald-400/20"}`}
          >
            {resolvido ? "Reabrir" : "Resolver"}
          </button>

          <button
            onClick={() => onEditar(chamado)}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-cyan-500/20 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-cyan-400/20"
          >
            Editar
          </button>

          <button
            onClick={() => onExcluir(chamado.id)}
            className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-rose-500/20 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-rose-400/20"
          >
            Excluir
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ListaAtendimentos({ atendimentos, carregando, onResolver, onEditar, onExcluir }) {
  if (carregando) {
    return <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300">Carregando atendimentos...</div>;
  }

  return (
    <div className="space-y-4">
      {atendimentos.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-slate-300">
          <strong className="block text-white">Nenhum chamado encontrado</strong>
          <p className="mt-2 text-sm leading-6 text-slate-400">Ajuste os filtros ou crie um novo atendimento para começar.</p>
        </div>
      )}

      {atendimentos.map((chamado) => (
        <CartaoAtendimento
          key={chamado.id}
          chamado={chamado}
          onResolver={onResolver}
          onEditar={onEditar}
          onExcluir={onExcluir}
        />
      ))}
    </div>
  );
}
