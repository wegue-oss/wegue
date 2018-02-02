import Vue from 'vue';

/**
 * Directive to make a window component draggable by dragging it's header.
 * Proudly inspired by https://www.w3schools.com/howto/howto_js_draggable.asp
 */
export const DraggableWin = {
  bind (elmnt, binding, vnode) {
    var pos1 = 0;
    var pos2 = 0;
    var pos3 = 0;
    var pos4 = 0;

    // get the header element to bind the events on it
    var header = elmnt.querySelector('nav');
    if (!header) {
      return;
    }
    header.onmousedown = dragMouseDown;

    function dragMouseDown (e) {
      e = e || window.event;
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag (e) {
      e = e || window.event;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // set the Vue component's new position:
      vnode.componentInstance.$parent.top = (elmnt.offsetTop - pos2) + 'px';
      vnode.componentInstance.$parent.left = (elmnt.offsetLeft - pos1) + 'px';
    }

    function closeDragElement () {
      // stop moving when mouse button is released
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
};

// Make directive available globally
Vue.directive('draggable-win', DraggableWin);
