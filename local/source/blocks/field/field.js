// инициализация печатного placeholder у поля
function initInputWriter() {
	if (window.Typewriter) {
		$('.js-writer').each(function () {
			const field = $(this)
			const input = field.find('.js-writer__input')

			// переключение видимости анимации ввода текста
			input.off('focus.writer').on('focus.writer', function () {
				field.removeClass('show-writer')
			})
			input.off('blur.writer').on('blur.writer', function () {
				if (!$(this).val().length) field.addClass('show-writer')
			})

			// инициализация анимации ввода текста
			const _this = field.find('.js-writer__text')
			new Typewriter(_this[0], {
				strings: [_this.data('writer')],
				autoStart: true,
				loop: true,
			});
		})
	}
}

// синхронизировать вводимые значения полей
function synchronizeFields() {
	$('.js-synchronize-fields').each(function () {
		var parent = $(this)
		var fields = parent.find('.js-synchronize-fields__field')

		fields.each(function () {
			var inputField = $(this)
			var inputFieldId = inputField.data('id')

			inputField.off('keypress.synchronizeFields').on('keypress.synchronizeFields', function () {
				fields.each(function () {
					var field = $(this)

					if (field.data('id') === inputFieldId) {
						field.val(inputField.val())
					}
				})
			})
		})
	})
}

// валидация ввода для поля
$('input[type=email]').off('keypress.email').on('keypress.email', function (e) {
	var reg = /[а-яА-ЯёЁ]/g;

	if (e.key.search(reg) != -1) {
		e.preventDefault()
		return false
	}
})

$(function () {
	initInputWriter()
	synchronizeFields()
})