// сворачивание больших текстов по кнопке
function clippedText() {
	var win = $(window)

	$('.js-clipped').each(function (ind) {
		var parent = $(this)
		var content = parent.find('.js-clipped__content')
		var toggler = parent.find('.js-clipped__toggler')
		var timeout = null;
		var textInit = content.html()
		// высота текста из атрибута или дефолтная, которую стоит сворачивать
		var clippedHeight = parent.data('clippedHeight') || 100
		// колличество символов для показа сокращенной версии
		var clippedSymbols = parent.data('clippedSymbols')

		function clippedText() {
			// сбросс высоты контента
			parent.removeClass('init-clipped')
			content.css({maxHeight: ''})

			// если указано ограничение сокращенной версии по символам то высоту берем по их размеру высоты
			if (clippedSymbols) {
				content.text(content.text().substr(0, clippedSymbols))
				clippedHeight = content.outerHeight()
				content.html(textInit)
			}

			// изначальная высота блока с текстом
			var initialHeightContent = content.outerHeight()

			// инициализация плагина, если длинна текста больше допустимой
			if (initialHeightContent > clippedHeight) {
				parent.addClass('init-clipped')
				close()

				// переключение сворачивания контента
				toggler.off('click.clippedText').on('click.clippedText', function () {
					if (parent.hasClass('open-clipped')) {
						close()
					} else {
						parent.addClass('open-clipped')
						content.css({maxHeight: initialHeightContent})
					}
				})
			} else {
				toggler.off('click.clippedText')
			}
		}

		// закрыть выпадашку
		function close() {
			parent.removeClass('open-clipped')
			content.css({maxHeight: clippedHeight})
		}

		win.off('resize.clippedText' + ind).on('resize.clippedText' + ind, function () {
			clearTimeout(timeout);
			timeout = setTimeout(clippedText, 300);
		})

		win.trigger('resize.clippedText' + ind);
	})
}

$(function () {
	clippedText()
})