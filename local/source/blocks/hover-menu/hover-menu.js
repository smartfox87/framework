// меню с ховером и задержкой
function delayHoverMenu() {
	var allParents = $('.js-hover-menu')
	var win = $(window)
	var timeout = null;

	function delayHoverMenu() {
		var adaptiveDevice = win.width() < 1024
		allParents.each(function () {
			var parent = $(this)
			var items = parent.find('.js-hover-menu__item')

			if (!adaptiveDevice) {
				// текущее положение курсора
				var nCurPosX;
				parent.mousemove(function (event) {
					return nCurPosX = event.clientX
				})

				items.each(function () {
					var curItem = $(this)

					// обработка прихода курсора на пункта меню
					curItem.off('mouseover.showInnerMenu').on('mouseover.showInnerMenu', function () {
						curItem.addClass('hover');

						/* делаем задержку чтобы при случайном наведении на пункт подменю не показывалось */
						setTimeout(function () {

							/* если по истечению задержки мы все еще на том же пункт меню, значит показываем подменю */
							if (curItem.hasClass('hover')) {
								curItem.addClass('active')

								// инициализация картинок во внутреннем блоке
								lazyLoad(curItem)
							}
						}, 300);
					});

					// обработка ухода курсора с пункта меню
					curItem.off('mouseout.hideInnerMenu').on('mouseout.hideInnerMenu', function () {
						var nPosXStart = nCurPosX
						curItem.removeClass('hover');

						/* делаем небольшую задержку чтобы определить направление движение курсора */
						setTimeout(function () {

							// если в сторону подменю, значит делаем большую задержку для возможности движения по диагонали
							if (nCurPosX - nPosXStart > 0) {
								setTimeout(function () {

									/* если по истечению задержки курсор находится на подменю или текущем пункте меню тогда не прячем подменю */
									if (!curItem.hasClass('hover')) {
										deactivateItem()
									}
								}, 300);
							} else if (!curItem.hasClass('hover')) {

								// если нет и мы ушли с текущего пункта меню, моментально скрываем подменю
								deactivateItem()
							}
						}, 10);

						// деактивируем пункт меню
						function deactivateItem() {
							setTimeout(function () {
								curItem.removeClass('active');
							}, 300)
						}
					})
				})
			} else {
				// удаляем обработчики hover с пунктов меню
				items.off('mouseover.showInnerMenu')
				items.off('mouseout.hideInnerMenu')
				items.removeClass('hover active')
			}
		})
	}

	win.off('resize.delayHoverMenu').on('resize.delayHoverMenu', function () {
		clearTimeout(timeout);
		timeout = setTimeout(delayHoverMenu, 300);
	})

	win.trigger('resize.delayHoverMenu');
}

// меню с ховером и задержкой
function adaptiveHeightHoverMenu() {
	var allParents = $('.js-hover-menu--adaptive')
	var win = $(window)
	var timeout = null;

	function delayHoverMenu() {
		var adaptiveDevice = win.width() < 1024
		allParents.each(function () {
			var parent = $(this)
			var items = parent.find('.js-hover-menu__item')
			var subMenu = items.find('.js-hover-menu__submenu')

			if (!adaptiveDevice) {
				// текущее положение курсора
				var nCurPosX;
				parent.mousemove(function (event) {
					return nCurPosX = event.clientX
				})

				items.each(function () {
					var curItem = $(this)

					// обработка прихода курсора на пункта меню
					curItem.off('mouseover.showInnerMenu').on('mouseover.showInnerMenu', function () {
						curItem.addClass('hover');

						/* делаем задержку чтобы при случайном наведении на пункт подменю не показывалось */
						setTimeout(function () {

							/* если по истечению задержки мы все еще на том же пункт меню, значит показываем подменю */
							if (curItem.hasClass('hover')) {
								curItem.addClass('active')
								var subMenu = curItem.find('.js-hover-menu__submenu')
								parent.css({minHeight: subMenu.outerHeight()})
							}
						});
					});

					// обработка ухода курсора с пункта меню
					curItem.off('mouseout.hideInnerMenu').on('mouseout.hideInnerMenu', function () {
						var nPosXStart = nCurPosX
						curItem.removeClass('hover');

						/* делаем небольшую задержку чтобы определить направление движение курсора */
						setTimeout(function () {

							// если в сторону подменю, значит делаем большую задержку для возможности движения по диагонали
							if (nCurPosX - nPosXStart > 0) {
								setTimeout(function () {

									/* если по истечению задержки курсор находится на подменю или текущем пункте меню тогда не прячем подменю */
									if (!curItem.hasClass('hover')) {
										deactivateItem()
									}
								});
							} else if (!curItem.hasClass('hover')) {

								// если нет и мы ушли с текущего пункта меню, моментально скрываем подменю
								deactivateItem()
							}
						}, 10);

						// деактивируем пункт меню
						function deactivateItem() {
							setTimeout(function () {
								curItem.removeClass('active');
							})
						}
					})
				})

				// обработка ухода курсора с пункта меню
				parent.off('mouseleave.resetHeightMenu').on('mouseleave.resetHeightMenu', function () {
					parent.css({minHeight: 0})
				})
			} else {
				// удаляем обработчики hover с пунктов меню
				items.off('mouseover.showInnerMenu')
				items.off('mouseout.hideInnerMenu')
				items.removeClass('hover active')
			}
		})
	}

	win.off('resize.delayHoverMenu').on('resize.delayHoverMenu', function () {
		clearTimeout(timeout);
		timeout = setTimeout(delayHoverMenu, 300);
	})

	win.trigger('resize.delayHoverMenu');
}

$(function () {
	delayHoverMenu()
	adaptiveHeightHoverMenu()
})