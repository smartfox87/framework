// инициализация карусели (Swiper)
function initCarousel() {
	if (window.Swiper) {
		var win = $(window)
		var doc = $(document)
		var timeout = null

		// получать расстояние до видимости блока при скролле страницы
		function getVisibleElemOnScroll(elemJQ, reserveHeight) {
			if (elemJQ.length > 0) {
				return elemJQ.offset().top - (doc.scrollTop() + win.height() + reserveHeight) < 0
			}
			return false
		}

		// инициализация слайдера если он в зоне видимости или приближается к ней (ближе 500рх) и до сих пор не инициализирован
		function initSwiper(elemJQ, optionSwiper) {
			if (!elemJQ.hasClass('swiper-container-initialized') && getVisibleElemOnScroll(elemJQ, 500)) {
				// переопределение параметров слайдера переданных в атрибуте компонента
				var options = elemJQ.data('options')
				if (options) {
					Object.keys(options).forEach((key) => {
						if (typeof options[key] !== 'undefined') {
							optionSwiper[key] = options[key];
						}
					});
				}

				return new Swiper(elemJQ[0], optionSwiper)
			}
		}

		// добаления класса если ширины всех слайдов не достаточно для скролла
		function toggleClassSwiper(parent, widthAllItems) {
			parent.toggleClass('swiper-empty', 'parent.width() > widthAllItems')
		}

		// ******************************************************************************
		var optionSwiper = {
			slidesPerView: 5,
			slidesPerGroup: 5,
			// slidesPerView: 'auto',
			spaceBetween: 5,
			// Индексный номер начального слайда.
			initialSlide: 0,

			// slideToClickedSlide: true,

			// infinity scroll
			loop: true,
			loopedSlides: 5,
			loopAdditionalSlides: 5,

			autoHeight: false,

			a11y: {
				prevSlideMessage: 'Предыдущий слайд',
				nextSlideMessage: 'Следующий слайд',
				firstSlideMessage: 'Это первый слайд',
				lastSlideMessage: 'Это последний слайд',
				paginationBulletMessage: 'Перейти к слайду {{index}}'
			},

			// пересчет положения слайдов при ресайзе окна
			updateOnWindowResize: false,

			// если слайдов не хватает для скролла - центровать те что есть, не совместим с бесконечным скролом
			centerInsufficientSlides: true,
			// Если true, то активный слайд будет центрирован, а не всегда слева.
			centerSlides: true,
			// Если true, то активный слайд будет центрирован без добавления пробелов в начале и конце слайдера. Обязательно centeredSlides: true. Не предназначен для использования с loopилиpagination
			centerSlidesBounds: true,

			// скрывать навигацию если не хватает слайдов
			watchOverflow: true,

			// если родительский контейнер не виден (display none)
			observer: true,
			observeParents: true,

			// Если этот параметр отключен, то слайдер не будет двигаться, пока вы удерживаете на нем палец
			// followFinger: false,

			// дистанция при движении мыши после которой сработает событие перетаскивания
			threshold: 60,
			// Допустимый угол (в градусах) для срабатывания сенсорного перемещения
			touchAngle: 45,

			// Разрешить отпускать сенсорные события в положении края ползунка (начало, конец) также блочит скролл не полного слайдера
			touchReleaseOnEdges: true,

			// lazy load images
			watchSlidesVisibility: true,
			lazy: {
				loadPrevNext: true,
				loadOnTransitionStart: true,
			},

			// инертность свайпа слайдов
			freeMode: true,
			freeModeSticky: true,

			// Responsive breakpoints
			breakpoints: {
				420: {
					slidesPerView: 1,
					pagination: {
						dynamicBullets: true,
						dynamicMainBullets: 7,
					},
				},
				580: {
					slidesPerView: 2,
					pagination: {
						dynamicBullets: false,
					},
				},
				740: {
					slidesPerView: 3,
					pagination: {
						dynamicBullets: false,
					},
				},
			},

			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},

			pagination: {
				el: '.swiper-pagination',
				type: 'bullets',
				// type: 'fraction',
				clickable: true,
				dynamicBullets: 5,
			},

			on: {
				init: function () {
					// исправление бага с нерабочим свайпом слайда в фокусе на мобилке
					$(this.slides).each(function (ind, elem) {
						$(this).off('click.toggleSlide').on('click.toggleSlide', function () {
							elem.blur()
						})
					})

					// добаления класса если ширины всех слайдов не достаточно для скролла
					var parent = $(this.$el)
					var widthAllItems = this.slidesSizesGrid.reduce(function (sum, curr) {
						return sum + curr
					})
					toggleClassSwiper(parent, widthAllItems)
				},

				beforeDestroy: function () {
					// удаление стилей оставшихся от слайдера
					var wrapper = $(this.$wrapperEl)
					var slides = wrapper.find('.swiper-slide')
					setTimeout(function () {
						wrapper.removeAttr('style')
						slides.removeAttr('style')
					}, 1000)
				},

				resize: function () {
					var parent = $(this.$el)

					// добаления класса если ширины всех слайдов не достаточно для скролла
					var widthAllItems = this.slidesSizesGrid.reduce(function (sum, curr) {
						return sum + curr
					})
					toggleClassSwiper(parent, widthAllItems)
				},

				slidePrevTransitionEnd: function () {
					// добаления класса когда слайдер дошел до конца
					$(this.$el).removeClass('swiper-end')
				},

				reachEnd: function () {
					// удаление класса когда возврат на спредыдущий слайд
					$(this.$el).addClass('swiper-end')
				},

				slideChangeTransitionEnd: function () {
					// остановка предыдущего видео youtube iframe при его наличии
					if (View.youtubeVideoPlayed) {
						View.callYuotubeIframePlayer(View.youtubeVideoPlayed, 'pauseVideo')
					}
					// запуск видео youtube iframe в слайде
					View.youtubeVideoPlayed = $(this.slides).filter('.swiper-slide-active').find('iframe')[0]
					View.callYuotubeIframePlayer(View.youtubeVideoPlayed, 'playVideo')
				},

				// переключение динамических (прятающихся) буллетов на разных брэйкпойнтах
				breakpoint: function (swiper) {
					if (swiper.params.pagination.dynamicBullets) {
						swiper.pagination.init()
					} else {
						setTimeout(function () {
							swiper.pagination.el.style.width = '100%'
							swiper.pagination.el.classList.remove('swiper-pagination-bullets-dynamic')
						})
					}
				},
			}
		}

		// одиночная карусель
		function initSingleSwiper() {
			initSwiper($('.js-carousel--1'), optionSwiper)
		}

		win.off('scroll.initSingleSwiper').on('scroll.initSingleSwiper', initSingleSwiper)
		win.trigger('scroll.initSingleSwiper')

		// карусель только для адаптива
		var swiper_3 = {}

		function initOnlyAdaptiveSwipers() {
			if (win.width() <= 1024) {
				if (!'$el' in swiper_3) {
					swiper_3 = initSwiper($('.js-carousel--3'), optionSwiper)
				}
			} else {
				if (swiper_3.destroy) swiper_3.destroy(true, true)
			}
		}

		win.off('resize.initOnlyAdaptiveSwipers').on('resize.initOnlyAdaptiveSwipers', function () {
			clearTimeout(timeout)
			timeout = setTimeout(initOnlyAdaptiveSwipers, 300)
		})
		win.off('scroll.initOnlyAdaptiveSwipers').on('scroll.initOnlyAdaptiveSwipers', initOnlyAdaptiveSwipers)
		win.trigger('scroll.initOnlyAdaptiveSwipers')

		// *******************************************************************************

		// повторяющаяся карусель
		$('.js-carousel--2').each(function (ind) {
			var carouselElemJQ = $(this)

			function initSwiper_2() {
				initSwiper(carouselElemJQ, optionSwiper)
			}

			win.off('scroll.initSwiper_2_' + ind).on('scroll.initSwiper_2_' + ind, initSwiper_2)
			win.trigger('scroll.initSwiper_2_' + ind)
		})


		// инициализация слайдера
		var mySwiper = new Swiper('.js-slider', {
			effect: 'cube',
			speed: 800,

			// infinity scroll
			loop: true,
			a11y: false,

			autoplay: {
				delay: 5000,
				disableOnInteraction: false,
			},

			pagination: {
				el: '.swiper-pagination',
				type: 'bullets',
				clickable: true,
			},

			on: {
				init: function () {
					setTimeout(initAutoplay, 10, this)
					setTimeout(function () {
						mySwiper.on('slideChangeTransitionStart', function () {
							initAutoplay(this)
						}, 20);
					})
				},
			}
		});

		// реализация анимации буллетов при переключении сладов
		function initAutoplay(_this) {
			var parent = $(_this.el)
			var autoplayTimeCurrentSlide = parseInt(_this.$wrapperEl.find('.swiper-slide-active').attr('data-swiper-autoplay')) + 700
			var dots = parent.find('.swiper-pagination-bullet')
			var activeDot = parent.find('.swiper-pagination-bullet-active')
			var allSvg = dots.find('svg')

			// защита от повторного запуска инициализации
			if (!initAutoplay.init) {
				// вставка свг в дотсы пагинации
				dots.html(`<svg class="svg-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50"></circle>
                 </svg>`)

				// остановка автоплэя и анимации дотсов при ховере на слайдер
				parent.off('mouseenter.stopAutoPlay mousemove.stopAutoPlay').on('mouseenter.stopAutoPlay mousemove.stopAutoPlay', function () {
					_this.autoplay.stop();
					dots.find('svg').removeClass('animate').css({transitionDuration: ''})
				})
				// запуск автоплэя и анимации дотсов при потере ховера на слайдере
				parent.off('mouseleave.startAutoPlay').on('mouseleave.startAutoPlay', function () {
					_this.autoplay.start();
					parent.find('.swiper-pagination-bullet-active').find('svg').addClass('animate').css({transitionDuration: autoplayTimeCurrentSlide + 'ms'})
				})

				initAutoplay.init = true
			}

			// остановка анимации дотса
			allSvg.removeClass('animate').css({transitionDuration: ''})

			// запуск анимации дотса
			activeDot.find('svg').addClass('animate').css({transitionDuration: autoplayTimeCurrentSlide + 'ms'})
		}

		// ******************************************************************************
		// карусель с навигацией
		var navCarousel = initSwiper($('.js-carousel-w-nav--navigation'), {
			direction: 'vertical',
			slidesPerView: 4,
			spaceBetween: 10,

			// если слайдов не хватает для скролла - центровать те что есть, не совместим с бесконечным скролом
			watchOverflow: true,
			centerInsufficientSlides: true,

			// lazy load images
			watchSlidesProgress: true,
			watchSlidesVisibility: true,
			lazy: {
				loadPrevNext: true,
				loadOnTransitionStart: true,
			},

			// Responsive breakpoints
			breakpoints: {
				310: {
					slidesPerView: 3,
					direction: 'horizontal',
				},
				600: {
					slidesPerView: 4,
				},
			},
		})
		initSwiper($('.js-carousel-w-nav--main'), {
			effect: 'fade',
			// lazy load images
			lazy: {
				loadPrevNext: true,
				loadOnTransitionStart: true,
			},

			thumbs: {
				swiper: navCarousel
			},

			navigation: {
				nextEl: '.js-swiper-w-nav-button-next',
				prevEl: '.js-swiper-w-nav-button-prev',
			},
		})
	}
}

// реализация автоплэя слайдеров и анимации часов на дотсах от Пети
$('.js-slider-w-timer').each(function () {
	var slider = $(this);
	var block = slider.closest('.js-slider-w-timer-block');
	var slides = slider.find('.js-slider-w-timer__slide');
	var options = JSON.parse(slider.attr('data-slider'));
	var dots = '<div class="slider-w-timer-dots js-slider-w-timer__dots">';
	for (var i = 0; i < slides.length; i++)
		dots += '<svg viewBox="0 0 16 16" class="slider-w-timer-dot js-slider-w-timer__dot" data-slide="' + i + '">' +
			'<circle cx="8" cy="8" r="7"/><circle class="slider-w-timer-dot-progress js-slider-w-timer__dot-progress" cx="8" cy="8" r="7"/>' +
			'</svg>';
	dots += '</div>';

	slides.each(function (index) {
		$(this).attr('data-slide', index).addClass(index == 0 ? 'active' : null).prepend(dots);
	});

	slider.closest('.js-slider-w-timer-block').append(dots).children('.js-slider-w-timer__dots').addClass('slider-w-timer-dots--common');


	// autoplay iniitialization
	if (typeof options == 'object' && options.autoplay) {
		var autoplayTimeout = null;
		var curSlide = 0;

		slider.off('afterChange.setAutoplayTimer').on('afterChange.setAutoplayTimer', function (e, slick, currentSlide) {
			curSlide = currentSlide;

			setDot();

			if (slider.is(':hover'))
				return;

			startTimeout();

			block.addClass('loading');
		});

		block.off('mouseenter.setAutoplayTimer').on('mouseenter.setAutoplayTimer', function () {
			clearTimeout(autoplayTimeout);
			block.removeClass('loading');
		});

		block.off('mouseleave.setAutoplayTimer').on('mouseleave.setAutoplayTimer', startTimeout);

		function startTimeout() {
			clearTimeout(autoplayTimeout);
			autoplayTimeout = setTimeout(function () {
				var delta = slider.slick('slickGetOption', 'slidesToScroll');
				slider.slick('slickGoTo', curSlide + delta < slides.length ? Math.min(slides.length, curSlide + delta) : 0);
			}, options.autoplaySpeed);

			block.addClass('loading');
		}

		function setDot() {
			block
				.find('.js-slider-w-timer__dot')
				.removeClass('active')
				.filter('[data-slide="' + curSlide + '"]')
				.addClass('active')
				.find('.js-slider-w-timer__dot-progress')
				.css('transition-duration', options.autoplaySpeed ? options.autoplaySpeed + 'ms' : '');
		}

		setDot();
		startTimeout();
	}
});
$(function () {
	initCarousel()
})