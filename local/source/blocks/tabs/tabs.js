// переключение контента по табам
function toggleTabs() {
	$('.js-tabs').each(function () {
		var parent = $(this)
		var togglers = parent.find('.js-tabs__toggle')
		var tabs = parent.find('.js-tabs__tab')

		// инициализация и закрытие всех табов при загрузке, кроме того что с классом active-tab
		tabs.not('.active-tab').fadeOut(0)
		parent.addClass('init-tabs')

		togglers.each(function (index) {
			var toggler = $(this)

			// обработка переключения таба
			toggler.off('click.toggleTabs').on('click.toggleTabs', function (event) {
				event.preventDefault()

				// индекс нажатого таба
				var indexTab = toggler.addClass('active-tab').data('tabsItem')

				togglers.not(toggler).removeClass('active-tab')

				tabs.each(function () {
					var tab = $(this)

					// открытие таба при совпадении с индексом переключателя
					if (tab.data('tabsItem') != indexTab) {
						tab.fadeOut(0).removeClass('active-tab')
					} else {
						tab.fadeIn(300).addClass('active-tab')

						// обновление lazyload картинок внутри таба
						lazyLoad.instance.update()
					}
				})
			})
		})
	})
}

// отложенная загрузка изображений
function lazyLoad(scope) {
	if ($.fn.Lazy) {
		lazyLoad.instance = $('.js-lazy[data-src]', scope).Lazy({
			chainable: false,
			visibleOnly: true,
			effect: 'fadeIn',
			threshold: 250,
			placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTBweCIgaGVpZ2h0PSI1MHB4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCIgY2xhc3M9Imxkcy1kb3VibGUtcmluZyIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDApIG5vbmUgcmVwZWF0IHNjcm9sbCAwJSAwJTsiPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIG5nLWF0dHItcj0ie3tjb25maWcucmFkaXVzfX0iIG5nLWF0dHItc3Ryb2tlLXdpZHRoPSJ7e2NvbmZpZy53aWR0aH19IiBuZy1hdHRyLXN0cm9rZT0ie3tjb25maWcuYzF9fSIgbmctYXR0ci1zdHJva2UtZGFzaGFycmF5PSJ7e2NvbmZpZy5kYXNoYXJyYXl9fSIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiByPSI0MCIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2U9IiM5M2RiZTkiIHN0cm9rZS1kYXNoYXJyYXk9IjYyLjgzMTg1MzA3MTc5NTg2IDYyLjgzMTg1MzA3MTc5NTg2IiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgY2FsY01vZGU9ImxpbmVhciIgdmFsdWVzPSIwIDUwIDUwOzM2MCA1MCA1MCIga2V5VGltZXM9IjA7MSIgZHVyPSIxcyIgYmVnaW49IjBzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PC9hbmltYXRlVHJhbnNmb3JtPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIG5nLWF0dHItcj0ie3tjb25maWcucmFkaXVzMn19IiBuZy1hdHRyLXN0cm9rZS13aWR0aD0ie3tjb25maWcud2lkdGh9fSIgbmctYXR0ci1zdHJva2U9Int7Y29uZmlnLmMyfX0iIG5nLWF0dHItc3Ryb2tlLWRhc2hhcnJheT0ie3tjb25maWcuZGFzaGFycmF5Mn19IiBuZy1hdHRyLXN0cm9rZS1kYXNob2Zmc2V0PSJ7e2NvbmZpZy5kYXNob2Zmc2V0Mn19IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHI9IjMzIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZT0iIzY4OWNjNSIgc3Ryb2tlLWRhc2hhcnJheT0iNTEuODM2Mjc4Nzg0MjMxNTkgNTEuODM2Mjc4Nzg0MjMxNTkiIHN0cm9rZS1kYXNob2Zmc2V0PSI1MS44MzYyNzg3ODQyMzE1OSIgc3R5bGU9ImFuaW1hdGlvbi1wbGF5LXN0YXRlOiBydW5uaW5nOyBhbmltYXRpb24tZGVsYXk6IDBzOyI+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGNhbGNNb2RlPSJsaW5lYXIiIHZhbHVlcz0iMCA1MCA1MDstMzYwIDUwIDUwIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjFzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBzdHlsZT0iYW5pbWF0aW9uLXBsYXktc3RhdGU6IHJ1bm5pbmc7IGFuaW1hdGlvbi1kZWxheTogMHM7Ij48L2FuaW1hdGVUcmFuc2Zvcm0+PC9jaXJjbGU+PC9zdmc+',

			// стили фона прелоадера для элементов не являющимися картинками
			beforeLoad: function (element) {
				if (element[0].tagName !== 'IMG') {
					element.css({backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '119px'})
				}
			},

			afterLoad: function (element) {
				element.addClass('lazy-loaded')

				// очистка фона после загрузки изображения
				element.css({backgroundPosition: '', backgroundRepeat: '', backgroundSize: ''})
				if (element[0].tagName === 'IMG') {
					element.css({background: 'none'})
				}

				// инициализация события загрузки отложенного изображения
				$(window).trigger('lazyImagesLoaded')
			},
		})
	}
}

// переключение контента по табам нативный
function toggleTabsNative() {
	var parentsAll = document.querySelectorAll('.js-tabs');

	// вернет список без исключеного элемента
	function not($list, $element) {
		var list = Array.from($list);
		var index = list.indexOf($element);
		if (!index) {
			return list.slice(++index)
		} else {
			return list.slice(0, index).concat(list.slice(++index))
		}
	}

	Array.from(parentsAll).forEach(function (parent) {
		if (!parent.classList.contains('init-tabs')) {
			var togglers = parent.querySelectorAll('.js-tabs__toggle')
			var tabs = parent.querySelectorAll('.js-tabs__tab')

			// инициализация и закрытие всех табов при загрузке, кроме того что с классом active-tab
			parent.classList.add('init-tabs')
			Array.from(tabs).forEach(function (tab) {
				if (!tab.classList.contains('active-tab')) {
					tab.hidden = true;
				}
			})

			Array.from(togglers).forEach(function (toggler) {
				// обработка переключения таба
				toggler.addEventListener('click', function (e) {
					e.preventDefault()

					// индекс нажатого таба
					var indexTab = toggler.getAttribute('data-tabs-item')

					// активация переключателя при совпадении с индексом переключателя
					Array.from(togglers).forEach(function (togglerItem) {
						togglerItem.classList.remove('active-tab')
					})
					toggler.classList.add('active-tab')

					// открытие таба при совпадении с индексом переключателя
					Array.from(tabs).forEach(function (tab) {
						if (tab.getAttribute('data-tabs-item') === indexTab) {
							tab.classList.add('active-tab')
							tab.hidden = false;
						} else {
							tab.classList.remove('active-tab')
							tab.hidden = true;
						}
					})
				})
			})
		}
	})
}

$(function () {
	toggleTabs()
	toggleTabsNative()
})