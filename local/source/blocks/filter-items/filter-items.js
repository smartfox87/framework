// фильтрация элементов по клику на переключатели
function filterItems() {
	$('.js-filter-items').each(function () {
		var parent = $(this)
		var toggles = parent.find('.js-filter-items__toggle')
		var select = parent.find('.js-filter-items__select')
		var items = parent.find('.js-filter-items__item')

		// инициализация предустаноленного индекса
		filterItems(parent.attr('data-index'))
		parent.addClass('init-filter-items')

		// обработка переключения
		toggles.off('click.filterItems').on('click.filterItems', function () {
			var toggle = $(this)

			filterItems(toggle.attr('data-index'))
		})

		// обработка переключения
		select.off('change.filterItems').on('change.filterItems', function () {
			var select = $(this)

			filterItems(String(select.val()))
		})

		// перелючение активных элементов
		function filterItems(activeIndex) {
			toggles.removeClass('active-toggle').filter('[data-index=' + activeIndex + ']').addClass('active-toggle')


			items.each(function () {
				var item = $(this)

				if (~item.data('index').split(';').indexOf(activeIndex)) {
					item.show()
					item.addClass('active-item')
				} else {
					item.hide()
					item.removeClass('active-item')
				}
			})
		}
	})
}

$(function () {
filterItems()
})