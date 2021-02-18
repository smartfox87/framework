// многоуровневое меню со скроллом по все уровням
function menuWithScroll() {
	$('.js-menu-w-scroll').each(function () {
		// обработка клика по элементу
		$(this).off('mouseover.selectCategories').on('mouseover.selectCategories', '.js-menu-w-scroll__item', function (event) {
			event.stopPropagation()
			const listItem = $(this)

			// переключени состояния элемента для выбранной категории
			listItem.siblings('.js-menu-w-scroll__item').removeClass('active')
			listItem.addClass('active')

			// колонка родитель выбранного элемента
			const parentColumn = listItem.closest('.js-menu-w-scroll__column')
			// очистка уровней ниже выбранного
			parentColumn.nextAll('.js-menu-w-scroll__column').find('.js-menu-w-scroll__item').removeClass('visible  active')

			// родитительский атрибут выбранной категории
			const attrChildren = listItem.data('childrens') || false
			// элементы потомки для выбранной категории
			const childrenItems = parentColumn.next('.js-menu-w-scroll__column').find('.js-menu-w-scroll__item')
			// переключени состояния элементов потомков для выбранной категории, если они указаны в атрибуте
			if (attrChildren) {
				childrenItems.removeClass('visible').filter(`[data-parent=${attrChildren}]`).addClass('visible')
			} else {
				childrenItems.removeClass('visible')
			}
		})
	})
}

$(function () {
	menuWithScroll()
})