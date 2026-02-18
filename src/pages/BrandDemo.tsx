import React from "react";
import "@/styles/rami-brand.css";

export default function BrandDemo() {
  const formatPct = (n: number) => `${(n * 100).toFixed(1)}%`;

  return (
    <div className="rami" style={{ padding: 16 }}>
      <header className="rami-header" role="banner">
        <div className="rami-brand">
          <img src="/rami-logo.svg" alt="Ramí TestLab" height={32} />
          <span style={{ fontWeight: 700, color: "#6b7280" }}>Plataforma Interna de Testes</span>
        </div>
        <nav style={{ display: "flex", gap: 8 }}>
          <a className="rami-button primary" href="#simular">Rodar simulação</a>
          <a className="rami-button accent" href="#ab">Gerar A/B</a>
        </nav>
      </header>

      <section style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0" }}>
        <div>
          <h1 style={{ fontSize: 24, margin: 0, fontWeight: 800 }}>Ramí — Página de Teste de Marca</h1>
          <p style={{ color: "#6b7280", margin: "4px 0 0" }}>Visual de alto contraste, tipografia geométrica e UI minimalista.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="rami-button primary">Ação Primária</button>
          <button className="rami-button accent">Ação Secundária</button>
        </div>
      </section>

      <section className="rami-row" aria-live="polite">
        <div className="rami-card rami-kpi">
          <span className="label">Open rate</span>
          <span className="value">{formatPct(0.42)}</span>
        </div>
        <div className="rami-card rami-kpi">
          <span className="label">CTR</span>
          <span className="value">{formatPct(0.18)}</span>
        </div>
        <div className="rami-card rami-kpi">
          <span className="label">CTOR</span>
          <span className="value">{formatPct(0.36)}</span>
        </div>
      </section>

      <section className="rami-row" style={{ marginTop: 12 }}>
        <div className="rami-card rami-kpi">
          <span className="label">Descadastros</span>
          <span className="value">{formatPct(0.012)}</span>
        </div>
        <div className="rami-card rami-kpi">
          <span className="label">Spam</span>
          <span className="value">{formatPct(0.006)}</span>
        </div>
        <div className="rami-card rami-kpi">
          <span className="label">Bounces</span>
          <span className="value">{formatPct(0.025)}</span>
        </div>
      </section>

      <section style={{ marginTop: 16 }} id="ab">
        <div className="rami-card">
          <h2 className="rami-section-title">Variações A/B</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <span className="label">Assuntos</span>
              <ul style={{ margin: 8, paddingLeft: 18 }}>
                <li>Ramí | Oferta do mês — até 30% OFF</li>
                <li>Ramí TestLab: aprenda rápido, decida melhor</li>
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
        <div className="rami-card rami-type">
          <h2 className="rami-section-title">Tipografia</h2>
          <h1>Headings — Montserrat 800</h1>
          <h2>Subtítulos — Montserrat 700</h2>
          <p>Texto — Montserrat 400/500 com alto contraste em #0B0F19.</p>
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <div className="rami-card">
          <h2 className="rami-section-title">Badges</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="rami-badge media">Média</span>
            <span className="rami-badge alta">Alta</span>
            <span className="rami-badge baixa">Baixa</span>
          </div>
        </div>
      </section>
    </div>
  );
}
