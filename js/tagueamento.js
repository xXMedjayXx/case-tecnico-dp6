// =====================================================
// CONFIGURAÇÃO INICIAL
// Stream ID GA4: G-096NHNN8Q2
// =====================================================

// Inicialização do dataLayer e gtag
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-096NHNN8Q2', {
  'page_location': window.location.href
});

// =====================================================
// CAMADA DE ABSTRAÇÃO PARA EVENTOS
// =====================================================

// Função única para disparar eventos tanto para gtag quanto para dataLayer
function dispararEvento(eventName, eventParams) {
  // Parâmetros base que todos os eventos devem ter
  const baseParams = {
    'page_location': window.location.href
  };
  
  // Combinar parâmetros base com os parâmetros específicos do evento com Spread Operator
  const fullParams = { ...baseParams, ...eventParams };
  
  // Disparar para gtag
  gtag('event', eventName, fullParams);
  
  // Disparar para dataLayer (incluindo o nome do evento)
  dataLayer.push({
    'event': eventName,
    ...fullParams
  });
}

// =====================================================
// EVENTOS DE MENU (Todas as páginas - Botões Contato e Download de Arquivo)
// =====================================================

document.addEventListener('DOMContentLoaded', function() {

  // Evento: Click - "Entre em Contato"
  var botaoContato = document.querySelector('.menu-lista-contato');
  if (botaoContato) {
    botaoContato.addEventListener('click', function() {
      dispararEvento('click', {
        'element_name': 'entre_em_contato',
        'element_group': 'menu'
      });
    });
  }

  // Evento: file_download - "Download PDF"
  var botaoDownload = document.querySelector('.menu-lista-download');
  if (botaoDownload) {
    botaoDownload.addEventListener('click', function() {
      dispararEvento('file_download', {
        'element_name': 'download_pdf',
        'element_group': 'menu'
      });
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
        
        dispararEvento('click', {
          'element_name': elementName,
          'element_group': 'ver_mais'
        });
      });
    });
  }

  // =====================================================
  // EVENTOS DE FORMULÁRIO (sobre.html)
  // =====================================================

  var formContato = document.querySelector('form.contato');
  if (formContato) {
    var formStarted = false; // Flag para disparar form_start apenas uma vez

    // Função para obter form_id do atributo id do formulário
    function getFormId() {
      return formContato.id || undefined;
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

          dispararEvento('form_start', {
            'form_id': getFormId(),
            'form_name': formName,
            'form_destination': formDestination
          });
        }
      });
    });

    // Evento: form_submit - Envio do formulário
    formContato.addEventListener('submit', function(e) {
      var formId = getFormId();
      var botaoSubmit = formContato.querySelector('button[type="submit"]');
      var submitText = botaoSubmit ? botaoSubmit.textContent.trim() : 'Enviar';

      dispararEvento('form_submit', {
        'form_id': formId,
        'form_name': formName,
        'form_destination': formDestination,
        'form_submit_text': submitText
      });
    });

    // Evento: view_form_success - Popup de sucesso
    // Monitora quando o pop-up é aberto com mensagem de sucesso
    var sucessoEnviar = false; // Flag para evitar disparo múltiplo

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class' && !sucessoEnviar) {
          var bodyElement = document.body;
          if (bodyElement.classList.contains('lightbox-open')) {
            var lightboxTitle = document.querySelector('.lightbox-title');
            if (lightboxTitle && lightboxTitle.textContent === 'Contato enviado') {
              sucessoEnviar = true;

              dispararEvento('view_form_success', {
                'form_id': getFormId(),
                'form_name': formName
              });

              // Reset da flag após o pop-up fechar para permitir novo envio
              setTimeout(function() {
                sucessoEnviar = false;
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
