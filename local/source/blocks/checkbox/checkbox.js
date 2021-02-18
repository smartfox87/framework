// переключение видимости блока по чекбоксу (не требует переинициализации после аякс)
function toggleCheckboxBlock() {
	$('.js-checkbox-block').each(function (index) {
		var parent = $(this)
		var input = parent.find('.js-checkbox-block__input')
		var content = parent.find('.js-checkbox-block__content')

		input.off('change.toggleCheckboxBlock' + index).on('change.toggleCheckboxBlock' + index, toggleCheckboxBlock)

		function toggleCheckboxBlock() {
			if (input.prop('checked')) {
				content.fadeIn(300)
			} else {
				content.fadeOut(300)
			}
		}

		toggleCheckboxBlock()
	})
}

// управление всеми чекбоксам через один чекбокс
function checkAll() {
	$('.js-check-all').each(function () {
		var parent = $(this)
		var toggler = parent.find('.js-check-all__toggler')
		var checkboxes = parent.find('.js-check-all__checkbox')

		toggler.off('change.checkAll').on('change.checkAll', function () {
			if (toggler.prop('checked')) {
				checkboxes.prop('checked', true).triggerHandler('change')
			} else {
				checkboxes.prop('checked', false).triggerHandler('change')
			}
		})
	})
}

// сброс всех чекбоксов через кнопку
function resetCheckAll() {
	$('.js-reset-check-all').each(function () {
		var parent = $(this)
		var toggle = parent.find('.js-reset-check-all__toggle')
		var checkboxes = parent.find('.js-reset-check-all__checkbox')

		toggle.off('click.checkAll').on('click.checkAll', function () {
			if (checkboxes.prop('checked')) {
				checkboxes.prop('checked', false).triggerHandler('change')
			}
		})
	})
}

// повесить класс, если хотябы один чекбокс отмечен
function checkAnyCheckbox() {
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
}

$(function () {
	toggleCheckboxBlock()
	checkAnyCheckbox()
	checkAll()
	resetCheckAll()
})