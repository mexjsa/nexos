// ============================================================
// NEXO IA CHATBOT — Leads → WhatsApp 5514803488
// ============================================================
const NEXO_WA_NUMBER = '525514803488';

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
            message: "Podemos ayudarte. ¿Cómo prefieres continuar?",
            options: [
                { label: "💬 Quiero que me contacten (chat)", next: "capture_name", save_as: { session_interest: "chatbot" } },
                { label: "📄 Llenar formulario completo", next: "goto_form", save_as: { session_interest: "form" } },
                { label: "👋 WhatsApp directo", next: "direct_wa", save_as: { session_interest: "direct_wa" } }
            ]
        },
        goto_form: {
            message: "¡Perfecto! Te llevo al formulario donde podrás dejarnos todos tus datos y recibir una propuesta personalizada. 📝",
            action: "scroll_to_form",
            options: []
        },
        direct_wa: {
            message: "Haz clic abajo para abrir WhatsApp y platicar directamente con nuestro equipo. ¡Te esperamos! 👋",
            action: "open_whatsapp",
            options: [{ label: "🔙 Volver al inicio", next: "welcome" }]
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
            message: "Perfecto 🙌 Abriremos WhatsApp con tus datos para que nuestro equipo los reciba de inmediato. ¡Te contactamos pronto!",
            action: "submit_data",
            options: [{ label: "🔙 Volver al inicio", next: "welcome" }]
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
            } else if (node.action === 'scroll_to_form') {
                setTimeout(() => {
                    const formToggle = document.getElementById('nexos-form-toggle');
                    if (formToggle) { formToggle.click(); }
                    document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' });
                }, 500);
            } else if (node.action === 'open_whatsapp') {
                const waUrl = `https://wa.me/${NEXO_WA_NUMBER}?text=${encodeURIComponent('👋 Hola! Me interesó NEXOS IA y quiero conocer más sobre sus soluciones.')`;
                setTimeout(() => window.open(waUrl, '_blank'), 500);
                // Inject clickable WA button inside chat
                setTimeout(() => {
                    const waLink = document.createElement('a');
                    waLink.href = waUrl;
                    waLink.target = '_blank';
                    waLink.rel = 'noopener';
                    waLink.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:10px 16px;background:linear-gradient(135deg,#16a34a,#22c55e);color:white;border-radius:8px;font-weight:600;font-size:0.85rem;text-decoration:none;';
                    waLink.innerHTML = '💬 Abrir WhatsApp';
                    chatMessages.appendChild(waLink);
                    scrollToBottom();
                }, config.typingDelay + 100);
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

    // ✅ WHATSAPP — Envía lead vía wa.me con todos los datos recolectados
    function submitLeadData(data) {
        const scheduleLabels = { morning: 'Mañana (9–12h)', midday: 'Medio día (12–3h)', afternoon: 'Tarde (3–6h)', flexible: 'Flexible' };
        const interestLabels = { leads_bot: 'Captación de Leads', automation: 'Automatización de procesos', management_system: 'Sistema de gestión', custom_solution: 'Solución personalizada', demo: 'Ver demostración' };
        const sizeLabels   = { '1': 'Solo yo', '2_5': '2–5 personas', '6_20': '6–20 personas', '20_plus': '20+ personas' };

        const lines = [
            '📌 *Nuevo lead — Nexo Assistant*',
            '',
            data.name         ? `👤 *Nombre:* ${data.name}`                                       : null,
            data.company_name ? `🏢 *Empresa:* ${data.company_name}`                              : null,
            data.interest_type? `🎯 *Interés:* ${interestLabels[data.interest_type] || data.interest_type}` : null,
            data.business_size? `👥 *Tamaño:* ${sizeLabels[data.business_size] || data.business_size}`       : null,
            data.whatsapp     ? `📱 *WhatsApp:* ${data.whatsapp}`                                : null,
            data.phone        ? `📞 *Teléfono:* ${data.phone}`                                   : null,
            data.email        ? `📧 *Email:* ${data.email}`                                      : null,
            data.preferred_schedule ? `⏰ *Horario:* ${scheduleLabels[data.preferred_schedule] || data.preferred_schedule}` : null,
            data.preferred_contact  ? `📡 *Contacto preferido:* ${data.preferred_contact}`        : null,
        ].filter(Boolean).join('\n');

        const waUrl = `https://wa.me/${NEXO_WA_NUMBER}?text=${encodeURIComponent(lines)}`;

        // Auto-open WhatsApp
        setTimeout(() => window.open(waUrl, '_blank'), 400);

        // Inject green button inside chat for manual fallback
        setTimeout(() => {
            const waLink = document.createElement('a');
            waLink.href = waUrl;
            waLink.target = '_blank';
            waLink.rel = 'noopener';
            waLink.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin-top:10px;padding:12px 18px;background:linear-gradient(135deg,#16a34a,#22c55e);color:white;border-radius:10px;font-weight:700;font-size:0.9rem;text-decoration:none;box-shadow:0 4px 15px rgba(34,197,94,0.35);';
            waLink.innerHTML = '💬 Enviar mis datos a NEXOS ▶';
            chatMessages.appendChild(waLink);
            scrollToBottom();
        }, config.typingDelay + 200);
    }
});
