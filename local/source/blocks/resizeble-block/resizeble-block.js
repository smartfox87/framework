// пара блоков с возможностью измненеия их ширины переключателем
function resizebleBlocks() {
	$('.js-resizeble-block').each(function () {
		var timeout = null;
		var doc = $(document);
		var win = $(window);
		var parent = $(this);
		var minWidthScreenForInit = parseInt(parent.data('min-width-init'), 10);
		var resizebleBlock = parent.find('.js-resizeble-block__block');
		var maxWidthBlock = parseFloat(resizebleBlock.data('max-percent'));
		var minWidthBlock = parseFloat(resizebleBlock.data('min-percent'));
		var toggler = parent.find('.js-resizeble-block__toggler');

		function resizebleBlocks() {
			var parentWidth = parent.width();
			var parentPositionX = parent.offset().left;

			// обработка нажатия мыши в пределах родителя
			parent.off('mousedown.resizebleBlocks').on('mousedown.resizebleBlocks', '.js-resizeble-block__toggler', function () {
				// навешивание ресайза ширины блока относительно позиции курсора
				doc.off('mousemove.resizebleBlocks').on('mousemove.resizebleBlocks', function (event) {
					var positionXOffsetParent = event.clientX - parentPositionX;
					var widthLeftBlock = (positionXOffsetParent / parentWidth * 100).toFixed(3);

					// если позиция курсора укладывается в рамки минимально и максимально дозволенного интервала ширины блока
					if (minWidthBlock <= widthLeftBlock && maxWidthBlock >= widthLeftBlock) {
						resizebleBlock.width(widthLeftBlock + '%');

						// переключение классов на переключателе при достижении левого и правого предела
						toggler.toggleClass('start', minWidthBlock + 1 > widthLeftBlock);
						toggler.toggleClass('end', maxWidthBlock - 1 < widthLeftBlock);
					}
				});
			});
		}

		// отключение ресайза блоков при отпускании кнопки мышки
		doc.off('mouseup.resizebleBlocks').on('mouseup.resizebleBlocks', function () {
			doc.off('mousemove.resizebleBlocks');
		});

		// инициализаци начальная и повторная после ресайза окна
		win.off('resize.resizebleBlocks').on('resize.resizebleBlocks', function () {
			clearTimeout(timeout);
			if (win.width() > minWidthScreenForInit) {
				timeout = setTimeout(resizebleBlocks, 100);
			}
		}).triggerHandler('resize.resizebleBlocks');
	});
}

$(function () {
	resizebleBlocks()
})