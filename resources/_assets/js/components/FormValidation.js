$(document).ready(function () {
	function appendError(input, form) {
		input.parents('.form-group, .form-check')
			.addClass('has-error')
			.append('<small class="form-text">' + input.attr('data-error') + '</small>')

		form.find('.submit-form').prop('disabled', true)
	}

	function validateInput(input, form) {
		var regexp = RegExp('^[a-zA-Z0-9+\\.+\\-\\_]+@([a-zA-Z0-9]+\\.)+[a-zA-Z]+$')

		form.removeClass('success')

		input.parents('.form-group, .form-check').removeClass('has-error').find('.form-text').remove()

		if (!form.find('.form-group, .form-check').hasClass('has-error')) {
			form.find('.submit-form').prop('disabled', false)
		}

		if (input.is('[required]')) {
			if (!input.val()) {
				appendError(input, form)
			} else if (input.attr('type') == 'email' && !regexp.test(input.val())) {
				appendError(input, form)
			} else if (input.is('[type="checkbox"][required]') && !input.is(':checked')) {
				appendError(input, form)
			}
		}
	}

	function scrollForm(position) {
		var windowTop = $(window).scrollTop()

		if (windowTop > position) {
			$('html, body').animate({ 'scrollTop': position })
		}
	}

	function scrollToFirstError(form) {
		var $errorField = form.find('.has-error')

		if ($errorField.length) {
			var errorTop = $errorField.first().offset().top - 10

			scrollForm(errorTop)
		}
	}

	$('form.validate').find('input, textarea, select').on('focusout', function () {
		var self = $(this)

		if (self.val().length) {
			validateInput(self, self.parents('form'))
		}
	})

	$('form.validate').find('input, textarea, select').on('change', function () {
		var self = $(this)

		validateInput(self, self.parents('form'))
	})

	$('form.validate').find('input, textarea, select').on('keyup', function () {
		var self = $(this)

		if (self.parents('.form-group').hasClass('has-error')) {
			validateInput(self, self.parents('form'))
		}
	})

	$('form.validate').on('submit', function (event) {
		event.preventDefault()

		var submitBtn = $(this).find('.submit-form')
		var form = $(this)

		form.removeClass('success')

		$.each(form.find('input, textarea, select').filter('[required]:visible, [type="checkbox"][required]'), function (index, item) {
			if (!$(item).val().length || $(item).is('[type="checkbox"]') && !$(item).is(':checked')) {
				appendError($(item), form)
			}
		})

		scrollToFirstError(form)

		if (!form.find('input, textarea, select').filter('[required]:visible, [type="checkbox"][required]').parents('.form-group, .form-check').hasClass('has-error')) {
			var formData = new FormData(form[0])

			submitBtn.addClass('loading')
				.append('<span class="loader"></span>')
				.prop('disabled', true)

			$.ajax({
				url: form.attr('action'),
				type: form.attr('method'),
				data: formData,
				processData: false,
				contentType: false
			}).done(function (response, textStatus, xhr) {
				submitBtn.removeClass('loading')
					.prop('disabled', false)
					.find('.loader')
					.remove()

				if (xhr.status == 200) {
					form.addClass('success')

					var $successAlert = form.find('.form-alert-success')

					if ($successAlert.length) {
						$successAlert.find('.response-message').html(response.message)

						scrollForm($successAlert.offset().top - 10)
					}
				}

				if (response.redirect) {
					submitBtn.prop('disabled', true)

					setTimeout(function () {
						window.location = response.redirect
					}, 1000)
				} else {
					form[0].reset()
					$('.selectpicker').selectpicker('refresh')
				}
			}).fail(function (error) {
				submitBtn.removeClass('loading')
					.find('.loader')
					.remove()

				$.each(form.find('input, textarea, select'), function (index, item) {
					var name = $(item).attr('name')

					if (error.responseJSON.errors[name]) {
						$(item).parents('.form-group, .form-check').addClass('has-error')

						$(item).parents('.form-group, .form-check').append('<small class="form-text">' + error.responseJSON.errors[name][0] + '</small>')
					}
				})

				scrollToFirstError(form)
			})
		}
	})
})