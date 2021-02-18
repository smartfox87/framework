// переключение класса для родителя поля radio (не требует переинициализации после аякс)
function toggleRadioClass() {
	$(document)
		.off('change.toggleRadioClass', '.js-radio-class__input')
		.on('change.toggleRadioClass', '.js-radio-class__input', toggleRadioClass)

	function toggleRadioClass() {
		// проверяет явлеяется ли this елементом инициатора события или window
		var inputs = this?.location ? $('.js-radio-class__input') : $('.js-radio-class__input[name=' + $(this).prop('name') + ']')

		// перебор полей и перключение класса
		inputs.each(function () {
			var input = $(this)
			var label = input.closest('.js-radio-class')
			var toggleClass = label.data('class')

			if (input.prop('checked')) {
				label.addClass(toggleClass)
			} else {
				label.removeClass(toggleClass)
			}
		})
	}

	toggleRadioClass()
}

// переключение видимости блока по активному радио-баттону
function toggleRadioBlock() {
	$('.js-radio-block').each(function () {
		var parent = $(this);
		var inputs = parent.find('.js-radio-block__input');
		var blocks = parent.find('.js-radio-block__block');
		var currentValue = null;

		// обработка события переключения и инициализация радио-баттона
		inputs.off('change.toggleRadioBlock')
			.on('change.toggleRadioBlock', toggleRadioBlock)
			.triggerHandler('change.toggleRadioBlock');

		// переключение видимости блоков по значению атрибута value у радио-баттона
		function toggleRadioBlock() {
			currentValue = inputs.filter(':checked').val();
			blocks.hide().removeClass('visible-block')
				.filter('[data-value="' + currentValue + '"]').show().addClass('visible-block');
		}
	})
}

$(function () {
	toggleRadioClass()
	toggleRadioBlock()
})