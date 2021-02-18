// сворачивание лишних пунктов меню в аккордион с кнопкой "еще"
function collapsibleMenu() {
	$('.js-collapsible').each(function () {
		var parent = $(this)
		var items = parent.find('.js-collapsible__item')
		var quantity = parent.data('collapsible')

		// если елементов больше разрешенных и родитель не имеет класса инициализации свернуть лишние элементы в аккордион
		if (items.length > quantity && !parent.hasClass('init-collapsible')) {
			parent.addClass('init-collapsible')

			// добавление разметки для аккордионов
			var accordion = $('<div class="js-accordion"><div class="collapsible-menu__toggler  js-accordion__toggler"><span>Еще</span><span>Скрыть</span> <i>' + (items.length - quantity) + '</i></div></div>')
			var accordionContent = $('<div class="js-accordion__content"></div>')

			// пробегаем по всем элементам перенося лишние в аккордион
			items.each(function (index) {
				if (index + 1 > quantity) {
					accordionContent.append($(this))
				}
			})

			// вставляем и инициализируем итоговый аккордион в родитель
			accordion.append(accordionContent)
			parent.append(accordion)
			toggleAccordion()
		}
	})
}

// сворачивание лишних пунктов меню на адаптиве в аккордион с кнопкой "еще"
function collapsibleMenuAdaptive() {
	var timeout = null
	var win = $(window)

	function collapsibleMenu() {
		var parents = $('.js-collapsible--adaptive')
		if (win.width() < 768) {
			parents.each(function () {
				var parent = $(this)
				var items = parent.find('.js-collapsible__item')
				var quantity = parent.data('collapsible')

				// если елементов больше разрешенных и родитель не имеет класса инициализации свернуть лишние элементы в аккордион
				if (items.length > quantity && !parent.hasClass('init-collapsible')) {
					parent.addClass('init-collapsible')

					// добавление разметки для аккордионов
					var accordion = $('<div class="js-accordion"><div class="collapsible-menu__toggler  btn  btn--border  js-accordion__toggler">Еще <span>' + (items.length - quantity) + '</span></div></div>')
					var accordionContent = $('<div class="js-accordion__content"></div>')

					// пробегаем по всем элементам перенося лишние в аккордион
					items.each(function (index) {
						if (index + 1 > quantity) {
							accordionContent.append($(this))
						}
					})

					// вставляем и инициализируем итоговый аккордион в родитель
					accordion.append(accordionContent)
					parent.append(accordion)
					View.init.global.toggleAccordion()
				}
			})
		} else {
			parents.each(function () {
				var parent = $(this)

				if (parent.hasClass('init-collapsible')) {
					var accordion = parent.find('.js-accordion')

					parent.removeClass('init-collapsible')
					parent.append(accordion.find('.js-collapsible__item'))
					accordion.detach()
				}
			})
		}
	}


	win.off('resize.collapsibleMenu').on('resize.collapsibleMenu', function () {
		clearTimeout(timeout);
		timeout = setTimeout(collapsibleMenu, 300);
	})

	win.trigger('resize.collapsibleMenu');
}

// accordion
function toggleAccordion() {
	$('.js-accordion').each(function () {
		var parent = $(this)
		var content = parent.find('.js-accordion__content')

		// инициализация и закрытие всех аккордионов кроме тех что с классом open-accordion
		if (!parent.hasClass('open-accordion')) content.slideUp(0)
		parent.addClass('init-accordion')

		// переключение состояния аккордиона по клику
		parent.find('.js-accordion__toggler').off('click.toggleAccordion').on('click.toggleAccordion', function (event) {
			event.stopPropagation()
			event.preventDefault()

			parent.toggleClass('open-accordion')
			content.slideToggle(300)
		})
	})
}

$(function () {
	collapsibleMenu()
	collapsibleMenuAdaptive()
})