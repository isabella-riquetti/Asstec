 
  $(document).ready(function(e) {
	$( "#contactform" ).validate({
		rules: {
			Nome: {
				required: true,
				minlength: 5,
				maxlength: 100
			},
			Telefone: {
			  require_from_group: [1, ".contact-group"]
			},
			Email: {
			  require_from_group: [1, ".contact-group"]
			},
			Mensagem: {
				required: true,
				minlength: 10,
				maxlength: 500
			}
		},
		messages: {
			Nome: {
			  required: 'Por favor, informe seu nome.',
			  minlength: 'O nome deve ter ao menos {0} caracteres',
			  maxlength: 'O nome deve ter no máximo {0} caracteres'
			},
			Telefone : {
			  require_from_group: 'Por favor, informe ao menos {0} campo de contato.'
			},					  
			Email : {
			  require_from_group: 'Por favor, informe ao menos {0} campo de contato.',
			  email: 'E-mail válido'
			},
			Mensagem: {
			  required: 'Por favor, informe uma mensagem.',
			  minlength: 'A mensagem deve ter ao menos {0} caracteres',
			  maxlength: 'A mensagem deve ter no máximo {0} caracteres'
			}
		}
	});	
  });

  $(document).ready(function(e) {
    $('#fixedMenu').scrollToFixed();
    $('.res-nav_click').click(function(){
      $('.main-nav').slideToggle();
      return false
    });
  });

  wow = new WOW(
    {
      animateClass: 'animated',
      offset:       100
    }
  );
  wow.init();

  $(window).load(function(){
    $('.main-nav li a, .servicelink').bind('click',function(event){
      var $anchor = $(this);

      $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top - 102
      }, 1500,'easeInOutExpo');

      if ($(window).width() < 768 ) {
        $('.main-nav').hide();
      }
      event.preventDefault();
    });
  });

  $(window).load(function(){
    var $container = $('.portfolioContainer'),
    $body = $('body'),
    colW = 375,
    columns = null;

    $container.isotope({
      resizable: true,
      masonry: {
        columnWidth: colW
      }
    });

    $(window).smartresize(function(){
      var currentColumns = Math.floor( ( $body.width() -30 ) / colW );
      if ( currentColumns !== columns ) {
        columns = currentColumns;
        $container.width( columns * colW )
        .isotope('reLayout');
      }
    }).smartresize();

    $('.portfolioFilter a').click(function(){
      $('.portfolioFilter .current').removeClass('current');
      $(this).addClass('current');

      var selector = $(this).attr('data-filter');
      $container.isotope({

        filter: selector,
      });
      return false;
    });
  });