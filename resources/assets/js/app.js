const baseHref = window.location.href
global.baseUrl = baseHref.substr(-1) === '/' ? baseHref.slice(0, baseHref.length - 1) : baseHref

// The no-js class is provided in order to allow you to more easily and explicitly add custom styles based
// on whether JavaScript is disabled (.no-js) or enabled (.js).
// Using this technique also helps avoid the FOUC.
// https://github.com/h5bp/html5-boilerplate/blob/6.0.1/dist/doc/html.md#the-no-js-class
$('html.no-js').removeClass('no-js').addClass('js')

// ...
console.log('it works!')