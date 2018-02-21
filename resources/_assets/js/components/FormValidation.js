$(document).ready(function () {
	// display error
	function appendError(input, form, object) {
		let error

		try {
			if (typeof JSON.parse(input.attr('data-error')) === 'object') {
				error = JSON.parse(input.attr('data-error'))[object]
			}
		} catch(e) {
			error = input.attr('data-error')
		}

		input
			.parents('.form-group, .form-check')
			.addClass('has-error')
			.append('<small class="form-text">' + error + '</small>')

		form
			.addClass('has-errors')
			.find('.submit-form')
			.prop('disabled', true)
	}

	// input validation
	function validateInput(input, form) {
		let regexp = RegExp('^[a-zA-Z0-9+\\.+\\-\\_]+@([a-zA-Z0-9]+\\.)+[a-zA-Z]+$')

		input
			.parents('.form-group, .form-check')
			.removeClass('has-error')
			.find('.form-text')
			.remove()

		form.removeClass('success')

		if (!form.find('.form-group, .form-check').hasClass('has-error')) {
			form
				.removeClass('has-errors')
				.find('.submit-form')
				.prop('disabled', false)
		}

		if (input.is('[required]')) {
			switch(input.attr('type')) {
				case 'email':
					if (!input.val()) {
						appendError(input, form, 'required')
					} else if (!regexp.test(input.val())) {
						appendError(input, form, 'invalid')
					}

					break
				case 'checkbox':
					if (!input.is(':checked')) {
						appendError(input, form)
					}

					break
				default:
					if (!input.val()) {
						appendError(input, form, 'required')
					}
			}
		}
	}

	// scroll to form top
	function scrollForm(position) {
		let windowTop = $(window).scrollTop()

		if (windowTop > position) {
			$('html, body').animate({ 'scrollTop': position })
		}
	}

	// scroll to error
	function scrollToFirstError(form) {
		let $errorField = form.find('.has-error')

		if ($errorField.length) {
			let errorTop = $errorField.first().offset().top - 10

			scrollForm(errorTop)
		}
	}

	// validate input on focus out
	$('form.validate').find('input, textarea, select').on('focusout', function () {
		let self = $(this)

		if (self.val().length) {
			validateInput(self, self.parents('form'))
		}
	})

	// validate input on change
	$('form.validate').find('input, textarea, select').on('change', function () {
		let self = $(this)

		validateInput(self, self.parents('form'))
	})

	// validate input on keyup
	$('form.validate').find('input, textarea, select').on('keyup', function () {
		let self = $(this)

		if (self.parents('.form-group').hasClass('has-error')) {
			validateInput(self, self.parents('form'))
		}
	})

	// submit form
	$('form.validate').on('submit', function (event) {
		event.preventDefault()

		let submitBtn = $(this).find('.submit-form')
		let form = $(this)

		// go through all elements and validate
		$.each(form.find('input, textarea, select'), function (index, item) {
			validateInput($(item), form)
		})

		// check if both passwords match
		let passwordOne = form.find('input').filter('[name="password"]')
		let passwordTwo = form.find('input').filter('[name="password_confirmation"]')

		if (passwordOne.length && passwordTwo.length && passwordOne.val().length && passwordTwo.val().length) {
			if (passwordOne.val() != passwordTwo.val()) {
				appendError(passwordOne, form, 'password_match')
			}
		}

		scrollToFirstError(form)

		if (!form.hasClass('has-errors')) {
			let formData = new FormData(form[0])

			submitBtn
				.addClass('loading')
				.append('<span class="loader"></span>')
				.prop('disabled', true)

			$.ajax({
				url: form.attr('action'),
				type: form.attr('method'),
				data: formData,
				processData: false,
				contentType: false
			}).done(function (response, textStatus, xhr) {
				submitBtn
					.removeClass('loading')
					.prop('disabled', false)
					.find('.loader')
					.remove()

				if (xhr.status == 200) {
					form.addClass('success')

					let $successAlert = form.find('.form-alert-success')

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
				submitBtn
					.removeClass('loading')
					.find('.loader')
					.remove()

				$.each(form.find('input, textarea, select'), function (index, item) {
					let name = $(item).attr('name')

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