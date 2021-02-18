// всплывающая подсказка
function initTooltip() {
	if ($.fn.tooltipster) {
		var activeInstance = null

		$('.js-tooltip').each(function () {
			var tooltip = $(this)
			var attrOptions = tooltip.data('options')
			var options = {
				// «top», «bottom», «left», «right». Это также может быть массив ['top', 'bottom', 'right', 'left']
				side: 'top',
				// trigger: 'click',
				// возможность взаимодействовать с содержимим всплывашки
				interactive: true,
				theme: 'tooltipster-shadow',
				// отступ от переключателя
				distance: 5,
				// минимальный отступ от выступающего треугольника от края
				minIntersection: 10,
				minWidth: 200,
				maxWidth: 320,
				// Перемещает всплывающую подсказку, если она выходит из области просмотра, когда пользователь прокручивает страницу, чтобы она оставалась видимой как можно дольше.
				repositionOnScroll: true,
				zIndex: 10,
				//  	'fade', 'grow', 'swing', 'slide', 'fall'
				animation: 'fade',
				// версия ИЕ для поддержки
				IEmin: 11,

				functionBefore: function (instance, helper) {
					// закрытие предыдущего
					if (activeInstance) activeInstance.close()
					activeInstance = instance
				},

				// срабатывает при инициализации
				functionInit: function (instance, helper) {
					// переключатель для подсказки
					var toggler = $(helper.origin)
					var dataOptions = toggler.data('tooltipster');

					// примениение параметров в атрибуте при их наличии
					if (dataOptions) {
						$.each(dataOptions, function (name, option) {
							instance.option(View.toCamelCase(name), option);
						});
					}
				},

				// срабатывает когда подсказка и ее содержимое было добавлено в DOM
				functionReady: function (instance, helper) {
					// переключатель для подсказки
					var toggler = $(helper.origin)

					// добавить кастомный класс на подсказку
					$(helper.tooltip).addClass(toggler.data('custom-class'))
				}
			}

			// переназначение параметров из атрибута
			if (attrOptions) {
				for (var key in attrOptions) {
					options[key] = attrOptions[key]
				}
			}

			if (!tooltip.hasClass('tooltipstered')) tooltip.tooltipster(options)
		});
	}
}

// имеется масса плагинов добавляющих функционал:
// 1) Делает всплывающую подсказку прокручиваемой, когда она становится слишком большой
// 2) Позволяет всплывающей подсказке следовать за курсором.
// 3) Создает группы всплывающих подсказок для более быстрого отображения.
// 4) Делает всплывающую подсказку, когда вы выбираете / выделяете некоторый текст.
// 5) добавляет поддержку SVG

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

	// вычисление положения
	tooltipPosition.calcPosition = function () {
		tooltips = $('.js-tooltip-position');
		tooltips.css('marginLeft', '');

		// ширина паддинга контейнера страницы
		containerPadding = window.innerWidth > tooltipPosition.breakpoints['xs-max'] ? 30 : 10;
		containerPadding = window.innerWidth > tooltipPosition.breakpoints['sm-max'] ? 30 : containerPadding;

		for (i = 0; i < tooltips.length; i++) {
			// насколько выступает правый край выпадашки за границы контейнера страницы
			delta = tooltips[i].getBoundingClientRect().left + tooltips[i].offsetWidth -
				Math.min((window.innerWidth - tooltipPosition.scrollBarWidth - containerPadding), (window.innerWidth - tooltipPosition.scrollBarWidth) / 2 + 684);

			if (delta > 1) {
				// сдвиг выпадашки, если она выступает
				tooltips[i].style.marginLeft = ((parseInt(tooltips[i].style.marginLeft) || 0) - delta) + 'px';
			}
		}
	}

	$(window).off('resize.setTooltipPositions').on('resize.setTooltipPositions', function () {
		clearTimeout(timeout);

		timeout = setTimeout(tooltipPosition.calcPosition, 100);
	}).trigger('resize.setTooltipPositions');
}

$(function () {
	initTooltip()
})