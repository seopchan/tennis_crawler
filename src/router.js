function route(handle, pathname, response, query) {
  console.log('about to route a request for ' + pathname);

  function handleQuery(query) {
    if (query) {
      console.log("handleQuery" + JSON.stringify(JSON.parse('{"' + decodeURI(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')));
      return JSON.parse('{"' + decodeURI(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
    } else {
      return {};
    }
  }

  if (typeof handle[pathname] === 'function') {
    const params = {
      query: handleQuery(query)
    };

    handle[pathname](response, params);
  } else {
    console.log('no request handler found for ' + pathname);
    response.writeHead(404, {'Content-Type' : 'text/plain'});
    response.write('404 Not found');
    response.end();
  }
}

export default route;