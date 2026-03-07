// Inicialização do gtag.js e dataLayer
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-096NHNN8Q2', {
  'page_location': window.location.href
});

// =====================================================
// FUNÇÕES PARA EVENTOS
// =====================================================

// Função para disparar eventos no gtag e dataLayer
function dispararEvento(eventName, eventData) {
  // gtag.js
  gtag('event', eventName, eventData);
  
  // dataLayer.push (inclui o eventName e todos os dados do eventData)
  dataLayer.push({
    'event': eventName,
    ...eventData
  });
}

// =====================================================
// EVENTOS DE MENU (Todas as páginas)
// =====================================================

document.addEventListener('DOMContentLoaded', function() {

  // Evento: Click - "Entre em Contato"
  var btnContato = document.querySelector('.menu-lista-contato');
  if (btnContato) {
    btnContato.addEventListener('click', function() {
      var eventName = 'click';
      var eventData = {
        'page_location': window.location.href,
        'element_name': 'entre_em_contato',
        'element_group': 'menu'
      };
      
      dispararEvento(eventName, eventData);
    });
  }

  // Evento: file_download - "Download PDF"
  var btnDownload = document.querySelector('.menu-lista-download');
  if (btnDownload) {
    btnDownload.addEventListener('click', function() {
      var eventName = 'file_download';
      var eventData = {
        'page_location': window.location.href,
        'element_name': 'download_pdf',
        'element_group': 'menu'
      };
      
      dispararEvento(eventName, eventData);
    });
  }

  // =====================================================
  // EVENTOS DE ANÁLISE (analise.html)
  // =====================================================

  // Evento: Click - Botões "Ver Mais" (Lorem, Ipsum, Dolor)
  var cardsVermais = document.querySelectorAll('.card-montadoras');
  if (cardsVermais.length > 0) {
    cardsVermais.forEach(function(card) {
      card.addEventListener('click', function() {
        var elementName = this.getAttribute('data-id'); // lorem, ipsum ou dolor
        
        var eventName = 'click';
        var eventData = {
          'page_location': window.location.href,
          'element_name': elementName,
          'element_group': 'ver_mais'
        };
        
        dispararEvento(eventName, eventData);
      });
    });
  }

  // =====================================================
  // EVENTOS DE FORMULÁRIO (sobre.html)
  // =====================================================

  var formContato = document.querySelector('form.contato');
  if (formContato) {
    var formStarted = false; // Disparar o evento de form_start apenas uma vez

    // Função para obter o form_id
    function getFormId() {
      return formContato.id || 'formulario-nao-possui-id';
    }

    // Captura informações do formulário
    var formName = formContato.name;
    var formDestination = formContato.action || window.location.href;

    // Evento: form_start - Primeiro campo preenchido
    var camposInput = formContato.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');

    camposInput.forEach(function(campo) {
      campo.addEventListener('input', function() {
        if (!formStarted) {
          formStarted = true;

          var formId = getFormId();

          var eventName = 'form_start';
          var eventData = {
            'page_location': window.location.href,
            'form_id': formId,
            'form_name': formName,
            'form_destination': formDestination
          };
          
          dispararEvento(eventName, eventData);
        }
      });
    });

    // Evento: form_submit - Envio do formulário
    formContato.addEventListener('submit', function(e) {
      var formId = getFormId();
      var btnSubmit = formContato.querySelector('button[type="submit"]');
      var submitText = btnSubmit ? btnSubmit.textContent.trim() : 'Enviar';

      var eventName = 'form_submit';
      var eventData = {
        'page_location': window.location.href,
        'form_id': formId,
        'form_name': formName,
        'form_destination': formDestination,
        'form_submit_text': submitText
      };
      
      dispararEvento(eventName, eventData);
    });

    // Evento: view_form_success - Popup de sucesso
    var successFired = false; // Flag para evitar disparo múltiplo

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class' && !successFired) {
          var bodyElement = document.body;
          if (bodyElement.classList.contains('lightbox-open')) {
            var lightboxTitle = document.querySelector('.lightbox-title');
            if (lightboxTitle && lightboxTitle.textContent === 'Contato enviado') {
              successFired = true;

              var formId = getFormId();

              var eventName = 'view_form_success';
              var eventData = {
                'page_location': window.location.href,
                'form_id': formId,
                'form_name': formName
              };
              
              dispararEvento(eventName, eventData);

              // Reset da flag após o pop-up fechar para permitir novo envio
              setTimeout(function() {
                successFired = false;
                formStarted = false; // Permite novo form_start
              }, 1000);
            }
          }
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
});
