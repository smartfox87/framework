// одноуровневые выпадающие селекты
function toggleSelect() {
	var allParents = $('.js-select')
	var allContents = allParents.find('.js-select__content')

	allParents.each(function (index) {
		var parent = $(this)
		var toggler = parent.find('.js-select__toggler')
		var content = parent.find('.js-select__content')
		var listItems = parent.find('.js-select__item')
		var input = parent.find('.js-select__value')

		// инициализации и закрытие селекта при загрузке страницы
		content.fadeOut(0)
		parent.addClass('init-select')

		// открытие по клику
		toggler.off('click.toggleSelect').on('click.toggleSelect', function (event) {
			event.stopPropagation()
			// селект заблокирован при наличии класса
			if (toggler.hasClass('disabled')) return

			if (!parent.hasClass('open-select')) {
				openSelect()
			} else {
				closeSelect()
			}
		})

		// клик для выбора елемента option
		listItems.off('click.setSelectOption').on('click.setSelectOption', function (event) {
			event.stopPropagation()
			var item = $(this)
			var itemValue = item.attr('data-value')

			closeSelect()
			if (itemValue === 'reset') {
				listItems.removeClass('selected')
				toggler.removeClass('selected').html(toggler.data('reset'))
				parent.attr('data-value', '')
			} else {
				listItems.removeClass('selected')
				item.addClass('selected')
				toggler.addClass('selected').html(item.html())
				parent.attr('data-value', itemValue)
			}

			// триггер события и установка выбранного значения на скрытом поле
			input.val(item.attr('data-value')).trigger('change')
		})

		// переключение значения кастомного селекта по состоянию селекта
		input.off('change.setSelectOption').on('change.setSelectOption', function () {
			activateItem()
		})

		// переключение значения кастомного селекта
		function activateItem() {
			var item = listItems.filter(function () {
				return $(this).data('value') == input.val()
			})
			var itemValue = item.attr('data-value')

			listItems.removeClass('selected')
			item.addClass('selected')
			toggler.addClass('selected').html(item.html())
			parent.attr('data-value', itemValue)
		}

		activateItem()

		// открытие селекта
		function openSelect() {
			content.fadeIn(300)
			parent.addClass('open-select')
		}

		// закрытие селекта
		function closeSelect() {
			content.fadeOut(300)
			parent.removeClass('open-select')
		}

		$(document).off('click.toggleSelect' + index).on('click.toggleSelect' + index, function (e) {
			if (!$(e.target).closest('.js-select').length) {
				closeSelect()
			}
		})
	})

	// закрыть все селекты
	toggleSelect.closeAllSelect = function () {
		allParents.removeClass('open-select')
		allContents.fadeOut(300)
	}
}

// одноуровневые выпадающие селекты по наведению курсора
function toggleSelectHover() {
	var allParents = $('.js-select--hover')
	var allContents = allParents.find('.js-select__content')
	var win = $(window)
	var adaptiveDevice = win.width() <= 1024

	allParents.each(function (ind) {
		var parent = $(this)
		var toggler = parent.find('.js-select__toggler')
		var content = parent.find('.js-select__content')
		var listItems = parent.find('.js-select__item')
		var input = parent.find('.js-select__value')
		var timeout = null;

		// инициализации и закрытие селекта при загрузке страницы
		content.fadeOut(0)
		parent.addClass('init-select')

		// переключение метода открытия для адаптива и десктопа
		function toggleSelectHover() {
			adaptiveDevice = win.width() <= 1024

			if (adaptiveDevice) {
				// открытие по клику
				toggler.off('click.toggleSelect').on('click.toggleSelect', function (event) {
					event.stopPropagation()
					// селект заблокирован при наличии класса
					if (toggler.hasClass('disabled')) return

					if (!parent.hasClass('open-select')) {
						openSelect()
					} else {
						closeSelect()
					}
				})

				// снятие ненужных обработчиков
				parent.off('mouseover.toggleSelect')
				parent.off('mouseleave.toggleSelect')
			} else {
				// обработка события прихода курсора на элемент
				parent.off('mouseover.toggleSelect').on('mouseover.toggleSelect', function (event) {
					event.preventDefault()
					event.stopPropagation()

					// селект заблокирован при наличии класса
					if (toggler.hasClass('disabled')) return

					// переключение состояния
					clearTimeout(timeout);
					timeout = setTimeout(openSelect, 150);
				})

				// обработка события ухода курсора с элемента
				parent.off('mouseleave.toggleSelect').on('mouseleave.toggleSelect', function (event) {
					event.preventDefault()
					event.stopPropagation()

					// переключение состояния
					clearTimeout(timeout);
					timeout = setTimeout(closeSelect, 500);
				})

				// снятие ненужных обработчиков
				toggler.off('click.toggleSelect')
			}
		}

		// клик для выбора елемента option
		listItems.off('click.setSelectOption').on('click.setSelectOption', function (event) {
			event.stopPropagation()
			var item = $(this)
			var itemValue = item.attr('data-value')

			closeSelect()

			if (itemValue === 'reset') {
				listItems.removeClass('selected')
				toggler.removeClass('selected').html(toggler.data('reset'))
				parent.attr('data-value', '')
			} else {
				listItems.removeClass('selected')
				item.addClass('selected')
				toggler.addClass('selected').html(item.html())
				parent.attr('data-value', itemValue)
			}

			// триггер события и установка выбранного значения на скрытом поле
			input.val(item.attr('data-value')).trigger('change')
		})

		// переключение значения кастомного селекта по состоянию селекта
		input.off('change.setSelectOption').on('change.setSelectOption', function () {
			activateItem()
		})

		// переключение значения кастомного селекта
		function activateItem() {
			var item = listItems.filter(function () {
				return $(this).data('value') == input.val()
			})
			var itemValue = item.attr('data-value')

			listItems.removeClass('selected')
			item.addClass('selected')
			toggler.addClass('selected').html(item.html())
			parent.attr('data-value', itemValue)
		}

		activateItem()

		// открытие селекта
		function openSelect() {
			content.fadeIn(300)
			parent.addClass('open-select')
		}

		// закрытие селекта
		function closeSelect() {
			content.fadeOut(300)
			parent.removeClass('open-select')
		}

		win.off('resize.toggleSelectHover' + ind).on('resize.toggleSelectHover' + ind, function () {
			clearTimeout(timeout);
			timeout = setTimeout(toggleSelectHover, 300);
		}).trigger('resize.toggleSelectHover' + ind);

		$(document).off('click.toggleSelectHover' + ind).on('click.toggleSelectHover' + ind, function (e) {
			if (!$(e.target).closest('.js-select--hover').length) {
				closeSelect()
			}
		})
	})

	// закрыть все селекты
	toggleSelectHover.closeAllSelectHover = function () {
		if (adaptiveDevice) {
			allContents.fadeOut(300)
			allParents.removeClass('open-select')
		}
	}
}

// переключение видимости блоков по значению селекта
function toggleSelectBlock() {
	$('.js-select-block').each(function () {
		var parent = $(this)
		var select = parent.find('.js-select-block__select')
		var items = parent.find('.js-select-block__item')

		select.off('change.toggleSelectBlock')
			.on('change.toggleSelectBlock', toggleSelectBlock)
			.triggerHandler('change.toggleSelectBlock')

		// перебор элементов привязанных к селекту и переключение их видимости при совпадении атрибута value
		function toggleSelectBlock() {
			var selectValue = select.val()

			items.each(function () {
				var item = $(this)

				if (item.data('value') == selectValue) {
					item.show()
				} else {
					item.hide()
				}
			})
		}
	})
}

// одноуровневые выпадающие селекты с фильтром
function toggleSelectFilter() {
	var allParents = $('.js-select--filter')
	var allContents = allParents.find('.js-select__content')

	allParents.each(function (index) {
		var parent = $(this)
		var toggler = parent.find('.js-select__toggler')
		var content = parent.find('.js-select__content')
		var listItems = parent.find('.js-select__item')
		var input = parent.find('.js-select__value')
		var filter = parent.find('.js-select__filter')

		// инициализации и закрытие селекта при загрузке страницы
		content.fadeOut(0)
		parent.addClass('init-select')

		parent.off('click.toggleSelect').on('click.toggleSelect', function (event) {
			event.stopPropagation()
		})

		// открытие по клику
		toggler.off('click.toggleSelect').on('click.toggleSelect', function (event) {
			// селект заблокирован при наличии класса
			if (toggler.hasClass('disabled')) return

			if (!parent.hasClass('open-select')) {
				openSelect()
			} else {
				closeSelect()
			}
		})

		// фильтрация опций селекта
		filter.off('input.toggleSelect').on('input.toggleSelect', function (event) {
			listItems.each(function () {
				var item = $(this)

				if (~item.text().toLowerCase().indexOf(filter.val().toLowerCase())) {
					item.show()
				} else {
					item.hide()
				}
			})
		})

		// клик для выбора елемента option
		listItems.off('click.setSelectOption').on('click.setSelectOption', function (event) {
			event.stopPropagation()
			var item = $(this)
			var itemValue = item.attr('data-value')

			closeSelect()
			if (itemValue === 'reset') {
				listItems.removeClass('selected')
				toggler.removeClass('selected').html(toggler.data('reset'))
				parent.attr('data-value', '')
			} else {
				listItems.removeClass('selected')
				item.addClass('selected')
				toggler.addClass('selected').html(item.html())
				parent.attr('data-value', itemValue)
			}

			// триггер события и установка выбранного значения на скрытом поле
			input.val(item.attr('data-value')).trigger('change')
		})

		// переключение значения кастомного селекта по состоянию селекта
		input.off('change.setSelectOption').on('change.setSelectOption', function () {
			activateItem()
		})

		// переключение значения кастомного селекта
		function activateItem() {
			var item = listItems.filter(function () {
				return $(this).data('value') == input.val()
			})
			var itemValue = item.attr('data-value')

			listItems.removeClass('selected')
			item.addClass('selected')
			toggler.addClass('selected').html(item.html())
			parent.attr('data-value', itemValue)
		}

		activateItem()

		// открытие селекта
		function openSelect() {
			content.fadeIn(300)
			parent.addClass('open-select')
			filter.focus()
		}

		// закрытие селекта
		function closeSelect() {
			content.fadeOut(300)
			parent.removeClass('open-select')
		}

		$(document).off('click.toggleSelectFilter' + index).on('click.toggleSelectFilter' + index, function (e) {
			if (!$(e.target).closest('.js-select--filter').length) {
				closeSelect()
			}
		})
	})

	// закрыть все селекты
	toggleSelect.closeAllSelect = function () {
		allParents.removeClass('open-select')
		allContents.fadeOut(300)
	}
}

// селект с полем фильтром
function selectWithFilter() {
	if ($.fn.ikSelect) {
		$('.js-select-w-filter').each(function () {
			$(this).ikSelect({
				// customClass: 'intro-select1',
				ddFullWidth: false,
				filter: true
			});
		});
	}
}

$(function () {
	toggleSelect()
	toggleSelectHover()
	toggleSelectBlock()
	toggleSelectFilter()
	selectWithFilter()
})