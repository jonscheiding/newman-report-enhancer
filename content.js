function highlightFailedAssertions(panel) {
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
}

function highlightFailedTests() {
  $('.panel').each((i, panel) => {
    const failedCount = parseInt(
      $(panel)
        .find(':contains("Total failed tests")')
        .next().text()
    );

    if(failedCount == 0) {
      return;
    }

    $(panel).addClass('failed');

    highlightFailedAssertions(panel);
  });
}

function togglePanelCollapseBasedOnTestResult() {
  $('.panel.failed .panel-collapse').collapse('show');
  $('.panel:not(.failed) .panel-collapse').collapse('hide');
}

function highlightFailures() {
  highlightFailedTests();
  togglePanelCollapseBasedOnTestResult();
}

function createHighlightFailuresButton(parent) {
  parent.append(
    $('<button />')
      .addClass('btn btn-danger')
      .attr('data-action', 'highlight-failures')
      .text('Highlight Failures')
      .click(highlightFailures)
  );
}

function createCollapsePlugin() {
  embedScriptInHostPage(chrome.runtime.getURL('embed.js'));

  //
  // Create a jQuery plugin function that uses postMessage to talk to 
  // the host page for collapsing/expanding panels.
  //
  // See the other side of this communication in embed.js
  //
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
}

function embedScriptInHostPage(url) {
  var s = document.createElement('script');
  s.src = url;
  s.type = 'text/javascript';
  (document.head || document.documentElement).appendChild(s);
}

$(() => {
  const checkElement = $('h3:contains("Newman Report")');
  if(checkElement.length == 0) {
    return;
  }

  createHighlightFailuresButton(checkElement);

  createCollapsePlugin();
});
