// ползунок для ввода значений с полями
function initRange() {
	if (noUiSlider && wNumb) {
		$('.js-range').each(function () {
			var _this = $(this)
			var slider = _this.find('.js-range__slider');
			var inputs = _this.find('.js-range__input');

			// инициализация слайдера
			noUiSlider.create(slider[0], {
				start: slider.data('value'),
				connect: true,
				tooltips: [true, wNumb({decimals: 2})],
				range: {
					'min': slider.data('min'),
					'max': slider.data('max')
				}
			});

			// установка значений в поля из слайдера
			slider[0].noUiSlider.on('update', function (values, index) {
				inputs[index].value = Math.round(values[index])
			});

			// обработка ввода значений из полей
			inputs.each(function (index, input) {
				input.addEventListener('change', function () {
					slider[0].noUiSlider.setHandle(index, this.value);
				});

				input.addEventListener('keydown', function (e) {
					var values = slider[0].noUiSlider.get();
					var value = Number(values[index]);

					// [[handle0_down, handle0_up], [handle1_down, handle1_up]]
					var steps = slider[0].noUiSlider.steps();

					// [down, up]
					var step = steps[index];

					var position;

					// обработка клика по кнопкам в полях 13 is enter, 38 is key up, 40 is key down.
					switch (e.which) {

						case 13:
							slider[0].noUiSlider.setHandle(index, this.value);
							break;

						case 38:

							// Get step to go increase slider value (up)
							position = step[1];

							// false = no step is set
							if (position === false) {
								position = 1;
							}

							// null = edge of slider
							if (position !== null) {
								slider[0].noUiSlider.setHandle(index, value + position);
							}

							break;

						case 40:

							position = step[0];

							if (position === false) {
								position = 1;
							}

							if (position !== null) {
								slider[0].noUiSlider.setHandle(index, value - position);
							}

							break;
					}
				});
			});
		})
	}
}

$(function () {
	initRange()
})