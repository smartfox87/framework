// загрузка фотографий на мобильном при создании объявления
function uploadPhotos() {
	$('.js-upload-photos').each(function () {
		var parent = $(this)
		var buttons = parent.find('.js-upload-photos__btn')
		// контейнер для добавленных полей фото
		var containerForPhotos = parent.find('.js-upload-photos__files')
		var maxCountPhotos = parseInt(containerForPhotos.data('maxCountPhotos')) || 5

		// добавляем поле для фото из камеры но не больше 8 штук
		buttons.each(function () {
			var btn = $(this)
			var typeBtn = btn.attr('data-type')
			var inputForPhoto = null

			// тип поля для выбора фото (камера или галерея)
			if (typeBtn == 'camera') {
				inputForPhoto = $('<input class="js-upload-photos__input" type="file" accept="image/*" capture="camera">')
			} else if (typeBtn == 'gallery') {
				inputForPhoto = $('<input class="js-upload-photos__input" type="file">')
			}

			// добавление фоток если возможно
			btn.off('click.getPhotoCamera').on('click.getPhotoCamera', function () {
				if (!buttons.hasClass('disabled')) {
					addPhoto(containerForPhotos, inputForPhoto)
				}
			})
		})

		// перекление блокировки кнопок выбора фото
		containerForPhotos.off('refreshItemsCount').on('refreshItemsCount', function () {
			var photoItems = containerForPhotos.find('.js-upload-photos__item')

			// если выбрано максимальное количество фоток заданное в атрибуте контейнере
			if (photoItems.length >= maxCountPhotos) {
				// навесить блокировку
				buttons.addClass('disabled')

				photoItems.on('removeItem', function () {
					buttons.removeClass('disabled')
				})
			} else {
				// снять блокировку
				buttons.removeClass('disabled')

				photoItems.off('removeItem')
			}
		})
	})

	// выбрать фото и вставить в контейнер
	function addPhoto(container, input) {
		var label = $('<div>').addClass('upload-photos__file js-upload-photos__item js-remove')
		var span = $('<span>')
		var close = $('<i>').addClass('icon-close js-remove__btn')

		// отслеживание события выбора фото и его вставка в контейнер
		input.off('change.getPhotoCamera').on('change.getPhotoCamera', function (event) {
			span.text(event.target.files[0].name)
			label.append(input).append(span).append(close)
			container.append(label).trigger('refreshItemsCount')
		})

		// инициируем клик по созданному полю для фото
		input.click()
	}
}

// удаление элемента по клику (не требует переинициализации после ajax)
function removeItem() {
	$(document).off('click.removeItem').on('click.removeItem', '.js-remove__btn', function () {
		$(this).closest('.js-remove').trigger('removeItem').remove()
	})
}

$(function () {
	uploadPhotos()
})