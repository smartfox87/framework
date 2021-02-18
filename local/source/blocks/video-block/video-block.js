// запуск и остановка кастомного видео
function toggleVideo() {
	$('.js-video').each(function () {
		const parent = $(this)
		const video = parent.find('.js-video__content')[0]

		// переключение состояния видео
		parent.find('.js-video__toggler').off('click.toggleVideo').on('click.toggleVideo', function () {
			if (video.paused) {
				video.play()
			} else {
				video.pause()
			}
			parent.addClass('play')
		})

		// смена кнопки при останове видео
		video.addEventListener('pause', stopVideo)
		video.addEventListener('ended', stopVideo)

		function stopVideo() {
			parent.removeClass('play')
		}
	})
}

// переключение класса по клику
function toggleClassBlock() {
	var allParents = $('.js-class')

	allParents.each(function () {
		var parent = $(this)
		// кастомный класс для переключения либо дефолтный
		var activeClass = parent.data('class') || 'active-class'

		parent.find('.js-class__toggler').off('click.toggleClass').on('click.toggleClass', function (event) {
			event.stopPropagation()
			event.preventDefault()

			if (!parent.hasClass(activeClass)) {
				parent.addClass(activeClass)
			} else {
				parent.removeClass(activeClass)
			}
		})
	})

	// закрыть все блоки
	toggleClassBlock.closeAllClassBlocks = function () {
		allParents.removeClass('active-class')
	}
}

$(function () {
	toggleVideo()
})