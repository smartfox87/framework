// поле для ввода количества с кнопками -/+
function setQuantity() {
	$('.js-quantity').each(function () {
		var parent = $(this)
		var input = parent.find('.js-quantity__input')
		var maxValue = parseFloat(input.data('maxValue'))
		var minValue = parseFloat(input.data('minValue'))
		var units = input.data('units')
		var timeout = null

		// обработка кликов по кнопке
		parent.find('.js-quantity__btn').off('click.toggleQuantity').on('click.toggleQuantity', function () {
			var step = parseFloat($(this).attr('data-step'))
			var nextValue = parseFloat(input.val()) + step

			// если не выходит за интервал значений поля, то переключаем значение поля на заданный в атрибуте кнопок шаг
			if (nextValue <= maxValue && nextValue >= minValue) {

				// добавляем единицы измерения, если они заданы
				input.val((units.length) ? nextValue + units : nextValue)
			}
		})

		// защита от ввода всех символов кроме цифр
		input.off('keypress.toggleQuantity').on('keypress.toggleQuantity', function (event) {
			return event.charCode >= 48 && event.charCode <= 57
		})

		// обработка ввода в поле
		input.off('keyup.toggleQuantity').on('keyup.toggleQuantity', function () {
			var newValue = input.val().trim().length ? parseFloat(input.val()) : minValue

			// если выходит за интервал значений поля, то меняем значение поля на корректное
			clearTimeout(timeout)
			timeout = setTimeout(function () {
				if (newValue > maxValue) {
					// добавляем единицы измерения, если они заданы
					input.val((units.length) ? maxValue + units : maxValue)
				}
				if (newValue <= minValue) {
					// добавляем единицы измерения, если они заданы
					input.val((units.length) ? minValue + units : minValue)
				}
			}, 1000)
		})
	})
}

$(function () {
setQuantity()
})