// переключение класса по клику
function toggleClassBlock() {
	var allParents = $('.js-class')

	allParents.each(function () {
		var parent = $(this)
		// кастомный класс для переключения либо дефолтный
		var activeClass = parent.data('class') || 'active-class'

		parent.find('.js-class__toggler').off('click.toggleClass').on('click.toggleClass', function (event) {
			event.stopPropagation()
			event.preventDefault()

			if (!parent.hasClass(activeClass)) {
				parent.addClass(activeClass)
			} else {
				parent.removeClass(activeClass)
			}
		})
	})

	// закрыть все блоки
	toggleClassBlock.closeAllClassBlocks = function () {
		allParents.removeClass('active-class')
	}
}

function toggleClassBlockNative() {
	// переключение класса по клику
	toggleClassBlock.arrClasses = []

	var allParents = document.querySelectorAll('.js-class')
	Array.from(allParents).forEach(function (parent) {
		// кастомный класс для переключения либо дефолтный
		var activeClass = parent.getAttribute('data-class') || 'active-class'
		var toggler = parent.querySelector('.js-class__toggler')

		// toggleClassBlockNative.arrClasses.push(activeClass)

		toggler.removeEventListener('click', toggleClassBlockCallback)
		toggler.addEventListener('click', toggleClassBlockCallback)

		function toggleClassBlockCallback(event) {
			event.preventDefault()

			if (!parent.classList.contains(activeClass)) {
				parent.classList.add(activeClass)
				document.body.classList.add(activeClass);
			} else {
				parent.classList.remove(activeClass)
				document.body.classList.remove(activeClass);
			}
		}

		// закрытие по клику вне блока
		document.addEventListener('click', function (e) {
			if (!parent.contains(e.target)) {
				parent.classList.remove(activeClass)
			}
		})
	})

	// закрыть все блоки
	// toggleClassBlockNative.closeAllClassBlocks = function () {
	// 	toggleClassBlockNative.arrClasses.forEach(function (activeClass) {
	// 		Array.from(allParents).forEach(function (parent) {
	// 			parent.classList.remove(activeClass)
	// 		})
	// 	})
	// }
	// toggleClassBlockNative.closeAllClassBlocks()
}

$(function () {
	toggleClassBlock()
	toggleClassBlockNative()
})