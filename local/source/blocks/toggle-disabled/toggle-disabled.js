// блокировка кнопки по незаполненным полям
function toggleDisabledBtn() {
	$('.js-toggle-disabled').each(function () {
		var $parent = $(this);
		var $inputs = $parent.find('.js-toggle-disabled__input');
		var $btn = $parent.find('.js-toggle-disabled__btn');

		$inputs.off('change.toggleDisabledBtn').on('change.toggleDisabledBtn', toggleDisabledBtn);
		$inputs.off('input.toggleDisabledBtn').on('input.toggleDisabledBtn', toggleDisabledBtn);

		toggleDisabledBtn();

		// проверка всех полей на заполненость и переключение блокировки кнопки
		function toggleDisabledBtn() {
			// все заполненные поля
			var inputsTrue = $.grep($inputs, function (item) {
				var input = $(item);
				var status = false;

				// проверка значения поля согласно его типу
				switch (input.prop('type')) {
					case 'text':
						status = input.val().length;
						break;
					case 'tel':
						status = input.val().length;
						// +375 (99) 999-99-99
						// status = /\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}/.test(input.val());
						break;
					case 'checkbox':
						status = input.prop('checked');
						break;
				}
				return status;
			})

			// блокировка кнопки если не все поля заполнены
			var blockedState = $inputs.length !== inputsTrue.length;

			$btn.prop('disabled', blockedState);
			$parent.toggleClass('blocked', blockedState);
		}
	})
}

$(function () {
	toggleDisabledBtn()
})