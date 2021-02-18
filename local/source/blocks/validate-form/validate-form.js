// валидация форм
function validateForm() {
	if ($.fn.parsley) {
		// обработка валидации поля с ощибкой
		window.Parsley.on('field:error', function () {
			this.$element.closest('.js-field').addClass('field--error')
		});

		// обработка успешной валидации поля
		window.Parsley.on('field:success', function () {
			this.$element.closest('.js-field').removeClass('field--error')
		});
	}
}

$(function () {
	validateForm()
})