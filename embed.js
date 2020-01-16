window.addEventListener('message', event => {
  switch(event.data.type) {
    case 'collapse':
      $('#' + event.data.id).collapse(event.data.action);
  }
});
