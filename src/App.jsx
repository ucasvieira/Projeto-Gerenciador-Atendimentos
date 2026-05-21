import { useEffect, useState } from "react";

const URL = "/atendimentos";

export default function App() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [form, setForm] = useState({
    cliente: "",
    whatsapp: "",
    problema: "",
    status: "Aberto"
  });

  useEffect(() => {
    carregarAtendimentos();
  }, []);

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

    await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ cliente: "", whatsapp: "", problema: "", status: "Aberto" });
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

  // --- ESTILOS REUTILIZÁVEIS ---
  const inputStyle = {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ced4da",
    fontSize: "15px",
    outline: "none"
  };

  const btnStyle = {
    padding: "10px 15px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.2s"
  };

  return (
    <div style={{ backgroundColor: "#f4f7f6", minHeight: "100vh", padding: "40px 20px", fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: "#333" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <h1 style={{ textAlign: "center", color: "#2c3e50", marginBottom: "30px", fontSize: "28px" }}>
          Gerenciador de Atendimentos
        </h1>

        {/* CARTÃO DO FORMULÁRIO */}
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", marginBottom: "35px" }}>
          <h2 style={{ marginTop: "0", fontSize: "18px", color: "#495057", marginBottom: "20px", borderBottom: "2px solid #f0f2f5", paddingBottom: "10px" }}>
            Abrir Novo Chamado
          </h2>
          <form onSubmit={adicionar} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "flex", gap: "15px" }}>
              <input placeholder="Nome do Cliente" value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} required style={{ ...inputStyle, flex: 1 }} />
              <input placeholder="WhatsApp (ex: 11999999999)" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
            </div>
            <input placeholder="Descrição detalhada do Problema" value={form.problema} onChange={(e) => setForm({ ...form, problema: e.target.value })} required style={inputStyle} />
            <button type="submit" style={{ ...btnStyle, backgroundColor: "#0d6efd", color: "white", marginTop: "5px", padding: "14px" }}>
              + Registrar Atendimento
            </button>
          </form>
        </div>
        
        {/* LISTA DE CHAMADOS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <h2 style={{ fontSize: "20px", color: "#2c3e50", margin: "0 0 10px 0" }}>Fila de Atendimentos</h2>
          
          {atendimentos.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "white", borderRadius: "10px", color: "#6c757d" }}>
              Nenhum chamado na fila. Tudo tranquilo por aqui! 🎉
            </div>
          )}
          
          {atendimentos.map((chamado) => (
            <div key={chamado.id} style={{ 
              backgroundColor: "white", 
              padding: "20px", 
              borderRadius: "10px", 
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              borderLeft: chamado.status === "Resolvido" ? "5px solid #198754" : "5px solid #ffc107",
              opacity: chamado.status === "Resolvido" ? "0.8" : "1"
            }}>
              
              {/* DADOS DO CHAMADO */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <h3 style={{ margin: "0", fontSize: "18px", color: "#212529" }}>{chamado.cliente}</h3>
                  <span style={{ color: "#6c757d", fontSize: "14px" }}>📱 {chamado.whatsapp}</span>
                  
                  {/* BADGE DE STATUS */}
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: "12px", 
                    fontSize: "12px", 
                    fontWeight: "bold", 
                    textTransform: "uppercase",
                    backgroundColor: chamado.status === "Resolvido" ? "#d1e7dd" : "#fff3cd",
                    color: chamado.status === "Resolvido" ? "#0f5132" : "#856404",
                  }}>
                    {chamado.status}
                  </span>
                </div>
                
                <p style={{ margin: "0", color: "#495057", fontSize: "15px", lineHeight: "1.4" }}>
                  <strong>Motivo:</strong> {chamado.problema}
                </p>
              </div>
              
              {/* AÇÕES */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => atualizarStatus(chamado)} 
                  style={{ ...btnStyle, backgroundColor: chamado.status === "Aberto" ? "#198754" : "#ffc107", color: chamado.status === "Aberto" ? "white" : "#000" }}
                >
                  {chamado.status === "Aberto" ? "✔ Resolver" : "↺ Reabrir"}
                </button>

                <button onClick={() => remover(chamado.id)} style={{ ...btnStyle, backgroundColor: "#dc3545", color: "white" }}>
                  ✖ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}