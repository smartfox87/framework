// загрузка файла
function inputFile() {
	$('.js-input-file').each(function () {
		var parent = $(this)
		var input = parent.find('.js-input-file__input')
		var name = parent.find('.js-input-file__name')

		// отслеживание события выбора файла
		input.off('change.inputFile').on('change.inputFile', function (event) {
			name.text(event.target.files[0].name)
			parent.addClass('selected-file')
			// size.text(formatFileSize(event.target.files[0].size))
		})

		// сброс файла
		parent.find('.js-input-file__delete').off('click.deleteInputFile').on('click.deleteInputFile', function () {
			input.val('')
			parent.removeClass('selected-file')
		})
	})
}

$(function () {
	inputFile()
})