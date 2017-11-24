export default {
	inserted (el, binding, vnode) {
		const $form = $(el)
		const $modal = $form.closest('.modal')
		const url = vnode.data.attrs.action
		const method = vnode.data.attrs.method

		$form.on('submit', event => {
			event.preventDefault()

			// reset errors and messages
			vnode.context.errors = {}
			vnode.context.message = {}

			const data = $form.serialize()
			const request = $.ajax({
				method,
				url,
				data
			})

			request.fail((xhr, status, error) => {
				const response = xhr.responseJSON ? xhr.responseJSON : JSON.parse(xhr.responseText)
				switch (xhr.status) {
					case 422:
						// validation error
						vnode.context.message = {
							class: 'danger',
							text: '<strong>Uh oh.</strong> Something went wrong. Try again later!'
						}
						vnode.context.errors = response
						break

					case 500:
						// server error
						vnode.context.message = {
							class: 'danger',
							text: '<strong>Uh oh.</strong> Something went wrong. Try again later!'
						}
						break

					default:
						// handle other errors
				}
			})

			request.done((data, status, xhr) => {
				vnode.context.message = {
					class: 'success',
					text: '<strong>Yay!</strong> You have successfully logged in.'
				}

				// show successful message
				console.log(data)
			})
		})

		if ($modal.length)
			$modal.on('hidden.bs.modal', () => {
				// reset errors and messages
				vnode.context.errors = {}
				vnode.context.message = {}
			})
	}
}