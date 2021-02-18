// анимация появления блоков при прокрутке
function animateScroll() {
	$('body').addClass('script-on')
	var sections = $('.js-animate-scroll')
	var win = $(window)
	var winHeight = win.height()

	function setAnimateClass() {
		sections.each(function () {
			var _this = $(this)
			var offsetHeight = _this.data('offsetHeight') || 0
			// if (win.width() < View.breakpoints.xsMid) offsetHeight = 0
			var initElemHeight = _this.outerHeight() + offsetHeight
			var elemHeight = initElemHeight < winHeight ? initElemHeight : winHeight

			if (!_this.hasClass('animated') && _this.offset().top + elemHeight < winHeight + win.scrollTop()) {
				_this.addClass('animated')
			}
		})
	}

	win.off('scroll.animateScroll').on('scroll.animateScroll', setAnimateClass).trigger('scroll.animateScroll')
}

// установка интервалов срабатывания последовательной анимации элементов
function setAnimateInterval() {
	$('.js-animate-interval').each(function () {
		var parent = $(this),
			timeDelay = parent.data('delay') || 0.3,
			timeOffset = parent.data('offset') || 0;

		parent.find('.js-animate-interval__item').each(function (index) {
			$(this).css('transition-delay', timeOffset + timeDelay * index + 's');
		});
	});
}

$(function () {
	animateScroll()
	setAnimateInterval()
})