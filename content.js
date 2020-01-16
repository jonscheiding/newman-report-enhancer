function highlightFailures() {
  $('.panel').each((i, panel) => {
    const failedCount = parseInt(
      $(panel)
        .find(':contains("Total failed tests")')
        .next()
        .text()
    );

    const collapseTarget = $(panel).find('.panel-collapse');
    
    if(failedCount == 0) {
      // $(panel).find('a[data-toggle="collapse"]').trigger('click');
      // window.postMessage({
      //   type: 'collapse',
      //   action: 'hide',
      //   id: $(panel).attr('id')
      // }, '*');
      $(collapseTarget).collapse('hide');
      return;
    }

    $(collapseTarget).collapse('show');

    $(panel).find('.panel-heading').addClass('failed');

    const assertionRows = $(panel).find('table > tbody > tr');
    assertionRows.each((i, row) => {
      const assertionFailedCount = parseInt(
        $(row)
          .find('td:nth-child(3)')
          .text()
      );

      if(assertionFailedCount > 0) {
        $(row).addClass('failed');
      }
    })
  });
}

$(() => {
  const checkElement = $('h3:contains("Newman Report")');
  if(checkElement.length == 0) {
    return;
  }

  checkElement.append(
    $('<button />')
      .addClass('btn btn-danger')
      .attr('data-action', 'highlight-failures')
      .text('Highlight Failures')
      .click(highlightFailures)
  );

  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('embed.js');
  s.type = 'text/javascript';
  (document.head || document.documentElement).appendChild(s);
});

$.fn.collapse = function(action) {
  this.each((i, element) => {
    window.postMessage({
      type: 'collapse',
      action: action,
      id: element.id
    }, '*');
  });
  
  return this;
}
