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

// accordion only adaptive
function toggleAccordionOnlyAdaptive() {
	var timeout = null
	var win = $(window)
	var doc = $(document)

	// accordion только для адаптива
	function toggleAccordionOnlyAdaptive() {
		var allParents = $('.js-accordion--adaptive')

		allParents.each(function () {
			var parent = $(this)
			var content = parent.find('.js-accordion__content')
			var toggler = parent.find('.js-accordion__toggler')
			var maxWidth = parseInt(parent.data('maxWidth'))

			if (win.width() <= maxWidth) {
				// инициализация и закрытие всех аккордионов кроме тех что с классом open-accordion
				if (!parent.hasClass('open-accordion')) content.slideUp(0)
				parent.addClass('init-accordion')
				parent.removeClass('destroy-accordion')

				toggler.off('click.toggleAccordion').on('click.toggleAccordion', function (event) {
					event.stopPropagation()
					event.preventDefault()

					parent.toggleClass('open-accordion')
					content.slideToggle(300)
				})
			} else {
				// accordion destroy
				parent.removeClass('init-accordion')
				parent.removeClass('open-accordion')
				parent.addClass('destroy-accordion')
				content.slideDown(0)

				toggler.off('click.toggleAccordion')
			}
		})
	}

	win.off('resize.toggleAccordionOnlyAdaptive').on('resize.toggleAccordionOnlyAdaptive', function () {
		clearTimeout(timeout);
		timeout = setTimeout(toggleAccordionOnlyAdaptive, 300);
	})

	win.trigger('resize.toggleAccordionOnlyAdaptive');
}

// accordion only adaptive
function toggleAccordionOnlyAdaptiveMultiLevel() {
	var timeout = null
	var win = $(window)
	var doc = $(document)
	var scrollBarWidth = (function () {
		const outer = document.createElement('div');
		outer.style.visibility = 'hidden';
		outer.style.width = '100px';
		outer.style.msOverflowStyle = 'scrollbar';

		document.body.appendChild(outer);
		var widthNoScroll = outer.offsetWidth;
		// force scrollbars
		outer.style.overflow = 'scroll';
		// add innerdiv
		var inner = document.createElement('div');
		inner.style.width = '100%';
		outer.appendChild(inner);
		var widthWithScroll = inner.offsetWidth;
		// remove divs
		outer.parentNode.removeChild(outer);
		return widthNoScroll - widthWithScroll;
	})();

	// accordion только для адаптива
	function toggleAccordionOnlyAdaptive() {
		var winHaveScroll = win.height() < doc.height()

		$('.js-accordion__toggler--adaptive').each(function () {
			var toggler = $(this)
			var parent = toggler.closest('.js-accordion--adaptive')
			var content = parent.children('.js-accordion__content')
			var maxWidth = parseInt(parent.data('maxWidth'))
			maxWidth = winHaveScroll ? maxWidth - scrollBarWidth : maxWidth

			if (win.width() <= maxWidth) {
				// инициализация и закрытие всех аккордионов кроме тех что с классом open-accordion
				if (!parent.hasClass('open-accordion')) content.slideUp(0)
				parent.addClass('init-accordion')
				parent.removeClass('destroy-accordion')

				toggler.off('click.toggleAccordion').on('click.toggleAccordion', function (event) {
					event.stopPropagation()
					event.preventDefault()

					parent.toggleClass('open-accordion')
					content.slideToggle(300)
				})
			} else {
				// accordion destroy
				if (parent.hasClass('init-accordion')) {
					parent.addClass('destroy-accordion')
					content.slideDown(0)
					parent.removeClass('init-accordion')
					parent.removeClass('open-accordion')
					toggler.off('click.toggleAccordion')
				}
			}
		})
	}

	win.off('resize.toggleAccordionOnlyAdaptive').on('resize.toggleAccordionOnlyAdaptive', function () {
		clearTimeout(timeout);
		timeout = setTimeout(toggleAccordionOnlyAdaptive, 300);
	})

	win.trigger('resize.toggleAccordionOnlyAdaptive');
}

// accordion group
function toggleAccordionGroup() {
	$('.js-accordion--group').each(function () {
		var allAccordions = $(this).find('.js-accordion__item')
		var allContents = allAccordions.find('.js-accordion__content')

		allAccordions.each(function () {
			var accordion = $(this)
			var content = accordion.find('.js-accordion__content')

			// инициализация и закрытие всех аккордионов кроме тех что с классом open-accordion
			if (!accordion.hasClass('open-accordion')) content.slideUp(0)
			accordion.addClass('init-accordion')

			// переключение состояния аккордиона по клику
			accordion.find('.js-accordion__toggler').off('click.toggleAccordion').on('click.toggleAccordion', function (event) {
				event.stopPropagation()
				event.preventDefault()

				closeOtherAccordions()

				// переключение состояния аккордиона
				accordion.toggleClass('open-accordion')
				content.slideToggle(300)
			})

			// закрытие остальных аккардионов в группе
			function closeOtherAccordions() {
				allAccordions.not(accordion).removeClass('open-accordion')
				allContents.not(content).slideUp(300)
			}
		})
	})
}

// accordion for multi level menu
function toggleAccordionMultiLevel() {
	$('.js-accordion__toggler').each(function () {
		var toggler = $(this)
		var parent = toggler.closest('.js-accordion')
		var content = parent.children('.js-accordion__content')

		// инициализация и закрытие всех аккордионов кроме тех что с классом open-accordion
		if (!parent.hasClass('open-accordion')) content.slideUp(0)
		parent.addClass('init-accordion')

		// переключение состояния аккордиона по клику
		toggler.off('click.toggleAccordion').on('click.toggleAccordion', function (event) {
			event.stopPropagation()
			event.preventDefault()

			parent.toggleClass('open-accordion')
			content.slideToggle(300)
		})
	})
}

// accordion native js
function toggleAccordionNative() {
	var accordionAll = document.querySelectorAll('.js-accordion--native');

	Array.from(accordionAll).forEach(function (accordion) {
		if (!accordion.classList.contains('init-accordion')) {
			var content = accordion.querySelector('.js-accordion__content')
			var toggler = accordion.querySelector('.js-accordion__toggler')

			function closeContent() {
				content.style.height = '0'
			}

			// инициализация начального состояния
			accordion.classList.add('init-accordion')
			if (content && !accordion.classList.contains('open-accordion')) closeContent()

			if (content && toggler) {
				// переключение аккордиона
				toggler.addEventListener('click', function (e) {

					e.preventDefault()

					if (accordion.classList.contains('open-accordion')) {
						accordion.classList.remove('open-accordion')
						toggler.classList.remove('open-accordion')
						content.style.height = content.scrollHeight + 'px';
						// нужно для перерендеринга высоты контента
						content.scrollHeight;
						if (requestAnimationFrame) requestAnimationFrame(closeContent)
						else setTimeout(closeContent)
					} else {
						open()
					}
				})

				dataStorage.set(accordion, 'open', open);

				function open() {
					content.style.height = content.scrollHeight + 'px';
					toggler.classList.add('open-accordion')
					setTimeout(() => {
						accordion.classList.add('open-accordion')
					}, 300)
				}

				// очистка высоты после завершения анимации открытия
				content.addEventListener('transitionend', function (e) {
					if (accordion.classList.contains('open-accordion')) {
						content.style.height = null;
					}
				})
			}
		}
	})
}

// accordion group native
function toggleAccordionGroupNative() {
	Array.from(document.querySelectorAll('.js-accordion-group--native')).forEach(function (group) {
		if (!group.classList.contains('accordion-group-init')) {
			var allAccordions = group.querySelectorAll('.js-accordion-group__item')
			var allContents = group.querySelectorAll('.js-accordion-group__content')
			var allTogglers = group.querySelectorAll('.js-accordion-group__toggler')

			group.classList.add('accordion-group-init')

			// перебор аккордионов в группе
			Array.from(allAccordions).forEach(function (accordion) {
				var content = accordion.querySelector('.js-accordion-group__content')
				var toggler = accordion.querySelector('.js-accordion-group__toggler')

				function closeContent() {
					content.style.height = '0'
				}

				if (content && toggler) {
					// инициализация начального состояния
					accordion.classList.add('init-accordion')
					if (!accordion.classList.contains('open-accordion')) closeContent()

					// переключение аккордиона
					toggler.addEventListener('click', function (e) {
						e.preventDefault()

						// закрытие всех кроме активного аккордиона
						closeOtherAccordions()

						// переключение аккордиона
						if (accordion.classList.contains('open-accordion')) {
							accordion.classList.remove('open-accordion')
							toggler.classList.remove('open-accordion')
							content.style.height = content.scrollHeight + 'px';
							if (requestAnimationFrame) requestAnimationFrame(closeContent)
							else setTimeout(closeContent)
						} else {
							accordion.classList.add('open-accordion')
							toggler.classList.add('open-accordion')
							content.style.height = content.scrollHeight + 'px';
						}
					})
				}

				// закрытие неактивных аккардионов в группе
				function closeOtherAccordions() {
					Array.from(not(allTogglers, toggler)).forEach(function (accordion) {
						accordion.classList.remove('open-accordion')
					})
					Array.from(not(allAccordions, accordion)).forEach(function (accordion) {
						accordion.classList.remove('open-accordion')
					})
					Array.from(not(allContents, content)).forEach(function (content) {
						content.style.height = '0';
					})
				}
			})
		}
	})

	// вернет список без исключеного элемента
	function not($list, $element) {
		var list = Array.from($list);
		var index = list.indexOf($element);
		if (!index) {
			return list.slice(++index)
		} else {
			return list.slice(0, index).concat(list.slice(++index))
		}
	}
}

window.dataStorage = {
	_storage: new WeakMap(),
	set: function (element, key, obj) {
		if (!this._storage.has(element)) {
			this._storage.set(element, new Map());
		}
		this._storage.get(element).set(key, obj);
	},
	get: function (element, key) {
		if (!this._storage.get(element)) {
			return
		}
		return this._storage.get(element).get(key);
	},
	has: function (element, key) {
		return this._storage.has(element) && this._storage.get(element).has(key);
	},
	remove: function (element, key) {
		var ret = this._storage.get(element).delete(key);
		if (!this._storage.get(element).size === 0) {
			this._storage.delete(element);
		}
		return ret;
	}
}
$(function () {
	toggleAccordion()
	toggleAccordionOnlyAdaptive()
	toggleAccordionOnlyAdaptiveMultiLevel()
	toggleAccordionGroup()
	toggleAccordionMultiLevel()
	toggleAccordionNative()
	toggleAccordionGroupNative()
})