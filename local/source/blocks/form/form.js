// валидация форм
function validateForm() {
	if ($.fn.parsley) {
		$('[data-parsley-validate]').parsley()

		// обработка валидации поля с ощибкой
		window.Parsley.off('field:error').on('field:error', function () {
			this.$element.closest('.js-field').addClass('field--error')
		});

		// обработка успешной валидации поля
		window.Parsley.off('field:success').on('field:success', function () {
			this.$element.closest('.js-field').removeClass('field--error')
		});

		// валидация ввода для поля
		$('input[type=email]').off('keypress.email').on('keypress.email', function (e) {
			var reg = /[а-яА-ЯёЁ]/g;

			if (e.key.search(reg) != -1) {
				e.preventDefault()
				return false
			}
		})
	}
}

$(function () {
	validateForm()
})