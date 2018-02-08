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

		if (!input.val()) {
			appendError(input, form)
		} else if (input.attr('type') == 'email' && !regexp.test(input.val())) {
			appendError(input, form)
		} else if (input.is('[type="checkbox"][required]') && !input.is(':checked')) {
			appendError(input, form)
		}
	}

	$('form').find('input, textarea, select').on('paste change focusout', function () {
		validateInput($(this), $(this).parents('form'))
	})

	var timer

	$('form').find('input, textarea, select').on('keyup', function () {
		var self = $(this)

		if (self.parents('.form-group, .form-check').hasClass('has-error')) {
			validateInput(self, self.parents('form'))
		} else if (self.val().length) {
			clearTimeout(timer)

			timer = setTimeout(function () {
				validateInput(self, self.parents('form'))
			}, 500)
		}
	})

	$('form').on('submit', function (event) {
		event.preventDefault()

		var submitBtn = $(this).find('.submit-form')
		var form = $(this)

		form.removeClass('success')

		$.each(form.find('input, textarea, select').filter('[required]:visible, [type="checkbox"][required]'), function (index, item) {
			if (!$(item).val().length || $(item).is('[type="checkbox"]') && !$(item).is(':checked')) {
				appendError($(item), form)
			}
		})

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
			}).done(function (xml, textStatus, xhr) {
				form[0].reset()
				$('.selectpicker').selectpicker('refresh')

				submitBtn.removeClass('loading')
					.prop('disabled', false)
					.find('.loader')
					.remove()

				if (xhr.status == 200) {
					form.addClass('success')
				}

				if (xml.redirect) {
					setTimeout(function () {
						window.location = xml.redirect
					}, 500)
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
			})
		}
	})
})