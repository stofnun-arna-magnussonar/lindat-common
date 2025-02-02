var $ = require('jquery');
var lindatRefBox = require('./refbox/main');
require('./refbox');

require('./lindat.less');

var partials = {
  'en': {
    header: require('./partials/header.html?lang=en'),
    footer: require('./partials/footer.html?lang=en')
  },
  'is': {
    header: require('./partials/header.html?lang=is'),
    footer: require('./partials/footer.html?lang=is')
  }
};

function switchLang(lang) {
  var header = partials[lang].header.replace(/<script[^>]*>/gi, ' <!-- ').replace(/<\/script>/gi, ' --> ');
  var footer = partials[lang].footer.replace(/<script[^>]*>/gi, ' <!-- ').replace(/<\/script>/gi, ' --> ');
  document.querySelector('header').innerHTML = header;
  document.querySelector('footer').innerHTML = footer;
}

function updateLoadedStyles() {
  $('#loaded-styles').empty();
  $('.css-select').prop('disabled', false);
  $('link[rel="stylesheet"]').each(function () {
    $('#loaded-styles').append($(this).attr('href') + '\n');
  });
}

function injectStylesheets(url) {
  var SERVICE_URL = 'https://lindat-extractor.herokuapp.com';
  localStorage.setItem('url', url);

  $('link[injected]').remove();

  if (!url) {
    updateLoadedStyles();
    return;
  }

  $.ajax(SERVICE_URL + '/styles', {
    data: { uri: url }
  }).done(function (data) {
    data.forEach(function (item) {
      if (/lindat\.css$/.test(item)) {
        return;
      }
      $('head').append('<link rel="stylesheet" href="'+ item + '" type="text/css" injected="injected" />');
    });
    updateLoadedStyles();
  });
}

function switchHandle(handle, title) {
  var refbox = document.querySelector('#refbox');
  localStorage.setItem('handle', handle);
  localStorage.setItem('title', title);
  refbox.setAttribute('handle', handle);
  refbox.setAttribute('title', title);
  lindatRefBox(refbox, {
    rest: DEBUG ? DEV_REST_API : REST_API
  });
}

function init() {
  Array.prototype.slice.call(document.querySelectorAll('.lang-select')).forEach(function(elm) {
    var value = elm.getAttribute('value');
    elm.addEventListener('click', function() {
      localStorage.setItem('lang', value);
      switchLang(value);
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('.project-select')).forEach(function(elm) {
    var value = elm.getAttribute('value');
    elm.addEventListener('click', function() {
      localStorage.setItem('project', value);
      document.body.setAttribute('id', value);
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('.handle-select')).forEach(function(elm) {
    var value = elm.getAttribute('value');
    elm.addEventListener('click', function() {
      switchHandle(value, elm.textContent);
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('.css-select')).forEach(function(elm) {
    var value = elm.getAttribute('value');
    elm.addEventListener('click', function() {
      $('.css-select').prop('disabled', true);
      injectStylesheets(value);
    });
  });

  var lang = localStorage.getItem('lang') || 'en';
  var project = localStorage.getItem('project') || 'lindat-home';

  var handle = localStorage.getItem('handle') || '20.500.12537/184';
  var title = localStorage.getItem('title') || 'CLARIN-IS';
  var url  = localStorage.getItem('url') || '';

  injectStylesheets(url);
  switchHandle(handle, title);
  document.body.setAttribute('id', project);
  switchLang(lang);
}

$(init); // Execute on page load
