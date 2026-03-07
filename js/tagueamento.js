// =====================================================
// CONFIGURAÇÃO INICIAL
// Stream ID GA4: G-096NHNN8Q2
// =====================================================

(function() {
  // Configuração inicial
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-096NHNN8Q2', { page_location: location.href });

  // Helper function para tracking unificado
  function trackEvent(eventType, extraParams = {}) {
    const baseParams = {
      page_location: location.href,
      ...extraParams
    };
    
    // Dispara para ambos os sistemas
    gtag('event', eventType, baseParams);
    dataLayer.push({ event: eventType, ...baseParams });
  }

  // Inicializa após carregamento da página
  document.addEventListener('DOMContentLoaded', () => {
    
    // Menu tracking
    const menuMap = {
      '.menu-lista-contato': { name: 'entre_em_contato', group: 'menu' },
      '.menu-lista-download': { name: 'download_pdf', group: 'menu' }
    };

    Object.entries(menuMap).forEach(([selector, data]) => {
      const element = document.querySelector(selector);
      if (element) {
        element.addEventListener('click', () => {
          trackEvent('click', {
            element_name: data.name,
            element_group: data.group
          });
        });
      }
    });

    // Cards "Ver Mais"
    document.querySelectorAll('.card-montadoras').forEach(card => {
      card.addEventListener('click', function() {
        trackEvent('click', {
          element_name: this.dataset.id || 'sem_id',
          element_group: 'ver_mais'
        });
      });
    });

    // Formulário de contato
    const form = document.querySelector('form.contato');
    if (form) {
      let formStarted = false;
      const formId = form.id || 'sem_id';
      const formName = form.name || '';
      const formDestination = form.action || location.href;

      // Início do preenchimento
      form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]')
        .forEach(input => {
          input.addEventListener('input', () => {
            if (!formStarted) {
              formStarted = true;
              trackEvent('form_start', { form_id: formId, form_name: formName, form_destination: formDestination });
            }
          });
        });

      // Submissão
      form.addEventListener('submit', () => {
        const submitText = form.querySelector('button[type="submit"]')?.textContent?.trim() || 'Enviar';
        trackEvent('form_submit', {
          form_id: formId,
          form_name: formName,
          form_destination: formDestination,
          form_submit_text: submitText
        });
      });

      // Sucesso (popup)
      const checkSuccess = setInterval(() => {
        if (document.body.classList.contains('lightbox-open') && 
            document.querySelector('.lightbox-title')?.textContent === 'Contato enviado') {
          trackEvent('view_form_success', { form_id: formId, form_name: formName });
          clearInterval(checkSuccess);
          
          // Reset após 1s
          setTimeout(() => {
            formStarted = false;
          }, 1000);
        }
      }, 500);
    }
  });
})();
