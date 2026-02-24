// Portfolio Modal Logic

const modal = document.getElementById('demo-modal');
const demoContainer = document.getElementById('demo-container');

function openDemo(projectId) {
    modal.style.display = 'flex';
    demoContainer.innerHTML = ''; // Clear previous content

    if (projectId === 'credit_risk') {
        renderCreditRiskDemo();
    } else if (projectId === 'catimex') {
        renderCatimexDemo();
    } else if (projectId === 'betting_bot') {
        renderBettingBotDemo();
    }
}

function closeDemo() {
    modal.style.display = 'none';
    demoContainer.innerHTML = '';
}

// Close on outside click
window.onclick = function (event) {
    if (event.target == modal) {
        closeDemo();
    }
}

// --- Demo Renderers ---

function renderCreditRiskDemo() {
    demoContainer.innerHTML = `
        <h3 style="margin-bottom: 1rem;">Calculadora de Riesgo de Crédito</h3>
        <p style="margin-bottom: 2rem; color: #a1a1aa;">Simulación de algoritmo de scoring financiero.</p>
        
        <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
            <div>
                <label style="display: block; margin-bottom: 0.5rem;">Ingreso Mensual ($)</label>
                <input type="number" id="risk-income" value="15000" style="width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid #333; color: white; border-radius: 8px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 0.5rem;">Deuda Total ($)</label>
                <input type="number" id="risk-debt" value="5000" style="width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid #333; color: white; border-radius: 8px;">
            </div>
             <div>
                <label style="display: block; margin-bottom: 0.5rem;">Historial Crediticio (Score Buró)</label>
                <input type="range" id="risk-score" min="300" max="850" value="650" style="width: 100%;">
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #a1a1aa;">
                    <span>300 (Malo)</span>
                    <span id="score-display">650</span>
                    <span>850 (Excelente)</span>
                </div>
            </div>
        </div>
        
        <button onclick="calculateRisk()" class="btn btn-primary" style="width: 100%;">Calcular Riesgo</button>
        
        <div id="risk-result" style="margin-top: 2rem; padding: 1rem; border-radius: 8px; display: none; text-align: center;">
            <h4 style="font-size: 1.2rem;">Resultado del Análisis</h4>
            <div id="risk-meter" style="height: 10px; background: #333; margin: 1rem 0; border-radius: 5px; overflow: hidden;">
                <div id="risk-fill" style="width: 0%; height: 100%; transition: width 0.5s;"></div>
            </div>
            <p id="risk-message" style="font-weight: bold;"></p>
        </div>
    `;

    // Add event listener for range slider
    document.getElementById('risk-score').addEventListener('input', (e) => {
        document.getElementById('score-display').innerText = e.target.value;
    });
}

function calculateRisk() {
    // Simple mock algorithm
    const income = parseFloat(document.getElementById('risk-income').value);
    const debt = parseFloat(document.getElementById('risk-debt').value);
    const score = parseInt(document.getElementById('risk-score').value);

    const dti = debt / income; // Debt to Income ratio
    let riskLevel = 0; // 0 to 100 (100 is safe)

    // Logic
    if (dti < 0.3) riskLevel += 40;
    else if (dti < 0.5) riskLevel += 20;

    if (score > 700) riskLevel += 60;
    else if (score > 600) riskLevel += 30;

    riskLevel = Math.min(100, riskLevel);

    // Display
    const resultDiv = document.getElementById('risk-result');
    const fill = document.getElementById('risk-fill');
    const msg = document.getElementById('risk-message');

    resultDiv.style.display = 'block';

    // Animate
    setTimeout(() => {
        fill.style.width = riskLevel + '%';
        if (riskLevel > 70) {
            fill.style.background = '#10b981'; // Green
            msg.innerText = "RIESGO BAJO - APROBADO";
            msg.style.color = '#10b981';
        } else if (riskLevel > 40) {
            fill.style.background = '#f59e0b'; // Yellow
            msg.innerText = "RIESGO MEDIO - REVISIÓN MANUAL";
            msg.style.color = '#f59e0b';
        } else {
            fill.style.background = '#ef4444'; // Red
            msg.innerText = "RIESGO ALTO - RECHAZADO";
            msg.style.color = '#ef4444';
        }
    }, 100);
}

// --- CATIMEX DEMO STATE ---
let catimexView = 'dashboard';
const fakeUsers = [
    { name: "Agustín L.", status: "Activo", weapon: "Glock 25 (.380)" },
    { name: "Valeria M.", status: "En Proceso", weapon: "Beretta 84FS" },
    { name: "Ricardo J.", status: "Activo", weapon: "Tanfoglio FT9" },
    { name: "Sofia H.", status: "Pendiente", weapon: "Cezka P07" }
];

function renderCatimexDemo() {
    const content = getCatimexContent();

    demoContainer.innerHTML = `
        <div style="display: flex; height: 400px; gap: 1rem;">
            <!-- Sidebar -->
            <div style="width: 150px; border-right: 1px solid #333; padding-right: 1rem;">
                <h4 style="color: var(--accent); margin-bottom: 2rem;">CATIMEX <span style="font-size: 0.6rem;">v2.0</span></h4>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <button onclick="setCatimexView('dashboard')" style="text-align: left; background: ${catimexView === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent'}; border: none; color: ${catimexView === 'dashboard' ? 'white' : '#a1a1aa'}; padding: 0.5rem; cursor: pointer; border-radius: 5px;">📊 Resumen</button>
                    <button onclick="setCatimexView('users')" style="text-align: left; background: ${catimexView === 'users' ? 'rgba(255,255,255,0.1)' : 'transparent'}; border: none; color: ${catimexView === 'users' ? 'white' : '#a1a1aa'}; padding: 0.5rem; cursor: pointer; border-radius: 5px;">👥 Socios</button>
                    <button onclick="setCatimexView('inventory')" style="text-align: left; background: ${catimexView === 'inventory' ? 'rgba(255,255,255,0.1)' : 'transparent'}; border: none; color: ${catimexView === 'inventory' ? 'white' : '#a1a1aa'}; padding: 0.5rem; cursor: pointer; border-radius: 5px;">🔫 Armamento</button>
                    <button onclick="setCatimexView('sedena')" style="text-align: left; background: ${catimexView === 'sedena' ? 'rgba(255,255,255,0.1)' : 'transparent'}; border: none; color: ${catimexView === 'sedena' ? 'white' : '#a1a1aa'}; padding: 0.5rem; cursor: pointer; border-radius: 5px;">📄 Tramites SEDENA</button>
                </div>
            </div>
            
            <!-- Main Content -->
            <div style="flex: 1; overflow-y: auto;">
                ${content}
            </div>
        </div>
    `;
}

function setCatimexView(view) {
    catimexView = view;
    renderCatimexDemo();
}

function getCatimexContent() {
    if (catimexView === 'dashboard') {
        return `
            <h3>Panel General</h3>
            <p style="color: #a1a1aa; margin-bottom: 1.5rem;">Bienvenido, Administrador.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 8px;">
                    <h2 style="color: var(--accent);">124</h2>
                    <span style="font-size: 0.8rem; color: #a1a1aa;">Socios Activos</span>
                </div>
                <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 8px;">
                    <h2 style="color: #10b981;">100%</h2>
                    <span style="font-size: 0.8rem; color: #a1a1aa;">Cumplimiento SEDENA</span>
                </div>
            </div>
            <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem; color:white;">Alertas Recientes</h4>
            <div style="font-size: 0.8rem; color: #a1a1aa; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px;">
                <p style="margin-bottom: 0.5rem;">⚠️ 3 trámites requieren firma.</p>
                <p>✅ Inventario mensual verificado.</p>
            </div>
        `;
    } else if (catimexView === 'users') {
        return `
            <h3>Directorio de Socios</h3>
            <p style="color: #a1a1aa; margin-bottom: 1rem; font-size: 0.8rem;">Datos anonimizados para demostración.</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
                <tr style="border-bottom: 1px solid #333;">
                    <th style="padding: 0.5rem;">Nombre</th>
                    <th style="padding: 0.5rem;">Estatus</th>
                    <th style="padding: 0.5rem;">Acciones</th>
                </tr>
                ${fakeUsers.map(u => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 0.5rem;">${u.name}</td>
                    <td style="padding: 0.5rem;"><span style="background: ${u.status === 'Activo' ? '#10b981' : '#f59e0b'}; color: black; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem;">${u.status}</span></td>
                    <td style="padding: 0.5rem;"><button style="background:none; border: 1px solid #555; color: white; border-radius: 4px; cursor: pointer;">Ver</button></td>
                </tr>
                `).join('')}
            </table>
        `;
    } else if (catimexView === 'inventory') {
        return `
             <h3>Inventario de Club</h3>
             <ul style="list-style: none; margin-top: 1rem;">
                ${fakeUsers.map(u => `
                    <li style="display: flex; justify-content: space-between; padding: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <span>🔫 ${u.weapon}</span>
                        <span style="color: #a1a1aa; font-size: 0.8rem;">Asignada a: ${u.name}</span>
                    </li>
                `).join('')}
             </ul>
        `;
    } else if (catimexView === 'sedena') {
        return `
            <h3>Generador de Formatos</h3>
            <div style="background: #fff; color: #000; padding: 2rem; margin-top: 1rem; border-radius: 4px; opacity: 0.9; text-align: center;">
                <h4 style="margin: 0;">SECRETARÍA DE LA DEFENSA NACIONAL</h4>
                <p style="font-size: 0.6rem; margin-bottom: 2rem;">DIRECCIÓN GENERAL DEL REGISTRO FEDERAL DE ARMAS DE FUEGO Y CONTROL DE EXPLOSIVOS</p>
                <div style="border: 2px dashed #000; padding: 1rem;">
                    <p style="font-weight: bold;">SOLICITUD DE COMPRA</p>
                    <p style="font-size: 0.8rem;">FOLIO: A-2039-X</p>
                    <p style="font-size: 0.8rem;">SOLICITANTE: [PROTEGIDO]</p>
                </div>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Descargar PDF (Simulado)</button>
        `;
    }
}

function renderBettingBotDemo() {
    demoContainer.innerHTML = `
        <h3>Terminal de Análisis</h3>
        <div id="terminal" style="background: #000; padding: 1rem; font-family: 'Courier New', monospace; height: 300px; overflow-y: auto; color: #0f0; border-radius: 8px; margin-top: 1rem; border: 1px solid #333;">
            <div>> Iniciando sistema...</div>
            <div>> Conectando a API de visión... OK</div>
            <div>> Escaneando mercados...</div>
        </div>
    `;

    const terminal = document.getElementById('terminal');
    const messages = [
        "> Analizando 'Lakers vs Bulls' @ Bet365...",
        "> Momio detectado: +150",
        "> Comparando con Pinnacle...",
        "> Diferencia encontrada: 3.5%",
        "> OPORTUNIDAD DE ARBITRAJE DETECTADA",
        "> Ejecutando orden de compra...",
        "> Orden completada. ID: #99283",
        "> Esperando nuevos eventos..."
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i >= messages.length) {
            clearInterval(interval);
            return;
        }
        const msg = document.createElement('div');
        msg.innerText = messages[i];
        if (messages[i].includes("OPORTUNIDAD")) {
            msg.style.color = "yellow";
            msg.style.fontWeight = "bold";
        }
        terminal.appendChild(msg);
        terminal.scrollTop = terminal.scrollHeight;
        i++;
    }, 1500);
}
