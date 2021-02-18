// прогресс бар
function progressBar() {
	$('.js-progress').each(function () {
		var _this = $(this)
		var points = _this.find('.js-progress__point')
		var timeout = null

		function setBarWidth() {
			var start = points.first().position().left
			var end = points.last().position().left
			_this.find('.js-progress__bar').width(end - start)
		}

		$(window).off('resize.setBarWidth').on('resize.setBarWidth', function () {
			clearTimeout(timeout);
			timeout = setTimeout(setBarWidth, 300);
		}).trigger('resize.setBarWidth');
	})
}
$(function () {
progressBar()
})