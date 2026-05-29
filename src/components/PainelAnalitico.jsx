import { getMaxValor } from "../lib/atendimentos";

function ResumoStatus({ cor, titulo, valor }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${cor}`} />
        <span className="text-xs text-slate-300">{titulo}</span>
      </div>
      <strong className="mt-2 block text-2xl font-black text-white">{valor}</strong>
    </div>
  );
}

function StatusDonut({ abertos, andamento, resolvidos }) {
  const total = abertos + andamento + resolvidos;
  const raio = 42;
  const circunferencia = 2 * Math.PI * raio;
  const segmentos = [
    { valor: abertos, cor: "#f59e0b" },
    { valor: andamento, cor: "#06b6d4" },
    { valor: resolvidos, cor: "#10b981" },
  ].filter((segmento) => segmento.valor > 0);

  let acumulado = 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Distribuição</p>
          <h3 className="mt-2 text-lg font-bold text-white">Status dos chamados</h3>
        </div>
        <span className="self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 sm:self-center">
          {total} itens
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="flex justify-center">
          <svg viewBox="0 0 120 120" className="h-44 w-44 -rotate-90 sm:h-48 sm:w-48">
            <circle cx="60" cy="60" r={raio} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" />
            {segmentos.map((segmento) => {
              const dashArray = `${(segmento.valor / total) * circunferencia} ${circunferencia}`;
              const dashOffset = -((acumulado / total) * circunferencia);
              acumulado += segmento.valor;

              return (
                <circle
                  key={segmento.cor}
                  cx="60"
                  cy="60"
                  r={raio}
                  fill="none"
                  stroke={segmento.cor}
                  strokeWidth="16"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>

        <div className="grid gap-3">
          <ResumoStatus cor="bg-amber-400" titulo="Abertos" valor={abertos} />
          <ResumoStatus cor="bg-cyan-400" titulo="Em andamento" valor={andamento} />
          <ResumoStatus cor="bg-emerald-400" titulo="Resolvidos" valor={resolvidos} />
        </div>
      </div>
    </div>
  );
}

function BarraMetricas({ titulo, itens }) {
  const maxValor = getMaxValor(itens);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/20">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">{titulo}</p>
      <div className="mt-5 space-y-4">
        {itens.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-200">{item.label}</span>
              <span className="text-slate-400">{item.valor}</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/10">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                style={{ width: `${(item.valor / maxValor) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LinhaTempo({ itens }) {
  const largura = 320;
  const altura = 140;
  const maxValor = getMaxValor(itens);

  const pontos = itens.map((item, index) => {
    const passoX = itens.length > 1 ? largura / (itens.length - 1) : largura;
    const x = index * passoX;
    const y = altura - (item.valor / maxValor) * (altura - 18) - 8;
    return `${x},${y}`;
  });

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Tendência</p>
          <h3 className="mt-2 text-lg font-bold text-white">Chamados criados nos últimos 7 dias</h3>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-3">
        <svg viewBox={`0 0 ${largura} ${altura}`} className="h-40 w-full">
          <polyline
            points={pontos.join(" ")}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {itens.map((item, index) => {
            const passoX = itens.length > 1 ? largura / (itens.length - 1) : largura;
            const x = index * passoX;
            const y = altura - (item.valor / maxValor) * (altura - 18) - 8;

            return <circle key={item.label} cx={x} cy={y} r="4.5" fill="#f8fafc" stroke="#22d3ee" strokeWidth="2" />;
          })}
        </svg>

        <div className="mt-2 grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.18em] text-slate-400">
          {itens.map((item) => (
            <span key={item.label}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PainelAnalitico({
  chamadosAbertos,
  chamadosAndamento,
  chamadosResolvidos,
  categoriasResumo,
  clientesResumo,
  serieDias,
}) {
  return (
    <>
      <section className="grid gap-4 xl:grid-cols-3">
        <StatusDonut abertos={chamadosAbertos} andamento={chamadosAndamento} resolvidos={chamadosResolvidos} />
        <BarraMetricas titulo="Categorias mais frequentes" itens={categoriasResumo} />
        <BarraMetricas titulo="Clientes com mais ocorrências" itens={clientesResumo} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <LinhaTempo itens={serieDias} />

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/20">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Visão rápida</p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            <p>Os gráficos mostram a distribuição por status, as categorias mais comuns e a tendência dos últimos 7 dias.</p>
            <p>Se quiser, o próximo passo natural é adicionar SLA por prioridade ou um gráfico por cliente.</p>
          </div>
        </div>
      </section>
    </>
  );
}
