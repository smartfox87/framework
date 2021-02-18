// маска для полей ввода
function maskInputs() {
	if ($.fn.inputmask) {
		$('.js-mask').each(function () {
			var input = $(this)
			input.inputmask(input.data('mask'), {
				'clearIncomplete': true,
				'placeholder': '*',
				'showMaskOnHover': false,
			})
		})
	}
}

// проверка введенного кода оператора на валидность доступных кодов
function validateCodePhone() {
	$('.js-phone-country').each(function () {
		var parent = $(this)
		var input = parent.find('.js-phone-country__input')
		var phoneCodes = ['17', '25', '29', '33', '44']

		input.inputmask('+375(99)999-99-99');

		input.off('keyup.phoneInput').on('keyup.phoneInput', function () {
			var phoneCode = input.val().substr(5, 2)

			// проверка на наличие в масиве валидных кодов
			if (!~phoneCodes.indexOf(phoneCode) && phoneCode.length == 2 && !~phoneCode.indexOf('_')) {
				phoneParent.addClass('show-message')
			} else {
				phoneParent.removeClass('show-message')
			}
		})
	})
}

$(function () {
	maskInputs()
	validateCodePhone()
})