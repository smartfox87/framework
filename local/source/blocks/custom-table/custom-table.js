// таблица на дивах с html структурой колонок
function tableWithColumns() {
    $('.js-table').each(function () {
        var columns = $(this).find('.js-table__column')
        var cellsHeight = []
        var timeout = null

        // расчет высоты ячеек
        function calcHeightCels() {
            // сброс массива максимальный высот ячеек в ряде
            cellsHeight.length = 0

            // получение высот ячеек и запись максимальный в массив
            columns.each(function () {
                $(this).find('.js-table__cell').each(function (index) {
                    var height = $(this).removeAttr('style').outerHeight()
                    if (!cellsHeight[index] || cellsHeight[index] < height) {
                        cellsHeight[index] = height
                    }
                })
            })

            // установка максимальных высот ячеек из массива
            columns.each(function () {
                $(this).find('.js-table__cell').each(function (index) {
                    $(this).css({minHeight: cellsHeight[index]})
                })
            })
        }

        $(window).off('resize.calcHeightCels').on('resize.calcHeightCels', function () {
            clearTimeout(timeout)
            timeout = setTimeout(calcHeightCels, 300)
        }).trigger('resize.calcHeightCels')
    })
}
$(function () {
tableWithColumns()
})