// фиксация блока при скролле страницы
function fixedBlockWhenScrolling() {
	$('.js-fixed--up').each(function (index) {
		var block = $(this)
		var content = block.find('.js-fixed__content')
		var blockHeight = content.outerHeight()
		var blockStart = block.offset().top
		var doc = $(document)
		var win = $(window)
		var winWidth = win.width()

		block.addClass('init-fixed')
		block.css('padding-top', blockHeight)

		function fixedBlockWhenScrolling() {
			var docScroll = doc.scrollTop()

			// фиксация блока
			if (!block.hasClass('active-fixed') && blockStart < docScroll) {
				doc.addClass('active-fixed')
				block.addClass('active-fixed').css('padding-top', blockHeight)
			} else if (block.hasClass('active-fixed') && blockStart >= docScroll) {
				// отмена фиксации блока
				doc.removeClass('active-fixed')
				block.removeClass('active-fixed')
				// block.removeClass('active-fixed').css('padding-top', 0)
			}
		}

		// инициализаци с индексом на случай множественных блоков для фиксации
		win.off('resize.fixedBlockWhenScrolling' + index)
			.on('resize.fixedBlockWhenScrolling' + index, function () {
				if (winWidth != win.width()) {
					winWidth = win.width()
					blockHeight = content.outerHeight()
					blockStart = block.offset().top
					block.css('padding-top', blockHeight)

					if (requestAnimationFrame) requestAnimationFrame(fixedBlockWhenScrolling)
					else fixedBlockWhenScrolling();
				}
			})

		// инициализаци с индексом на случай множественных блоков для фиксации
		doc.off('scroll.fixedBlockWhenScrolling' + index)
			.on('scroll.fixedBlockWhenScrolling' + index, function () {
				if (requestAnimationFrame) requestAnimationFrame(fixedBlockWhenScrolling)
				else fixedBlockWhenScrolling();
			})
			.trigger('scroll.fixedBlockWhenScrolling' + index);
	})
}

// показ зафиксированного блока при скролле страницы вверх
function showBlockIfScrollingUp() {
	$('.js-fixed--up').each(function (index) {
		var block = $(this)
		var blockHeight = block.outerHeight()
		var blockStart = block.offset().top
		var blockEnd = blockStart + blockHeight
		var doc = $(document)
		var win = $(window)
		var winWidth = win.width()
		var oldDocScroll = 0
		var newDocScroll = 0

		block.addClass('init-fixed')
		block.css('padding-top', blockHeight)

		function showBlockIfScrollingUp() {
			newDocScroll = doc.scrollTop()

			// показ блока если сделан скролл страницы наверх
			if (!block.hasClass('active-fixed') && blockEnd < newDocScroll && oldDocScroll > newDocScroll) {
				block.addClass('active-fixed').css('padding-top', blockHeight)
			} else if (block.hasClass('active-fixed') && blockStart >= newDocScroll || oldDocScroll < newDocScroll) {
				// скрытие блока
				block.removeClass('active-fixed').css('padding-top', 0)
			}

			oldDocScroll = doc.scrollTop()
		}

		// инициализаци с индексом на случай множественных блоков для фиксации
		win.off('resize.showBlockIfScrollingUp' + index)
			.on('resize.showBlockIfScrollingUp' + index, function () {
				if (winWidth != win.width()) {
					winWidth = win.width()
					blockHeight = content.outerHeight()
					blockStart = block.offset().top
					block.css('padding-top', blockHeight)

					if (requestAnimationFrame) requestAnimationFrame(showBlockIfScrollingUp)
					else showBlockIfScrollingUp();
				}
			})

		// инициализаци с индексом на случай множественных блоков для фиксации
		doc.off('scroll.showBlockIfScrollingUp' + index)
			.on('scroll.showBlockIfScrollingUp' + index, function () {
				if (winWidth != win.width()) {
					winWidth = win.width()
					if (requestAnimationFrame) requestAnimationFrame(showBlockIfScrollingUp)
					else showBlockIfScrollingUp();
				}
			})
			.trigger('scroll.showBlockIfScrollingUp' + index);
	})
}

$(function () {
	fixedBlockWhenScrolling()
	showBlockIfScrollingUp()
})