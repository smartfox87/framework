//  функция присваивания крайних классов дотсам слайдера для их скрытия при большом количестве (slick slider)
function setDotClasses(event, slick, currentSlide, nextSlide) {
	slick.$dots.find('li').removeClass('slick-dot-on-edge slick-dot-out-of-edge').each(function (index, item) {
		var limit = 4;
		var shift = Math.max(0, limit - nextSlide);

		if ((nextSlide > limit && nextSlide - index == limit - shift) || (nextSlide < slick.$slides.length - limit) && nextSlide - index == -limit - shift)
			$(item).addClass('slick-dot-on-edge');
		else if (nextSlide - index > limit - shift || nextSlide - index < -limit - shift)
			$(item).addClass('slick-dot-out-of-edge');
	});
}

// переключение видимости пагинации если слайдо не достаточно для скролла
$('.js-slider').on('setPosition', function (event, slick) {
	if (slick.options.slidesToShow >= slick.$slides.length) {
		slick.$dots.hide()
	}
});

// ограничение количества дотсов
$('.js-slider').on('init', function (event, slick) {
	setDotClasses(event, slick, 0, 0);
});
$('.js-slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
	setDotClasses(event, slick, currentSlide, nextSlide);
});