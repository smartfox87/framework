// рябь на кнопке при клике
function clickButtonRipple() {
	$('.js-btn-ripple').off('mousedown.clickButtonRipple').on('mousedown.clickButtonRipple', function (event) {
		var $btn = $(this);
		var $btnOffset = $btn.offset();

		// координаты позиции ряби на кнопке
		var x = event.pageX - $btnOffset.left;
		var y = event.pageY - $btnOffset.top;

		// элемент ряби
		$btn.find('.js-btn-ripple__circle')
			.css({top: y, left: x})
			.addClass('active')
			.on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function () {
				$(this).removeClass('active');
			});
	})
}

$(function () {
	clickButtonRipple()
})