// выбор и зброс файлов для загрузки на десктопе
function uploadFiles() {
	$('.js-upload-files').each(function () {
		var parent = $(this)
		var input = parent.find('.js-upload-files__input')
		var nameFile = parent.find('.js-upload-files__name')

		// отслеживание события выбора файла и вставка его имени
		input.off('change.uploadFiles').on('change.uploadFiles', function (event) {
			nameFile.text(event.target.files[0].name)
			parent.addClass('selected-file')
		})

		// сброс выбранного файла
		parent.find('.js-upload-files__delete').off('click.uploadFileReset').on('click.uploadFileReset', function (event) {
			parent.removeClass('selected-file')
			input.val('')
			nameFile.text('')
		})
	})
}

$(function () {
	uploadFiles()
})