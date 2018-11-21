/**
 * @module List
 */

/**
 * controls and populates the tag cloud in a given page<br/>
 *  {{#crossLink "TagsTests"}}Unit Tests{{/crossLink}}
 * @class Tags
 */


/**
 * the selection of tags to display
 * @property selection
 * @default 0
 * @type int
 */
var selection = 0;

// window bindings
window.loadTags = loadTags;

/**
 * the cloud HTML element in which to insert the tags
 * @property tagCloud
 * @type HTMLElement
 */
var tagCloud = $('#tagCloud');

/**
 * The left arrow that controls the tagCloud HTML element
 * @property arrowLeft
 * @type HTMLElement
 */
var arrowLeft = tagCloud.find('.arrow-left');

/**
 * The right arrow that controls the tagCloud HTML element
 * @property arrowRight
 * @type HTMLElement
 */
var arrowRight = tagCloud.find('.arrow-right');

/**
 * loads tags for a tag cloud
 * @method loadTags
 * @param {int} next
 * either 1 or -1, to determine whether to get the next or previous selections
 * of tags
 */
function loadTags(type, next) {
  selection += next;
  if(selection <= 0) {
    selection = 0;
  }
  var fetchURL = type + '?tagsOnly=true&page=' + selection;
  if(type==='explore') {
    fetchURL = '/api/tags/'+selection;
  }
  $.get(fetchURL).done(function(data) {
    if($(data).find('.tag').length === 0) {
      selection-=1;
      arrowRight.hide();
      return;
    }
    $('#tagCloud').html($(data).html());
    arrowLeft = tagCloud.find('.arrow-left');
    arrowRight = tagCloud.find('.arrow-right');
    hideShowArrows();
  });
}


function hideShowArrows() {
  $('#tagCloud').find('.arrow-left').css('display','block');

  if(selection === 0) {
    $('#tagCloud').find('.arrow-left').css('display','none');
  }
  $('#tagCloud').find('.arrow-right').css('display','block');
  if($('.tag').length < 20) {
  $('#tagCloud').find('.arrow-left').css('display','none');
  }
}


/**
 * hide left button on page load
 * @method onReady
 */
function onReady() {
  hideShowArrows();
}
$(onReady);
