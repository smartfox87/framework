import 'core-js/stable';

window.Postmate = require('postmate/build/postmate.min.js');

if (window.jQuery) {
	$(function ($) {
		lazyLoad($(document))
		showElemAfterScroll($('.js-scroll-top'), 300)
		lockScroll()
		removeItem()
		tooltipPosition()

		console.log(formatFileSize('99999999999999999'))

		$(document).off('click.closeAll').on('click.closeAll', function () {
			// console.log('close all')
			// toggleOverlay.closeAllOverlay()
			// toggleDropdown.closeAllDropdown()
			// toggleDropdownHover.closeAllDropdownHover()
			// toggleSelect.closeAllSelect()
			// toggleSelectHover.closeAllSelectHover()
			// toggleClassBlock.closeAllClassBlocks()
			// toggleFade.closeAllFade()
		})
	})
}

// инициализация всех яндекс карт на сайте
function initMaps() {
	ymaps.ready(function () {
		// одиночная метка с контеном
		$('#ymaps-single').each(function () {
			var mapItem = $(this)
			var placemarkCoordinates = mapItem.data('coordinates').split(', ')
			var placemarkTitle = mapItem.data('title') || ''
			var zoom = mapItem.data('zoom') || 8

			var mapObject = new ymaps.Map(mapItem[0], {
				center: placemarkCoordinates,
				controls: ['geolocationControl', 'fullscreenControl'],
				zoom: zoom,
			}, {
				searchControlProvider: 'yandex#search'
			})

			// Создание метки.
			var locationPoint = new ymaps.Placemark(placemarkCoordinates, {
				// balloonContentBody: 'Эдуард',
				// balloonContentFooter: 'г. Душанбе, ул. Айни',
				hintContent: placemarkTitle,
				balloonContent: placemarkTitle,
			}, {  // Опции.
				preset: 'islands#circleDotIcon',
			})
			mapObject.geoObjects.add(locationPoint)
		})

		// множество меток из атрибута
		$('#ymaps-multi-attr').each(function () {
			var mapItem = $(this)
			var points = mapItem.data('points');

			var mapObject = new ymaps.Map(mapItem[0], {
				center: ['38.563013', '68.810380'],
				controls: ['geolocationControl', 'fullscreenControl'],
				zoom: 15,
			}, {
				searchControlProvider: 'yandex#search'
			})

			points.forEach(function (point) {
				var placemarkCoordinates = point.coords.split(', ');
				var placemarkTitle = point.title || '';

				// Создание метки.
				var locationPoint = new ymaps.Placemark(placemarkCoordinates, {
					// balloonContentBody: 'Эдуард',
					// balloonContentFooter: 'г. Душанбе, ул. Айни',
					hintContent: placemarkTitle,
					balloonContent: placemarkTitle,
				}, {  // Опции.
					preset: 'islands#circleDotIcon',
				})
				mapObject.geoObjects.add(locationPoint)
			})

			// устанавливаем нужный центр и зум карты, чтобы было видно все метки и задаем нужный отступ меток от края карты
			mapObject.setBounds(mapObject.geoObjects.getBounds(), {checkZoomRange: true, zoomMargin: 50})
				.then(function () {
					//после установки проверяем зум и не даем выйти за рамки нужного
					if (mapObject.getZoom() > 15) mapObject.setZoom(15);
				});
		})

		// множество дефолтных меток
		$('#ymaps-multi-default').each(function () {
			var mapItem = $(this)
			// путь к JSON файлу с данными для карты
			var pathJsonMulti = mapItem.data('json-path')

			var mapObject = new ymaps.Map(mapItem[0], {
				center: [125.79, 17.64],
				controls: ['geolocationControl', 'fullscreenControl'],
				zoom: 1,
			}, {
				searchControlProvider: 'yandex#search'
			})
			var objectManager = new ymaps.ObjectManager({
				// Чтобы метки начали кластеризоваться, выставляем опцию.
				clusterize: true,
				// ObjectManager принимает те же опции, что и кластеризатор.
				gridSize: 32,
				clusterDisableClickZoom: true
			})

			// Чтобы задать опции одиночным объектам и кластерам,
			// обратимся к дочерним коллекциям ObjectManager.
			objectManager.objects.options.set('preset', 'islands#blueDotIcon');
			objectManager.clusters.options.set('preset', 'islands#blueClusterIcons');

			// Загружаем GeoJSON файл с описанием объектов.
			$.getJSON(pathJsonMulti)
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
		})

		// множество кастомизированных меток
		$('#ymaps-multi-custom').each(function () {
			var mapItem = $(this)
			// путь к JSON файлу с данными для карты
			var pathJsonMultiCustom = mapItem.data('json-path')

			var mapObject = new ymaps.Map(mapItem[0], {
				center: [50.79, 37.64],
				controls: ['zoomControl', 'geolocationControl'],
				zoom: 18,
			}, {
				searchControlProvider: 'yandex#search'
			})
			var objectManager = new ymaps.ObjectManager({
				// Чтобы метки начали кластеризоваться, выставляем опцию.
				clusterize: true,
				// ObjectManager принимает те же опции, что и кластеризатор.
				gridSize: 32,
				clusterDisableClickZoom: true,
			})

			// Добавим элемент управления FullscreenControl на карту, чтобы управлять им снаружи карты
			var fullscreenControl = new ymaps.control.FullscreenControl();
			mapObject.controls.add(fullscreenControl);

			// переведем карту в «полноэкранный режим» по внешнему переключателю
			$('.js-map-fullscreen').click(function () {
				fullscreenControl.enterFullscreen();
			})

			// стилизация меток на карте
			objectManager.objects.options.set('iconLayout', 'default#image');
			objectManager.objects.options.set('iconImageHref', 'img/location--blue.svg');
			objectManager.objects.options.set('iconImageSize', [34, 42]);
			objectManager.objects.options.set('iconImageOffset', [-17, -42]);
			// objectManager.objects.options.set('openBalloonOnClick', false);
			// objectManager.objects.options.set('hideIconOnBalloonOpen', false);

			// контент для метки кластера
			var MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
				'<div style="color: #ffffff; font-weight: bold; font-size: 17px;">{{ properties.geoObjects.length }}</div>'
			);
			// стилизация метки кластера
			objectManager.clusters.options.set({
				clusterIcons: [{
					href: 'img/map-cluster.svg',
					color: '#fff',
					size: [45, 45],
					offset: [-22, -22],
				}],
				clusterIconContentLayout: MyIconContentLayout,
				// высота балуна кластера
				balloonContentLayoutHeight: 360,
			});

			// обработка события открытия баллуна метки
			objectManager.objects.events.add(['balloonopen', 'redraw'], function (e, a) {
			});

			// обработка события открытия баллуна кластера
			objectManager.clusters.events.add(['balloonopen', 'redraw'], function (e) {
			});

			// обработка события клика по метке на карте
			objectManager.objects.events.add('click', function (e) {
				var pmId = e.get('objectId');
				var placemark = objectManager.objects.getById(pmId);

				// установка новой метки активной и сброс предыдущей
				setCurrenMark(pmId)
				resetPrevMark(pmId)

				// получение данных из метки карты
				console.log(placemark.properties.balloonContent)
			});

			// переменная для хранения ID предыдущей кликнутой метки
			var prevMarkId = ''

			// сброс метки карты на не выбранную
			function resetPrevMark(prevId) {
				// если предыдущая метка уже задана
				if (typeof prevMarkId == 'number') {
					var prevMarker = objectManager.objects.getById(prevMarkId)

					// путь к иконке метки карты (пустой или полной)
					var icon = 'img/icon__map--empty.svg'
					if (prevMarker.properties.balloonContent) {
						icon = 'img/icon__map--full.svg'
					}

					// сброс параметров метки на не выбранную
					objectManager.objects.setObjectOptions(prevMarkId, {
						iconImageSize: [46, 77],
						iconImageOffset: [-23, -65],
						iconImageHref: icon,
					});
					prevMarkId = prevId
				} else {
					prevMarkId = prevId
				}
			}

			// установка красной метки на выбранную метку карты
			function setCurrenMark(markId) {
				// установка параметров
				objectManager.objects.setObjectOptions(markId, {
					iconImageSize: [68, 94],
					iconImageOffset: [-34, -85],
					iconImageHref: 'img/icon__map--mark.svg',
				});
			}

			// удалить все метки на карте
			// mapObject.geoObjects.removeAll();

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
		})

		// карта с перетаскиваемой меткой и полем для ввода и вывода адреса
		$('#ymaps-with-input').each(function () {
			var mapItem = $(this)
			var mapObject = new ymaps.Map(mapItem[0], {
				center: [38.563013, 68.810380],
				controls: ['geolocationControl', 'fullscreenControl', 'zoomControl'],
				zoom: 17,
			}, {
				searchControlProvider: 'yandex#search'
			})

			// Создание метки.
			var myPlacemark = new ymaps.Placemark(mapObject.getCenter(), {
				// iconCaption: 'поиск...'
			}, {
				iconLayout: 'default#image',
				iconImageHref: 'img/location.svg',
				iconImageSize: [62, 87],
				iconImageOffset: [-31, -87],
				draggable: true,
			});
			mapObject.geoObjects.add(myPlacemark);

			// Слушаем событие окончания перетаскивания на метке.
			myPlacemark.events.add('dragend', function () {
				getAddress(myPlacemark.geometry.getCoordinates());
			});

			// Слушаем клик на карте.
			mapObject.events.add('click', function (e) {
				var coords = e.get('coords');

				// передвигаем метку.
				myPlacemark.geometry.setCoordinates(coords);
				getAddress(coords);
			});

			// поля ввода и вывода адреса
			let locationInput = $('#location-input')
			// сообщение об ошибке
			var notice = $('#notice')

			// Определяем адрес по координатам (обратное геокодирование).
			function getAddress(coords) {
				ymaps.geocode(coords).then(function (res) {
					var firstGeoObject = res.geoObjects.get(0);
					// вставляем адресс в поле вывода адреса
					locationInput.attr('value', firstGeoObject.getAddressLine()).val(firstGeoObject.getAddressLine())
				});
			}

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
					console.log(e)
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
					// Передвигаем метку по найденным координатам
					setPlacemarkCoords(mapState);
				}

				function showError(message) {
					notice.text(message).css('display', 'block');
				}

				function setPlacemarkCoords(state) {
					// выставляем новый центр карты и меняем позицию метки в соответствии с найденным адресом.
					mapObject.setCenter(state.center, state.zoom + 2);
					myPlacemark.geometry.setCoordinates(state.center);
				}
			}
		})

		// карта с получением страны и города при загрузке и по клику на карте
		$('#ymaps-country-city').each(function () {
			var mapItem = $(this)
			var geolocation = ymaps.geolocation;
			var myPlacemark = null
			var geoCountry = null
			var geoCity = null
			var countryOutput = $('#get-country')
			var cityOutput = $('#get-city')

			var mapObject = new ymaps.Map(mapItem[0], {
				center: [55.76, 37.64],
				zoom: 10
			}, {
				searchControlProvider: 'yandex#search'
			});

			geolocation.get({
				provider: 'auto',
				autoReverseGeocode: true,
				// Карта автоматически отцентрируется по положению пользователя.
				mapStateAutoApply: true
			}).then(function (result) {
				myPlacemark = result.geoObjects.get(0)
				geoCountry = myPlacemark.getCountry()
				geoCity = myPlacemark.getLocalities()[0]

				// вставляем адресс в поле вывода адреса
				setCityValue()
				setCountryValue()

				mapObject.geoObjects.add(result.geoObjects)

				// клик по карте
				mapObject.events.add('click', function (e) {
					var coords = e.get('coords');

					// передвигаем метку.
					myPlacemark.geometry.setCoordinates(coords);
					getAddress(coords);
				});
			})
				.catch(function (error) {
					console.log('map api error', error)
				})

			// Определяем адрес по координатам (обратное геокодирование).
			function getAddress(coords) {
				ymaps.geocode(coords).then(function (res) {
					var firstGeoObject = res.geoObjects.get(0);
					geoCountry = firstGeoObject.getCountry()
					geoCity = firstGeoObject.getLocalities()[0]

					// вставляем адресс в поле вывода адреса
					setCityValue()
					setCountryValue()
				});
			}

			// установка значения страны
			function setCountryValue() {
				countryOutput.val(geoCountry)
			}

			// установка значения города
			function setCityValue() {
				cityOutput.val(geoCity)
			}
		})

		// карта с получением страны и города при загрузке и по клику на карте
		$('#ymaps-near-point').each(function () {
			var mapItem = $(this)
			var geolocation = ymaps.geolocation;
			var loadedPlacemarks = null
			var userPosition = null
			// путь к JSON файлу с данными для карты
			var pathJsonMulti = mapItem.data('json-path')

			var mapObject = new ymaps.Map(mapItem[0], {
				center: [55.73, 37.75],
				zoom: 12
			}, {
				searchControlProvider: 'yandex#search'
			});

			// Загружаем GeoJSON файл с описанием объектов.
			$.getJSON(pathJsonMulti)
				.done(function (response) {
					// Добавляем описание объектов в формате JSON в геообъекты с помощью ymaps.geoQuery и Добавляем объекты на карту.
					loadedPlacemarks = ymaps.geoQuery(response).addToMap(mapObject);

					// устанавливаем нужный центр и зум карты, чтобы было видно все метки и задаем нужный отступ меток от края карты
					mapObject.setBounds(mapObject.geoObjects.getBounds(), {checkZoomRange: true, zoomMargin: 50})
						.then(function () {
							//после установки проверяем зум и не даем выйти за рамки нужного
							if (mapObject.getZoom() > 15) mapObject.setZoom(15);
						});
				})
				.fail(function (response) {
					console.warn('map: ajax load failed', response)
				})

			geolocation.get({
				provider: 'auto',
				autoReverseGeocode: true,
				// Карта автоматически отцентрируется по положению пользователя.
				mapStateAutoApply: true
			}).then(function (result) {
				// центруем карту на положении пользователя
				// mapObject.setCenter(result.geoObjects.position)

				// С помощью обратного геокодирования найдем местоположение пользователя по его координатам
				userPosition = ymaps.geoQuery(ymaps.geocode(result.geoObjects.position, {kind: 'locality'}))
					// Нужно дождаться ответа от сервера и только потом обрабатывать полученные результаты.
					.then(function (res) {
						// findClosestObjects(userPosition.get(0))
						// клик по карте
						mapObject.events.add('click', function (event) {
							findClosestObjects(event.get('coords'))
						});
					});
			})
				.catch(function (error) {
					console.log('map api error', error)
				})

			// поиск ближайшей метки к указанной точке и обработка
			function findClosestObjects(coords) {
				var nearPoint = loadedPlacemarks.getClosestTo(coords)

				nearPoint.balloon.open();
				// установка центра карты на ближайшей метке
				mapObject.setCenter(nearPoint.geometry.getCoordinates())
			}

		})
	})
}


// *************************************** служебные функции ******************************************************

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

// обновление lazyload картинок внутри таба
// lazyLoad.instance.update()

// Видимости элемента после указанной высоты скролла страницы
function showElemAfterScroll(element, toggleHeightScroll) {
	var doc = $(document)

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

// блокировать всплытие события скролла на элементе
function lockScroll() {
	if ($.fn.scrollLock) {
		$('.js-lock-scroll').scrollLock({
			unblock: '.js-lock-scroll__unlock'
		});
	}
}

// добавление на страницу отложенной загрузки внешнего скрипта
var loadedDelayScripts = []

function loadDelayScript(url) {
	if (!~loadedDelayScripts.indexOf(url)) {
		loadedDelayScripts.push(url)
		var script = $(document.createElement('script'))
		script.attr({src: url, type: 'text/javascript'})
		$('body').append(script)
	}
}

// находится ли блок в видимой области вьюпорта или приближается к ней
function getVisibleElemOnScroll(elemJQ, reserveHeight) {
	if (elemJQ.length > 0) {
		return elemJQ.offset().top - ($(document).scrollTop() + $(window).height() + reserveHeight) < 0
	}
	return false
}

// удаление элемента по клику (не требует переинициализации после ajax)
function removeItem() {
	$(document).off('click.removeItem').on('click.removeItem', '.js-remove__btn', function () {
		$(this).closest('.js-remove').trigger('removeItem').remove()
	})
}

// запретить зум страницы после фокуса в поле ввода на IOS
function disableZoomAfterFocusInput() {
	var head = $('head')

	$('input[type=text], input[type=tel], input[type=number], input[type=email], textarea')
		.mouseover(zoomDisable)
		.mousedown(zoomEnable);

	function zoomDisable() {
		console.log('disable')
		head.children('meta[name=viewport]').remove();
		head.prepend('<meta name="viewport" content="user-scalable=0, maximum-scale=1.0, width=device-width" />');
	}

	function zoomEnable() {
		console.log('enable')
		head.children('meta[name=viewport]').remove();
		head.prepend('<meta name="viewport" content="user-scalable=1, initial-scale=1.0, width=device-width" />');
	}
}

// скролл к блоку по ссылке
function scrollToBlock() {
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
}

// скролл к блоку по ссылке
function scrollToBlockNative() {
	// скролл к блоку по ссылке
	Array.from(document.querySelectorAll('.js-scroll-to')).forEach(function (item) {
		item.removeEventListener('click', scrollToBlock)
		item.addEventListener('click', scrollToBlock)

		function scrollToBlock(event) {
			event.preventDefault()

			// величина недоезда блока до верха в атрибуте ссылки
			var offset = item.getAttribute('offset') || 0
			// ID блока до, которого скролить
			var block = document.querySelector(item.getAttribute('href'))
			if (block) {
				var positionBlock = block.getBoundingClientRect().top - offset

				animate({
					duration: 400,
					timing: function (timeFraction) {
						return timeFraction;
					},            // линейная функция значит, что анимация идёт с одной и той же скоростью
					draw: function (progress) {
						document.documentElement.scrollTop += Math.round((block.getBoundingClientRect().top - offset) * progress)
					}
				});
			}
		}
	})

	function animate({timing, draw, duration}) {
		let start = performance.now();

		requestAnimationFrame(function animate(time) {
			// timeFraction изменяется от 0 до 1
			let timeFraction = (time - start) / duration;
			if (timeFraction > 1) timeFraction = 1;

			// вычисление текущего состояния анимации
			let progress = timing(timeFraction);

			draw(progress); // отрисовать её

			if (timeFraction < 1) {
				requestAnimationFrame(animate);
			}
		});
	}
}

// триггер клика по другому или одновременно нескольким элементам
function triggerClick() {
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
}

// инициализация позиционирования, не выходящего за контентную область
function tooltipPosition() {
	var tooltips;
	var delta;
	var i;
	var containerPadding;
	var timeout = null;

	// ширина скроллбара
	tooltipPosition.scrollBarWidth = (function () {
		var outer = document.createElement('div');
		outer.style.visibility = 'hidden';
		outer.style.width = '100px';
		outer.style.msOverflowStyle = 'scrollbar';

		document.body.appendChild(outer);

		var widthNoScroll = outer.offsetWidth;
		// force scrollbars
		outer.style.overflow = 'scroll';

		// add innerdiv
		var inner = document.createElement('div');
		inner.style.width = '100%';
		outer.appendChild(inner);

		var widthWithScroll = inner.offsetWidth;

		// remove divs
		outer.parentNode.removeChild(outer);

		return widthNoScroll - widthWithScroll;
	})();

	// breakpoints
	tooltipPosition.breakpoints = {
		'md-max': 1249,
		'sm-max': 999,
		'xs-max': 759,
	};

	// вычисление положения
	tooltipPosition.calcPosition = function () {
		tooltips = $('.js-tooltip-position');
		tooltips.css('marginLeft', '');

		// ширина паддинга контейнера страницы
		containerPadding = window.innerWidth > tooltipPosition.breakpoints['xs-max'] ? 30 : 10;
		containerPadding = window.innerWidth > tooltipPosition.breakpoints['sm-max'] ? 30 : containerPadding;

		for (i = 0; i < tooltips.length; i++) {
			// насколько выступает правый край выпадашки за границы контейнера страницы
			delta = tooltips[i].getBoundingClientRect().left + tooltips[i].offsetWidth -
				Math.min((window.innerWidth - tooltipPosition.scrollBarWidth - containerPadding), (window.innerWidth - tooltipPosition.scrollBarWidth) / 2 + 684);

			if (delta > 1) {
				// сдвиг выпадашки, если она выступает
				tooltips[i].style.marginLeft = ((parseInt(tooltips[i].style.marginLeft) || 0) - delta) + 'px';
			}
		}
	}

	$(window).off('resize.setTooltipPositions').on('resize.setTooltipPositions', function () {
		clearTimeout(timeout);

		timeout = setTimeout(tooltipPosition.calcPosition, 100);
	}).trigger('resize.setTooltipPositions');
}

// установка единиц измерения для размера файла
function formatFileSize(value) {
	if (!value || !value.toString) value = 0;

	var units = 'Б';

	if (value > 1024) {
		value /= 1024;
		units = 'кБ'
	}

	if (value > 1024) {
		value /= 1024;
		units = 'МБ'
	}

	if (value > 1024) {
		value /= 1024;
		units = 'ГБ'
	}
	return parseFloat(value)
		.toFixed(2)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
		.replace(/\./g, ',') + ' ' + units;
}

// autoplay video
function startAutoplayVideo() {
	$('video[autoplay]').each(function () {
		var video = $(this)
		video.prop('muted', true)
		video[0].play()
	})
}

// переключение класса по наведению
function toggleClassByHover() {
	var allItems = $('.js-class-hover')

	allItems.each(function () {
		var item = $(this)
		var itemClass = item.data('class')

		// обработка прихода курсора на элемента
		item.off('mouseover.toggleClassByHover').on('mouseover.toggleClassByHover', function () {
			body.addClass(itemClass);
			item.addClass(itemClass);
		});

		// обработка ухода курсора с элемента
		item.off('mouseout.toggleClassByHover').on('mouseout.toggleClassByHover', function () {
			body.removeClass(itemClass);
			item.removeClass(itemClass);
		})
	})
}

// задание переменной 1vh для css
function setVhVariable() {
	var timeout = null

	function setVhVariable() {
		let vh = (window.innerHeight * 0.01).toFixed(4) + 'px';
		document.documentElement.style.setProperty('--vh', vh);
	}

	setVhVariable()

	window.addEventListener('resize', function () {
		clearTimeout(timeout)
		timeout = setTimeout(setVhVariable, 300)
	});
}

// запрет ввода в поле символов
function disableInputSymbols() {
	// запрет ввода для всего кроме номера мобильного
	$('[type="tel"]').off('keypress.banSymbolsForPhone').on('keypress.banSymbolsForPhone', function (event) {
		var enabledSymbol = /[\d\s\)\(\+-]/.test(String.fromCharCode(event.charCode))
		if (!enabledSymbol) {
			event.preventDefault()
		}
	})

	// запрет ввода для всего кроме текстовых фраз
	$('[data-input-type="text"]').off('keypress.banSymbolsForText').on('keypress.banSymbolsForText', function (event) {
		var enabledSymbol = /[A-Za-zА-ЯЁа-яё\s-]/.test(String.fromCharCode(event.charCode))
		if (!enabledSymbol) {
			event.preventDefault()
		}
	})
}

// управление youtube iframe видео через его API
function callYuotubeIframePlayer(iframe, func, args) {
	// провека iframe на наличие youtube
	if (iframe && ~iframe.src.indexOf('youtube.com/embed')) {
		iframe.contentWindow.postMessage(JSON.stringify({
			'event': 'command',
			'func': func,
			'args': args || []
		}), '*');
	}
	// запущеннно youtube iframe видео
	callYuotubeIframePlayer.youtubeVideoPlayed = null
}

// остановка предыдущего видео youtube iframe при его наличии
if (callYuotubeIframePlayer.youtubeVideoPlayed) {
	callYuotubeIframePlayer(callYuotubeIframePlayer.youtubeVideoPlayed, 'pauseVideo')
}
// запуск видео youtube iframe в слайде
// callYuotubeIframePlayer.youtubeVideoPlayed = $(this.slides).filter('.swiper-slide-active').find('iframe')[0]
// callYuotubeIframePlayer(callYuotubeIframePlayer.youtubeVideoPlayed, 'playVideo')

// трансформация строки в camelCase стиль
function toCamelCase(str) {
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

// нативный аналог метода jquery .not()
function not($list, $element) {
	var list = Array.from($list);
	var index = list.indexOf($element);
	if (!index) {
		return list.slice(++index)
	} else {
		return list.slice(0, index).concat(list.slice(++index))
	}
}

// нативный аналог метода jquery .data()
window.dataStorage = {
	_storage: new WeakMap(),
	set: function (element, key, obj) {
		if (!this._storage.has(element)) {
			this._storage.set(element, new Map());
		}
		this._storage.get(element).set(key, obj);
	},
	get: function (element, key) {
		if (!this._storage.get(element)) {
			return
		}
		return this._storage.get(element).get(key);
	},
	has: function (element, key) {
		return this._storage.has(element) && this._storage.get(element).has(key);
	},
	remove: function (element, key) {
		var ret = this._storage.get(element).delete(key);
		if (!this._storage.get(element).size === 0) {
			this._storage.delete(element);
		}
		return ret;
	}
}

// отслеживание свайпа на мобилке для галереи
function detectSwipe() {
	let touchstartX = 0;
	let touchstartY = 0;
	let touchendX = 0;
	let touchendY = 0;
	var deg = 0;

	const gestureZone = document.getElementById('js_full_image_lnk');

	if (gestureZone) {
		gestureZone.addEventListener('touchstart', function (event) {
			touchstartX = event.changedTouches[0].screenX;
			touchstartY = event.changedTouches[0].screenY;
		}, false);

		gestureZone.addEventListener('touchend', function (event) {
			touchendX = event.changedTouches[0].screenX;
			touchendY = event.changedTouches[0].screenY;
			handleGesture();
		}, false);
	}

	// расчет угла свайпа
	function calcDeg() {
		var rads = Math.atan((touchstartY - touchendY) / (touchstartX - touchendX))
		deg = rads * (180 / 3.14);
	}

	// расчет направления свайпа
	function handleGesture() {
		if (touchendX < touchstartX) {
			calcDeg()
			if (deg > -35 && deg < 35) {
				jQuery('.more-img.current').next().find('a').click()
				console.log('Swiped left');
			}
		}

		if (touchendX > touchstartX) {
			calcDeg()
			if (deg > -35 && deg < 35) {
				jQuery('.more-img.current').prev().find('a').click()
				console.log('Swiped right');
			}
		}

		if (touchendY < touchstartY) {
			calcDeg()
			if (deg < -65 || deg > 65) {
				console.log('Swiped up');
			}
		}

		if (touchendY > touchstartY) {
			calcDeg()
			if (deg < -65 || deg > 65) {
				console.log('Swiped down');
			}
		}

		if (touchendY === touchstartY) {
			console.log('Tap');
		}
	}
}

// проверка скролла на начальное и конечное положение
$('.js-shadow-top').each(function () {
	return addEventListenerScroolEnd($(this), $('.js-shadow-trigger', this), 'Top');
});

function addEventListenerScroolEnd(el, trigger, pos) {
	var _event, beginClassName, endClassName, prop;
	_event = 'scroll.checkScrool';
	prop = pos === 'Left' ? 'Width' : 'Height';
	endClassName = (pos.toLowerCase()) + '-end';
	beginClassName = (pos.toLowerCase()) + '-begin';
	return trigger.off(_event).on(_event, function (e) {
		if ((this['scroll' + prop] - this['client' + prop]) !== 0) {
			el.toggleClass(endClassName, this['scroll' + pos] === (this['scroll' + pos + 'Max'] || (this['scroll' + prop] - this['client' + prop])));
			return el.toggleClass(beginClassName, this['scroll' + pos] === 0);
		} else {
			return el.addClass(endClassName + ' ' + beginClassName);
		}
	}).trigger(_event);
};

function customScrollbar() {
	if (window.Scrollbar) {
		$('.js-custom-scrollbar').each(function () {
			console.log('iiiiiiiii111111111111111')
			if (!$(this).data('data-scrollbar')) {
				console.log('iiiiiiiii2222222222222')
				window.Scrollbar.init(this, {
					continuousScrolling: false
				});
			}
		})
	}
}