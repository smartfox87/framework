// построение мобилного меню каталога
function hamburgerMenu() {
	$('.js-hamburger-menu').each(function () {
		var $hamburgerMenu = $(this)
		var $hamburgerMenuToggles = $hamburgerMenu.find('.js-hamburger-menu__link');

		$hamburgerMenuToggles.off('click.hamburger').on('click.hamburger', function (e) {
			e.preventDefault();
			var $self = $(this);

			$self.addClass('open');
			$self
				.next('.js-hamburger-menu__sub-list')
				.find('.js-hamburger-menu__btn-back')
				.off('click.hamburger').on('click.hamburger', function () {
				$self.removeClass('open');
			});
		});

		// закрыть уровни мобильного меню каталога
		hamburgerMenu.closeAll = function () {
			$hamburgerMenu.removeClass('open');
			$hamburgerMenuToggles.removeClass('open');
		}
	})
}

// блокировать всплытие события скролла на элементе
function lockScroll() {
	if ($.fn.scrollLock) {
		$('.js-lock-scroll').scrollLock({
			unblock: '.js-lock-scroll__unlock'
		});
	}
}

$(function () {
	hamburgerMenu()
})