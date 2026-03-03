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
    } else if (projectId === 'insurance') {
        renderInsuranceDemo();
    } else if (projectId === 'design_portfolio') {
        renderDesignDemo();
    } else if (projectId === 'real_estate') {
        renderRealEstateDemo();
    } else if (projectId === 'manson_tours') {
        renderMansonToursDemo();
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

function renderInsuranceDemo() {
    demoContainer.innerHTML = `
        <h3 style="margin-bottom: 1rem;">Cotizador de Seguros Inteligente</h3>
        <p style="margin-bottom: 2rem; color: #a1a1aa;">Simulación de cotización en tiempo real para seguros de vida.</p>
        
        <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
            <div>
                <label style="display: block; margin-bottom: 0.5rem;">Edad del Asegurado</label>
                <input type="number" id="ins-age" value="30" style="width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid #333; color: white; border-radius: 8px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 0.5rem;">Suma Asegurada ($)</label>
                <select id="ins-amount" style="width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid #333; color: white; border-radius: 8px;">
                    <option value="500000">500,000</option>
                    <option value="1000000" selected>1,000,000</option>
                    <option value="2000000">2,000,000</option>
                </select>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <input type="checkbox" id="ins-smoker" style="width: 20px; height: 20px;">
                <label>¿Es fumador?</label>
            </div>
        </div>
        
        <button onclick="calculateInsurance()" class="btn btn-primary" style="width: 100%;">Generar Cotización</button>
        
        <div id="ins-result" style="margin-top: 2rem; padding: 1.5rem; background: rgba(59, 130, 246, 0.1); border: 1px solid var(--accent); border-radius: 8px; display: none; text-align: center;">
            <p style="font-size: 0.9rem; color: #a1a1aa; margin-bottom: 0.5rem;">Prima Mensual Estimada:</p>
            <h4 id="ins-price" style="font-size: 2rem; color: white;">$0.00</h4>
            <button class="btn btn-outline" style="margin-top: 1rem; font-size: 0.8rem;">Descargar Folleto PDF</button>
        </div>
    `;
}

function calculateInsurance() {
    const age = parseInt(document.getElementById('ins-age').value);
    const amount = parseInt(document.getElementById('ins-amount').value);
    const isSmoker = document.getElementById('ins-smoker').checked;

    let base = amount * 0.0005;
    if (age > 40) base *= 1.5;
    if (isSmoker) base *= 2.0;

    const resultDiv = document.getElementById('ins-result');
    const priceDisplay = document.getElementById('ins-price');

    resultDiv.style.display = 'block';
    priceDisplay.innerText = `$${base.toFixed(2)}`;
}

function renderDentalDemo() {
    demoContainer.innerHTML = `
        <h3 style="margin-bottom: 1rem;">Gestión de Citas Odontológicas</h3>
        <p style="margin-bottom: 2rem; color: #a1a1aa;">Interfaz simplificada para agenda de pacientes infantiles.</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
                <h4 style="font-size: 0.8rem; color: #a1a1aa; margin-bottom: 1rem;">CALENDARIO SEMANAL</h4>
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; font-size: 0.7rem;">
                    <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
                    <span style="opacity: 0.3;">24</span><span style="opacity: 0.3;">25</span><span style="background: var(--accent); border-radius: 2px;">26</span><span>27</span><span>28</span><span>1</span><span>2</span>
                </div>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
                <h4 style="font-size: 0.8rem; color: #a1a1aa; margin-bottom: 1rem;">PRÓXIMO PACIENTE</h4>
                <p style="font-weight: bold;">Mateo García</p>
                <p style="font-size: 0.7rem; color: #10b981;">10:30 AM - Profilaxis</p>
            </div>
        </div>

        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 1rem;">
             <h4 style="font-size: 0.8rem; color: #a1a1aa; margin-bottom: 1rem;">NUEVA CITA RÁPIDA</h4>
             <div style="display: flex; gap: 0.5rem;">
                <input type="text" placeholder="Nombre del niño/a" style="flex: 1; padding: 0.5rem; background: #000; border: 1px solid #333; color: white; border-radius: 4px;">
                <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Agendar</button>
             </div>
        </div>
    `;
}

function renderDesignDemo() {
    demoContainer.innerHTML = `
        <h3 style="margin-bottom: 1rem;">Portfolio Inmersivo v1.0</h3>
        <p style="margin-bottom: 2rem; color: #a1a1aa;">Concepto de galería interactiva para marcas de lujo.</p>
        
        <div style="display: flex; gap: 1rem; height: 300px; overflow: hidden;">
            <div style="flex: 1; background: linear-gradient(45deg, #1a1a1a, #333); display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                <span style="font-size: 3rem; opacity: 0.2;">✦</span>
                <p style="position: absolute; bottom: 1rem; font-size: 0.7rem; letter-spacing: 2px;">BRANDING 2024</p>
            </div>
            <div style="flex: 1; background: linear-gradient(-45deg, #222, #444); display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                 <span style="font-size: 3rem; opacity: 0.2;">⬤</span>
                 <p style="position: absolute; bottom: 1rem; font-size: 0.7rem; letter-spacing: 2px;">EDITORIAL</p>
            </div>
        </div>
        
        <p style="margin-top: 1.5rem; font-size: 0.8rem; text-align: center; color: var(--accent);">Arrastra para navegar la experiencia inmersiva</p>
    `;
}

// --- REAL ESTATE DEMO STATE ---

const realEstateTranslations = {
    es: {
        title: "Residencia Calle 9",
        subtitle: "Lujo minimalista al sur de la ciudad",
        agentTitle: "Asistente Virtual",
        agentStatus: "En línea",
        chatPlaceholder: "Escribe tu pregunta (ej. ¿Aceptan mascotas?)...",
        formTitle: "Agendar Visita",
        namePlaceholder: "Nombre completo",
        phonePlaceholder: "Teléfono celular",
        emailPlaceholder: "Correo electrónico",
        datePlaceholder: "Fecha sugerida para visita",
        submitBtn: "Solicitar Cita",
        mapTitle: "Ubicación",
        langSelector: "EN/FR"
    },
    en: {
        title: "Calle 9 Residence",
        subtitle: "Minimalist luxury south of the city",
        agentTitle: "Virtual Assistant",
        agentStatus: "Online",
        chatPlaceholder: "Type your question (e.g. Do you accept pets?)...",
        formTitle: "Schedule a Tour",
        namePlaceholder: "Full Name",
        phonePlaceholder: "Mobile Phone",
        emailPlaceholder: "Email address",
        datePlaceholder: "Suggested date for tour",
        submitBtn: "Request Appointment",
        mapTitle: "Location",
        langSelector: "ES/FR"
    },
    fr: {
        title: "Résidence Calle 9",
        subtitle: "Luxe minimaliste au sud de la ville",
        agentTitle: "Assistant Virtuel",
        agentStatus: "En ligne",
        chatPlaceholder: "Posez votre question (ex. Acceptez-vous les animaux ?)...",
        formTitle: "Planifier une Visite",
        namePlaceholder: "Nom complet",
        phonePlaceholder: "Téléphone portable",
        emailPlaceholder: "Adresse e-mail",
        datePlaceholder: "Date suggérée pour la visite",
        submitBtn: "Demander le Rendez-vous",
        mapTitle: "Emplacement",
        langSelector: "ES/EN"
    }
};

let reLang = 'es';
let reImages = [
    'assets/calle9/Fachada.JPG',
    'assets/calle9/Entrada.jpg',
    'assets/calle9/Sala 1.jpg',
    'assets/calle9/Cocina 1.jpg',
    'assets/calle9/Dormitorio 1.jpg',
    'assets/calle9/Baño 1.jpg',
    'assets/calle9/Patio 1.jpg'
];
let currentImageIndex = 0;

function setReLanguage(lang) {
    reLang = lang;
    renderRealEstateDemo();
}

function nextReImage() {
    currentImageIndex = (currentImageIndex + 1) % reImages.length;
    document.getElementById('re-carousel-img').src = reImages[currentImageIndex];
}

function prevReImage() {
    currentImageIndex = (currentImageIndex - 1 + reImages.length) % reImages.length;
    document.getElementById('re-carousel-img').src = reImages[currentImageIndex];
}

function renderRealEstateDemo() {
    const t = realEstateTranslations[reLang];

    // Custom Ajusco colors
    const primaryColor = '#2b3a2f'; // Deep green
    const secondaryColor = '#e2e0d8'; // Stone white
    const accentColor = '#8c9c8a'; // Sage green

    demoContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
                <h3 style="color: ${secondaryColor}; font-family: 'Plus Jakarta Sans', sans-serif;">${t.title}</h3>
                <p style="color: ${accentColor}; font-size: 0.9rem;">${t.subtitle}</p>
            </div>
            <div style="display: flex; gap: 0.5rem; background: rgba(0,0,0,0.5); padding: 0.5rem; border-radius: 8px;">
                <button onclick="setReLanguage('es')" style="background: ${reLang === 'es' ? primaryColor : 'transparent'}; border: none; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">ES</button>
                <button onclick="setReLanguage('en')" style="background: ${reLang === 'en' ? primaryColor : 'transparent'}; border: none; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">EN</button>
                <button onclick="setReLanguage('fr')" style="background: ${reLang === 'fr' ? primaryColor : 'transparent'}; border: none; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">FR</button>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; height: 450px;">
            <!-- Left Column: Carousel & Map -->
            <div style="display: flex; flex-direction: column; gap: 1rem; overflow-y: auto; padding-right: 0.5rem;">
                
                <!-- Image Carousel -->
                <div style="position: relative; width: 100%; height: 250px; border-radius: 8px; overflow: hidden; background: #000;">
                    <img id="re-carousel-img" src="${reImages[currentImageIndex]}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s;" alt="Property Image">
                    <button onclick="prevReImage()" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">❮</button>
                    <button onclick="nextReImage()" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">❯</button>
                </div>
                
                <!-- Map -->
                <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
                     <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem; color: ${accentColor};">${t.mapTitle}</h4>
                     <iframe 
                        width="100%" 
                        height="120" 
                        frameborder="0" 
                        scrolling="no" 
                        marginheight="0" 
                        marginwidth="0" 
                        src="https://maps.google.com/maps?q=19.27529071339462,-99.21026948011156&hl=es&z=15&amp;output=embed"
                        style="border-radius: 4px; filter: invert(90%) hue-rotate(180deg) brightness(80%) contrast(80%);">
                     </iframe>
                </div>
            </div>
            
            <!-- Right Column: AI Chat & Form -->
            <div style="display: flex; flex-direction: column; background: rgba(0,0,0,0.3); border: 1px solid ${primaryColor}; border-radius: 8px; overflow: hidden;">
                
                <!-- Chat Header -->
                <div style="background: ${primaryColor}; padding: 0.8rem; display: flex; align-items: center; gap: 0.8rem;">
                    <div style="width: 35px; height: 35px; background: ${secondaryColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">🤖</div>
                    <div>
                        <div style="font-weight: bold; font-size: 0.9rem; color: ${secondaryColor};">${t.agentTitle}</div>
                        <div style="font-size: 0.7rem; color: #10b981;">● ${t.agentStatus}</div>
                    </div>
                </div>
                
                <!-- Chat Messages -->
                <div id="re-chat-history" style="flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.8rem; font-size: 0.85rem;">
                    <div style="background: rgba(255,255,255,0.1); padding: 0.8rem; border-radius: 8px 8px 8px 0; max-width: 85%; align-self: flex-start;">
                        ${reLang === 'es' ? '¡Hola! Soy el asistente virtual de Juan. ¿Qué información te gustaría saber sobre el departamento?' : (reLang === 'en' ? "Hello! I am Juan's virtual assistant. What would you like to know about the apartment?" : "Bonjour! Je suis l'assistant virtuel de Juan. Que souhaitez-vous savoir sur l'appartement?")}
                    </div>
                </div>
                
                <!-- Chat Input -->
                <div style="padding: 0.8rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 0.5rem;">
                    <input type="text" id="re-chat-input" placeholder="${t.chatPlaceholder}" style="flex: 1; padding: 0.6rem; background: rgba(255,255,255,0.05); border: 1px solid #333; color: white; border-radius: 4px; font-size: 0.8rem;" onkeypress="if(event.key === 'Enter') handleReChat()">
                    <button onclick="handleReChat()" style="background: ${primaryColor}; border: none; color: ${secondaryColor}; padding: 0 1rem; border-radius: 4px; cursor: pointer;">➤</button>
                </div>
            </div>
        </div>
        
        <!-- Supabase Form Trigger -->
        <div style="margin-top: 1.5rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem;">
            <p style="font-size: 0.85rem; color: #a1a1aa; margin-bottom: 1rem;">¿Listo para conocerlo?</p>
            <button onclick="showReForm()" style="background: ${secondaryColor}; color: #000; border: none; padding: 0.8rem 2rem; border-radius: 4px; font-weight: bold; cursor: pointer; transition: transform 0.2s;">${t.submitBtn}</button>
        </div>
        
        <!--Hidden Form Overlay-- >
        <div id="re-form-overlay" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); justify-content: center; align-items: center; border-radius: 8px;">
            <div style="background: #111; padding: 2rem; border-radius: 8px; width: 80%; max-width: 400px; border: 1px solid ${primaryColor}; position: relative;">
                <span onclick="hideReForm()" style="position: absolute; top: 10px; right: 15px; cursor: pointer; font-size: 1.2rem; color: #a1a1aa;">&times;</span>
                <h4 style="margin-bottom: 1.5rem; color: ${secondaryColor};">${t.formTitle}</h4>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <input type="text" id="re-form-name" placeholder="${t.namePlaceholder}" style="width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid #333; color: white; border-radius: 4px;">
                        <input type="tel" id="re-form-phone" placeholder="${t.phonePlaceholder}" style="width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid #333; color: white; border-radius: 4px;">
                            <input type="email" id="re-form-email" placeholder="${t.emailPlaceholder}" style="width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid #333; color: white; border-radius: 4px;">
                                <input type="text" id="re-form-date" placeholder="${t.datePlaceholder}" style="width: 100%; padding: 0.8rem; background: rgba(255,255,255,0.05); border: 1px solid #333; color: white; border-radius: 4px;">
                                    <button onclick="submitReLead()" style="background: ${primaryColor}; color: white; border: none; padding: 1rem; border-radius: 4px; font-weight: bold; cursor: pointer; margin-top: 0.5rem;">${t.submitBtn}</button>
                                </div>
                                <div id="re-form-feedback" style="margin-top: 1rem; font-size: 0.8rem; text-align: center; color: #10b981; display: none;">✅ Datos enviados de forma segura. Te contactaremos pronto.</div>
                            </div>
                        </div>
                        `;
}

function showReForm() {
    document.getElementById('re-form-overlay').style.display = 'flex';
}

function hideReForm() {
    document.getElementById('re-form-overlay').style.display = 'none';
}

// Simple rule-based chatbot for the demo
function handleReChat() {
    const inputEl = document.getElementById('re-chat-input');
    const msg = inputEl.value.trim();
    if (!msg) return;

    appendReMessage(msg, 'user');
    inputEl.value = '';

    // Simulate thinking time
    setTimeout(() => {
        const response = getReBotResponse(msg.toLowerCase());
        appendReMessage(response, 'bot');
    }, 800);
}

function appendReMessage(text, sender) {
    const history = document.getElementById('re-chat-history');
    const primaryColor = '#2b3a2f';
    const isBot = sender === 'bot';

    const div = document.createElement('div');
    div.style.padding = '0.8rem';
    div.style.maxWidth = '85%';
    div.style.borderRadius = isBot ? '8px 8px 8px 0' : '8px 8px 0 8px';
    div.style.alignSelf = isBot ? 'flex-start' : 'flex-end';
    div.style.background = isBot ? 'rgba(255,255,255,0.1)' : primaryColor;
    div.innerText = text;

    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}

function getReBotResponse(msg) {
    // English rules
    if (reLang === 'en') {
        if (msg.includes('pet') || msg.includes('dog') || msg.includes('cat')) return "Yes, we accept small pets. We are open to friendly negotiation for any situation. Would you like to schedule an appointment?";
        if (msg.includes('location') || msg.includes('where')) return "Calle 9, in the Miguel Hidalgo 4a Sección neighborhood, Tlalpan Municipality. Very close to the Ajusco Medio hospital. The map is updated on this screen!";
        if (msg.includes('furniture') || msg.includes('furnished')) return "It is possible to rent it furnished, but this will understandably increase the rent and deposit. We can discuss this in a personalized appointment.";
        if (msg.includes('parking')) return "There is no parking in the building, but there are pensions around that cost between $500 and $800 MXN per month. Would you like to set up an appointment?";
        if (msg.includes('room') || msg.includes('size')) return "It has one bedroom. The property is approximately 80m2, of which about 30m2 is a private garden space.";
        if (msg.includes('garden')) return "No, the garden terrace is completely private, very beautiful and quiet.";
        if (msg.includes('include') || msg.includes('what')) return "The rent includes: solid wood bed base, stove with hood, artisanal kitchen rack, electric fireplace, high-capacity programmable boiler, energy regulator, and a no-break for internet during outages.";

        return "You can leave your details using the button below, and I will gladly have Juan contact you specifically for this request!";
    }

    // French rules
    if (reLang === 'fr') {
        if (msg.includes('animal') || msg.includes('chien') || msg.includes('chat')) return "Oui, nous acceptons les petits animaux. Nous sommes ouverts à la négociation. Souhaitez-vous prendre rendez-vous ?";
        if (msg.includes('où') || msg.includes('emplacement') || msg.includes('lieu')) return "Calle 9, dans le quartier Miguel Hidalgo 4a Sección, municipalité de Tlalpan. Très proche de l'hôpital Ajusco Medio. La carte est sur cet écran !";
        if (msg.includes('meuble') || msg.includes('meublé')) return "Il est possible de louer meublé, mais cela augmentera le loyer et la caution. Nous pouvons en discuter lors d'un rendez-vous.";
        if (msg.includes('parking') || msg.includes('garage')) return "Il n'y a pas de parking dans l'immeuble, mais il y a des pensions autour (500-800 MXN / mois).";
        if (msg.includes('chambre') || msg.includes('taille')) return "Il a une chambre. La propriété fait environ 80m2, dont environ 30m2 de jardin privé.";
        if (msg.includes('jardin')) return "Non, la terrasse de jardin est entièrement privée, très belle et calme.";

        return "Vous pouvez laisser vos coordonnées via le bouton ci-dessous, et Juan vous contactera personnellement !";
    }

    // Default Spanish rules (based on provided FAQ text)
    if (msg.includes('hola') || msg.includes('info')) return "Claro que si... Remito requisitos y ubicación. Puedes hacerme preguntas precisas, o dejar tus datos.";
    if (msg.includes('foto')) return "Todas las fotos se encuentran en el carrusel interactivo que ves en esta pantalla.";
    if (msg.includes('ubicacion') || msg.includes('donde') || msg.includes('queda')) return "Calle 9, en la Colonia Miguel Hidalgo 4a Sección, Alcaldía de Tlalpan. Para mayor referencia, se encuentra cerca del hospital Ajusco Medio. Tienes el mapa al lado.";
    if (msg.includes('amueblado') || msg.includes('mueble')) return "Si es posible, pero esto te incrementará necesariamente la renta y el deposito en consecuencia. Podemos tratar ese tema en una cita personalizada. ¿Te queda el próximo miércoles?";
    if (msg.includes('estacionamiento')) return "No tiene estacionamiento en el edificio, la buena noticia es que existen pensiones alrededor y cuestan entre $500 y $800 mensuales. ¿Te gustaría que agendáramos una cita?";
    if (msg.includes('cuartos') || msg.includes('habitacion')) return "Solo un cuarto, es el espacio ideal para una pareja joven o personas que trabajan de forma remota.";
    if (msg.includes('jardin') || msg.includes('compartido')) return "No, la terraza jardín es completamente privada, es muy bella y silenciosa.";
    if (msg.includes('mascota') || msg.includes('perro') || msg.includes('gato')) return "Si, aceptamos mascotas pequeñas. No obstante estamos abiertos a la negociación amistosa de cualquier situación, ¿quieres agendar una cita para platicar de las particularidades de tu caso?";
    if (msg.includes('tamaño') || msg.includes('medida') || msg.includes('metros')) return "El tamaño es de aproximadamente 80m2, de estos alrededor de 30m2 son de jardín.";
    if (msg.includes('meses') || msg.includes('tiempo') || msg.includes('año')) return "Si claro, pero se mantiene el requisito del deposito, además la póliza es el único requisito que no podemos realizar por un tiempo menor a un año.";
    if (msg.includes('incluye') || msg.includes('dotacion')) return "La renta de 8400 incluye: base de cama de madera sólida, separaciones de madera, estufa con campana, rack artesanal, chimenea eléctrica, boiler programable, regulador, un no break y muebles de almacenamiento en la azotea.";
    if (msg.includes('cita') || msg.includes('ver')) return "Actualmente se está mostrando los días miércoles en horario corrido de 8 a 16 hrs. Por favor haz clic en 'Solicitar Cita' abajo para agendar.";

    return "No entendí del todo tu pregunta, pero si haces clic en el botón 'Solicitar Cita' Juan se pondrá en contacto contigo de inmediato.";
}

// Mock Supabase insertion function
function submitReLead() {
    // In a real scenario, you would use:
    // const {data, error} = await supabase.from('real_estate_leads').insert([{name, phone, email, date}])

    const btn = document.querySelector('#re-form-overlay button');
    btn.innerText = "Enviando...";
    btn.style.opacity = "0.7";

    setTimeout(() => {
        btn.innerText = "Listo";
        document.getElementById('re-form-feedback').style.display = 'block';
        setTimeout(() => hideReForm(), 2000);
    }, 1000);
}

function renderMansonToursDemo() {
    demoContainer.innerHTML = `
        <h3 style="margin-bottom: 1rem;">Manson Tours Landing Page</h3>
        <p style="margin-bottom: 1rem; color: #a1a1aa;">Sitio web productivo e interactivo, actualmente alojado en GitHub Pages.</p>
        
        <div style="width: 100%; height: 500px; border-radius: 8px; overflow: hidden; background: #000; border: 1px solid rgba(255,255,255,0.1);">
            <iframe 
                src="https://mexjsa.github.io/manson_tours/" 
                width="100%" 
                height="100%" 
                frameborder="0"
                loading="lazy"
                title="Manson Tours Demo">
            </iframe>
        </div>
        
        <div style="margin-top: 1rem; text-align: center;">
            <a href="https://mexjsa.github.io/manson_tours/" target="_blank" class="btn btn-primary" style="font-size: 0.8rem; padding: 0.5rem 1rem;">Abrir en Pestaña Completa</a>
        </div>
    `;
}

