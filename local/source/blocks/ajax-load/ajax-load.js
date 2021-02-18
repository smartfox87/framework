// аякс подгрузка разметки в блок
function ajaxLoad() {
	var body = $('body')
	$('.js-ajax-load').each(function () {
		var parent = $(this)
		var url = parent.data('ajaxUrl')
		var content = parent.find('.js-ajax-load__content')
		var preloader = $('<div>').addClass('icon-preloader')

		parent.find('.js-ajax-load__toggler').off('click.ajaxLoad').on('click.ajaxLoad', function (event) {
			event.preventDefault()
			body.append(preloader)
			$.get(url)
				.done(function (response) {
					var $response = $(response)
					content.append($response)
					parent.addClass('loaded')
					setTimeout(function () {
						preloader.remove();
						$response.addClass('loaded')
					}, 300)
				})
				.fail(function (response) {
					preloader.remove()
					console.warn('offer: ajax load failed', response)
				})
		})
	})
}

// аякс подгрузка разметки в конец страницы
function ajaxLoadAppendBody() {
	var body = $('body');
	var preloader = $('<div>').addClass('icon-preloader');

	$('.js-ajax-load-toggler').each(function () {
		var toggler = $(this)
		var url = toggler.data('ajaxUrl');

		toggler.off('click.ajaxLoad').on('click.ajaxLoad', function (event) {
			event.preventDefault();
			body.append(preloader);

			$.get(url).done(function (response) {
				var $response = $(response)
				body.append($response);
				setTimeout(function () {
					preloader.remove();
					$response.addClass('loaded')
				}, 300)
			}).fail(function (response) {
				preloader.remove();
				console.warn('offer: ajax load failed', response);
			});
		});
	})
}

$(function () {
	ajaxLoad()
	ajaxLoadAppendBody()
})