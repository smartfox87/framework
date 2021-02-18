// баннер-меню с переключающимися фонами, заголовками и кнопками
function initBannerMenu() {
	$('.js-banner-menu').each(function () {
		var parent = $(this)
		var defaultBackground = parent.attr('data-bg-src')
		var defaultTitle = parent.attr('data-title')
		var backgroundBlock = parent.find('.js-banner-menu__bg')
		var title = parent.find('.js-banner-menu__title')
		var togglerReset = parent.find('.js-banner-menu__reset')
		var togglers = parent.find('.js-banner-menu__toggler')
		var togglersClick = parent.find('.js-banner-menu__clicker')
		var buttons = parent.find('.js-banner-menu__buttons')
		var timeout = null

		// init
		parent.prop('currentBg', defaultBackground)

		// toggler reset click
		togglerReset.off('click.toggleBannerMenu').on('click.toggleBannerMenu', function (event) {
			event.preventDefault()

			toggleButtons($(this).attr('data-buttons-id'))
			setDefault()

			togglers.off('mouseout.toggleBannerMenu').on('mouseout.toggleBannerMenu', setDefault)
		})

		// toggler click
		togglersClick.off('click.toggleBannerMenu').on('click.toggleBannerMenu', function (event) {
			event.preventDefault()
			var toggler = $(this)

			toggleButtons(toggler.attr('data-buttons-id'))
			setCurrent(event)

			parent.addClass('second-level')
			toggler.off('mouseout.toggleBannerMenu', setDefault)
		})

		// toggler mouse in
		togglers.off('mouseover.toggleBannerMenu').on('mouseover.toggleBannerMenu', setCurrent)

		// toggler mouse out
		togglers.off('mouseout.toggleBannerMenu').on('mouseout.toggleBannerMenu', setDefault)

		// toggle buttons
		function toggleButtons(id) {
			buttons.each(function () {
				var currentButtons = $(this)

				if (currentButtons.attr('data-id') == id) {
					currentButtons.addClass('active')
				} else {
					currentButtons.removeClass('active')
				}
			})
		}

		// set background image for parent
		function setBg(imageSrc) {
			if (parent.prop('currentBg') != imageSrc) {
				parent.prop('currentBg', imageSrc)

				if (backgroundBlock.eq(0).hasClass('active-bg')) {
					backgroundBlock.eq(1).css('background-image', 'url("' + imageSrc + '")')
					backgroundBlock.eq(1).addClass('active-bg')
					backgroundBlock.eq(0).removeClass('active-bg')
				} else {
					backgroundBlock.eq(0).css('background-image', 'url("' + imageSrc + '")')
					backgroundBlock.eq(0).addClass('active-bg')
					backgroundBlock.eq(1).removeClass('active-bg')
				}
			}
		}

		// set title for parent
		function setTitle(titleText) {
			title.text(titleText)
		}

		// set current bg and title
		function setCurrent(event) {
			var toggler = $(event.target)
			var togglerBackground = toggler.attr('data-bg-src')
			var togglerTitle = toggler.attr('data-title')

			clearTimeout(timeout)
			setBg(togglerBackground)
			setTitle(togglerTitle)
		}

		// set default bg and title
		function setDefault() {
			timeout = setTimeout(function () {
				setBg(defaultBackground)
				setTitle(defaultTitle)
				parent.removeClass('second-level')
			}, 400)
		}
	})
}

$(function () {
	initBannerMenu()
})