// get base url
let baseHref = window.location.origin
let $base = $('base')
if ($base.length)
	baseHref = $base.prop('href')
global.baseUrl = baseHref.substr(-1) === '/' ? baseHref.slice(0, baseHref.length - 1) : baseHref

// imports
import FormValidation from 'directives/FormValidation'

// The no-js class is provided in order to allow you to more easily and explicitly add custom styles based
// on whether JavaScript is disabled (.no-js) or enabled (.js).
$('html.no-js').removeClass('no-js').addClass('js')

// app
// new Vue({
// 	el: '#app'
// })

new Vue({
	el: 'form[v-form-validation]',
	data: {
		errors: {},
		message: {}
	},
	directives: {
		FormValidation
	}
})