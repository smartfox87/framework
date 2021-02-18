// переключение скрытого блока по кнопке
function toggleFade() {
	var allParents = $('.js-fade')
	var allContents = allParents.find('.js-fade__content')

	allParents.each(function () {
		var parent = $(this)
		var content = parent.find('.js-fade__content')

		// блокировка всплытия из контента
		content.click(function (event) {
			event.stopPropagation()
		})

		// клик по переключателю состояния
		parent.find('.js-fade__toggler').off('click.toggleFade').on('click.toggleFade', function (event) {
			event.preventDefault()
			event.stopPropagation()

			// закрыть остальные блоки Dropdown
			allParents.not(parent).removeClass('open-fade')
			allContents.not(content).fadeOut(300)

			// переключение состояния
			if (!parent.hasClass('open-fade')) {
				openDropdown()
			} else {
				closeDropdown()
			}
		})

		// открыть
		function openDropdown() {
			parent.addClass('open-fade')
			content.fadeIn(300)
		}

		// закрыть
		function closeDropdown() {
			parent.removeClass('open-fade')
			content.fadeOut(300)
		}
	})

	// закрытие всех выпадашек
	toggleFade.closeAllFade = function () {
		allParents.removeClass('open-fade')
		allContents.fadeOut(300)
	}
}

$(function () {
	toggleFade()
})