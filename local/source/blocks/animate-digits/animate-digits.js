// анимация чисел
function animateDigits() {
	if ($.fn.spincrement) {
		var win = $(window)

		win.off('scroll.animateDigits').on('scroll.animateDigits', animateDigits)
		win.trigger('scroll.animateDigits')

		function animateDigits() {
			$('.js-animate-digits').each(function () {
				var _this = $(this)

				if (_this.offset().top < win.height() + win.scrollTop() - 50 && !_this.hasClass('animated')) {
					// защита от повторной анимации
					_this.addClass('animated')

					// фиксация ширины во время анимации
					var width = _this.outerWidth()
					_this.css({display: 'inline-block', width: width, whiteSpace: 'nowrap'})

					// инициализация анимации
					_this.spincrement({
						thousandSeparator: ' ',
						duration: 2000,
						to: parseInt(_this.text().replace(/\s/, '')),
					})

					// сбросс ширины
					setTimeout(function () {
						_this.removeAttr('style')
					}, 3000)
				}
			})
		}
	}
}

$(function () {
	animateDigits()
})