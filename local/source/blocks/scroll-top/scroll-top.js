// Видимости элемента после указанной высоты скролла страницы
function showElemAfterScroll(element, toggleHeightScroll) {
	var doc = $(document)

	doc.off('scroll.showElemAfterScroll').on('scroll.showElemAfterScroll', toggleShow)
	doc.trigger('scroll.showElemAfterScroll')

	function toggleShow() {
		var scrollDocument = doc.scrollTop();

		if (scrollDocument < toggleHeightScroll) {
			element.fadeOut(300)
		} else {
			element.fadeIn(300)
		}
	}
}

// подскролл страницы в начала по клику на кнопку
function scrollTop() {
	showElemAfterScroll($('.js-scroll-top'), window.innerHeight)

	$('.js-scroll-top').off('click.scrollTop').on('click.scrollTop', function (event) {
		event.preventDefault()
		$([document.documentElement, document.body]).animate({scrollTop: 0}, 400)
	})
}

// подскролл страницы в начала по клику на кнопку
function scrollTopNative() {
	$('.js-scroll-top').off('click.scrollTop').on('click.scrollTop', function (event) {
		event.preventDefault()

		function animate({timing, draw, duration}) {                      // Вспомогательная функция animate для создания анимации
			let start = performance.now();
			requestAnimationFrame(function animate(time) {
				let timeFraction = (time - start) / duration;                          // timeFraction изменяется от 0 до 1
				if (timeFraction > 1) timeFraction = 1;
				let progress = timing(timeFraction);                    // вычисление текущего состояния анимации
				draw(progress);                          // отрисовать её
				if (timeFraction < 1) {
					requestAnimationFrame(animate);
				}
			})
		}

		animate({
			duration: 1000,
			timing: function (timeFraction) {
				return timeFraction;
			},            // линейная функция значит, что анимация идёт с одной и той же скоростью
			draw: function (progress) {
				document.documentElement.scrollTop = document.documentElement.scrollTop - (progress * document.documentElement.scrollTop)
			}
		});
	})
}

$(function () {
	scrollTop()
	scrollTopNative()
})