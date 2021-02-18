// отложенная инициализация яндекс карт по скроллу
function initMapsDelayScroll() {
	var win = $(window)
	var maps = $('.js-map')
	// для защиты от повторной инициализации
	var checkInitedMaps = false

	if (maps.length) {
		function initMaps() {
			// инициализируем если карта еще не инициализировалась
			if (!checkInitedMaps) {
				loadDelayScript('https://api-maps.yandex.ru/2.1.73/?lang=ru_RU&onLoad=initMaps')
				checkInitedMaps = true
			}
		}

		// запус инициализации если карта в зоне видимости или приближается к ней
		win.off('scroll.initMapsScroll').on('scroll.initMapsScroll', function () {
			if (getVisibleElemOnScroll(maps, 500)) initMaps()
		})
		win.trigger('scroll.initMapsScroll')
	}
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

		// карта с поиском ближайшей метки на карте для указанной точки
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

// обновить размер карты при ресайзе контейнера
//mapObject.container.fitToViewport();

// добавление на страницу отложенной загрузки внешнего скрипта
function loadDelayScript(url) {
	var script = $(document.createElement('script'))
	script.attr({src: url, type: 'text/javascript'})
	$('body').append(script)
}

// находится ли блок в видимой области вьюпорта или приближается к ней
function getVisibleElemOnScroll(elemJQ, reserveHeight) {
	if (elemJQ.length > 0) {
		return elemJQ.offset().top - ($(document).scrollTop() + $(window).height() + reserveHeight) < 0
	}
	return false
}

// закрытие баллуна по кнопке внутри него
$(document).off('click.closeBallon').on('click.closeBallon', '.js-select-pharmacy', function (e) {
	mapObject.balloon.close()
})

// Добавим элемент управления FullscreenControl на карту, чтобы управлять им снаружи карты
//var fullscreenControl = new ymaps.control.FullscreenControl();
//mapObject.controls.add(fullscreenControl);

// переведем карту в «полноэкранный режим» по внешнему переключателю
$('.js-map-fullscreen').click(function () {
	fullscreenControl.enterFullscreen();
	fullscreenControl.exitFullscreen();
})

$(function () {
	initMapsDelayScroll()
})