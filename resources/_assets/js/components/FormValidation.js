$(document).ready(function () {
	function appendError(input, form) {
		input.parents('.form-group')
			.addClass('has-error')
			.append('<small class="form-text">' + input.attr('data-error') + '</small>')

		form.find('.submit-form').prop('disabled', true)
	}

	$('form').find('input, textarea, select').on('change keyup paste focusout', function () {
		var form = $(this).parents('form')
		var regexp = RegExp('^[a-zA-Z0-9+\\.+\\-\\_]+@([a-zA-Z0-9]+\\.)+[a-zA-Z]+$')
		var self = $(this)

		form.removeClass('success')

		self.parents('.form-group').removeClass('has-error').find('.form-text').remove()

		if (!form.find('.form-group').hasClass('has-error')) {
			form.find('.submit-form').prop('disabled', false)
		}

		if (!self.val()) {
			appendError(self, form)
		} else if (self.attr('type') == 'email' && !regexp.test(self.val())) {
			appendError(self, form)
		}
	})

	$('form .submit-form').on('click', function (event) {
		event.preventDefault()

		var self = $(this)
		var form = self.parents('form')

		form.removeClass('success')

		$.each(form.find('input, textarea, select').filter('[required]:visible'), function (index, item) {
			if (!$(item).val().length) {
				appendError($(item), form)
			}
		})

		if (!form.find('input, textarea, select').filter('[required]:visible').parents('.form-group').hasClass('has-error')) {
			var formData = new FormData(form[0])

			self.addClass('loading').append('<span class="loader"></span>')

			$.ajax({
				url: form.attr('action'),
				type: form.attr('method'),
				data: formData,
				processData: false,
				contentType: false
			}).done(function (xml, textStatus, xhr) {
				self.removeClass('loading').find('.loader').remove()
				form[0].reset()

				if (xhr.status == 200) {
					form.addClass('success')
				}
			}).fail(function (error) {
				self.removeClass('loading')
					.find('.loader')
					.remove()
					.prop('disabled', true)

				$.each(form.find('input, textarea, select'), function (index, item) {
					var name = $(item).attr('name')

					if (error.responseJSON.errors[name]) {
						$(item).parents('.form-group').addClass('has-error')

						$(item).parents('.form-group').append('<small class="form-text">' + error.responseJSON.errors[name[0]] + '</small>')
					}
				})
			})
		}
	})
})