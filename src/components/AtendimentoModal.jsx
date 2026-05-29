import {
  CATEGORIA_OPCOES,
  formatarWhatsApp,
  PRIORIDADE_OPCOES,
  STATUS_OPCOES,
} from "../lib/atendimentos";

export default function AtendimentoModal({
  aberto,
  modoEdicao,
  form,
  setForm,
  onClose,
  onSubmit,
}) {
  if (!aberto) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="novo-atendimento-title"
        className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              {modoEdicao ? "Editar chamado" : "Novo chamado"}
            </p>
            <h2 id="novo-atendimento-title" className="mt-2 text-2xl font-bold text-white">
              {modoEdicao ? "Atualizar atendimento" : "Abrir atendimento"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-400/20"
            aria-label="Fechar modal"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Cliente</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                placeholder="Nome do cliente"
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">WhatsApp</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                placeholder="(11) 99999-9999"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: formatarWhatsApp(e.target.value) })}
                inputMode="tel"
                autoComplete="tel"
                maxLength={15}
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-200">Problema</span>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
              placeholder="Descreva o problema com o máximo de contexto possível"
              value={form.problema}
              onChange={(e) => setForm({ ...form, problema: e.target.value })}
              required
              rows={5}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Status</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {STATUS_OPCOES.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Prioridade</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                value={form.prioridade}
                onChange={(e) => setForm({ ...form, prioridade: e.target.value })}
              >
                {PRIORIDADE_OPCOES.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Categoria</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              >
                {CATEGORIA_OPCOES.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Responsável</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                placeholder="Nome do atendente"
                value={form.responsavel}
                onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Observações</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                placeholder="Detalhes internos ou contexto adicional"
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              />
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30 focus:outline-none focus:ring-4 focus:ring-cyan-400/20"
            >
              {modoEdicao ? "Salvar alterações" : "Registrar atendimento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
