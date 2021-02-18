if (window.jQuery) {
	const View = new (function () {
		// внутренние переменные
		const body = $(document.body);
		const htmlbody = $([document.documentElement, document.body]);
		const win = $(window);
		const doc = $(document)

		// внешние переменные
		// проверка на мобильное устройство (true/false)
		this.checkAdaptiveBrowser = 'ontouchstart' in document.documentElement
		this.isIE = (function detectIE() {
			var ua = window.navigator.userAgent;

			var msie = ua.indexOf('MSIE ');
			if (msie > 0) return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);

			var trident = ua.indexOf('Trident/');
			if (trident > 0) {
				var rv = ua.indexOf('rv:');
				return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
			}

			var edge = ua.indexOf('Edge/');
			if (edge > 0) return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);

			return false;
		})();
		this.isIOS = parseInt(('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1]).replace('undefined', '3_2').replace('_', '.').replace('_', '')) || false;

		this.screenSizeIsAdaptive = null;
		// проверка устройства десктоп или адатив
		this.mobileAndTabletCheck = null;
		// проверка наличия скроллбара у окна браузера
		this.winHaveScroll = null;
		// ширина скроллбара у окна браузера
		this.scrollBarWidth = null;
		// длительность анимации эффектов переключения всех переключающихся блоков
		this.animateDuration = 200
		// breakpoints
		this.breakpoints = {
			'lgMax': 1440,
			'lgMin': 1367,
			'mdMax': 1366,
			'mdMin': 1025,
			'smMax': 1024,
			'smMin': 768,
			'xsMax': 767,
			'xsMid': 550,
			'xsMin': 320,
		}
		// спиннер при ожидании загрузки контента
		this.imageLoaderBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxzdHlsZT4KICAgICAgICAuc3Bpbm5lcnsKICAgICAgICAgICAgYW5pbWF0aW9uOiBzcGlubmVyIDFzIGxpbmVhciBpbmZpbml0ZTsKICAgICAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyIGNlbnRlcjsKICAgICAgICB9CiAgICAgICAgQGtleWZyYW1lcyBzcGlubmVyIHsKICAgICAgICAwJSB7CiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7CiAgICAgICAgfQogICAgICAgIDEwMCUgewogICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7CiAgICAgICAgfQogICAgICAgIH0KICAgIDwvc3R5bGU+CiAgICA8cGF0aCBjbGFzcz0ic3Bpbm5lciIKICAgICAgICAgIGQ9Ik0xMC43MjI1IDIuMzg3MjRDNy41NTQyOSAyLjM1Njg3IDQuMjU5NDYgNC40NDM0MyAyLjk3ODMxIDguMTA5MzRDMS44NTk5MyAxMS4zMjg4IDIuNTgwMzkgMTYuMDI3MyA3LjI0OTgyIDE4Ljc3NkM3LjMxOTE2IDE4LjgwNjQgNy40NzU5MSAxNy4yMTc5IDExLjg2OCAxNkMxNS4zMTY2IDE1LjA0NjMgMTcuODY2OCAxMS41ODA5IDE1LjgyOSA4Ljk1NjcyQzE0LjMwMDcgNi45ODU1NyAxMS41NDI0IDYuODA2MzggOS4yMjczMiA5LjI4NDc0QzkuOTU5ODQgNy4xODkwNyAxMS41NjM1IDUuOTQzODEgMTIuOTQ3MiA1LjY0MDA5QzE2Ljc3NTYgNC44MjYxMiAxOS40ODU2IDguMjU4MTYgMTkuMTA4OCAxMi4yODI1QzE4LjY4OTggMTYuODAxOCAxNC40Njk1IDIwIDkuODM5MjYgMjBDNC40NDMzNCAyMCAwIDE1LjQ4MDYgMCA5Ljk3NzIyQzAuMDExOTU2OCA3LjMyNjkyIDEuMDY1MyA0Ljc4OTI3IDIuOTI5NTggMi45MTk0OEM0Ljc5Mzg1IDEuMDQ5NjkgNy4zMTcyOCAtMi43Mzc5MWUtMDUgOS45NDc3OCA1LjM1NTkyZS0xMEMxNS40MzExIDUuMzU1OTVlLTEwIDE5LjgzNTMgNC40NDAzOSAxOS44NDczIDEwLjEzMjFDMTguODA0MyA1LjgyNTM2IDE1LjU1NDcgMi40MzU4NCAxMC43MjI1IDIuMzg3MjRaIgogICAgICAgICAgZmlsbD0iIzE3OEVEMSIvPgo8L3N2Zz4K'
		this.setCookie = function (name, value, options) {
			options = options || {};

			var expires = options.expires;

			if (typeof expires == 'number' && expires) {
				var d = new Date();
				d.setTime(d.getTime() + expires * 1000);
				expires = options.expires = d;
			}
			if (expires && expires.toUTCString) {
				options.expires = expires.toUTCString();
			}

			value = encodeURIComponent(value);

			var updatedCookie = name + '=' + value;

			for (var propName in options) {
				updatedCookie += '; ' + propName;
				var propValue = options[propName];
				if (propValue !== true) {
					updatedCookie += '=' + propValue;
				}
			}

			document.cookie = updatedCookie;
		};

		// добавление на страницу отложенной загрузки внешнего скрипта
		this.loadedScripts = []
		this.loadDelayScript = function (url) {
			if (!~View.loadedScripts.indexOf(url)) {
				View.loadedScripts.push(url)
				const script = $(document.createElement('script'))
				script.attr({src: url, type: 'text/javascript'})
				body.append(script)
			}
		}

		// проверка расстояние до видимости блока больше или меншье указнного (при скролле страницы)
		this.getVisibleElemOnScroll = (elemJQ, reserveHeight) => {
			if (elemJQ.is(':visible') && elemJQ.length) {
				return elemJQ.offset().top - (doc.scrollTop() + win.height() + reserveHeight) < 0
			}
			return false
		}

		// Видимости элемента после указанной высоты скролла страницы
		this.showElemAfterScroll = function (element, toggleHeightScroll) {
			doc.off('scroll.showElemAfterScroll').on('scroll.showElemAfterScroll', toggleShow)
			doc.trigger('scroll.showElemAfterScroll')

			function toggleShow() {
				var scrollDocument = doc.scrollTop();

				if (scrollDocument < toggleHeightScroll) {
					element.fadeOut(300)
				} else {
					element.fadeIn(300)
				}
			}
		}

		this.allClassPage = []

		// для защиты от повторного скачивания апи карт
		this.loadYandexApi = false
		// инициализация всех яндекс карт на сайте
		this.initMaps = function () {
			this.loadYandexApi = true
			if (window.ymaps && window.ymaps.Map) {
				// console.log('window.ymaps')
				initMaps()
			} else {
				// console.log('not window.ymaps')
				window.ymaps.ready(function () {
					initMaps()
				})
			}

			function initMaps() {
				// карта с выбором городов на главной странице
				$('#ymaps-multi-city').each(function () {
					var mapItem = $(this)
					console.log('map container', mapItem)

					if (!mapItem.hasClass('init-map')) {

						mapItem.empty()
						mapItem.addClass('init-map')

						var mapObject = new ymaps.Map(mapItem[0], {
							center: [50.79, 37.64],
							controls: ['zoomControl', 'fullscreenControl'],
							zoom: 18,
						}, {
							searchControlProvider: 'yandex#search'
						})
						var objectManager = new ymaps.ObjectManager({
							// Чтобы метки начали кластеризоваться, выставляем опцию.
							clusterize: true,
							// ObjectManager принимает те же опции, что и кластеризатор.
							gridSize: 32,
						})

						// стилизация меток на карте
						objectManager.objects.options.set('iconLayout', 'default#image');
						objectManager.objects.options.set('iconImageHref', '/local/build/img/map__icon.svg');
						objectManager.objects.options.set('iconImageSize', [48, 60]);
						objectManager.objects.options.set('iconImageOffset', [-24, -60]);

						// контент для метки кластера
						var MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
							'<div style="color: #ffffff; font-weight: 500; font-size: 17px;">{{ properties.geoObjects.length }}</div>'
						);
						// стилизация метки кластера
						objectManager.clusters.options.set({
							clusterIcons: [{
								href: '/local/build/img/map__icon--cluster.svg',
								color: '#fff',
								size: [48, 60],
								offset: [-24, -60],
							}],
							clusterIconContentLayout: MyIconContentLayout,
						});

						// загрузка данных меток и добавление на карту
						function loadMapData(dataJsonPath) {
							// путь к JSON файлу с данными для карты
							var pathJsonMultiCustom = dataJsonPath || mapItem.data('json-path')

							// удалить все метки на карте
							objectManager.removeAll();
							mapObject.geoObjects.removeAll();

							// Загружаем GeoJSON файл с описанием объектов.
							$.getJSON(pathJsonMultiCustom)
								.done(function (response) {
									// Добавляем описание объектов в формате JSON в менеджер объектов.
									objectManager.add(response);
									// Добавляем объекты на карту.
									mapObject.geoObjects.add(objectManager);

									// устанавливаем нужный центр и зум карты, чтобы было видно все метки и задаем нужный отступ меток от края карты
									mapObject.setBounds(mapObject.geoObjects.getBounds(), {checkZoomRange: true, zoomMargin: 50})
										.then(function () {
											//после установки проверяем зум и не даем выйти за рамки нужного
											if (mapObject.getZoom() > 15) mapObject.setZoom(15);
										});
								})
								.fail(function (response) {
									console.warn('offer: ajax load failed', response)
								})
						}

						loadMapData()

						// проброс функции обновления данных карты наружу
						mapItem.data('loadMapData', loadMapData)

						// переключение города и его меток на карте
						var citySelect = $('#js-map-city')

						citySelect.off('change').on('change', function () {
							loadMapData(citySelect.val())
						})
					}
				})

				// карта с полем для ввода адреса
				$('.ymaps-with-input').each(function () {
					var mapItem = $(this)
					console.log('map container', mapItem)

					if (!mapItem.hasClass('init-map')) {
						mapItem.empty()
						mapItem.addClass('init-map')
						var mapObject = new ymaps.Map(mapItem[0], {
							center: [50.79, 37.64],
							controls: ['zoomControl'],
							zoom: 18,
						}, {
							autoFitToViewport: 'always',
							searchControlProvider: 'yandex#search'
						})
						var objectManager = new ymaps.ObjectManager({
							// Чтобы метки начали кластеризоваться, выставляем опцию.
							clusterize: true,
							// ObjectManager принимает те же опции, что и кластеризатор.
							gridSize: 32,
						})

						// стилизация меток на карте
						objectManager.objects.options.set('iconLayout', 'default#image');
						objectManager.objects.options.set('iconImageHref', '/local/build/img/map__icon.svg');
						objectManager.objects.options.set('iconImageSize', [48, 60]);
						objectManager.objects.options.set('iconImageOffset', [-24, -60]);

						// контент для метки кластера
						var MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
							'<div style="color: #ffffff; font-weight: 500; font-size: 17px;">{{ properties.geoObjects.length }}</div>'
						);
						// стилизация метки кластера
						objectManager.clusters.options.set({
							clusterIcons: [{
								href: '/local/build/img/map__icon--cluster.svg',
								color: '#fff',
								size: [48, 60],
								offset: [-24, -60],
							}],
							clusterIconContentLayout: MyIconContentLayout,
						});

						// при открытии балуна
						objectManager.objects.events.add(['balloonopen', 'redraw'], function (e, a) {
							if (win.width() < 820) {
								$('.fancybox-slide').scrollTop(400)
								// fullscreenControl.enterFullscreen();
								mapObject.getBalloon().mapAutoPan()
							}
						});

						// загрузка данных меток и добавление на карту
						function loadMapData(dataJsonPath) {
							// путь к JSON файлу с данными для карты
							var pathJsonMultiCustom = dataJsonPath || mapItem.data('json-path')

							// удалить все метки на карте
							objectManager.removeAll();
							mapObject.geoObjects.removeAll();

							// Загружаем GeoJSON файл с описанием объектов.
							$.getJSON(pathJsonMultiCustom)
								.done(function (response) {
									// Добавляем описание объектов в формате JSON в менеджер объектов.
									objectManager.add(response);
									// Добавляем объекты на карту.
									mapObject.geoObjects.add(objectManager);

									// устанавливаем нужный центр и зум карты, чтобы было видно все метки и задаем нужный отступ меток от края карты
									mapItem.data('setPositionMap')()

									return response
								})
								.fail(function (response) {
									console.warn('offer: ajax load failed', response)
								})
						}

						// проброс функции обновления данных карты наружу
						mapItem.data('loadMapData', loadMapData)

						// устанавливаем нужный центр и зум карты, чтобы было видно все метки и задаем нужный отступ меток от края карты
						function setPositionMap() {
							mapObject.setBounds(mapObject.geoObjects.getBounds(), {checkZoomRange: true, zoomMargin: 50})
								.then(function () {
									//после установки проверяем зум и не даем выйти за рамки нужного
									if (mapObject.getZoom() > 15) mapObject.setZoom(15);
								});
						}

						mapItem.data('setPositionMap', setPositionMap)

						loadMapData()

						// Слушаем клик на карте.
						// mapObject.events.add('click', function (e) {
						// 	var coords = e.get('coords');
						//
						// 	// передвигаем метку.
						// 	myPlacemark.geometry.setCoordinates(coords);
						// 	getAddress(coords);
						// });

						// поля ввода и вывода адреса
						let locationInput = $('#location-input')
						// сообщение об ошибке
						var notice = $('#notice')

						// Подключаем поисковые подсказки к полю ввода.
						var suggestView = new ymaps.SuggestView('location-input')

						// При клике по кнопке запускаем верификацию введёных данных.
						$('#btn-search').on('click.searchLocation', function (e) {
							geocode();
						});

						function geocode() {
							// Забираем запрос из поля ввода.
							var request = locationInput.val();
							// Геокодируем введённые данные.
							ymaps.geocode(request).then(function (res) {
								var obj = res.geoObjects.get(0),
									error;

								// Об оценке точности ответа геокодера
								if (obj) {
									switch (obj.properties.get('metaDataProperty.GeocoderMetaData.precision')) {
										case 'exact':
											break;
										case 'number':
										case 'near':
										case 'range':
											error = 'Неточный адрес, уточните номер дома';
											break;
										case 'street':
											error = 'Неполный адрес, уточните номер дома';
											break;
										case 'other':
										default:
											error = 'Неточный адрес, требуется уточнение';
									}
								} else {
									error = 'Адрес не найден';
								}

								// Если геокодер возвращает пустой массив или неточный результат, то показываем ошибку.
								if (error) {
									showError(error);
								} else {
									showResult(obj);
								}
							}, function (e) {
								console.log('geocode error', e)
							})

							function showResult(obj) {
								// Удаляем сообщение об ошибке, если найденный адрес совпадает с поисковым запросом.
								notice.css('display', 'none');

								var mapItem = $('#ymaps-with-input')
								var bounds = obj.properties.get('boundedBy')
								// Рассчитываем видимую область для текущего положения пользователя.
								var mapState = ymaps.util.bounds.getCenterAndZoom(
									bounds,
									[mapItem.width(), mapItem.height()]
								)
								// Убираем контролы с карты.
								mapState.controls = [];
								// Передвигаем карту по найденным координатам
								setPlacemarkCoords(mapState);
							}

							function showError(message) {
								notice.text(message).css('display', 'block');
							}

							function setPlacemarkCoords(state) {
								// выставляем новый центр карты и меняем позицию метки в соответствии с найденным адресом.
								mapObject.setCenter(state.center, state.zoom + 2);
							}
						}

						// обновить размер карты при ресайзе
						mapItem.off('updateSizeMap').on('updateSizeMap', function () {
							setTimeout(function () {
								mapObject.container.fitToViewport();
							})
						})

						// Добавим элемент управления FullscreenControl на карту, чтобы управлять им снаружи карты
						var fullscreenControl = new ymaps.control.FullscreenControl();
						mapObject.controls.add(fullscreenControl);

						// закрытие баллуна по кнопке внутри него
						doc.off('click.closeBallon').on('click.closeBallon', '.js-select-pharmacy', function (e) {
							mapObject.balloon.close()

							// переведем карту из «полноэкранный режим»
							fullscreenControl.exitFullscreen();

							View.control.closeAll()
							$.fancybox.close();
						})
					}
				})
			}
		}

		// ajax подгрузка при наличии параметра data-ajax с адресом файла блоков, параметры - (url, контейнер для выгрузки данных, контейнер локальной переинициализации, callback)
		this.ajaxLoad = function (ajaxUrl, ajaxContainerForData, containerForReInit, callback) {
			if (!ajaxContainerForData.prop('ajaxLoaded')) {
				$.get(ajaxUrl, function (data, status) {
					ajaxContainerForData.append(data)
					if (containerForReInit) View.initAllLocal(containerForReInit)
					if (status === 'success') {
						ajaxContainerForData.prop('ajaxLoaded', true)
						if (typeof callback === 'function') callback()
					} else {
						console.log('ajax error')
					}
				})
			} else {
				if (typeof callback === 'function') callback()
			}
		}

		// управление youtube iframe видео через его API
		this.callYuotubeIframePlayer = function (iframe, func, args) {
			// провека iframe на наличие youtube
			if (iframe && ~iframe.src.indexOf('youtube.com/embed')) {
				iframe.contentWindow.postMessage(JSON.stringify({
					'event': 'command',
					'func': func,
					'args': args || []
				}), '*');
			}
		}
		// запущеннно youtube iframe видео
		this.youtubeVideoPlayed = null

		// трансформация строки в camelCase стиль
		this.toCamelCase = function (str) {
			// Lower cases the string
			return str.toLowerCase()
				// Replaces any - or _ characters with a space
				.replace(/[-_]+/g, ' ')

				// Removes any non alphanumeric characters
				.replace(/[^\w\s]/g, '')

				// Uppercases the first character in each group immediately following a space
				// (delimited by spaces)
				.replace(/ (.)/g, function ($1) {
					return $1.toUpperCase();
				})
				// Removes spaces
				.replace(/ /g, '');
		}

		// инициализация основных параметров класса View
		this.initView = function () {
			this.scrollBarWidth = (function () {
				const outer = document.createElement('div');
				outer.style.visibility = 'hidden';
				outer.style.width = '100px';
				outer.style.msOverflowStyle = 'scrollbar';

				document.body.appendChild(outer);
				const widthNoScroll = outer.offsetWidth;
				// force scrollbars
				outer.style.overflow = 'scroll';
				// add innerdiv
				const inner = document.createElement('div');
				inner.style.width = '100%';
				outer.appendChild(inner);
				const widthWithScroll = inner.offsetWidth;
				// remove divs
				outer.parentNode.removeChild(outer);
				return widthNoScroll - widthWithScroll;
			})();
			(function haveScroll() {
				let timeout = null

				function winHaveScroll() {
					View.winHaveScroll = win.height() < doc.height()
				}

				win.off('resize.winHaveScroll').on('resize.winHaveScroll', function () {
					clearTimeout(timeout)
					timeout = setTimeout(winHaveScroll, 300)
				})
				win.trigger('resize.winHaveScroll');
			})();
			(function screenWidthIsAdaptive() {
				let timeout = null

				function getScreenWidth() {
					if (View.winHaveScroll) {
						View.screenSizeIsAdaptive = (win.width() + View.scrollBarWidth) <= 1024
					} else {
						View.screenSizeIsAdaptive = win.width() <= 1024
					}
				}

				win.off('resize.getScreenWidth').on('resize.getScreenWidth', function () {
					clearTimeout(timeout)
					timeout = setTimeout(getScreenWidth, 300)
				})
				getScreenWidth()
			})();
			(function setMobileAndTabletCheck() {
				let timeout = null

				function setAdaptiveCheck() {
					View.mobileAndTabletCheck = View.checkAdaptiveBrowser || View.screenSizeIsAdaptive
				}

				win.off('resize.setAdaptiveCheck').on('resize.setAdaptiveCheck', function () {
					clearTimeout(timeout)
					timeout = setTimeout(setAdaptiveCheck, 300)
				})
				setAdaptiveCheck()
			})();
		}

		// инициализация
		this.init = {
			// global - инициализируется 1 раз
			global: {
				favorites() {
					$('body').off('click.favorites', '.js-favorite').on('click.favorites', '.js-favorite', function (e) {
						var element = $(this);
						var id = element.data('product');
						if (element.hasClass('product-item__favorite--active')) {
							$.ajax({
								'url': window.location.pathname,
								'data': 'FAVORITE_DEL=' + id,
								'success': function (res) {
									var count = parseInt($('.js-favorite-header-count').text());
									if (count > 1) {
										count--;
									} else {
										count = 0;
									}
									$('.js-favorite-header-count').text(count);
									element.removeClass('product-item__favorite--active');
									if (element.parents('.catalog__cell').hasClass('isFavorites')) {
										element.parents('.catalog__cell').remove();
										if (!$('.catalog__cell').length) {
											window.location.reload();
										}
									}
								}
							});
						} else {
							$.ajax({
								'url': window.location.pathname,
								'data': 'FAVORITE_ADD=' + id,
								'success': function (res) {
									var count = parseInt($('.js-favorite-header-count').text());
									count++;
									$('.js-favorite-header-count').text(count);
									element.addClass('product-item__favorite--active');
								}
							});
						}
					});
				},

				// сворачивать в выпадашку пункты меню, если не влезают
				flexMenu() {
					if ($.fn.flexMenu) {
						var parents = $('.js-flex-menu')

						parents.each(function () {
							var parent = $(this)

							parent.flexMenu({
								linkText: 'Еще',
								linkTitle: 'Показать еще',
								linkTextAll: 'Меню',
								linkTitleAll: 'Показать меню',
								cutoff: 1,
								showOnHover: false,
								shouldApply: function () {
									return win.width() > 1024
								}
							})

							// обработка если открывается попап по клику
							var toggler = parent.find('.flexMenu-viewMore')
							var content = parent.find('.flexMenu-popup')

							toggler.off('click.flexMenu').on('click.flexMenu', function (event) {
								event.stopPropagation()

								parent.toggleClass('active', toggler.hasClass('active'))
							})

							doc.off('click.flexMenu').on('click.flexMenu', function () {
								parent.removeClass('active')
								toggler.removeClass('active')
								content.hide()
							})
						})
					}
				},

				// переключение скрытого блока по наведению с задержкой
				toggleDropdownHover() {
					var allParents = $('.js-dropdown--hover')
					var allContents = allParents.find('.js-dropdown__content')

					allParents.each(function (ind) {
						var parent = $(this)
						var content = parent.find('.js-dropdown__content')
						var toggler = parent.find('.js-dropdown__toggler')
						var timeout = null;

						// инициализации и закрытие при загрузке страницы
						content.click(function (event) {
							event.stopPropagation()
						})
						parent.addClass('init-dropdown')

						// переключение метода открытия для адаптива и десктопа
						function toggleDropdownHover() {
							if (View.mobileAndTabletCheck) {
								// открытие по клику
								togglerClick()

								// снятие ненужных обработчиков
								parent.off('mouseover.toggleDropdownHover')
								parent.off('mouseleave.toggleDropdownHover')
							} else {
								// обработка события прихода курсора на элемент
								parent.off('mouseover.toggleDropdownHover').on('mouseover.toggleDropdownHover', function (event) {
									event.preventDefault()
									event.stopPropagation()

									// переключение состояния
									clearTimeout(timeout);
									timeout = setTimeout(openDropdown, 100);
								})

								// обработка события ухода курсора с элемента
								parent.off('mouseleave.toggleDropdownHover').on('mouseleave.toggleDropdownHover', function (event) {
									event.preventDefault()
									event.stopPropagation()

									// переключение состояния
									clearTimeout(timeout);
									timeout = setTimeout(closeDropdown, 100);
								})
							}
						}

						function togglerClick() {
							toggler.off('click.toggleDropdownHover').on('click.toggleDropdownHover', function (event) {
								event.preventDefault()
								event.stopPropagation()

								if (!parent.hasClass('open-dropdown')) {
									// закрыть остальные блоки Dropdown
									allParents.not(parent).removeClass('open-dropdown')
									allContents.not(content).slideUp(300)

									openDropdown()
								} else {
									closeDropdown()
								}
							})
						}

						// открыть
						function openDropdown() {
							parent.addClass('open-dropdown')
							content.fadeIn(0)
						}

						// закрыть
						function closeDropdown() {
							parent.removeClass('open-dropdown')
							content.fadeOut(0)
						}

						win.off('resize.toggleDropdownHover' + ind).on('resize.toggleDropdownHover' + ind, function () {
							clearTimeout(timeout);
							timeout = setTimeout(toggleDropdownHover, 300);
						})

						win.trigger('resize.toggleDropdownHover' + ind);
					})

					View.init.global.toggleDropdownHover.closeAllDropdownHover = function () {
						// if (View.mobileAndTabletCheck) {
						allParents.removeClass('open-dropdown')
						allContents.fadeOut(0)
						// }
					}
				},

				// аякс подгрузка разметки в конец страницы
				ajaxLoadAppendBody() {
					var preloader = $('<div>').addClass('icon-preloader');

					$('.js-ajax-load-toggler').each(function () {
						var toggler = $(this)
						var url = toggler.data('ajaxUrl');

						toggler.off('click.ajaxLoad').on('click.ajaxLoad', function (event) {
							event.preventDefault();
							body.append(preloader);

							$.get(url).done(function (response) {
								var $response = $(response)
								body.append($response);
								preloader.remove();

								// реинициализация скриптов после аякса
								View.init.local.maskInputs($response)
								$('[data-parsley-validate]').parsley();

							}).fail(function (response) {
								preloader.remove();
								console.warn('offer: ajax load failed', response);
							});
						});
					})
				},

				// удаление элемента по клику (не требует переинициализации после ajax)
				removeItem() {
					doc.off('click.removeItem').on('click.removeItem', '.js-remove__btn', function () {
						$(this).closest('.js-remove').trigger('removeItem').remove()
					})
				},

				// меню с ховером и задержкой
				adaptiveHeightHoverMenu() {
					var allParents = $('.js-hover-menu')
					var timeout = null;

					function delayHoverMenu() {
						allParents.each(function () {
							var parent = $(this)
							var items = parent.find('.js-hover-menu__item')
							var subMenu = items.find('.js-hover-menu__submenu')

							if (!View.mobileAndTabletCheck) {
								// текущее положение курсора
								var nCurPosX;
								parent.mousemove(function (event) {
									return nCurPosX = event.clientX
								})

								items.each(function () {
									var curItem = $(this)

									// обработка прихода курсора на пункта меню
									curItem.off('mouseover.showInnerMenu').on('mouseover.showInnerMenu', function () {
										items.not(curItem).removeClass('hover').removeClass('active');
										curItem.addClass('hover');

										/* делаем задержку чтобы при случайном наведении на пункт подменю не показывалось */
										setTimeout(function () {

											/* если по истечению задержки мы все еще на том же пункт меню, значит показываем подменю */
											if (curItem.hasClass('hover')) {
												curItem.addClass('active')

												// установка высоты навигации в зависимости от высоты выпадющего меню
												var subMenu = curItem.find('.js-hover-menu__submenu')
												parent.css({minHeight: 0})
												parent.css({minHeight: subMenu.outerHeight()})
											}
										});
									});

									// обработка ухода курсора с пункта меню
									curItem.off('mouseout.hideInnerMenu').on('mouseout.hideInnerMenu', function () {
										var nPosXStart = nCurPosX
										// curItem.removeClass('hover');

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
				},

				// accordion only adaptive
				toggleAccordionOnlyAdaptive() {
					var timeout = null

					// accordion только для адаптива
					function toggleAccordionOnlyAdaptive() {
						var allParents = $('.js-accordion--adaptive')

						allParents.each(function () {
							var parent = $(this)
							var content = parent.find('.js-accordion__content')
							var toggler = parent.find('.js-accordion__toggler')
							var maxWidth = parseInt(parent.data('maxWidth'))
							maxWidth = View.winHaveScroll ? maxWidth - View.scrollBarWidth : maxWidth

							if (win.width() <= maxWidth) {
								// инициализация и закрытие всех аккордионов кроме тех что с классом open-accordion
								if (!parent.hasClass('open-accordion')) content.slideUp(0)
								parent.addClass('init-accordion')
								parent.removeClass('destroy-accordion')

								toggler.off('click.toggleAccordion').on('click.toggleAccordion', function (event) {
									event.stopPropagation()
									event.preventDefault()

									// View.control.closeAll(['closeAllAccordionAdaptive'])
									View.control.closeAll()

									parent.toggleClass('open-accordion')
									content.slideToggle(300)
								})
							} else {
								// accordion destroy
								parent.removeClass('init-accordion')
								parent.removeClass('open-accordion')
								parent.addClass('destroy-accordion')
								content.slideDown(0)

								toggler.off('click.toggleAccordion')
							}
						})

						// View.init.global.toggleAccordionOnlyAdaptive.closeAllAccordionAdaptive = function () {
						// 	allParents.removeClass('open-accordion')
						// 	allParents.find('.js-accordion__content').slideUp(300)
						// }
					}

					win.off('resize.toggleAccordionOnlyAdaptive')
						.on('resize.toggleAccordionOnlyAdaptive', function () {
							clearTimeout(timeout);
							timeout = setTimeout(toggleAccordionOnlyAdaptive, 300);
						})
						.trigger('resize.toggleAccordionOnlyAdaptive');
				},

				// переключение класса по наведению
				toggleClassByHover() {
					var allItems = $('.js-class-hover')
					var parent = $('.js-class-hover-parent')
					var timeout = null

					allItems.each(function () {
						var item = $(this)
						var itemClass = item.data('class')

						// обработка прихода курсора на элемента
						item.off('mouseenter.toggleClassByHover').on('mouseenter.toggleClassByHover', function () {
							clearTimeout(timeout)
							timeout = setTimeout(function () {
								if (!item.parents('.flexMenu-viewMore').length) {
									body.addClass(itemClass);
									item.addClass(itemClass);
								}
							}, 600)
						});

						// обработка ухода курсора с элемента
						item.off('mouseleave.toggleClassByHover').on('mouseleave.toggleClassByHover', function () {
							clearTimeout(timeout)
							timeout = setTimeout(function () {
								body.removeClass(itemClass);
								item.removeClass(itemClass);
							}, 600)
						})
					})

					// обработка ухода курсора со всего меню
					parent.off('mouseleave.toggleClassByHover').on('mouseleave.toggleClassByHover', function () {
						clearTimeout(timeout)
						var itemClass = parent.data('class')
						body.removeClass(itemClass);
					})
				},

				// мобильное меню каталога в гамбургере
				mobileMenu() {
					var $hamburgerMenuContainer = $('.js-hamburger-menu-container')
					var $hamburgerMenuAll = $('.js-hamburger-menu')
					var $hamburgerMenuTogglesAll = $hamburgerMenuAll.find('.js-hamburger-menu__link');

					$hamburgerMenuAll.each(function () {
						var $hamburgerMenu = $(this)
						var $hamburgerMenuToggles = $hamburgerMenu.find('.js-hamburger-menu__link');
						var $hamburgerSubLists = $hamburgerMenu.find('.js-hamburger-menu__sub-list')

						$hamburgerMenuToggles.off('click.hamburger').on('click.hamburger', function (e) {
							e.preventDefault();
							var $self = $(this);

							$hamburgerMenuContainer.scrollTop(0)
							$hamburgerSubLists.scrollTop(0)

							$hamburgerMenu.addClass('open');
							$self.addClass('open');
							$self.next('.js-hamburger-menu__sub-list')
								.find('.js-hamburger-menu__btn-back').off('click.hamburger').on('click.hamburger', function () {
								$self.removeClass('open');
							});
						});
					})

					// закрыть уровни мобильного меню каталога
					View.init.global.mobileMenu.closeAll = function () {
						$hamburgerMenuAll.removeClass('open');
						$hamburgerMenuTogglesAll.removeClass('open');
					}
				},

				// инициализация карусели (Swiper)
				initCarousel() {
					if (window.Swiper) {
						var timeout = null

						// инициализация слайдера если он в зоне видимости или приближается к ней (ближе 500рх) и до сих пор не инициализирован
						function initSwiper(elemJQ, optionSwiper) {
							if (!elemJQ.hasClass('swiper-container-initialized') && View.getVisibleElemOnScroll(elemJQ, 500)) {
								// переопределение параметров слайдера переданных в атрибуте компонента
								var options = elemJQ.data('options')
								if (options) {
									Object.keys(options).forEach((key) => {
										if (typeof options[key] !== 'undefined') {
											optionSwiper[key] = options[key];
										}
									});
								}
								console.log('options', optionSwiper)

								return new Swiper(elemJQ[0], optionSwiper)
							}
						}

						// добаления класса если ширины всех слайдов не достаточно для скролла
						function toggleClassSwiper(parent, widthAllItems) {
							parent.toggleClass('swiper-empty', 'parent.width() > widthAllItems')
						}

						// ******************************************************************************
						var optionSwiper = {
							autoHeight: true,
							// infinity scroll
							loop: true,

							// lazy load images
							watchSlidesVisibility: true,
							lazy: {
								loadPrevNext: true,
								loadOnTransitionStart: true,
							},

							navigation: {
								nextEl: '.swiper-button-next',
								prevEl: '.swiper-button-prev',
							},

							pagination: {
								el: '.swiper-pagination',
								type: 'bullets',
								clickable: true,
								// dynamicBullets: true,
								// dynamicMainBullets: 7,
							},
						}

						// одиночная карусель
						function initSingleSwiper() {
							initSwiper($('.js-carousel--main-banner'), optionSwiper)
						}

						win.off('scroll.initSingleSwiper').on('scroll.initSingleSwiper', initSingleSwiper)
						win.trigger('scroll.initSingleSwiper')


						// ******************************************************************************
						var optionSwiperArticles = {
							autoHeight: true,
							// infinity scroll
							loop: true,

							// lazy load images
							watchSlidesVisibility: true,
							lazy: {
								loadPrevNext: true,
								loadOnTransitionStart: true,
							},

							// Responsive breakpoints
							breakpoints: {
								320: {
									slidesPerView: 1,
									slidesPerGroup: 1,
									autoHeight: true,
									spaceBetween: 0,
								},
								450: {
									slidesPerView: 2,
									slidesPerGroup: 2,
									autoHeight: false,
									spaceBetween: 10,
								}
							},

							pagination: {
								el: '.swiper-pagination',
								type: 'bullets',
								clickable: true,
								// dynamicBullets: true,
								// dynamicMainBullets: 7,
							},
						}

						// одиночная карусель
						function initSingleSwiperArticles() {
							initSwiper($('.js-carousel--articles'), optionSwiperArticles)
						}

						win.off('scroll.initSingleSwiperArticles').on('scroll.initSingleSwiperArticles', initSingleSwiperArticles)
						win.trigger('scroll.initSingleSwiperArticles')

						// *******************************************************************************

						// повторяющаяся карусель
						var optionSwiperRepeat = {
							// Разрешить отпускать сенсорные события в положении края ползунка (начало, конец)
							touchReleaseOnEdges: true,

							// lazy load images
							watchSlidesVisibility: true,
							lazy: {
								loadPrevNext: true,
								loadOnTransitionStart: true,
							},

							// infinity scroll
							// loop: true,
							// loopedSlides: 5,
							// loopAdditionalSlides: 5,

							// инертность свайпа слайдов
							// freeMode: true,
							// freeModeSticky: true,

							// Responsive breakpoints
							breakpoints: {
								320: {
									slidesPerView: 1,
									slidesPerGroup: 1,
									// autoHeight: true,
									spaceBetween: 0,
									pagination: {
										dynamicBullets: true,
										dynamicMainBullets: 7,
									},
								},
								430: {
									slidesPerView: 2,
									slidesPerGroup: 2,
									spaceBetween: 20,
									pagination: {
										dynamicBullets: false,
									},
								},
								645: {
									slidesPerView: 3,
									slidesPerGroup: 3,
									spaceBetween: 20,
									pagination: {
										dynamicBullets: false,
									},
								},
								880: {
									slidesPerView: 4,
									slidesPerGroup: 4,
									spaceBetween: 20,
									pagination: {
										dynamicBullets: false,
									},
								},
								1025: {
									slidesPerView: 4,
									slidesPerGroup: 4,
									spaceBetween: -32,
									pagination: {
										dynamicBullets: false,
									},
								},
								1220: {
									slidesPerView: 5,
									slidesPerGroup: 5,
									spaceBetween: -32,
									pagination: {
										dynamicBullets: false,
									},
								},
							},

							navigation: {
								nextEl: '.swiper-button-next',
								prevEl: '.swiper-button-prev',
							},

							pagination: {
								el: '.swiper-pagination',
								type: 'bullets',
								clickable: true,
								dynamicBullets: false,
							},

							on: {
								breakpoint: function (swiper) {
									if (swiper.params.pagination.dynamicBullets) {
										swiper.pagination.init()
									} else {
										setTimeout(function () {
											swiper.pagination.el.style.width = '100%'
											swiper.pagination.el.classList.remove('swiper-pagination-bullets-dynamic')
										})
									}
								},
							}
						}
						$('.js-carousel--repeat').each(function (ind) {
							var carouselElemJQ = $(this)

							function initSwiper_repeat() {
								initSwiper(carouselElemJQ, optionSwiperRepeat)
							}

							win.off('scroll.initSwiper_repeat_' + ind).on('scroll.initSwiper_repeat_' + ind, initSwiper_repeat)
							win.trigger('scroll.initSwiper_repeat_' + ind)
						})

						// *******************************************************************************

						// повторяющаяся карусель в скрытых табах
						var optionSwiperRepeatTabs = {
							// lazy load images
							watchSlidesVisibility: true,
							lazy: {
								loadPrevNext: true,
								loadOnTransitionStart: true,
							},

							// если родительский контейнер не виден (display none)
							observer: true,
							observeParents: true,

							// infinity scroll
							// loop: true,
							// loopedSlides: 5,
							// loopAdditionalSlides: 5,

							// инертность свайпа слайдов
							// freeMode: true,
							// freeModeSticky: true,

							// Responsive breakpoints
							breakpoints: {
								320: {
									slidesPerView: 1,
									slidesPerGroup: 1,
									// autoHeight: true,
									spaceBetween: 0,
									pagination: {
										dynamicBullets: true,
										dynamicMainBullets: 7,
									},
								},
								430: {
									slidesPerView: 2,
									slidesPerGroup: 2,
									spaceBetween: 20,
									pagination: {
										dynamicBullets: false,
									},
								},
								645: {
									slidesPerView: 3,
									slidesPerGroup: 3,
									spaceBetween: 20,
									pagination: {
										dynamicBullets: false,
									},
								},
								880: {
									slidesPerView: 4,
									slidesPerGroup: 4,
									spaceBetween: 20,
									pagination: {
										dynamicBullets: false,
									},
								},
								1025: {
									slidesPerView: 4,
									slidesPerGroup: 4,
									spaceBetween: -32,
									pagination: {
										dynamicBullets: false,
									},
								},
								1220: {
									slidesPerView: 5,
									slidesPerGroup: 5,
									spaceBetween: -32,
									pagination: {
										dynamicBullets: false,
									},
								},
							},

							navigation: {
								nextEl: '.swiper-button-next',
								prevEl: '.swiper-button-prev',
							},

							pagination: {
								el: '.swiper-pagination',
								type: 'bullets',
								clickable: true,
								dynamicBullets: false,
							},

							on: {
								// переключение динамических (прятающихся) буллетов на разных брэйкпойнтах
								breakpoint: function (swiper) {
									if (swiper.params.pagination.dynamicBullets) {
										swiper.pagination.init()
									} else {
										setTimeout(function () {
											swiper.pagination.el.style.width = '100%'
											swiper.pagination.el.classList.remove('swiper-pagination-bullets-dynamic')
										})
									}
								},
							}
						}
						$('.js-carousel--repeat-tabs').each(function (ind) {
							var carouselElemJQ = $(this)

							function initSwiper_repeat() {
								initSwiper(carouselElemJQ, optionSwiperRepeatTabs)
							}

							win.off('scroll.initSwiper_repeat_' + ind).on('scroll.initSwiper_repeat_' + ind, initSwiper_repeat)
							win.trigger('scroll.initSwiper_repeat_' + ind)
						})

						//	******************************************************************************

						// карусель с навигацией
						var navCarousel = initSwiper($('.js-carousel-w-nav--navigation'), {
							direction: 'vertical',
							spaceBetween: 12,
							slidesPerView: 5,

							// lazy load images
							watchSlidesProgress: true,
							watchSlidesVisibility: true,
							lazy: {
								loadPrevNext: true,
								loadOnTransitionStart: true,
							},

							// Responsive breakpoints
							breakpoints: {
								310: {
									slidesPerView: 4,
									direction: 'horizontal',
								},
								400: {
									slidesPerView: 5,
									direction: 'horizontal',
								},
								600: {
									slidesPerView: 5,
									direction: 'vertical',
								},
							},
						})
						initSwiper($('.js-carousel-w-nav--main'), {
							effect: 'fade',

							// infinity scroll
							// loop: true,

							// lazy load images
							lazy: {
								loadPrevNext: true,
								loadOnTransitionStart: true,
							},

							thumbs: {
								swiper: navCarousel
							},

							navigation: {
								nextEl: '.js-swiper-w-nav-button-next',
								prevEl: '.js-swiper-w-nav-button-prev',
							},

							on: {
								slideChangeTransitionEnd: function () {
									// остановка предыдущего видео youtube iframe при его наличии
									if (View.youtubeVideoPlayed) {
										View.callYuotubeIframePlayer(View.youtubeVideoPlayed, 'pauseVideo')
									}
									// запуск видео youtube iframe в слайде
									View.youtubeVideoPlayed = $(this.slides).filter('.swiper-slide-active').find('iframe')[0]
									View.callYuotubeIframePlayer(View.youtubeVideoPlayed, 'playVideo')
								},
							}
						})
					}
				},

				// подскролл страницы в начала по клику на кнопку
				scrollTop() {
					var btn = $('.js-scroll-top')

					View.showElemAfterScroll(btn, win.height())

					btn.off('click.scrollTop').on('click.scrollTop', function (event) {
						event.preventDefault()
						htmlbody.animate({scrollTop: 0}, 400)
					})
				},

				// фиксация блока при скролле страницы
				fixedBlockWhenScrolling() {
					$('.js-fixed--up').each(function (index) {
						var block = $(this)
						var content = block.find('.js-fixed__content')
						var blockHeight = content.outerHeight()
						var blockStart = block.offset().top
						var doc = $(document)

						function fixedBlockWhenScrolling() {
							var docScroll = doc.scrollTop()

							// фиксация блока
							if (!block.hasClass('active-fixed') && blockStart <= docScroll) {
								doc.addClass('active-fixed')
								block.addClass('active-fixed').css('padding-top', blockHeight)
							} else if (block.hasClass('active-fixed') && blockStart > docScroll) {
								// отмена фиксации блока
								doc.removeClass('active-fixed')
								block.removeClass('active-fixed')
								// block.removeClass('active-fixed').css('padding-top', 0)
							}
						}

						block.css('padding-top', blockHeight).addClass('init-fixed')
						fixedBlockWhenScrolling()

						// инициализаци с индексом на случай множественных блоков для фиксации
						win.off('resize.fixedBlockWhenScrolling' + index)
							.on('resize.fixedBlockWhenScrolling' + index, function () {
								blockHeight = content.outerHeight()
								blockStart = block.offset().top
								block.css('padding-top', blockHeight)

								if (requestAnimationFrame) requestAnimationFrame(fixedBlockWhenScrolling)
								else fixedBlockWhenScrolling();
							})
						doc.off('scroll.fixedBlockWhenScrolling' + index)
							.on('scroll.fixedBlockWhenScrolling' + index, function () {
								if (requestAnimationFrame) requestAnimationFrame(fixedBlockWhenScrolling)
								else fixedBlockWhenScrolling();
							})
					})
				},

				// сворачивание лишних пунктов меню в аккордион с кнопкой "еще"
				collapsibleMenu() {
					$('.js-collapsible').each(function () {
						var parent = $(this)
						var items = parent.find('.js-collapsible__item')
						var quantity = parent.data('collapsible')

						// если елементов больше разрешенных и родитель не имеет класса инициализации свернуть лишние элементы в аккордион
						if (items.length > quantity && !parent.hasClass('init-collapsible')) {
							parent.addClass('init-collapsible')

							// добавление разметки для аккордионов
							var accordion = $('<div class="js-accordion"><div class="collapsible-menu__toggler  js-accordion__toggler">Еще <span>' + (items.length - quantity) + '</span></div></div>')
							var accordionContent = $('<div class="js-accordion__content"></div>')

							// пробегаем по всем элементам перенося лишние в аккордион
							items.each(function (index) {
								if (index + 1 > quantity) {
									accordionContent.append($(this))
								}
							})

							// вставляем и инициализируем итоговый аккордион в родитель
							accordion.append(accordionContent)
							parent.append(accordion)
							View.init.local.toggleAccordion()
						}
					})
				},

				// обрезка длинного текста точками
				clipText() {
					if ($.fn.dotdotdot && !View.isIE) {
						$('.js-dots-text').dotdotdot({
							ellipsis: '...',
							wrap: 'letter',
							fallbackToLetter: false,
							after: '',
							watch: window,
							height: null,
							tolerance: 0,
							callback: function (isTruncated, orgContent) {
							},
							lastCharacter: {
								remove: [' ', ',', ';', '.', '!', '?'],
								noEllipsis: []
							}
						});
					}
				},

				// поля для промежутка цены в фильтре
				setRangeInputs() {
					$('.js-range').each(function () {
						var parent = $(this)
						var inputs = parent.find('.js-range__input')

						inputs.off('keyup')
					})
				},

				// скролл к блоку по ссылке
				scrollToBlock() {
					$('.js-scroll-to').each(function () {
						var _this = $(this)

						_this.off('click.scrollToBlock').on('click.scrollToBlock', function (event) {
							event.preventDefault()

							// величина недоезда блока до верха в атрибуте ссылки
							var offset = $(_this).data('offset') || 0
							// ID блока до, которого скролить
							var block = $(_this.attr('href'))
							if (block.length) {
								var positionBlock = block.offset().top - offset

								$([document.documentElement, document.body]).animate({scrollTop: positionBlock}, 400)
							}
						})
					})
				},

				// блокировать всплытие события скролла на элементе
				lockScroll() {
					if ($.fn.scrollLock) {
						$('.js-lock-scroll').scrollLock({
							unblock: '.js-lock-scroll__unlock'
						});
					}
				},

				// поведение попапов
				initPopups() {
					if ($.fn.fancybox) {
						var popups = $('[data-fancybox]')

						if (popups.length) {
							popups.fancybox({
								hash: false,

								// кнопки на панели
								buttons: [
									// 'zoom',
									// 'share',
									'slideShow',
									'fullScreen',
									// 'download',
									'thumbs',
									'close'
								],

								// панель миниатюр
								thumbs: {
									autoStart: true
								},

								ajax: {
									// Object containing settings for ajax request
									settings: {
										transitionEffect: false,
										// This helps to indicate that request comes from the modal
										// Feel free to change naming
										data: {
											transitionEffect: false
										}
									}
								},
								beforeShow: function () {
									// компенсация скролла
									body.css({paddingRight: View.scrollBarWidth + 'px'})
								},
								// переинициализация скриптов в попапе
								afterShow: function (instance, slide) {
									setTimeout(function () {
										View.initAllLocal(instance.current.$content)

										instance.current.$content.find('.js-close-all').off('click.closePopup').on('click.closePopup', function (e) {
											$.fancybox.close();
										})

										// при наличии атрибута инициализирует карту в попапе
										setTimeout(function () {
											if (instance.$trigger.attr('data-map')) {
												if (window.ymaps && window.ymaps.Map) {
													View.initMaps()
												} else {
													View.init.global.initMapsDelayScroll()
												}
											}
										})
									})
								},
								afterClose: function () {
									body.css({paddingRight: 0})
									View.initAllGlobal();
								}
							});
						}

						// закрыть попап по кнопке на всплатии
						$(document).off('click.closePopup').on('click.closePopup', '.js-close-popup', function () {
							$.fancybox.close();
						})
					}
				},

				// повесить класс, если хотябы один чекбокс отмечен
				checkAnyCheckbox() {
					$('.js-check-any').each(function () {
						var parent = $(this)
						var toggler = parent.find('.js-check-any__toggler')
						var checkboxes = parent.find('.js-check-any__checkbox')

						checkboxes.off('change.checkAnyCheckbox').on('change.checkAnyCheckbox', function () {
							if (Array.from(checkboxes).some((elem) => $(elem).prop('checked'))) {
								parent.addClass('active')
								toggler.addClass('active')
							} else {
								parent.removeClass('active')
								toggler.removeClass('active')
							}
						})
					})
				},

				// инициализация позиционирования, не выходящего за контентную область
				tooltipPosition() {
					var tooltips;
					var delta;
					var i;
					var containerPadding;
					var timeout = null;

					// вычисление положения
					View.init.global.tooltipPosition.calcPosition = function () {
						tooltips = $('.js-tooltip-position');
						tooltips.css('marginLeft', '');

						// ширина паддинга контейнера страницы
						containerPadding = window.innerWidth > View.breakpoints['xs-max'] ? 20 : 10;
						containerPadding = window.innerWidth > View.breakpoints['sm-max'] ? 20 : containerPadding;

						for (i = 0; i < tooltips.length; i++) {
							// насколько выступает правый край выпадашки за границы контейнера страницы
							delta = tooltips[i].getBoundingClientRect().left + tooltips[i].offsetWidth -
								Math.min((window.innerWidth - View.scrollBarWidth - containerPadding), (window.innerWidth - View.scrollBarWidth) / 2 + 720);

							if (delta > 1) {
								// сдвиг выпадашки, если она выступает
								tooltips[i].style.marginLeft = ((parseInt(tooltips[i].style.marginLeft) || 0) - delta) + 'px';
							}
						}
					}

					win.off('resize.setTooltipPositions').on('resize.setTooltipPositions', function () {
						clearTimeout(timeout);

						timeout = setTimeout(View.init.global.tooltipPosition.calcPosition, 300);
					}).trigger('resize.setTooltipPositions');
				},

				// триггер клика по другому или одновременно нескольким элементам
				triggerClick() {
					var allSenders = $('.js-trigger-click__sender')
					var allRecipients = $('.js-trigger-click__recipient')

					allSenders.each(function () {
						var sender = $(this)
						// массив из ID отправителя для связывания триггеров со своими приемщиками
						var triggerIdArr = (sender.data('triggerId')) ? String(sender.data('triggerId')).split(',') : false

						// обработка клика отправителя триггера
						sender.off('click.triggerClick').on('click.triggerClick', function (event) {
							event.stopPropagation()
							event.preventDefault()

							if (triggerIdArr) {
								// перебор масива приемщиков триггеров
								allRecipients.each(function () {
									const recipient = $(this)

									// инициализация клика при совпадении ID отправителя и приемщика
									if (~triggerIdArr.indexOf(String(recipient.data('triggerId')))) recipient.trigger('click')
								})
							}
						})
					})
				},

				// анимация чисел
				animateDigits() {
					if ($.fn.spincrement) {
						function animateDigits() {
							$('.js-animate-digits').each(function () {
								var _this = $(this)

								if (_this.offset().top < win.height() + win.scrollTop() - 50 && !_this.hasClass('animated')) {
									// защита от повторной анимации
									_this.addClass('animated')

									// фиксация ширины во время анимации
									var width = _this.outerWidth()
									_this.css({display: 'inline-block', width: width, whiteSpace: 'nowrap'})

									// инициализация анимации
									_this.spincrement({
										thousandSeparator: ' ',
										duration: 2000,
										to: parseInt(_this.text().replace(/\s/, '')),
									})

									// сбросс ширины
									setTimeout(function () {
										_this.removeAttr('style')
									}, 3000)
								}
							})
						}

						win.off('scroll.animateDigits').on('scroll.animateDigits', animateDigits)
						win.trigger('scroll.animateDigits')
					}
				},

				// отложенная инициализация яндекс карт по скроллу
				initMapsDelayScroll() {
					$('.js-map').each(function () {
						var map = $(this)
						var timeout = null

						function initMaps() {
							console.log('initMapsDelayScroll', View.loadYandexApi)
							// инициализируем если карта еще не инициализировалась
							View.loadDelayScript('https://api-maps.yandex.ru/2.1.73/?apikey=93e7d8c8-9ed1-495c-812f-da7e87965be9&lang=ru_RU&onLoad=View.initMaps')
						}

						// запус инициализации если карта в зоне видимости или приближается к ней
						win.off('scroll.initMapsScroll').on('scroll.initMapsScroll', function () {
							// clearTimeout(timeout)
							// timeout = setTimeout(function () {
							if (View.getVisibleElemOnScroll(map, 500)) initMaps()
							// }, 10000)
						})
						win.trigger('scroll.initMapsScroll')
					})
				},

				// закрыть все что открывается по клику на странице и при ее ресайзе
				closeAll() {
					// body.add('.js-close-all').off('click.closeAll').on('click.closeAll', function (e) {
					$('.js-close-all').off('click.closeAll').on('click.closeAll', function (e) {
						View.control.closeAll()
						$.fancybox.close();
					})
					doc.off('click.closeAll').on('click.closeAll', '.js-close-all', function (e) {
						View.control.closeAll()
						$.fancybox.close();
					})
					if (View.mobileAndTabletCheck) {
						$('.js-close-all-hover').off('click.closeAll').on('click.closeAll', function (e) {
							View.control.closeAll()
							// View.init.local.toggleClassBlock.closeAllClassBlocks()
							// View.init.local.toggleClassPage.closeAllClassPage()
						})
					} else {
						$('.js-close-all-hover').off('mouseover.closeAll').on('mouseover.closeAll', function (e) {
							View.control.closeAll()
							// View.init.local.toggleClassBlock.closeAllClassBlocks()
							// View.init.local.toggleClassPage.closeAllClassPage()
						})
					}
					// закрыте по клику в теле страницы
					body.off('click.closeAll').on('click.closeAll', function (e) {
						if (View.mobileAndTabletCheck) {
							View.control.closeAll(['closeAllClassBlocks', 'closeAllClassPage'])
						} else {
							View.control.closeAll(['closeAllClassBlocks', 'closeAllClassPage'])
						}
					})
					win.off('resize.closeAll').on('resize.closeAll', function () {
						if (!View.mobileAndTabletCheck) View.control.closeAll();
					});
				},
			},
			// local - требует переинициализации после перезагрузки DOM
			local: {
				// отложенная загрузка изображений
				lazyLoad(scope) {
					if ($.fn.Lazy) {
						View.init.local.lazyLoad.instance = $('.js-lazy[data-src]', scope).Lazy({
							chainable: false,
							visibleOnly: true,
							effect: 'fadeIn',
							threshold: 250,
							placeholder: View.imageLoaderBase64,

							// стили фона прелоадера для элементов не являющимися картинками
							beforeLoad: function (element) {
								if (element[0].tagName !== 'IMG') {
									element.css({backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '42px'})
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
								win.trigger('lazyImagesLoaded')
							},
						})
					}
				},

				// фильтрация элементов по клику на переключатели
				filterItems() {
					$('.js-filter-items').each(function () {
						var parent = $(this)
						var toggles = parent.find('.js-filter-items__toggle')
						var select = parent.find('.js-filter-items__select')
						var items = parent.find('.js-filter-items__item')

						// инициализация предустаноленного индекса
						filterItems(parent.attr('data-index'))
						parent.addClass('init-filter-items')

						// обработка переключения
						toggles.off('click.filterItems').on('click.filterItems', function () {
							var toggle = $(this)

							filterItems(toggle.attr('data-index'))
						})

						// обработка переключения
						select.off('change.filterItems').on('change.filterItems', function () {
							var select = $(this)

							filterItems(String(select.val()))
						})

						// перелючение активных элементов
						function filterItems(activeIndex) {
							toggles.removeClass('active-toggle').filter('[data-index=' + activeIndex + ']').addClass('active-toggle')


							items.each(function () {
								var item = $(this)

								if (~item.data('index').split(';').indexOf(activeIndex)) {
									item.show()
									item.addClass('active-item')
								} else {
									item.hide()
									item.removeClass('active-item')
								}
							})

							// обновление lazyload картинок внутри
							if (View.init.local.lazyLoad.instance) View.init.local.lazyLoad.instance.update()
						}
					})
				},

				// переключение класса по клику
				toggleClassBlock(scope) {
					var allParents = $('.js-class', scope)
					var allClass = []

					allParents.each(function () {
						var parent = $(this)
						// кастомный класс для переключения либо дефолтный
						var activeClass = parent.data('class') || 'active-class'
						allClass.push(activeClass)

						parent.click(function (event) {
							event.stopPropagation()
						})
						parent.find('.js-class__toggler').off('click.toggleClass').on('click.toggleClass', function (event) {
							event.stopPropagation()
							event.preventDefault()
							View.control.closeAll(['closeAllClassBlocks', 'closeAllClassPage'])

							if (!parent.hasClass(activeClass)) {
								body.addClass(activeClass)
								parent.addClass(activeClass)

								// обновление lazyload картинок внутри таба
								View.init.local.lazyLoad()

								// показ первого сабменю при открытиии каталога
								if (!View.mobileAndTabletCheck && parent.hasClass('open-catalog')) {
									$('.js-hover-menu__item').first().triggerHandler('mouseover.showInnerMenu')
									htmlbody.animate({scrollTop: 0}, 400)
								}
							} else {
								body.removeClass(activeClass)
								parent.removeClass(activeClass)
							}
						})
					})

					// закрыть все блоки
					View.init.local.toggleClassBlock.closeAllClassBlocks = function () {
						allClass.forEach(function (classSelector) {
							body.removeClass(classSelector)
							allParents.removeClass(classSelector)
						})
					}
				},

				// переключение по кнопке класса страницы
				toggleClassPage(scope) {
					var allTogglers = $('.js-toggle-class-page', scope)

					allTogglers.each(function () {
						var _this = $(this)
						var itemClass = _this.data('class')

						_this.off('click.toggleClassPage').on('click.toggleClassPage', function (e) {
							e.preventDefault()
							e.stopPropagation()

							setTimeout(function () {
								View.allClassPage.push(itemClass)
								body.toggleClass(itemClass, !body.hasClass(itemClass))
							})
						})
					})

					View.init.local.toggleClassPage.closeAllClassPage = function () {
						View.allClassPage.forEach(function (item) {
							body.removeClass(item)
						})
					}
				},

				// поисковая строка в шапке
				showSearch(scope) {
					$('.js-search', scope).each(function () {
						var form = $(this)
						var content = form.find('.js-search__content')
						var input = form.find('.js-search__input')
						var close = form.find('.js-search__close')
						var url = form.attr('action')
						var timeout = null

						input.off('keyup.showSearch').on('keyup.showSearch', input, function (event) {
							clearTimeout(timeout)
							console.log('keyup.showSearch', input.val())

							if (event.key === 'Escape') {
								event.stopPropagation()
								View.init.local.showSearch.closeSearch();
								return
							}
							timeout = setTimeout(function () {
								if (input.val().length >= 3) {
									$.ajax({
										'url': '/search/?' + form.serialize(),
										'success': function (data) {
											console.log('success search')
											content
												.html($('.js-search__content', data).html())
												.slideDown(300);
											form.addClass('show-search')
											body.addClass('show-search')

											View.initAllLocal(form);
										}
									});
								}
							}, 600)
						})

						$(document).off('click.closeSearch').on('click.closeSearch', function (event) {
							if (!form.closest($(event.target)).length && input.val().length >= 1) {
								View.init.local.showSearch.closeSearch()
							}
						});

						form.off('submit.showSearch').on('submit.showSearch', function (event) {
							if (input.val().length >= 3) {
								window.location.href = '/search/?q=' + input.val()
							}
						})

						View.init.local.showSearch.closeSearch = function () {
							body.removeClass('show-search')
							form.removeClass('show-search')
							form.find('.js-search__content').slideUp(300)
							form.find('.js-search__content').html('')
							input.val('')
						}

						form.off('click.showSearch').on('click.showSearch', function (event) {
							event.stopPropagation()

							View.control.closeAll('closeSearch')
						});

						close.off('click.closeSearch').on('click.closeSearch', function (e) {
							e.stopPropagation()

							View.init.local.showSearch.closeSearch()
						})
					})
				},

				// accordion group
				toggleAccordionGroup(scope) {
					$('.js-accordion--group', scope).each(function () {
						var allAccordions = $(this).find('.js-accordion__item')
						var allContents = allAccordions.find('.js-accordion__content')

						allAccordions.each(function () {
							var accordion = $(this)
							var content = accordion.find('.js-accordion__content')

							// инициализация и закрытие всех аккордионов кроме тех что с классом open-accordion
							if (!accordion.hasClass('open-accordion')) content.slideUp(0)
							accordion.addClass('init-accordion')

							// переключение состояния аккордиона по клику
							accordion.find('.js-accordion__toggler').off('click.toggleAccordion').on('click.toggleAccordion', function (event) {
								event.stopPropagation()
								event.preventDefault()

								closeOtherAccordions()

								// переключение состояния аккордиона
								accordion.toggleClass('open-accordion')
								content.slideToggle(300)

								setTimeout(function () {
									// обновление lazyload картинок внутри
									View.init.local.lazyLoad.instance.update()
								})
							})

							// закрытие остальных аккардионов в группе
							function closeOtherAccordions() {
								allAccordions.not(accordion).removeClass('open-accordion')
								allContents.not(content).slideUp(300)
							}
						})
					})
				},

				// одноуровневые выпадающие селекты
				toggleSelect(scope) {
					var allParents = $('.js-select', scope)
					var allContents = allParents.find('.js-select__content')

					allParents.each(function () {
						var parent = $(this)
						var toggler = parent.find('.js-select__toggler')
						var content = parent.find('.js-select__content')
						var listItems = parent.find('.js-select__item')
						var input = parent.find('.js-select__value')

						// инициализации и закрытие селекта при загрузке страницы
						content.fadeOut(0)
						parent.addClass('init-select')

						// инициализация предустановленного значения селекта
						var initValue = parent.attr('data-init-value')
						if (initValue.length) {
							listItems.each(function () {
								var listItem = $(this)
								if (listItem.attr('data-value') === initValue) {
									listItem.addClass('selected')
									toggler.addClass('selected').html(listItem.html())
									input.val(initValue).trigger('change').trigger('input')
								}
							})
						}

						// открытие по клику
						toggler.off('click.toggleSelect').on('click.toggleSelect', function (event) {
							event.stopPropagation()
							event.preventDefault()

							// селект заблокирован при наличии класса
							if (toggler.hasClass('disabled')) return

							if (!parent.hasClass('open-select')) {
								View.control.closeAll()
								openSelect()
							} else {
								closeSelect()
							}
						})

						// клик для выбора елемента option
						listItems.off('click.setSelectOption').on('click.setSelectOption', function (event) {
							event.stopPropagation()
							var item = $(this)
							var itemValue = item.attr('data-value')

							closeSelect()
							if (itemValue === 'reset') {
								listItems.removeClass('selected')
								toggler.removeClass('selected').html(toggler.data('reset'))
								parent.attr('data-value', '')
							} else {
								listItems.removeClass('selected')
								item.addClass('selected')
								toggler.addClass('selected').html(item.html())
								parent.attr('data-value', itemValue)
							}

							// триггер события и установка выбранного значения на скрытом поле
							input.val(item.attr('data-value')).trigger('change').trigger('input')
						})

						// открытие селекта
						function openSelect() {
							content.fadeIn(100)
							parent.addClass('open-select')
						}

						// закрытие селекта
						function closeSelect() {
							content.fadeOut(100)
							parent.removeClass('open-select')
						}
					})

					// закрыть все селекты
					View.init.local.toggleSelect.closeAllSelect = function () {
						allParents.removeClass('open-select')
						allContents.fadeOut(100)
					}
				},

				// сворачивание больших текстов по кнопке
				clippedText(scope) {
					$('.js-clipped', scope).each(function (ind) {
						var parent = $(this)
						var content = parent.find('.js-clipped__content')
						var toggler = parent.find('.js-clipped__toggler')
						var timeout = null;
						var textInit = content.html()
						// высота текста из атрибута или дефолтная, которую стоит сворачивать
						var clippedHeight = parent.data('clippedHeight') || 100
						// колличество символов для показа сокращенной версии
						var clippedSymbols = parent.data('clippedSymbols')

						var winWidth = null

						function clippedText() {
							winWidth = win.width()

							// сбросс высоты контента
							parent.removeClass('init-clipped')
							content.css({maxHeight: ''})

							// если указано ограничение сокращенной версии по символам то высоту берем по их размеру высоты
							if (clippedSymbols) {
								content.text(content.text().substr(0, clippedSymbols))
								clippedHeight = content.outerHeight()
								content.html(textInit)
							}

							// изначальная высота блока с текстом
							var initialHeightContent = content.outerHeight()

							// инициализация плагина, если длинна текста больше допустимой
							if (initialHeightContent > clippedHeight) {
								parent.addClass('init-clipped')
								close()

								// переключение сворачивания контента
								toggler.off('click.clippedText').on('click.clippedText', function () {
									if (parent.hasClass('open-clipped')) {
										close()
									} else {
										parent.addClass('open-clipped')
										content.css({maxHeight: initialHeightContent})
									}
								})
							} else {
								toggler.off('click.clippedText')
							}
						}

						// закрыть выпадашку
						function close() {
							parent.removeClass('open-clipped')
							content.css({maxHeight: clippedHeight})
						}

						win.off('resize.clippedText' + ind).on('resize.clippedText' + ind, function () {
							clearTimeout(timeout);
							timeout = setTimeout(function () {
								if (winWidth != win.width()) {
									clippedText()
								}
							}, 300);
						})

						win.trigger('resize.clippedText' + ind);
					})
				},

				// переключение контента аяксом
				toggleAjax(scope) {
					$('.js-toggle-ajax', scope).each(function () {
						var parent = $(this)
						var toggles = parent.find('.js-toggle-ajax__toggle')
						var toggles_2 = parent.find('.js-toggle-ajax__toggle-2')
						var select = parent.find('.js-toggle-ajax__select')
						var content = parent.find('.js-toggle-ajax__content')
						var preloader = $('<div>').addClass('icon-preloader')

						function toggleAjax(url) {
							body.append(preloader)

							$.get(url)
								.done(function (response) {
									console.log('ajax success')

									content.html(response)

									content.find('[data-parsley-validate]').parsley();

									View.init.global.initMapsDelayScroll()
									View.initAllLocal(parent.parent())

									setTimeout(function () {
										preloader.remove()
									}, 300)
								})
								.fail(function (response) {
									console.warn('offer: ajax load failed', response)

									setTimeout(function () {
										preloader.remove()
									}, 300)
								})
						}

						// обработка переключения
						toggles.off('click.toggleAjax').on('click.toggleAjax', function (e) {
							e.preventDefault()
							var toggle = $(this)
							toggles.removeClass('active-ajax')
							toggle.addClass('active-ajax')

							if (toggle.hasClass('pagination__link')) {
								htmlbody.animate({scrollTop: 0}, 400)
							}
							toggleAjax(toggle.data('url'))
						})

						// обработка переключения
						toggles_2.off('click.toggleAjax').on('click.toggleAjax', function (e) {
							e.preventDefault()
							var toggle = $(this)
							toggles_2.removeClass('active-ajax')
							toggle.addClass('active-ajax')

							toggleAjax(toggle.data('url'))
						})

						// обработка переключения
						select.off('change.toggleAjax').on('change.toggleAjax', function () {
							toggleAjax(select.val())
						})
					})
				},

				// валидация форм
				validateForm(scope) {
					if ($.fn.parsley) {
						$('[data-parsley-validate]', scope).parsley()

						// обработка валидации поля с ощибкой
						window.Parsley.off('field:error').on('field:error', function () {
							this.$element.closest('.js-field').addClass('field--error')
						});

						// обработка успешной валидации поля
						window.Parsley.off('field:success').on('field:success', function () {
							this.$element.closest('.js-field').removeClass('field--error')
						});

						// валидация ввода для поля
						$('input[type=email]').off('keypress.email').on('keypress.email', function (e) {
							var reg = /[а-яА-ЯёЁ]/g;

							if (e.key.search(reg) != -1) {
								e.preventDefault()
								return false
							}
						})
					}
				},

				// всплывающая подсказка
				initTooltip(scope) {
					if ($.fn.tooltipster) {
						var activeInstance = null

						$('.js-tooltip', scope).each(function () {
							var tooltip = $(this)
							var attrOptions = tooltip.data('options')
							var options = {
								// «top», «bottom», «left», «right». Это также может быть массив ['top', 'bottom', 'right', 'left']
								side: 'top',
								trigger: 'click',
								// возможность взаимодействовать с содержимим всплывашки
								interactive: true,
								theme: 'tooltipster-shadow',
								// отступ от переключателя
								distance: 5,
								// минимальный отступ от выступающего треугольника от края
								minIntersection: 10,
								minWidth: 150,
								maxWidth: 320,
								// Перемещает всплывающую подсказку, если она выходит из области просмотра, когда пользователь прокручивает страницу, чтобы она оставалась видимой как можно дольше.
								repositionOnScroll: true,
								zIndex: 99999,
								//  	'fade', 'grow', 'swing', 'slide', 'fall'
								animation: 'fade',
								// версия ИЕ для поддержки
								IEmin: 11,

								functionBefore: function (instance, helper) {
									// закрытие предыдущего
									if (activeInstance) activeInstance.close()
									activeInstance = instance
								},

								// срабатывает при инициализации
								functionInit: function (instance, helper) {
									// переключатель для подсказки
									var toggler = $(helper.origin)
									var dataOptions = toggler.data('tooltipster');

									// примениение параметров в атрибуте при их наличии
									if (dataOptions) {
										$.each(dataOptions, function (name, option) {
											instance.option(View.toCamelCase(name), option);
										});
									}
								},

								// срабатывает когда подсказка и ее содержимое было добавлено в DOM
								// functionReady: function (instance, helper) {
								// 	// переключатель для подсказки
								// 	var toggler = $(helper.origin)
								//
								// 	// добавить кастомный класс на подсказку
								// 	$(helper.tooltip).addClass(toggler.data('custom-class'))
								// }
							}

							// переназначение параметров из атрибута
							if (attrOptions) {
								for (var key in attrOptions) {
									options[key] = attrOptions[key]
								}
							}


							if (!tooltip.hasClass('tooltipstered')) tooltip.tooltipster(options)
						});
					}
				},

				// загрузка файла
				inputFile(scope) {
					$('.js-input-file', scope).each(function () {
						var parent = $(this)
						var name = parent.find('.js-input-file__name')

						// // отслеживание события выбора файла
						// inputs.off('change.inputFile').on('change.inputFile', function () {
						// 	setFile()
						// })
						//
						// function setFile() {
						// 	inputs.each(function () {
						// 		var input = $(this)
						// 		console.log('input', input[0].files)
						//
						// 		if (input[0].files.length) {
						// 			name.text(input[0].files[0].name)
						// 			parent.addClass('selected-file')
						// 		}
						// 	})
						// }
						//
						// setFile()

						// сброс файла
						parent.find('.js-input-file__delete').off('click.deleteInputFile').on('click.deleteInputFile', function () {
							$(this).remove()
							parent.find('input').each(function () {
								$(this).val('')
							})
							// parent.removeClass('selected-file')
							name.text('Выберите файл')
						})
					})
				},
			},
		};

		// управление открытием/закрытием всех переключающихся блоков и состояний
		this.control = {
			functionsArr: {
				closeAllSelects: function () {
					View.init.local.toggleSelect.closeAllSelect()
				},
				closeAllMobileMenu: function () {
					View.init.global.mobileMenu.closeAll()
				},
				closeAllClassBlocks: function () {
					View.init.local.toggleClassBlock.closeAllClassBlocks()
				},
				closeAllDropdownHover: function () {
					View.init.global.toggleDropdownHover.closeAllDropdownHover()
				},
				closeAllDropdown: function () {
					View.init.local.toggleDropdown.closeAllDropdown()
				},
				closeSearch: function () {
					View.init.local.showSearch.closeSearch()
				},
				closeAllClassPage: function () {
					View.init.local.toggleClassPage.closeAllClassPage()
				},
				// closeAllAccordionAdaptive: function () {
				// 	View.init.global.toggleAccordionOnlyAdaptive.closeAllAccordionAdaptive()
				// },
			},

			// закрыть всё что открывается, за исключением переданного списка параметров указанных имен закрывашек
			closeAll(exclude) {
				exclude = exclude || []

				// перебор массива со всеми имеющимися функциями для управлени
				for (var fn in View.control.functionsArr) {
					if (typeof View.control.functionsArr[fn] == 'function' && !~exclude.indexOf(fn)) {
						View.control.functionsArr[fn]();
					} else {
						// console.log('View.control.functionsArr[fn]', fn)
					}
				}

				console.log('closeAll')
			},
		}

		this.initAllGlobal = function () {
			$.each(this.init.global, function (index, fn) {
				if (typeof fn === 'function') fn();
			});
		};
		this.initAllLocal = function (scope) {
			$.each(this.init.local, function (index, fn) {
				if (typeof fn === 'function') fn(scope);
			});

			console.log('init local')
		};
	})()

	$(function ($) {
		const body = $(document.body);
		// body.removeClass('loading-page');

		body.addClass(View.isIOS ? ('ios ios-' + View.isIOS) : 'no-ios');
		body.addClass(View.checkAdaptiveBrowser ? 'touch' : 'no-touch');
		body.addClass(View.isIE ? 'ie' : 'no-ie');

		View.initView();
		View.initAllGlobal();
		View.initAllLocal(body);
		if (View.isIE) {
			svg4everybody();
			objectFitImages();
		}

		// body.off('onAjaxSuccess').on('onAjaxSuccess', View.initAllLocal())
		if (window.BX) {
			BX.addCustomEvent('onAjaxSuccess', function (e) {
				View.initAllLocal(body);
			});
			BX.addCustomEvent('ajaxstop', function (e) {
				View.initAllLocal(body);
				console.log('BX.ajaxstop')
			});

			// Готовый пример, показывает/скрывает лоадер, запускает/останавливает анимацию
			BX.ready(function () {
				var preloader = $('<div>').addClass('icon-preloader')
				BX.showWait = function (node, msg) {
					body.append(preloader)
					setTimeout(function () {
						preloader.remove()
					}, 7000)
				};
				BX.closeWait = function (node, obMsg) {
					preloader.remove()
					console.log('BX.closeWait')
				};
			});
		}
	})
}