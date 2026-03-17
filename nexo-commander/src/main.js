import './style.css'

const projects = [
  {
    name: 'Calle 9',
    db: 'Firebase Firestore',
    dbType: 'firebase',
    skills: ['Lead Capture', 'Real Estate Chatbot', 'Anti-Leak Protocol'],
    leads: 9,
    status: 'Protegido',
    leadsToday: 0
  },
  {
    name: 'Liga MX Model',
    db: 'Supabase (PostgreSQL)',
    dbType: 'supabase',
    skills: ['Data Mining', 'Statistical Modeling (Poisson)', 'RLS Secured'],
    leads: 0,
    status: 'Activo',
    leadsToday: 0
  },
  {
    name: 'YRDoc / DMS',
    db: 'SQLite (Local Hub)',
    dbType: 'sqlite',
    skills: ['Document Management', 'Role System', 'Currency Engine'],
    leads: 24,
    status: 'Deploy Ready',
    leadsToday: 2
  },
  {
    name: 'Manson Tours',
    db: 'Internal / API',
    dbType: 'sqlite',
    skills: ['Portfolio Integration', 'Lead Management'],
    leads: 12,
    status: 'Operativo',
    leadsToday: 1
  },
  {
    name: 'CONASAMA Chat',
    db: 'Firebase Firestore',
    dbType: 'firebase',
    skills: ['Health / Psych', 'Clinical Scoring', 'Crisis Detection'],
    leads: 154,
    status: 'Demo Ready',
    leadsToday: 8
  }
];

document.querySelector('#app').innerHTML = `
  <div>
    <header>
      <div class="logo-section">
        <h1>Nexo Commander</h1>
        <p>Sistema Central de Control de Proyectos - Skynet v1.0</p>
      </div>
      <div class="status-badge">
        <div class="status-dot"></div>
        Core Online / Operativo
      </div>
    </header>

    <main class="project-grid">
      ${projects.map(p => `
        <div class="project-card">
          <div class="project-header">
            <h2>${p.name}</h2>
            <span class="db-tag db-${p.dbType}">${p.db}</span>
          </div>
          
          <div class="project-stats">
            <div class="stat-item">
              <span class="stat-label">Total Leads</span>
              <div class="stat-value">${p.leads}</div>
            </div>
            <div class="stat-item">
              <span class="stat-label">Estado</span>
              <div class="stat-value" style="font-size: 1rem; color: #38bdf8">${p.status}</div>
            </div>
          </div>

          <div class="skills-section">
            <div class="skills-title">Skills Relacionadas</div>
            <div class="skills-list">
              ${p.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </main>

    <footer class="footer-brand">
      Desarrollado en México por <strong style="color: #e2e8f0">NEXOS IA</strong> - 2026
    </footer>
  </div>
`
