// перетаскивание блоков
function sortableBlocks() {
	if (window.Sortable) {
		$('.js-sortable').each(function () {
			var parent = $(this)

			new Sortable(parent[0], {
				animation: 150,
				// класс добавляемый при перетаскивании
				ghostClass: 'active-drag',
				// элемент для перетескавания блока (опционально)
				handle: '.js-sortable__toggler',
			});
		})
	}
}

$(function () {
	sortableBlocks()
})