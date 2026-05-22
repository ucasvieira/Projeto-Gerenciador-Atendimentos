import { useEffect, useState } from "react";

const URL = "/atendimentos";

function formatarWhatsApp(valor) {
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

function validarWhatsApp(valor) {
  const digitos = valor.replace(/\D/g, "");
  return digitos.length === 10 || digitos.length === 11;
}

export default function App() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({
    cliente: "",
    whatsapp: "",
    problema: "",
    status: "Aberto"
  });

  useEffect(() => {
    carregarAtendimentos();
  }, []);

  const totalAtendimentos = atendimentos.length;
  const chamadosAbertos = atendimentos.filter((atendimento) => atendimento.status === "Aberto").length;
  const chamadosResolvidos = totalAtendimentos - chamadosAbertos;

  async function carregarAtendimentos() {
    try {
      const res = await fetch(URL);
      const data = await res.json();
      setAtendimentos(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  async function adicionar(e) {
    e.preventDefault();
    if (!form.cliente || !form.problema) return alert("Preencha os campos obrigatórios!");
    if (form.whatsapp && !validarWhatsApp(form.whatsapp)) {
      return alert("Informe um WhatsApp válido com DDD e 10 ou 11 dígitos.");
    }

    await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ cliente: "", whatsapp: "", problema: "", status: "Aberto" });
    setModalAberto(false);
    carregarAtendimentos(); 
  }

  async function remover(id) {
    await fetch(`${URL}/${id}`, {
      method: "DELETE"
    });
    carregarAtendimentos(); 
  }

  async function atualizarStatus(chamado) {
    const novoStatus = chamado.status === "Aberto" ? "Resolvido" : "Aberto";
    const chamadoAtualizado = { ...chamado, status: novoStatus };

    await fetch(`${URL}/${chamado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chamadoAtualizado)
    });

    carregarAtendimentos(); 
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm"
          onClick={() => setModalAberto(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="novo-atendimento-title"
            className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  Novo chamado
                </p>
                <h2 id="novo-atendimento-title" className="mt-2 text-2xl font-bold text-white">
                  Abrir atendimento
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-400/20"
                aria-label="Fechar modal"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>

            <form onSubmit={adicionar} className="space-y-4">
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
                  className="min-h-36 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                  placeholder="Descreva o problema com o máximo de contexto possível"
                  value={form.problema}
                  onChange={(e) => setForm({ ...form, problema: e.target.value })}
                  required
                  rows={5}
                />
              </label>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30 focus:outline-none focus:ring-4 focus:ring-cyan-400/20"
                >
                  Registrar atendimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-5">
              <span className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                Central de suporte
              </span>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Gerenciador de Atendimentos
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Organize chamados, acompanhe o que está aberto e resolva solicitações com uma interface mais limpa, moderna e responsiva.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalAberto(true)}
                className="inline-flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30 focus:outline-none focus:ring-4 focus:ring-cyan-400/20"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2.5]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                </svg>
                Novo atendimento
              </button>

              
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <article className="rounded-2xl border border-white/10 bg-white/8 p-5">
                <span className="text-sm text-slate-400">Total</span>
                <strong className="mt-2 block text-3xl font-black text-white">{totalAtendimentos}</strong>
              </article>

              <article className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5">
                <span className="text-sm text-amber-100/80">Abertos</span>
                <strong className="mt-2 block text-3xl font-black text-white">{chamadosAbertos}</strong>
              </article>

              <article className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <span className="text-sm text-emerald-100/80">Resolvidos</span>
                <strong className="mt-2 block text-3xl font-black text-white">{chamadosResolvidos}</strong>
              </article>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Fila ativa</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Atendimentos em andamento</h2>
            </div>
            <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              Atualize, resolva ou remova chamados
            </span>
          </div>

          <div className="space-y-4">
            {atendimentos.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-slate-300">
                <strong className="block text-white">Sem chamados na fila</strong>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Assim que um novo atendimento entrar, ele aparecerá aqui.
                </p>
              </div>
            )}

            {atendimentos.map((chamado) => {
              const resolvido = chamado.status === "Resolvido";

              return (
                <article
                  key={chamado.id}
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
                      </div>

                      <p className="mt-2 text-sm text-slate-400">
                        WhatsApp: {chamado.whatsapp || "Não informado"}
                      </p>

                      <p className="mt-3 text-sm leading-7 text-slate-200">
                        {chamado.problema}
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 xl:w-44 xl:grid-cols-1">
                      <button
                        onClick={() => atualizarStatus(chamado)}
                        className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 ${resolvido ? "bg-amber-500 shadow-amber-500/20 focus:ring-amber-400/20" : "bg-emerald-500 shadow-emerald-500/20 focus:ring-emerald-400/20"}`}
                      >
                        {resolvido ? "Reabrir" : "Resolver"}
                      </button>

                      <button
                        onClick={() => remover(chamado.id)}
                        className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-rose-500/20 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-rose-400/20"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}