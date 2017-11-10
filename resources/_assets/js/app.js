// get base url
let $base = $('base')
let baseHref = window.location.origin
if ($base.length)
    baseHref = $base.prop('href')
global.baseUrl = baseHref.substr(-1) === '/' ? baseHref.slice(0, baseHref.length - 1) : baseHref

// The no-js class is provided in order to allow you to more easily and explicitly add custom styles based
// on whether JavaScript is disabled (.no-js) or enabled (.js).
$('html.no-js').removeClass('no-js').addClass('js')

// ...
console.log('it works!')