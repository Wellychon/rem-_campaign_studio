import React from "react";
import "@/styles/remi-brand.css";

export default function BrandDemo() {
  const formatPct = (n: number) => `${(n * 100).toFixed(1)}%`;

  return (
    <div className="remi" style={{ padding: 16 }}>
      <header className="remi-header" role="banner">
        <div className="remi-brand">
          <img src="/logo.png" alt="Remí TestLab" height={32} />
          <span style={{ fontWeight: 700, color: "#6b7280" }}>Plataforma Interna de Testes</span>
        </div>
        <nav style={{ display: "flex", gap: 8 }}>
          <a className="remi-button primary" href="#simular">Rodar simulação</a>
          <a className="remi-button accent" href="#ab">Gerar A/B</a>
        </nav>
      </header>

      <section style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0" }}>
        <div>
          <h1 style={{ fontSize: 24, margin: 0, fontWeight: 800 }}>Remí — Página de Teste de Marca</h1>
          <p style={{ color: "#6b7280", margin: "4px 0 0" }}>Visual de alto contraste, tipografia geométrica e UI minimalista.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="remi-button primary">Ação Primária</button>
          <button className="remi-button accent">Ação Secundária</button>
        </div>
      </section>

      <section className="remi-row" aria-live="polite">
        <div className="remi-card remi-kpi">
          <span className="label">Open rate</span>
          <span className="value">{formatPct(0.42)}</span>
        </div>
        <div className="remi-card remi-kpi">
          <span className="label">CTR</span>
          <span className="value">{formatPct(0.18)}</span>
        </div>
        <div className="remi-card remi-kpi">
          <span className="label">CTOR</span>
          <span className="value">{formatPct(0.36)}</span>
        </div>
      </section>

      <section className="remi-row" style={{ marginTop: 12 }}>
        <div className="remi-card remi-kpi">
          <span className="label">Descadastros</span>
          <span className="value">{formatPct(0.012)}</span>
        </div>
        <div className="remi-card remi-kpi">
          <span className="label">Spam</span>
          <span className="value">{formatPct(0.006)}</span>
        </div>
        <div className="remi-card remi-kpi">
          <span className="label">Bounces</span>
          <span className="value">{formatPct(0.025)}</span>
        </div>
      </section>

      <section style={{ marginTop: 16 }} id="ab">
        <div className="remi-card">
          <h2 className="remi-section-title">Variações A/B</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <span className="label">Assuntos</span>
              <ul style={{ margin: 8, paddingLeft: 18 }}>
                <li>Remí | Oferta do mês — até 30% OFF</li>
                <li>Remí TestLab: aprenda rápido, decida melhor</li>
                <li>Seus resultados simulados em 2 cliques</li>
              </ul>
            </div>
            <div>
              <span className="label">CTAs</span>
              <ul style={{ margin: 8, paddingLeft: 18 }}>
                <li>Quero aproveitar agora</li>
                <li>Ver detalhes</li>
                <li>Comparar variações</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <div className="remi-card remi-type">
          <h2 className="remi-section-title">Tipografia</h2>
          <h1>Headings — Montserrat 800</h1>
          <h2>Subtítulos — Montserrat 700</h2>
          <p>Texto — Montserrat 400/500 com alto contraste em #0B0F19.</p>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <div className="remi-card">
          <h2 className="remi-section-title">Badges</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="remi-badge media">Média</span>
            <span className="remi-badge alta">Alta</span>
            <span className="remi-badge baixa">Baixa</span>
          </div>
        </div>
      </section>
    </div>
  );
}
