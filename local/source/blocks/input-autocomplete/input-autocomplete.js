// инпут с автокомплитом и мультивыбором (в виде тэгов)
// использовать не минимизированную версию скрипта
function initInputAutocompleteMulti() {
	if ($.fn.magicSuggest) {
		$('.js-input-autocomplete-multi').each(function () {
			$(this).magicSuggest({
				cls: 'input-autocomplete',
				maxSelection: 2,
				// объект, массив, url, function
				data: [{'id': 'Paris', 'name': 'Paris'}, {'id': 'New York', 'name': 'New York'}]
			})
		})
	}
}

// инпут с автокомплитом
function initInputAutocomplete() {
	if ($.fn.easyAutocomplete) {

		$('.js-input-autocomplete').each(function () {
			var input = $(this)

			input.easyAutocomplete({
				// объект, массив, путь к json
				data: [
					'apples',
					'apricot',
					'avocado',
					'bananas',
					'blueberries',
					'cherries',
					'grapefruit',
					'grapes',
					'kiwi fruit',
					'lemons',
					'mangoes',
					'melons',
					'nectarines',
					'oranges',
					'passion fruit',
					'peaches',
					'pears',
					'pineapples',
					'plums',
					'rhubarb',
					'rock melon',
					'strawberries',
					'watermelon'
				],
				// отправка запроса
				// url: function (query) {
				// 	return input.data('url') + query + '&format=json';
				// },
				// задержка до отправки
				// requestDelay: 500
				// указание поля для отображения в списке
				// getValue: 'name',
				// отключение подсветки введенной фразы в элементах списка
				// highlightPhrase: false,
				placeholder: 'Set up placeholder value',
				list: {
					maxNumberOfElements: 10,
					sort: {
						enabled: true
					},
					// показывать в выпадающем списке только совпадения
					match: {
						enabled: true
					},
					showAnimation: {
						type: 'fade', //normal|slide|fade
						time: 400,
						callback: function () {
						}
					},
					hideAnimation: {
						type: 'slide', //normal|slide|fade
						time: 400,
						callback: function () {
						}
					}
				}
			})
		})
	}
}

$(function () {
	initInputAutocompleteMulti()
	initInputAutocomplete()
})