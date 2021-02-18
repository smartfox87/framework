// сворачивать в выпадашку пункты меню, если не влезают
function flexMenu() {
	if ($.fn.flexMenu) {
		var parents = $('.js-flex-menu')

		parents.each(function () {
			$(this).flexMenu({
				linkText: 'Еще',
				linkTitle: 'Показать еще',
				linkTextAll: 'Меню',
				linkTitleAll: 'Показать меню',
				cutoff: 1,
				shouldApply: function () {
					return $(window).width() > 1024
				}
				// showOnHover: false,
			})
		})

		// обработка если открывается попап по клику
		var toggler = parents.find('.flexMenu-viewMore')
		var content = parents.find('.flexMenu-popup')

		parents.off('click.flexMenu').on('click.flexMenu', function (event) {
			event.stopPropagation()
		})

		$(document).off('click.flexMenu').on('click.flexMenu', function () {
			toggler.removeClass('active')
			content.hide()
		})
	}
}

$(function () {
	flexMenu()
})