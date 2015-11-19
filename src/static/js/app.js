/*
* http://addyosmani.com/blog/essential-js-namespacing/
*/
(function(app) {
  'use strict';
  /*global FB, Foundation*/

  app.menuActiveFeatureClicked = function() {
    if (typeof Foundation !== undefined) Foundation.libs.topbar.toggle();
  };

  app.facebookShareBlog = function(ingress, path, title, pictureUrl) {
    event.preventDefault();
    FB.ui(
    {
      method: 'share',
      href: 'https://filosofianakatemia.fi/blogi/' + path,
      picture: pictureUrl,
      title: title,
      description: ingress
    },
    function(/*response*/) {
      return null;
    });
  };

  app.twitterShareBlog = function(path, title) {
    event.preventDefault();
    // http://gpiot.com/blog/elegant-twitter-share-button-and-dialog-with-jquery/
    var sharelUrl = 'https://filosofianakatemia.fi/blogi/' + path;
    var shareVia = 'filosofianakate';
    var url = 'http://twitter.com/share?via=' + shareVia + '&amp;url=' + sharelUrl + '&amp;text=' + title;
    window.open(url, '_blank', 'height=420, width=550');
  };

  app.linkedInShareBlog = function(ingress, path, title) {
    event.preventDefault();
    var sharelUrl = 'https://filosofianakatemia.fi/blogi/' + path;
    var url = 'https://www.linkedin.com/shareArticle?mini=true&url=' + sharelUrl + '&title=' + title +
    '&summary=' + ingress + '&source=Filosofian%20Akatemia';
    window.open(url, '_blank', 'height=420, width=550');
  };

  function httpGetAsync(theUrl, callback)
  {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
    };
    xmlHttp.open('GET', theUrl, true); // true for asynchronous
    xmlHttp.send(null);
  }

  app.getShareCount = function(path) {
    // http://stackoverflow.com/a/19119580
    var totalCount = 0;
    var totalCountElement = document.getElementById('total-shares_count');
    var sharelUrl = 'https://filosofianakatemia.fi/blogi/' + path;

    var facebookUrl = 'https://api.facebook.com/method/links.getStats?urls=' + sharelUrl + '&format=json';
    httpGetAsync(facebookUrl, facebookCount);
    function facebookCount(response) {
      totalCount += JSON.parse(response)[0].share_count;
      if (totalCountElement) {
        totalCountElement.innerHTML = totalCount;
      }
    }

    var twitterUrl = 'http://cdn.api.twitter.com/1/urls/count.json?url=' + sharelUrl;
    httpGetAsync(twitterUrl, twitterCount);
    function twitterCount(response) {
      totalCount += JSON.parse(response).count;
      if (totalCountElement) {
        totalCountElement.innerHTML = totalCount;
      }
    }

    var linkedInUrl = 'http://www.linkedin.com/countserv/count/share?url=' + sharelUrl + '&format=json';
    httpGetAsync(linkedInUrl, linkedInCount);
    function linkedInCount(response) {
      totalCount += JSON.parse(response).count;
      if (totalCountElement) {
        totalCountElement.innerHTML = totalCount;
      }
    }
  };

})(window.app = window.app || {});
