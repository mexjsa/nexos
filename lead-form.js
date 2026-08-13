const form = document.getElementById('nexos-intake-form');
const error = document.getElementById('nx-form-error');
const success = document.getElementById('nx-form-success');
const whatsappLink = document.getElementById('nx-wa-cta');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  error.textContent = '';
  if (!form.reportValidity()) return;

  const services = [...document.querySelectorAll('.nx-service:checked')].map((input) => input.value);
  if (!services.length) {
    error.textContent = 'Selecciona al menos una solución para preparar tu mensaje.';
    return;
  }

  const value = (id) => document.getElementById(id).value.trim();
  const lines = [
    '*Nueva solicitud desde NEXOS IA*',
    'Gracias por tu interés. Estos son los datos del proyecto:',
    '',
    `*Nombre:* ${value('nx-name')}`,
    value('nx-company') ? `*Empresa o giro:* ${value('nx-company')}` : null,
    `*Correo:* ${value('nx-email')}`,
    value('nx-phone') ? `*WhatsApp o teléfono:* ${value('nx-phone')}` : null,
    `*Soluciones de interés:* ${services.join(', ')}`,
    value('nx-budget') ? `*Presupuesto estimado:* ${value('nx-budget')}` : null,
    value('nx-desc') ? `*Comentarios:* ${value('nx-desc')}` : null
  ].filter(Boolean).join('\n');

  whatsappLink.href = `https://wa.me/525514803488?text=${encodeURIComponent(lines)}`;
  success.hidden = false;
  success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  whatsappLink.focus();
});
