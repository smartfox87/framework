// переключение по кнопке класса корневого html страницы
function toggleClassPage() {
	$('.js-toggle-class-page').each(function () {
		var _this = $(this)
		var html = $('html')

		_this.off('click.toggleClassPage').on('click.toggleClassPage', function (e) {
			e.preventDefault()
			html.toggleClass(_this.data('class'))
		})
	})
}

$(function () {
	toggleClassPage()
})