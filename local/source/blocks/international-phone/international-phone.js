// поле номера с селектом кода страны
function internationalPhone() {
	if (window.intlTelInput) {
		var countryMaskArr = {
			ru: '+7 (999) 999-99-99',
			by: '+375 (99) 999-99-99',
			kz: '+7 (999) 999-99-99',
			ua: '+380 (99) 999-99-99'
		}

		$('.js-international-phone').each(function () {
			var telInput = $(this)
			var label = telInput.closest('label')

			var iti = window.intlTelInput(telInput[0], {
				initialCountry: 'auto',
				geoIpLookup: function (callback) {
					$.get('http://ip-api.com/json/', function (resp) {
						var countryCode = (resp && resp.countryCode) ? resp.countryCode : '';
						callback(countryCode);
					}, 'jsonp')
				},
				nationalMode: false,
				onlyCountries: ['ru', 'by', 'kz', 'ua'],
				utilsScript: telInput.data('utilPath')
			});

			telInput.on('countrychange', function () {
				var countryKey = iti.getSelectedCountryData().iso2

				if (countryKey) {
					telInput.blur()
					telInput.val('')
					telInput.mask(countryMaskArr[countryKey])
				}
			});

			telInput.off('focus.intlTelInput').on('focus.intlTelInput', function () {
				label.addClass('focus')
			})
			telInput.off('blur.intlTelInput').on('blur.intlTelInput', function () {
				label.removeClass('focus')
			})
		})
	}
}

$(function () {
	internationalPhone()
})