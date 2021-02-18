// поведение попапов
function initPopups() {
	if ($.fn.fancybox) {
		var popups = $('[data-fancybox]')
		popups.fancybox({
			// кнопки на панели
			buttons: [
				// 'zoom',
				// 'share',
				// 'slideShow',
				'fullScreen',
				// 'download',
				'thumbs',
				'close'
			],

			// запрет свайпа слайдов, чтобы отрабатывали клики на мобилке или в атрибе data-options='{"touch" : false}'
			touch: false,

			// панель миниатюр
			thumbs: {
				autoStart: true
			},

			// переинициализация скриптов в попапе
			afterShow: function (instance, slide) {
				// View.initAllLocal(instance.current.$content)
			}
		});
		// закрыть попап по кнопке на всплытии
		$(document).off('click.closePopup').on('click.closePopup', '.js-close-popup', function () {
			$.fancybox.close();
		})
	}
}

$(function () {
	initPopups()
})