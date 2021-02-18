// переключение скрытого блока по кнопке
function toggleDropdown() {
	var allParents = $('.js-dropdown')
	var allContents = allParents.find('.js-dropdown__content')

	allParents.each(function () {
		var parent = $(this)
		var content = parent.find('.js-dropdown__content')

		// инициализации и закрытие при загрузке страницы
		content.slideUp(0).click(function (event) {
			event.stopPropagation()
		})
		parent.addClass('init-dropdown')

		// клик по переключателю состояния
		parent.find('.js-dropdown__toggler').off('click.toggleDropdown').on('click.toggleDropdown', function (event) {
			event.preventDefault()
			event.stopPropagation()

			// закрыть остальные блоки Dropdown
			allParents.not(parent).removeClass('open-dropdown')
			allContents.not(content).slideUp(300)

			// переключение состояния
			if (!parent.hasClass('open-dropdown')) {
				openDropdown()
			} else {
				closeDropdown()
			}
		})

		// открыть
		function openDropdown() {
			parent.addClass('open-dropdown')
			content.slideDown(300)
			$(window).trigger('resize.setTooltipPositions');
		}

		// закрыть
		function closeDropdown() {
			parent.removeClass('open-dropdown')
			content.slideUp(300)
		}
	})

	// закрытие всех выпадашек
	toggleDropdown.closeAllDropdown = function () {
		allParents.removeClass('open-dropdown')
		allContents.slideUp(300)
	}
}

// переключение скрытого блока по наведению с задержкой
function toggleDropdownHover() {
	var allParents = $('.js-dropdown--hover')
	var allContents = allParents.find('.js-dropdown__content')
	var win = $(window)
	var adaptiveDevice = win.width() <= 1024

	allParents.each(function (ind) {
		var parent = $(this)
		var content = parent.find('.js-dropdown__content')
		var toggler = parent.find('.js-dropdown__toggler')
		var timeout = null;

		// инициализации и закрытие при загрузке страницы
		content.click(function (event) {
			event.stopPropagation()
		})
		parent.addClass('init-dropdown')

		// переключение метода открытия для адаптива и десктопа
		function toggleDropdownHover() {
			adaptiveDevice = win.width() <= 1024

			if (adaptiveDevice) {
				// открытие по клику
				togglerClick()

				// снятие ненужных обработчиков
				parent.off('mouseover.toggleDropdownHover')
				parent.off('mouseleave.toggleDropdownHover')
			} else {
				// обработка события прихода курсора на элемент
				parent.off('mouseover.toggleDropdownHover').on('mouseover.toggleDropdownHover', function (event) {
					event.preventDefault()
					event.stopPropagation()

					// переключение состояния
					clearTimeout(timeout);
					timeout = setTimeout(openDropdown, 150);
				})

				// обработка события ухода курсора с элемента
				parent.off('mouseleave.toggleDropdownHover').on('mouseleave.toggleDropdownHover', function (event) {
					event.preventDefault()
					event.stopPropagation()

					// переключение состояния
					clearTimeout(timeout);
					timeout = setTimeout(closeDropdown, 500);
				})

				togglerClick()
			}
		}

		function togglerClick() {
			toggler.off('click.toggleDropdownHover').on('click.toggleDropdownHover', function (event) {
				event.preventDefault()
				event.stopPropagation()

				if (!parent.hasClass('open-dropdown')) {
					// закрыть остальные блоки Dropdown
					allParents.not(parent).removeClass('open-dropdown')
					allContents.not(content).slideUp(300)

					openDropdown()
				} else {
					closeDropdown()
				}
			})
		}

		// открыть
		function openDropdown() {
			parent.addClass('open-dropdown')
			content.slideDown(300)
			win.trigger('resize.setTooltipPositions');
		}

		// закрыть
		function closeDropdown() {
			parent.removeClass('open-dropdown')
			content.slideUp(300)
		}

		win.off('resize.toggleDropdownHover' + ind).on('resize.toggleDropdownHover' + ind, function () {
			clearTimeout(timeout);
			timeout = setTimeout(toggleDropdownHover, 300);
		})

		win.trigger('resize.toggleDropdownHover' + ind);
	})

	toggleDropdownHover.closeAllDropdownHover = function () {
		if (adaptiveDevice) {
			allParents.removeClass('open-dropdown')
			allContents.slideUp(300)
		}
	}
}

// инициализация позиционирования, не выходящего за контентную область
function tooltipPosition() {
	var tooltips;
	var delta;
	var i;
	var containerPadding;
	var timeout = null;

	// ширина скроллбара
	tooltipPosition.scrollBarWidth = (function () {
		var outer = document.createElement('div');
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

	// breakpoints
	tooltipPosition.breakpoints = {
		'md-max': 1249,
		'sm-max': 999,
		'xs-max': 759,
	};

	$(window).off('resize.setTooltipPositions').on('resize.setTooltipPositions', function () {
		clearTimeout(timeout);
		timeout = setTimeout(function () {
			tooltips = $('.js-tooltip-position');
			tooltips.css('left', '');

			// ширина паддинга контейнера страницы
			containerPadding = window.innerWidth > tooltipPosition.breakpoints['xs-max'] ? 30 : 10;
			containerPadding = window.innerWidth > tooltipPosition.breakpoints['sm-max'] ? 30 : containerPadding;

			for (i = 0; i < tooltips.length; i++) {
				// насколько выступает правый край выпадашки за границы контейнера страницы
				delta = tooltips[i].getBoundingClientRect().left + tooltips[i].offsetWidth -
					Math.min((window.innerWidth - tooltipPosition.scrollBarWidth - containerPadding), (window.innerWidth - tooltipPosition.scrollBarWidth) / 2 + 684);

				if (delta > 1) {
					// сдвиг выпадашки, если она выступает
					tooltips[i].style.left = ((parseInt(tooltips[i].style.left) || 0) - delta) + 'px';
				}
			}
		}, 100);
	}).trigger('resize.setTooltipPositions');
}

$(function () {
	toggleDropdown()
	toggleDropdownHover()
})