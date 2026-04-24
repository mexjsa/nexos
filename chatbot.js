// ============================================================
// NEXO IA CHATBOT — Leads → Firebase calle9-2ca66 / nexos_leads
// ============================================================
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const _nexoFirebaseConfig = {
  apiKey: "AIzaSyBAXpmSLVVadvgVYPwLS1D2FtrI_IrQaQs",
  authDomain: "calle9-2ca66.firebaseapp.com",
  projectId: "calle9-2ca66",
  storageBucket: "calle9-2ca66.firebasestorage.app",
  messagingSenderId: "1064897799867",
  appId: "1:1064897799867:web:740a957d9d742e63f1ab9e"
};

// Reutiliza app si ya fue inicializada (en caso de cargar junto a portfolio.js)
const _nexoApp = getApps().length ? getApps()[0] : initializeApp(_nexoFirebaseConfig);
const _nexoDB = getFirestore(_nexoApp);

document.addEventListener('DOMContentLoaded', function () {
    const config = {
        botName: "Nexo Assistant",
        initialDelay: 500,
        typingDelay: 800,
    };

    const state = {
        isOpen: false,
        history: [],
        currentFlow: 'welcome',
        userData: {}
    };

    const flow = {
        welcome: {
            message: "Hola 👋 Soy el asistente de Nexo IA. ¿Qué te gustaría mejorar hoy?",
            options: [
                { label: "Captación de Leads", next: "business_size", save_as: { interest_type: "leads_bot" } },
                { label: "Automatizar procesos", next: "business_size", save_as: { interest_type: "automation" } },
                { label: "Sistema de gestión", next: "business_size", save_as: { interest_type: "management_system" } },
                { label: "Solución personalizada", next: "business_size", save_as: { interest_type: "custom_solution" } },
                { label: "Ver demostración", next: "business_size", save_as: { interest_type: "demo" } }
            ]
        },
        business_size: {
            message: "¿Cuántas personas trabajan en tu negocio?",
            options: [
                { label: "Solo yo", next: "offer_session", save_as: { business_size: "1" } },
                { label: "2–5 personas", next: "offer_session", save_as: { business_size: "2_5" } },
                { label: "6–20 personas", next: "offer_session", save_as: { business_size: "6_20" } },
                { label: "20+", next: "offer_session", save_as: { business_size: "20_plus" } }
            ]
        },
        offer_session: {
            message: "Podemos ayudarte a organizar y escalar tu operación. ¿Te gustaría una revisión breve sin costo?",
            options: [
                { label: "Sí, me interesa", next: "capture_name", save_as: { session_interest: "yes" } },
                { label: "Más información primero", next: "capture_name", save_as: { session_interest: "info_first" } }
            ]
        },
        capture_name: {
            message: "Perfecto 😊 ¿Cuál es tu nombre?",
            input: true,
            inputKey: "name",
            next: "capture_company"
        },
        capture_company: {
            message: "¿Cómo se llama tu empresa o proyecto?",
            input: true,
            inputKey: "company_name",
            next: "contact_method"
        },
        contact_method: {
            message: "¿Cómo prefieres que te contactemos?",
            options: [
                { label: "WhatsApp", next: "capture_whatsapp", save_as: { preferred_contact: "whatsapp" } },
                { label: "Llamada", next: "capture_phone", save_as: { preferred_contact: "phone" } },
                { label: "Email", next: "capture_email", save_as: { preferred_contact: "email" } }
            ]
        },
        capture_whatsapp: {
            message: "Compártenos tu número de WhatsApp.",
            input: true,
            inputKey: "whatsapp",
            next: "schedule"
        },
        capture_phone: {
            message: "¿A qué número podemos llamarte?",
            input: true,
            inputKey: "phone",
            next: "schedule"
        },
        capture_email: {
            message: "¿Cuál es tu correo electrónico?",
            input: true,
            inputKey: "email",
            validate: "email",
            next: "schedule"
        },
        schedule: {
            message: "¿Qué horario te acomoda mejor?",
            options: [
                { label: "Mañana (9–12)", next: "confirmation", save_as: { preferred_schedule: "morning" } },
                { label: "Medio día (12–3)", next: "confirmation", save_as: { preferred_schedule: "midday" } },
                { label: "Tarde (3–6)", next: "confirmation", save_as: { preferred_schedule: "afternoon" } },
                { label: "Flexible", next: "confirmation", save_as: { preferred_schedule: "flexible" } }
            ]
        },
        confirmation: {
            message: "Perfecto 🙌 Hemos registrado tu información. Te contactaremos pronto.",
            action: "submit_data",
            options: []
        },
        default: {
            message: "No estoy seguro de entender. ¿Podrías reformularlo o elegir una opción?",
            options: [
                { label: "Volver al menú", next: "welcome" }
            ]
        }
    };

    // --- DOM Widget ---
    const chatWidget = document.createElement('div');
    chatWidget.id = 'chat-widget';
    chatWidget.innerHTML = `
        <div class="chat-button" id="chatButton">
            <div class="chat-face">
                <div class="eyes">
                    <div class="eye left"></div>
                    <div class="eye right"></div>
                </div>
                <div class="mouth"></div>
            </div>
            <span>Platicame tu caso</span>
        </div>
        <div class="chat-window" id="chatWindow">
            <div class="chat-header">
                <h3>${config.botName}</h3>
                <button id="closeChat">×</button>
            </div>
            <div class="chat-messages" id="chatMessages"></div>
            <div class="chat-input-area" id="inputArea" style="display:none;">
                <input type="text" id="chatInput" placeholder="Escribe aquí...">
                <button id="sendMessage">➤</button>
            </div>
        </div>
    `;
    document.body.appendChild(chatWidget);

    const chatButton = document.getElementById('chatButton');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatMessages = document.getElementById('chatMessages');
    const inputArea = document.getElementById('inputArea');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');

    chatButton.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);
    sendMessage.addEventListener('click', handleInput);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleInput();
    });

    function toggleChat() {
        state.isOpen = !state.isOpen;
        chatWindow.classList.toggle('active', state.isOpen);
        if (state.isOpen && chatMessages.children.length === 0) {
            processNode('welcome');
        }
    }

    function processNode(nodeKey) {
        state.currentFlow = nodeKey;
        const node = flow[nodeKey] || flow['default'];
        let msg = node.message;
        if (state.userData.name) msg = msg.replace('{name}', state.userData.name);
        if (state.userData.email) msg = msg.replace('{email}', state.userData.email);

        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            addMessage('bot', msg);
            if (node.action === 'scroll_to_projects') {
                document.querySelector('#proyectos')?.scrollIntoView({ behavior: 'smooth' });
            } else if (node.action === 'submit_data') {
                submitLeadData(state.userData);
            }
            if (node.input) {
                showInput();
            } else if (node.options) {
                hideInput();
                addOptions(node.options);
            }
        }, config.typingDelay);
    }

    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.innerText = text;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addOptions(options) {
        if (!options || options.length === 0) return;
        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options-container');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.classList.add('chat-option-btn');
            btn.innerText = opt.label;
            btn.onclick = () => {
                optionsDiv.remove();
                addMessage('user', opt.label);
                if (opt.save_as) Object.assign(state.userData, opt.save_as);
                processNode(opt.next);
            };
            optionsDiv.appendChild(btn);
        });
        chatMessages.appendChild(optionsDiv);
        scrollToBottom();
    }

    function showInput() { inputArea.style.display = 'flex'; chatInput.focus(); }
    function hideInput() { inputArea.style.display = 'none'; }

    function handleInput() {
        const text = chatInput.value.trim();
        if (!text) return;
        const node = flow[state.currentFlow];
        if (node.validate === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(text)) { alert("Por favor ingresa un correo válido."); return; }
        }
        if (node.inputKey) state.userData[node.inputKey] = text;
        addMessage('user', text);
        chatInput.value = '';
        hideInput();
        processNode(node.next);
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.classList.add('message', 'bot');
        typingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function scrollToBottom() { chatMessages.scrollTop = chatMessages.scrollHeight; }

    // ✅ FIREBASE REAL — Guarda lead NEXOS en calle9-2ca66 / nexos_leads
    async function submitLeadData(data) {
        try {
            await addDoc(collection(_nexoDB, 'nexos_leads'), {
                ...data,
                project: 'NEXOS',
                source: 'chatbot_website',
                created_at: serverTimestamp()
            });
            console.log('✅ Lead NEXOS guardado en Firebase');
        } catch (err) {
            console.error('❌ Error guardando lead NEXOS:', err);
        }
    }
});
