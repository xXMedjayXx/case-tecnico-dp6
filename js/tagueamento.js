(function() {
  // Configuração inicial com parâmetros para desabilitar detecção automática
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-096NHNN8Q2', { 
    page_location: location.href,
    send_page_view: true, // Mantém o page_view
    allow_google_signals: false, // Reduz rastreamento automático
    allow_ad_personalization_signals: false,
    link_attribution: false, // Desabilita atribuição automática de links
    linker: {
      accept_incoming: false,
      decorate_forms: false
    }
  });

  // Função para enviar apenas eventos personalizados
  function sendCustomEvent(eventName, eventParams = {}) {
    const finalParams = {
      page_location: location.href,
      ...eventParams,
      // Adiciona prefixo para identificar eventos manuais
      custom_event: 'true'
    };
    
    // Envia apenas via gtag (o dataLayer recebe automaticamente)
    gtag('event', eventName, finalParams);
  }

  document.addEventListener('DOMContentLoaded', () => {
    
    // Menu tracking - eventos personalizados
    const menuMap = {
      '.menu-lista-contato': { name: 'entre_em_contato', group: 'menu', event: 'click' },
      '.menu-lista-download': { name: 'download_pdf', group: 'menu', event: 'file_download' }
    };

    Object.entries(menuMap).forEach(([selector, data]) => {
      const element = document.querySelector(selector);
      if (element) {
        element.addEventListener('click', (e) => {
          e.preventDefault(); // Previne ação padrão que pode disparar eventos automáticos
          
          sendCustomEvent(data.event, {
            element_name: data.name,
            element_group: data.group,
            link_text: element.textContent?.trim() || '',
            link_url: element.href || ''
          });

          // Redireciona manualmente após o tracking
          if (element.href && data.name === 'download_pdf') {
            setTimeout(() => { window.location.href = element.href; }, 150);
          }
        });
      }
    });

    // Cards "Ver Mais"
    document.querySelectorAll('.card-montadoras').forEach(card => {
      card.addEventListener('click', function(e) {
        sendCustomEvent('click', {
          element_name: this.dataset.id || 'sem_id',
          element_group: 'ver_mais',
          card_title: this.querySelector('h3')?.textContent?.trim() || ''
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
              sendCustomEvent('form_start', { 
                form_id: formId, 
                form_name: formName, 
                form_destination: formDestination 
              });
            }
          });
        });

      // Submissão
      form.addEventListener('submit', (e) => {
        const submitText = form.querySelector('button[type="submit"]')?.textContent?.trim() || 'Enviar';
        sendCustomEvent('form_submit', {
          form_id: formId,
          form_name: formName,
          form_destination: formDestination,
          form_submit_text: submitText
        });
        // Permite o envio normal do formulário
      });

      // Sucesso (popup) - Usando MutationObserver mais específico
      if (typeof MutationObserver !== 'undefined') {
        let successFired = false;
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (!successFired && document.body.classList.contains('lightbox-open')) {
              const title = document.querySelector('.lightbox-title');
              if (title && title.textContent === 'Contato enviado') {
                successFired = true;
                sendCustomEvent('view_form_success', { 
                  form_id: formId, 
                  form_name: formName 
                });
                
                setTimeout(() => {
                  successFired = false;
                  formStarted = false;
                }, 1000);
              }
            }
          });
        });

        observer.observe(document.body, {
          attributes: true,
          attributeFilter: ['class']
        });
      }
    }
  });
})();
