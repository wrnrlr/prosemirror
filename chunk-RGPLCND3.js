import {
  AllSelection,
  NodeSelection,
  Selection,
  TextSelection
} from "./chunk-UIQZLVQX.js";
import {
  dropPoint
} from "./chunk-HSTGJMAL.js";
import {
  DOMParser,
  DOMSerializer,
  Fragment,
  Mark,
  Slice
} from "./chunk-O5MLGE4X.js";

// node_modules/prosemirror-view/dist/index.es.js
var result = {};
if (typeof navigator != "undefined" && typeof document != "undefined") {
  ie_edge = /Edge\/(\d+)/.exec(navigator.userAgent);
  ie_upto10 = /MSIE \d/.test(navigator.userAgent);
  ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
  ie = result.ie = !!(ie_upto10 || ie_11up || ie_edge);
  result.ie_version = ie_upto10 ? document.documentMode || 6 : ie_11up ? +ie_11up[1] : ie_edge ? +ie_edge[1] : null;
  result.gecko = !ie && /gecko\/(\d+)/i.test(navigator.userAgent);
  result.gecko_version = result.gecko && +(/Firefox\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1];
  chrome = !ie && /Chrome\/(\d+)/.exec(navigator.userAgent);
  result.chrome = !!chrome;
  result.chrome_version = chrome && +chrome[1];
  result.safari = !ie && /Apple Computer/.test(navigator.vendor);
  result.ios = result.safari && (/Mobile\/\w+/.test(navigator.userAgent) || navigator.maxTouchPoints > 2);
  result.mac = result.ios || /Mac/.test(navigator.platform);
  result.android = /Android \d/.test(navigator.userAgent);
  result.webkit = "webkitFontSmoothing" in document.documentElement.style;
  result.webkit_version = result.webkit && +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1];
}
var ie_edge;
var ie_upto10;
var ie_11up;
var ie;
var chrome;
var domIndex = function(node2) {
  for (var index = 0; ; index++) {
    node2 = node2.previousSibling;
    if (!node2) {
      return index;
    }
  }
};
var parentNode = function(node2) {
  var parent = node2.assignedSlot || node2.parentNode;
  return parent && parent.nodeType == 11 ? parent.host : parent;
};
var reusedRange = null;
var textRange = function(node2, from2, to) {
  var range = reusedRange || (reusedRange = document.createRange());
  range.setEnd(node2, to == null ? node2.nodeValue.length : to);
  range.setStart(node2, from2 || 0);
  return range;
};
var isEquivalentPosition = function(node2, off, targetNode, targetOff) {
  return targetNode && (scanFor(node2, off, targetNode, targetOff, -1) || scanFor(node2, off, targetNode, targetOff, 1));
};
var atomElements = /^(img|br|input|textarea|hr)$/i;
function scanFor(node2, off, targetNode, targetOff, dir) {
  for (; ; ) {
    if (node2 == targetNode && off == targetOff) {
      return true;
    }
    if (off == (dir < 0 ? 0 : nodeSize(node2))) {
      var parent = node2.parentNode;
      if (!parent || parent.nodeType != 1 || hasBlockDesc(node2) || atomElements.test(node2.nodeName) || node2.contentEditable == "false") {
        return false;
      }
      off = domIndex(node2) + (dir < 0 ? 0 : 1);
      node2 = parent;
    } else if (node2.nodeType == 1) {
      node2 = node2.childNodes[off + (dir < 0 ? -1 : 0)];
      if (node2.contentEditable == "false") {
        return false;
      }
      off = dir < 0 ? nodeSize(node2) : 0;
    } else {
      return false;
    }
  }
}
function nodeSize(node2) {
  return node2.nodeType == 3 ? node2.nodeValue.length : node2.childNodes.length;
}
function isOnEdge(node2, offset, parent) {
  for (var atStart = offset == 0, atEnd = offset == nodeSize(node2); atStart || atEnd; ) {
    if (node2 == parent) {
      return true;
    }
    var index = domIndex(node2);
    node2 = node2.parentNode;
    if (!node2) {
      return false;
    }
    atStart = atStart && index == 0;
    atEnd = atEnd && index == nodeSize(node2);
  }
}
function hasBlockDesc(dom) {
  var desc;
  for (var cur = dom; cur; cur = cur.parentNode) {
    if (desc = cur.pmViewDesc) {
      break;
    }
  }
  return desc && desc.node && desc.node.isBlock && (desc.dom == dom || desc.contentDOM == dom);
}
var selectionCollapsed = function(domSel) {
  var collapsed = domSel.isCollapsed;
  if (collapsed && result.chrome && domSel.rangeCount && !domSel.getRangeAt(0).collapsed) {
    collapsed = false;
  }
  return collapsed;
};
function keyEvent(keyCode, key) {
  var event = document.createEvent("Event");
  event.initEvent("keydown", true, true);
  event.keyCode = keyCode;
  event.key = event.code = key;
  return event;
}
function windowRect(doc) {
  return {
    left: 0,
    right: doc.documentElement.clientWidth,
    top: 0,
    bottom: doc.documentElement.clientHeight
  };
}
function getSide(value, side) {
  return typeof value == "number" ? value : value[side];
}
function clientRect(node2) {
  var rect = node2.getBoundingClientRect();
  var scaleX = rect.width / node2.offsetWidth || 1;
  var scaleY = rect.height / node2.offsetHeight || 1;
  return {
    left: rect.left,
    right: rect.left + node2.clientWidth * scaleX,
    top: rect.top,
    bottom: rect.top + node2.clientHeight * scaleY
  };
}
function scrollRectIntoView(view, rect, startDOM) {
  var scrollThreshold = view.someProp("scrollThreshold") || 0, scrollMargin = view.someProp("scrollMargin") || 5;
  var doc = view.dom.ownerDocument;
  for (var parent = startDOM || view.dom; ; parent = parentNode(parent)) {
    if (!parent) {
      break;
    }
    if (parent.nodeType != 1) {
      continue;
    }
    var atTop = parent == doc.body || parent.nodeType != 1;
    var bounding = atTop ? windowRect(doc) : clientRect(parent);
    var moveX = 0, moveY = 0;
    if (rect.top < bounding.top + getSide(scrollThreshold, "top")) {
      moveY = -(bounding.top - rect.top + getSide(scrollMargin, "top"));
    } else if (rect.bottom > bounding.bottom - getSide(scrollThreshold, "bottom")) {
      moveY = rect.bottom - bounding.bottom + getSide(scrollMargin, "bottom");
    }
    if (rect.left < bounding.left + getSide(scrollThreshold, "left")) {
      moveX = -(bounding.left - rect.left + getSide(scrollMargin, "left"));
    } else if (rect.right > bounding.right - getSide(scrollThreshold, "right")) {
      moveX = rect.right - bounding.right + getSide(scrollMargin, "right");
    }
    if (moveX || moveY) {
      if (atTop) {
        doc.defaultView.scrollBy(moveX, moveY);
      } else {
        var startX = parent.scrollLeft, startY = parent.scrollTop;
        if (moveY) {
          parent.scrollTop += moveY;
        }
        if (moveX) {
          parent.scrollLeft += moveX;
        }
        var dX = parent.scrollLeft - startX, dY = parent.scrollTop - startY;
        rect = { left: rect.left - dX, top: rect.top - dY, right: rect.right - dX, bottom: rect.bottom - dY };
      }
    }
    if (atTop) {
      break;
    }
  }
}
function storeScrollPos(view) {
  var rect = view.dom.getBoundingClientRect(), startY = Math.max(0, rect.top);
  var refDOM, refTop;
  for (var x = (rect.left + rect.right) / 2, y = startY + 1; y < Math.min(innerHeight, rect.bottom); y += 5) {
    var dom = view.root.elementFromPoint(x, y);
    if (dom == view.dom || !view.dom.contains(dom)) {
      continue;
    }
    var localRect = dom.getBoundingClientRect();
    if (localRect.top >= startY - 20) {
      refDOM = dom;
      refTop = localRect.top;
      break;
    }
  }
  return { refDOM, refTop, stack: scrollStack(view.dom) };
}
function scrollStack(dom) {
  var stack = [], doc = dom.ownerDocument;
  for (; dom; dom = parentNode(dom)) {
    stack.push({ dom, top: dom.scrollTop, left: dom.scrollLeft });
    if (dom == doc) {
      break;
    }
  }
  return stack;
}
function resetScrollPos(ref) {
  var refDOM = ref.refDOM;
  var refTop = ref.refTop;
  var stack = ref.stack;
  var newRefTop = refDOM ? refDOM.getBoundingClientRect().top : 0;
  restoreScrollStack(stack, newRefTop == 0 ? 0 : newRefTop - refTop);
}
function restoreScrollStack(stack, dTop) {
  for (var i = 0; i < stack.length; i++) {
    var ref = stack[i];
    var dom = ref.dom;
    var top = ref.top;
    var left = ref.left;
    if (dom.scrollTop != top + dTop) {
      dom.scrollTop = top + dTop;
    }
    if (dom.scrollLeft != left) {
      dom.scrollLeft = left;
    }
  }
}
var preventScrollSupported = null;
function focusPreventScroll(dom) {
  if (dom.setActive) {
    return dom.setActive();
  }
  if (preventScrollSupported) {
    return dom.focus(preventScrollSupported);
  }
  var stored = scrollStack(dom);
  dom.focus(preventScrollSupported == null ? {
    get preventScroll() {
      preventScrollSupported = { preventScroll: true };
      return true;
    }
  } : void 0);
  if (!preventScrollSupported) {
    preventScrollSupported = false;
    restoreScrollStack(stored, 0);
  }
}
function findOffsetInNode(node2, coords) {
  var closest, dxClosest = 2e8, coordsClosest, offset = 0;
  var rowBot = coords.top, rowTop = coords.top;
  for (var child = node2.firstChild, childIndex = 0; child; child = child.nextSibling, childIndex++) {
    var rects = void 0;
    if (child.nodeType == 1) {
      rects = child.getClientRects();
    } else if (child.nodeType == 3) {
      rects = textRange(child).getClientRects();
    } else {
      continue;
    }
    for (var i = 0; i < rects.length; i++) {
      var rect = rects[i];
      if (rect.top <= rowBot && rect.bottom >= rowTop) {
        rowBot = Math.max(rect.bottom, rowBot);
        rowTop = Math.min(rect.top, rowTop);
        var dx = rect.left > coords.left ? rect.left - coords.left : rect.right < coords.left ? coords.left - rect.right : 0;
        if (dx < dxClosest) {
          closest = child;
          dxClosest = dx;
          coordsClosest = dx && closest.nodeType == 3 ? { left: rect.right < coords.left ? rect.right : rect.left, top: coords.top } : coords;
          if (child.nodeType == 1 && dx) {
            offset = childIndex + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0);
          }
          continue;
        }
      }
      if (!closest && (coords.left >= rect.right && coords.top >= rect.top || coords.left >= rect.left && coords.top >= rect.bottom)) {
        offset = childIndex + 1;
      }
    }
  }
  if (closest && closest.nodeType == 3) {
    return findOffsetInText(closest, coordsClosest);
  }
  if (!closest || dxClosest && closest.nodeType == 1) {
    return { node: node2, offset };
  }
  return findOffsetInNode(closest, coordsClosest);
}
function findOffsetInText(node2, coords) {
  var len = node2.nodeValue.length;
  var range = document.createRange();
  for (var i = 0; i < len; i++) {
    range.setEnd(node2, i + 1);
    range.setStart(node2, i);
    var rect = singleRect(range, 1);
    if (rect.top == rect.bottom) {
      continue;
    }
    if (inRect(coords, rect)) {
      return { node: node2, offset: i + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0) };
    }
  }
  return { node: node2, offset: 0 };
}
function inRect(coords, rect) {
  return coords.left >= rect.left - 1 && coords.left <= rect.right + 1 && coords.top >= rect.top - 1 && coords.top <= rect.bottom + 1;
}
function targetKludge(dom, coords) {
  var parent = dom.parentNode;
  if (parent && /^li$/i.test(parent.nodeName) && coords.left < dom.getBoundingClientRect().left) {
    return parent;
  }
  return dom;
}
function posFromElement(view, elt, coords) {
  var ref = findOffsetInNode(elt, coords);
  var node2 = ref.node;
  var offset = ref.offset;
  var bias = -1;
  if (node2.nodeType == 1 && !node2.firstChild) {
    var rect = node2.getBoundingClientRect();
    bias = rect.left != rect.right && coords.left > (rect.left + rect.right) / 2 ? 1 : -1;
  }
  return view.docView.posFromDOM(node2, offset, bias);
}
function posFromCaret(view, node2, offset, coords) {
  var outside = -1;
  for (var cur = node2; ; ) {
    if (cur == view.dom) {
      break;
    }
    var desc = view.docView.nearestDesc(cur, true);
    if (!desc) {
      return null;
    }
    if (desc.node.isBlock && desc.parent) {
      var rect = desc.dom.getBoundingClientRect();
      if (rect.left > coords.left || rect.top > coords.top) {
        outside = desc.posBefore;
      } else if (rect.right < coords.left || rect.bottom < coords.top) {
        outside = desc.posAfter;
      } else {
        break;
      }
    }
    cur = desc.dom.parentNode;
  }
  return outside > -1 ? outside : view.docView.posFromDOM(node2, offset);
}
function elementFromPoint(element, coords, box) {
  var len = element.childNodes.length;
  if (len && box.top < box.bottom) {
    for (var startI = Math.max(0, Math.min(len - 1, Math.floor(len * (coords.top - box.top) / (box.bottom - box.top)) - 2)), i = startI; ; ) {
      var child = element.childNodes[i];
      if (child.nodeType == 1) {
        var rects = child.getClientRects();
        for (var j = 0; j < rects.length; j++) {
          var rect = rects[j];
          if (inRect(coords, rect)) {
            return elementFromPoint(child, coords, rect);
          }
        }
      }
      if ((i = (i + 1) % len) == startI) {
        break;
      }
    }
  }
  return element;
}
function posAtCoords(view, coords) {
  var assign, assign$1;
  var doc = view.dom.ownerDocument, node2, offset;
  if (doc.caretPositionFromPoint) {
    try {
      var pos$1 = doc.caretPositionFromPoint(coords.left, coords.top);
      if (pos$1) {
        assign = pos$1, node2 = assign.offsetNode, offset = assign.offset;
      }
    } catch (_) {
    }
  }
  if (!node2 && doc.caretRangeFromPoint) {
    var range = doc.caretRangeFromPoint(coords.left, coords.top);
    if (range) {
      assign$1 = range, node2 = assign$1.startContainer, offset = assign$1.startOffset;
    }
  }
  var elt = (view.root.elementFromPoint ? view.root : doc).elementFromPoint(coords.left, coords.top + 1), pos;
  if (!elt || !view.dom.contains(elt.nodeType != 1 ? elt.parentNode : elt)) {
    var box = view.dom.getBoundingClientRect();
    if (!inRect(coords, box)) {
      return null;
    }
    elt = elementFromPoint(view.dom, coords, box);
    if (!elt) {
      return null;
    }
  }
  if (result.safari) {
    for (var p = elt; node2 && p; p = parentNode(p)) {
      if (p.draggable) {
        node2 = offset = null;
      }
    }
  }
  elt = targetKludge(elt, coords);
  if (node2) {
    if (result.gecko && node2.nodeType == 1) {
      offset = Math.min(offset, node2.childNodes.length);
      if (offset < node2.childNodes.length) {
        var next = node2.childNodes[offset], box$1;
        if (next.nodeName == "IMG" && (box$1 = next.getBoundingClientRect()).right <= coords.left && box$1.bottom > coords.top) {
          offset++;
        }
      }
    }
    if (node2 == view.dom && offset == node2.childNodes.length - 1 && node2.lastChild.nodeType == 1 && coords.top > node2.lastChild.getBoundingClientRect().bottom) {
      pos = view.state.doc.content.size;
    } else if (offset == 0 || node2.nodeType != 1 || node2.childNodes[offset - 1].nodeName != "BR") {
      pos = posFromCaret(view, node2, offset, coords);
    }
  }
  if (pos == null) {
    pos = posFromElement(view, elt, coords);
  }
  var desc = view.docView.nearestDesc(elt, true);
  return { pos, inside: desc ? desc.posAtStart - desc.border : -1 };
}
function singleRect(object, bias) {
  var rects = object.getClientRects();
  return !rects.length ? object.getBoundingClientRect() : rects[bias < 0 ? 0 : rects.length - 1];
}
var BIDI = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function coordsAtPos(view, pos, side) {
  var ref = view.docView.domFromPos(pos, side < 0 ? -1 : 1);
  var node2 = ref.node;
  var offset = ref.offset;
  var supportEmptyRange = result.webkit || result.gecko;
  if (node2.nodeType == 3) {
    if (supportEmptyRange && (BIDI.test(node2.nodeValue) || (side < 0 ? !offset : offset == node2.nodeValue.length))) {
      var rect = singleRect(textRange(node2, offset, offset), side);
      if (result.gecko && offset && /\s/.test(node2.nodeValue[offset - 1]) && offset < node2.nodeValue.length) {
        var rectBefore = singleRect(textRange(node2, offset - 1, offset - 1), -1);
        if (rectBefore.top == rect.top) {
          var rectAfter = singleRect(textRange(node2, offset, offset + 1), -1);
          if (rectAfter.top != rect.top) {
            return flattenV(rectAfter, rectAfter.left < rectBefore.left);
          }
        }
      }
      return rect;
    } else {
      var from2 = offset, to = offset, takeSide = side < 0 ? 1 : -1;
      if (side < 0 && !offset) {
        to++;
        takeSide = -1;
      } else if (side >= 0 && offset == node2.nodeValue.length) {
        from2--;
        takeSide = 1;
      } else if (side < 0) {
        from2--;
      } else {
        to++;
      }
      return flattenV(singleRect(textRange(node2, from2, to), takeSide), takeSide < 0);
    }
  }
  if (!view.state.doc.resolve(pos).parent.inlineContent) {
    if (offset && (side < 0 || offset == nodeSize(node2))) {
      var before = node2.childNodes[offset - 1];
      if (before.nodeType == 1) {
        return flattenH(before.getBoundingClientRect(), false);
      }
    }
    if (offset < nodeSize(node2)) {
      var after = node2.childNodes[offset];
      if (after.nodeType == 1) {
        return flattenH(after.getBoundingClientRect(), true);
      }
    }
    return flattenH(node2.getBoundingClientRect(), side >= 0);
  }
  if (offset && (side < 0 || offset == nodeSize(node2))) {
    var before$1 = node2.childNodes[offset - 1];
    var target = before$1.nodeType == 3 ? textRange(before$1, nodeSize(before$1) - (supportEmptyRange ? 0 : 1)) : before$1.nodeType == 1 && (before$1.nodeName != "BR" || !before$1.nextSibling) ? before$1 : null;
    if (target) {
      return flattenV(singleRect(target, 1), false);
    }
  }
  if (offset < nodeSize(node2)) {
    var after$1 = node2.childNodes[offset];
    while (after$1.pmViewDesc && after$1.pmViewDesc.ignoreForCoords) {
      after$1 = after$1.nextSibling;
    }
    var target$1 = !after$1 ? null : after$1.nodeType == 3 ? textRange(after$1, 0, supportEmptyRange ? 0 : 1) : after$1.nodeType == 1 ? after$1 : null;
    if (target$1) {
      return flattenV(singleRect(target$1, -1), true);
    }
  }
  return flattenV(singleRect(node2.nodeType == 3 ? textRange(node2) : node2, -side), side >= 0);
}
function flattenV(rect, left) {
  if (rect.width == 0) {
    return rect;
  }
  var x = left ? rect.left : rect.right;
  return { top: rect.top, bottom: rect.bottom, left: x, right: x };
}
function flattenH(rect, top) {
  if (rect.height == 0) {
    return rect;
  }
  var y = top ? rect.top : rect.bottom;
  return { top: y, bottom: y, left: rect.left, right: rect.right };
}
function withFlushedState(view, state, f) {
  var viewState = view.state, active = view.root.activeElement;
  if (viewState != state) {
    view.updateState(state);
  }
  if (active != view.dom) {
    view.focus();
  }
  try {
    return f();
  } finally {
    if (viewState != state) {
      view.updateState(viewState);
    }
    if (active != view.dom && active) {
      active.focus();
    }
  }
}
function endOfTextblockVertical(view, state, dir) {
  var sel = state.selection;
  var $pos = dir == "up" ? sel.$from : sel.$to;
  return withFlushedState(view, state, function() {
    var ref = view.docView.domFromPos($pos.pos, dir == "up" ? -1 : 1);
    var dom = ref.node;
    for (; ; ) {
      var nearest = view.docView.nearestDesc(dom, true);
      if (!nearest) {
        break;
      }
      if (nearest.node.isBlock) {
        dom = nearest.dom;
        break;
      }
      dom = nearest.dom.parentNode;
    }
    var coords = coordsAtPos(view, $pos.pos, 1);
    for (var child = dom.firstChild; child; child = child.nextSibling) {
      var boxes = void 0;
      if (child.nodeType == 1) {
        boxes = child.getClientRects();
      } else if (child.nodeType == 3) {
        boxes = textRange(child, 0, child.nodeValue.length).getClientRects();
      } else {
        continue;
      }
      for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        if (box.bottom > box.top + 1 && (dir == "up" ? coords.top - box.top > (box.bottom - coords.top) * 2 : box.bottom - coords.bottom > (coords.bottom - box.top) * 2)) {
          return false;
        }
      }
    }
    return true;
  });
}
var maybeRTL = /[\u0590-\u08ac]/;
function endOfTextblockHorizontal(view, state, dir) {
  var ref = state.selection;
  var $head = ref.$head;
  if (!$head.parent.isTextblock) {
    return false;
  }
  var offset = $head.parentOffset, atStart = !offset, atEnd = offset == $head.parent.content.size;
  var sel = view.root.getSelection();
  if (!maybeRTL.test($head.parent.textContent) || !sel.modify) {
    return dir == "left" || dir == "backward" ? atStart : atEnd;
  }
  return withFlushedState(view, state, function() {
    var oldRange = sel.getRangeAt(0), oldNode = sel.focusNode, oldOff = sel.focusOffset;
    var oldBidiLevel = sel.caretBidiLevel;
    sel.modify("move", dir, "character");
    var parentDOM = $head.depth ? view.docView.domAfterPos($head.before()) : view.dom;
    var result2 = !parentDOM.contains(sel.focusNode.nodeType == 1 ? sel.focusNode : sel.focusNode.parentNode) || oldNode == sel.focusNode && oldOff == sel.focusOffset;
    sel.removeAllRanges();
    sel.addRange(oldRange);
    if (oldBidiLevel != null) {
      sel.caretBidiLevel = oldBidiLevel;
    }
    return result2;
  });
}
var cachedState = null;
var cachedDir = null;
var cachedResult = false;
function endOfTextblock(view, state, dir) {
  if (cachedState == state && cachedDir == dir) {
    return cachedResult;
  }
  cachedState = state;
  cachedDir = dir;
  return cachedResult = dir == "up" || dir == "down" ? endOfTextblockVertical(view, state, dir) : endOfTextblockHorizontal(view, state, dir);
}
var NOT_DIRTY = 0;
var CHILD_DIRTY = 1;
var CONTENT_DIRTY = 2;
var NODE_DIRTY = 3;
var ViewDesc = function ViewDesc2(parent, children, dom, contentDOM) {
  this.parent = parent;
  this.children = children;
  this.dom = dom;
  dom.pmViewDesc = this;
  this.contentDOM = contentDOM;
  this.dirty = NOT_DIRTY;
};
var prototypeAccessors = { size: { configurable: true }, border: { configurable: true }, posBefore: { configurable: true }, posAtStart: { configurable: true }, posAfter: { configurable: true }, posAtEnd: { configurable: true }, contentLost: { configurable: true }, domAtom: { configurable: true }, ignoreForCoords: { configurable: true } };
ViewDesc.prototype.matchesWidget = function matchesWidget() {
  return false;
};
ViewDesc.prototype.matchesMark = function matchesMark() {
  return false;
};
ViewDesc.prototype.matchesNode = function matchesNode() {
  return false;
};
ViewDesc.prototype.matchesHack = function matchesHack(_nodeName) {
  return false;
};
ViewDesc.prototype.parseRule = function parseRule() {
  return null;
};
ViewDesc.prototype.stopEvent = function stopEvent() {
  return false;
};
prototypeAccessors.size.get = function() {
  var size = 0;
  for (var i = 0; i < this.children.length; i++) {
    size += this.children[i].size;
  }
  return size;
};
prototypeAccessors.border.get = function() {
  return 0;
};
ViewDesc.prototype.destroy = function destroy() {
  this.parent = null;
  if (this.dom.pmViewDesc == this) {
    this.dom.pmViewDesc = null;
  }
  for (var i = 0; i < this.children.length; i++) {
    this.children[i].destroy();
  }
};
ViewDesc.prototype.posBeforeChild = function posBeforeChild(child) {
  for (var i = 0, pos = this.posAtStart; i < this.children.length; i++) {
    var cur = this.children[i];
    if (cur == child) {
      return pos;
    }
    pos += cur.size;
  }
};
prototypeAccessors.posBefore.get = function() {
  return this.parent.posBeforeChild(this);
};
prototypeAccessors.posAtStart.get = function() {
  return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
};
prototypeAccessors.posAfter.get = function() {
  return this.posBefore + this.size;
};
prototypeAccessors.posAtEnd.get = function() {
  return this.posAtStart + this.size - 2 * this.border;
};
ViewDesc.prototype.localPosFromDOM = function localPosFromDOM(dom, offset, bias) {
  if (this.contentDOM && this.contentDOM.contains(dom.nodeType == 1 ? dom : dom.parentNode)) {
    if (bias < 0) {
      var domBefore, desc;
      if (dom == this.contentDOM) {
        domBefore = dom.childNodes[offset - 1];
      } else {
        while (dom.parentNode != this.contentDOM) {
          dom = dom.parentNode;
        }
        domBefore = dom.previousSibling;
      }
      while (domBefore && !((desc = domBefore.pmViewDesc) && desc.parent == this)) {
        domBefore = domBefore.previousSibling;
      }
      return domBefore ? this.posBeforeChild(desc) + desc.size : this.posAtStart;
    } else {
      var domAfter, desc$1;
      if (dom == this.contentDOM) {
        domAfter = dom.childNodes[offset];
      } else {
        while (dom.parentNode != this.contentDOM) {
          dom = dom.parentNode;
        }
        domAfter = dom.nextSibling;
      }
      while (domAfter && !((desc$1 = domAfter.pmViewDesc) && desc$1.parent == this)) {
        domAfter = domAfter.nextSibling;
      }
      return domAfter ? this.posBeforeChild(desc$1) : this.posAtEnd;
    }
  }
  var atEnd;
  if (dom == this.dom && this.contentDOM) {
    atEnd = offset > domIndex(this.contentDOM);
  } else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) {
    atEnd = dom.compareDocumentPosition(this.contentDOM) & 2;
  } else if (this.dom.firstChild) {
    if (offset == 0) {
      for (var search = dom; ; search = search.parentNode) {
        if (search == this.dom) {
          atEnd = false;
          break;
        }
        if (search.parentNode.firstChild != search) {
          break;
        }
      }
    }
    if (atEnd == null && offset == dom.childNodes.length) {
      for (var search$1 = dom; ; search$1 = search$1.parentNode) {
        if (search$1 == this.dom) {
          atEnd = true;
          break;
        }
        if (search$1.parentNode.lastChild != search$1) {
          break;
        }
      }
    }
  }
  return (atEnd == null ? bias > 0 : atEnd) ? this.posAtEnd : this.posAtStart;
};
ViewDesc.prototype.nearestDesc = function nearestDesc(dom, onlyNodes) {
  for (var first = true, cur = dom; cur; cur = cur.parentNode) {
    var desc = this.getDesc(cur);
    if (desc && (!onlyNodes || desc.node)) {
      if (first && desc.nodeDOM && !(desc.nodeDOM.nodeType == 1 ? desc.nodeDOM.contains(dom.nodeType == 1 ? dom : dom.parentNode) : desc.nodeDOM == dom)) {
        first = false;
      } else {
        return desc;
      }
    }
  }
};
ViewDesc.prototype.getDesc = function getDesc(dom) {
  var desc = dom.pmViewDesc;
  for (var cur = desc; cur; cur = cur.parent) {
    if (cur == this) {
      return desc;
    }
  }
};
ViewDesc.prototype.posFromDOM = function posFromDOM(dom, offset, bias) {
  for (var scan = dom; scan; scan = scan.parentNode) {
    var desc = this.getDesc(scan);
    if (desc) {
      return desc.localPosFromDOM(dom, offset, bias);
    }
  }
  return -1;
};
ViewDesc.prototype.descAt = function descAt(pos) {
  for (var i = 0, offset = 0; i < this.children.length; i++) {
    var child = this.children[i], end = offset + child.size;
    if (offset == pos && end != offset) {
      while (!child.border && child.children.length) {
        child = child.children[0];
      }
      return child;
    }
    if (pos < end) {
      return child.descAt(pos - offset - child.border);
    }
    offset = end;
  }
};
ViewDesc.prototype.domFromPos = function domFromPos(pos, side) {
  if (!this.contentDOM) {
    return { node: this.dom, offset: 0 };
  }
  var i = 0, offset = 0;
  for (var curPos = 0; i < this.children.length; i++) {
    var child = this.children[i], end = curPos + child.size;
    if (end > pos || child instanceof TrailingHackViewDesc) {
      offset = pos - curPos;
      break;
    }
    curPos = end;
  }
  if (offset) {
    return this.children[i].domFromPos(offset - this.children[i].border, side);
  }
  for (var prev = void 0; i && !(prev = this.children[i - 1]).size && prev instanceof WidgetViewDesc && prev.widget.type.side >= 0; i--) {
  }
  if (side <= 0) {
    var prev$1, enter = true;
    for (; ; i--, enter = false) {
      prev$1 = i ? this.children[i - 1] : null;
      if (!prev$1 || prev$1.dom.parentNode == this.contentDOM) {
        break;
      }
    }
    if (prev$1 && side && enter && !prev$1.border && !prev$1.domAtom) {
      return prev$1.domFromPos(prev$1.size, side);
    }
    return { node: this.contentDOM, offset: prev$1 ? domIndex(prev$1.dom) + 1 : 0 };
  } else {
    var next, enter$1 = true;
    for (; ; i++, enter$1 = false) {
      next = i < this.children.length ? this.children[i] : null;
      if (!next || next.dom.parentNode == this.contentDOM) {
        break;
      }
    }
    if (next && enter$1 && !next.border && !next.domAtom) {
      return next.domFromPos(0, side);
    }
    return { node: this.contentDOM, offset: next ? domIndex(next.dom) : this.contentDOM.childNodes.length };
  }
};
ViewDesc.prototype.parseRange = function parseRange(from2, to, base) {
  if (base === void 0)
    base = 0;
  if (this.children.length == 0) {
    return { node: this.contentDOM, from: from2, to, fromOffset: 0, toOffset: this.contentDOM.childNodes.length };
  }
  var fromOffset = -1, toOffset = -1;
  for (var offset = base, i = 0; ; i++) {
    var child = this.children[i], end = offset + child.size;
    if (fromOffset == -1 && from2 <= end) {
      var childBase = offset + child.border;
      if (from2 >= childBase && to <= end - child.border && child.node && child.contentDOM && this.contentDOM.contains(child.contentDOM)) {
        return child.parseRange(from2, to, childBase);
      }
      from2 = offset;
      for (var j = i; j > 0; j--) {
        var prev = this.children[j - 1];
        if (prev.size && prev.dom.parentNode == this.contentDOM && !prev.emptyChildAt(1)) {
          fromOffset = domIndex(prev.dom) + 1;
          break;
        }
        from2 -= prev.size;
      }
      if (fromOffset == -1) {
        fromOffset = 0;
      }
    }
    if (fromOffset > -1 && (end > to || i == this.children.length - 1)) {
      to = end;
      for (var j$1 = i + 1; j$1 < this.children.length; j$1++) {
        var next = this.children[j$1];
        if (next.size && next.dom.parentNode == this.contentDOM && !next.emptyChildAt(-1)) {
          toOffset = domIndex(next.dom);
          break;
        }
        to += next.size;
      }
      if (toOffset == -1) {
        toOffset = this.contentDOM.childNodes.length;
      }
      break;
    }
    offset = end;
  }
  return { node: this.contentDOM, from: from2, to, fromOffset, toOffset };
};
ViewDesc.prototype.emptyChildAt = function emptyChildAt(side) {
  if (this.border || !this.contentDOM || !this.children.length) {
    return false;
  }
  var child = this.children[side < 0 ? 0 : this.children.length - 1];
  return child.size == 0 || child.emptyChildAt(side);
};
ViewDesc.prototype.domAfterPos = function domAfterPos(pos) {
  var ref = this.domFromPos(pos, 0);
  var node2 = ref.node;
  var offset = ref.offset;
  if (node2.nodeType != 1 || offset == node2.childNodes.length) {
    throw new RangeError("No node after pos " + pos);
  }
  return node2.childNodes[offset];
};
ViewDesc.prototype.setSelection = function setSelection(anchor, head, root, force) {
  var from2 = Math.min(anchor, head), to = Math.max(anchor, head);
  for (var i = 0, offset = 0; i < this.children.length; i++) {
    var child = this.children[i], end = offset + child.size;
    if (from2 > offset && to < end) {
      return child.setSelection(anchor - offset - child.border, head - offset - child.border, root, force);
    }
    offset = end;
  }
  var anchorDOM = this.domFromPos(anchor, anchor ? -1 : 1);
  var headDOM = head == anchor ? anchorDOM : this.domFromPos(head, head ? -1 : 1);
  var domSel = root.getSelection();
  var brKludge = false;
  if ((result.gecko || result.safari) && anchor == head) {
    var node2 = anchorDOM.node;
    var offset$1 = anchorDOM.offset;
    if (node2.nodeType == 3) {
      brKludge = offset$1 && node2.nodeValue[offset$1 - 1] == "\n";
      if (brKludge && offset$1 == node2.nodeValue.length) {
        for (var scan = node2, after = void 0; scan; scan = scan.parentNode) {
          if (after = scan.nextSibling) {
            if (after.nodeName == "BR") {
              anchorDOM = headDOM = { node: after.parentNode, offset: domIndex(after) + 1 };
            }
            break;
          }
          var desc = scan.pmViewDesc;
          if (desc && desc.node && desc.node.isBlock) {
            break;
          }
        }
      }
    } else {
      var prev = node2.childNodes[offset$1 - 1];
      brKludge = prev && (prev.nodeName == "BR" || prev.contentEditable == "false");
    }
  }
  if (result.gecko && domSel.focusNode && domSel.focusNode != headDOM.node && domSel.focusNode.nodeType == 1) {
    var after$1 = domSel.focusNode.childNodes[domSel.focusOffset];
    if (after$1 && after$1.contentEditable == "false") {
      force = true;
    }
  }
  if (!(force || brKludge && result.safari) && isEquivalentPosition(anchorDOM.node, anchorDOM.offset, domSel.anchorNode, domSel.anchorOffset) && isEquivalentPosition(headDOM.node, headDOM.offset, domSel.focusNode, domSel.focusOffset)) {
    return;
  }
  var domSelExtended = false;
  if ((domSel.extend || anchor == head) && !brKludge) {
    domSel.collapse(anchorDOM.node, anchorDOM.offset);
    try {
      if (anchor != head) {
        domSel.extend(headDOM.node, headDOM.offset);
      }
      domSelExtended = true;
    } catch (err) {
      if (!(err instanceof DOMException)) {
        throw err;
      }
    }
  }
  if (!domSelExtended) {
    if (anchor > head) {
      var tmp = anchorDOM;
      anchorDOM = headDOM;
      headDOM = tmp;
    }
    var range = document.createRange();
    range.setEnd(headDOM.node, headDOM.offset);
    range.setStart(anchorDOM.node, anchorDOM.offset);
    domSel.removeAllRanges();
    domSel.addRange(range);
  }
};
ViewDesc.prototype.ignoreMutation = function ignoreMutation(mutation) {
  return !this.contentDOM && mutation.type != "selection";
};
prototypeAccessors.contentLost.get = function() {
  return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
};
ViewDesc.prototype.markDirty = function markDirty(from2, to) {
  for (var offset = 0, i = 0; i < this.children.length; i++) {
    var child = this.children[i], end = offset + child.size;
    if (offset == end ? from2 <= end && to >= offset : from2 < end && to > offset) {
      var startInside = offset + child.border, endInside = end - child.border;
      if (from2 >= startInside && to <= endInside) {
        this.dirty = from2 == offset || to == end ? CONTENT_DIRTY : CHILD_DIRTY;
        if (from2 == startInside && to == endInside && (child.contentLost || child.dom.parentNode != this.contentDOM)) {
          child.dirty = NODE_DIRTY;
        } else {
          child.markDirty(from2 - startInside, to - startInside);
        }
        return;
      } else {
        child.dirty = child.dom == child.contentDOM && child.dom.parentNode == this.contentDOM && !child.children.length ? CONTENT_DIRTY : NODE_DIRTY;
      }
    }
    offset = end;
  }
  this.dirty = CONTENT_DIRTY;
};
ViewDesc.prototype.markParentsDirty = function markParentsDirty() {
  var level = 1;
  for (var node2 = this.parent; node2; node2 = node2.parent, level++) {
    var dirty = level == 1 ? CONTENT_DIRTY : CHILD_DIRTY;
    if (node2.dirty < dirty) {
      node2.dirty = dirty;
    }
  }
};
prototypeAccessors.domAtom.get = function() {
  return false;
};
prototypeAccessors.ignoreForCoords.get = function() {
  return false;
};
Object.defineProperties(ViewDesc.prototype, prototypeAccessors);
var nothing = [];
var WidgetViewDesc = /* @__PURE__ */ function(ViewDesc3) {
  function WidgetViewDesc2(parent, widget2, view, pos) {
    var self, dom = widget2.type.toDOM;
    if (typeof dom == "function") {
      dom = dom(view, function() {
        if (!self) {
          return pos;
        }
        if (self.parent) {
          return self.parent.posBeforeChild(self);
        }
      });
    }
    if (!widget2.type.spec.raw) {
      if (dom.nodeType != 1) {
        var wrap = document.createElement("span");
        wrap.appendChild(dom);
        dom = wrap;
      }
      dom.contentEditable = false;
      dom.classList.add("ProseMirror-widget");
    }
    ViewDesc3.call(this, parent, nothing, dom, null);
    this.widget = widget2;
    self = this;
  }
  if (ViewDesc3)
    WidgetViewDesc2.__proto__ = ViewDesc3;
  WidgetViewDesc2.prototype = Object.create(ViewDesc3 && ViewDesc3.prototype);
  WidgetViewDesc2.prototype.constructor = WidgetViewDesc2;
  var prototypeAccessors$12 = { domAtom: { configurable: true } };
  WidgetViewDesc2.prototype.matchesWidget = function matchesWidget2(widget2) {
    return this.dirty == NOT_DIRTY && widget2.type.eq(this.widget.type);
  };
  WidgetViewDesc2.prototype.parseRule = function parseRule2() {
    return { ignore: true };
  };
  WidgetViewDesc2.prototype.stopEvent = function stopEvent2(event) {
    var stop2 = this.widget.spec.stopEvent;
    return stop2 ? stop2(event) : false;
  };
  WidgetViewDesc2.prototype.ignoreMutation = function ignoreMutation2(mutation) {
    return mutation.type != "selection" || this.widget.spec.ignoreSelection;
  };
  WidgetViewDesc2.prototype.destroy = function destroy4() {
    this.widget.type.destroy(this.dom);
    ViewDesc3.prototype.destroy.call(this);
  };
  prototypeAccessors$12.domAtom.get = function() {
    return true;
  };
  Object.defineProperties(WidgetViewDesc2.prototype, prototypeAccessors$12);
  return WidgetViewDesc2;
}(ViewDesc);
var CompositionViewDesc = /* @__PURE__ */ function(ViewDesc3) {
  function CompositionViewDesc2(parent, dom, textDOM, text) {
    ViewDesc3.call(this, parent, nothing, dom, null);
    this.textDOM = textDOM;
    this.text = text;
  }
  if (ViewDesc3)
    CompositionViewDesc2.__proto__ = ViewDesc3;
  CompositionViewDesc2.prototype = Object.create(ViewDesc3 && ViewDesc3.prototype);
  CompositionViewDesc2.prototype.constructor = CompositionViewDesc2;
  var prototypeAccessors$22 = { size: { configurable: true } };
  prototypeAccessors$22.size.get = function() {
    return this.text.length;
  };
  CompositionViewDesc2.prototype.localPosFromDOM = function localPosFromDOM2(dom, offset) {
    if (dom != this.textDOM) {
      return this.posAtStart + (offset ? this.size : 0);
    }
    return this.posAtStart + offset;
  };
  CompositionViewDesc2.prototype.domFromPos = function domFromPos2(pos) {
    return { node: this.textDOM, offset: pos };
  };
  CompositionViewDesc2.prototype.ignoreMutation = function ignoreMutation2(mut) {
    return mut.type === "characterData" && mut.target.nodeValue == mut.oldValue;
  };
  Object.defineProperties(CompositionViewDesc2.prototype, prototypeAccessors$22);
  return CompositionViewDesc2;
}(ViewDesc);
var MarkViewDesc = /* @__PURE__ */ function(ViewDesc3) {
  function MarkViewDesc2(parent, mark, dom, contentDOM) {
    ViewDesc3.call(this, parent, [], dom, contentDOM);
    this.mark = mark;
  }
  if (ViewDesc3)
    MarkViewDesc2.__proto__ = ViewDesc3;
  MarkViewDesc2.prototype = Object.create(ViewDesc3 && ViewDesc3.prototype);
  MarkViewDesc2.prototype.constructor = MarkViewDesc2;
  MarkViewDesc2.create = function create2(parent, mark, inline2, view) {
    var custom = view.nodeViews[mark.type.name];
    var spec = custom && custom(mark, view, inline2);
    if (!spec || !spec.dom) {
      spec = DOMSerializer.renderSpec(document, mark.type.spec.toDOM(mark, inline2));
    }
    return new MarkViewDesc2(parent, mark, spec.dom, spec.contentDOM || spec.dom);
  };
  MarkViewDesc2.prototype.parseRule = function parseRule2() {
    if (this.dirty & NODE_DIRTY || this.mark.type.spec.reparseInView) {
      return null;
    }
    return { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  };
  MarkViewDesc2.prototype.matchesMark = function matchesMark2(mark) {
    return this.dirty != NODE_DIRTY && this.mark.eq(mark);
  };
  MarkViewDesc2.prototype.markDirty = function markDirty2(from2, to) {
    ViewDesc3.prototype.markDirty.call(this, from2, to);
    if (this.dirty != NOT_DIRTY) {
      var parent = this.parent;
      while (!parent.node) {
        parent = parent.parent;
      }
      if (parent.dirty < this.dirty) {
        parent.dirty = this.dirty;
      }
      this.dirty = NOT_DIRTY;
    }
  };
  MarkViewDesc2.prototype.slice = function slice(from2, to, view) {
    var copy2 = MarkViewDesc2.create(this.parent, this.mark, true, view);
    var nodes = this.children, size = this.size;
    if (to < size) {
      nodes = replaceNodes(nodes, to, size, view);
    }
    if (from2 > 0) {
      nodes = replaceNodes(nodes, 0, from2, view);
    }
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].parent = copy2;
    }
    copy2.children = nodes;
    return copy2;
  };
  return MarkViewDesc2;
}(ViewDesc);
var NodeViewDesc = /* @__PURE__ */ function(ViewDesc3) {
  function NodeViewDesc2(parent, node2, outerDeco, innerDeco, dom, contentDOM, nodeDOM2, view, pos) {
    ViewDesc3.call(this, parent, node2.isLeaf ? nothing : [], dom, contentDOM);
    this.nodeDOM = nodeDOM2;
    this.node = node2;
    this.outerDeco = outerDeco;
    this.innerDeco = innerDeco;
    if (contentDOM) {
      this.updateChildren(view, pos);
    }
  }
  if (ViewDesc3)
    NodeViewDesc2.__proto__ = ViewDesc3;
  NodeViewDesc2.prototype = Object.create(ViewDesc3 && ViewDesc3.prototype);
  NodeViewDesc2.prototype.constructor = NodeViewDesc2;
  var prototypeAccessors$3 = { size: { configurable: true }, border: { configurable: true }, domAtom: { configurable: true } };
  NodeViewDesc2.create = function create2(parent, node2, outerDeco, innerDeco, view, pos) {
    var assign;
    var custom = view.nodeViews[node2.type.name], descObj;
    var spec = custom && custom(node2, view, function() {
      if (!descObj) {
        return pos;
      }
      if (descObj.parent) {
        return descObj.parent.posBeforeChild(descObj);
      }
    }, outerDeco, innerDeco);
    var dom = spec && spec.dom, contentDOM = spec && spec.contentDOM;
    if (node2.isText) {
      if (!dom) {
        dom = document.createTextNode(node2.text);
      } else if (dom.nodeType != 3) {
        throw new RangeError("Text must be rendered as a DOM text node");
      }
    } else if (!dom) {
      assign = DOMSerializer.renderSpec(document, node2.type.spec.toDOM(node2)), dom = assign.dom, contentDOM = assign.contentDOM;
    }
    if (!contentDOM && !node2.isText && dom.nodeName != "BR") {
      if (!dom.hasAttribute("contenteditable")) {
        dom.contentEditable = false;
      }
      if (node2.type.spec.draggable) {
        dom.draggable = true;
      }
    }
    var nodeDOM2 = dom;
    dom = applyOuterDeco(dom, outerDeco, node2);
    if (spec) {
      return descObj = new CustomNodeViewDesc(parent, node2, outerDeco, innerDeco, dom, contentDOM, nodeDOM2, spec, view, pos + 1);
    } else if (node2.isText) {
      return new TextViewDesc(parent, node2, outerDeco, innerDeco, dom, nodeDOM2, view);
    } else {
      return new NodeViewDesc2(parent, node2, outerDeco, innerDeco, dom, contentDOM, nodeDOM2, view, pos + 1);
    }
  };
  NodeViewDesc2.prototype.parseRule = function parseRule2() {
    var this$1 = this;
    if (this.node.type.spec.reparseInView) {
      return null;
    }
    var rule = { node: this.node.type.name, attrs: this.node.attrs };
    if (this.node.type.whitespace == "pre") {
      rule.preserveWhitespace = "full";
    }
    if (!this.contentDOM) {
      rule.getContent = function() {
        return this$1.node.content;
      };
    } else if (!this.contentLost) {
      rule.contentElement = this.contentDOM;
    } else {
      for (var i = this.children.length - 1; i >= 0; i--) {
        var child = this.children[i];
        if (this.dom.contains(child.dom.parentNode)) {
          rule.contentElement = child.dom.parentNode;
          break;
        }
      }
      if (!rule.contentElement) {
        rule.getContent = function() {
          return Fragment.empty;
        };
      }
    }
    return rule;
  };
  NodeViewDesc2.prototype.matchesNode = function matchesNode2(node2, outerDeco, innerDeco) {
    return this.dirty == NOT_DIRTY && node2.eq(this.node) && sameOuterDeco(outerDeco, this.outerDeco) && innerDeco.eq(this.innerDeco);
  };
  prototypeAccessors$3.size.get = function() {
    return this.node.nodeSize;
  };
  prototypeAccessors$3.border.get = function() {
    return this.node.isLeaf ? 0 : 1;
  };
  NodeViewDesc2.prototype.updateChildren = function updateChildren(view, pos) {
    var this$1 = this;
    var inline2 = this.node.inlineContent, off = pos;
    var composition = view.composing && this.localCompositionInfo(view, pos);
    var localComposition = composition && composition.pos > -1 ? composition : null;
    var compositionInChild = composition && composition.pos < 0;
    var updater = new ViewTreeUpdater(this, localComposition && localComposition.node);
    iterDeco(this.node, this.innerDeco, function(widget2, i, insideNode) {
      if (widget2.spec.marks) {
        updater.syncToMarks(widget2.spec.marks, inline2, view);
      } else if (widget2.type.side >= 0 && !insideNode) {
        updater.syncToMarks(i == this$1.node.childCount ? Mark.none : this$1.node.child(i).marks, inline2, view);
      }
      updater.placeWidget(widget2, view, off);
    }, function(child, outerDeco, innerDeco, i) {
      updater.syncToMarks(child.marks, inline2, view);
      var compIndex;
      if (updater.findNodeMatch(child, outerDeco, innerDeco, i))
        ;
      else if (compositionInChild && view.state.selection.from > off && view.state.selection.to < off + child.nodeSize && (compIndex = updater.findIndexWithChild(composition.node)) > -1 && updater.updateNodeAt(child, outerDeco, innerDeco, compIndex, view))
        ;
      else if (updater.updateNextNode(child, outerDeco, innerDeco, view, i))
        ;
      else {
        updater.addNode(child, outerDeco, innerDeco, view, off);
      }
      off += child.nodeSize;
    });
    updater.syncToMarks(nothing, inline2, view);
    if (this.node.isTextblock) {
      updater.addTextblockHacks();
    }
    updater.destroyRest();
    if (updater.changed || this.dirty == CONTENT_DIRTY) {
      if (localComposition) {
        this.protectLocalComposition(view, localComposition);
      }
      renderDescs(this.contentDOM, this.children, view);
      if (result.ios) {
        iosHacks(this.dom);
      }
    }
  };
  NodeViewDesc2.prototype.localCompositionInfo = function localCompositionInfo(view, pos) {
    var ref = view.state.selection;
    var from2 = ref.from;
    var to = ref.to;
    if (!(view.state.selection instanceof TextSelection) || from2 < pos || to > pos + this.node.content.size) {
      return;
    }
    var sel = view.root.getSelection();
    var textNode = nearbyTextNode(sel.focusNode, sel.focusOffset);
    if (!textNode || !this.dom.contains(textNode.parentNode)) {
      return;
    }
    if (this.node.inlineContent) {
      var text = textNode.nodeValue;
      var textPos = findTextInFragment(this.node.content, text, from2 - pos, to - pos);
      return textPos < 0 ? null : { node: textNode, pos: textPos, text };
    } else {
      return { node: textNode, pos: -1 };
    }
  };
  NodeViewDesc2.prototype.protectLocalComposition = function protectLocalComposition(view, ref) {
    var node2 = ref.node;
    var pos = ref.pos;
    var text = ref.text;
    if (this.getDesc(node2)) {
      return;
    }
    var topNode = node2;
    for (; ; topNode = topNode.parentNode) {
      if (topNode.parentNode == this.contentDOM) {
        break;
      }
      while (topNode.previousSibling) {
        topNode.parentNode.removeChild(topNode.previousSibling);
      }
      while (topNode.nextSibling) {
        topNode.parentNode.removeChild(topNode.nextSibling);
      }
      if (topNode.pmViewDesc) {
        topNode.pmViewDesc = null;
      }
    }
    var desc = new CompositionViewDesc(this, topNode, node2, text);
    view.compositionNodes.push(desc);
    this.children = replaceNodes(this.children, pos, pos + text.length, view, desc);
  };
  NodeViewDesc2.prototype.update = function update2(node2, outerDeco, innerDeco, view) {
    if (this.dirty == NODE_DIRTY || !node2.sameMarkup(this.node)) {
      return false;
    }
    this.updateInner(node2, outerDeco, innerDeco, view);
    return true;
  };
  NodeViewDesc2.prototype.updateInner = function updateInner(node2, outerDeco, innerDeco, view) {
    this.updateOuterDeco(outerDeco);
    this.node = node2;
    this.innerDeco = innerDeco;
    if (this.contentDOM) {
      this.updateChildren(view, this.posAtStart);
    }
    this.dirty = NOT_DIRTY;
  };
  NodeViewDesc2.prototype.updateOuterDeco = function updateOuterDeco(outerDeco) {
    if (sameOuterDeco(outerDeco, this.outerDeco)) {
      return;
    }
    var needsWrap = this.nodeDOM.nodeType != 1;
    var oldDOM = this.dom;
    this.dom = patchOuterDeco(this.dom, this.nodeDOM, computeOuterDeco(this.outerDeco, this.node, needsWrap), computeOuterDeco(outerDeco, this.node, needsWrap));
    if (this.dom != oldDOM) {
      oldDOM.pmViewDesc = null;
      this.dom.pmViewDesc = this;
    }
    this.outerDeco = outerDeco;
  };
  NodeViewDesc2.prototype.selectNode = function selectNode() {
    this.nodeDOM.classList.add("ProseMirror-selectednode");
    if (this.contentDOM || !this.node.type.spec.draggable) {
      this.dom.draggable = true;
    }
  };
  NodeViewDesc2.prototype.deselectNode = function deselectNode() {
    this.nodeDOM.classList.remove("ProseMirror-selectednode");
    if (this.contentDOM || !this.node.type.spec.draggable) {
      this.dom.removeAttribute("draggable");
    }
  };
  prototypeAccessors$3.domAtom.get = function() {
    return this.node.isAtom;
  };
  Object.defineProperties(NodeViewDesc2.prototype, prototypeAccessors$3);
  return NodeViewDesc2;
}(ViewDesc);
function docViewDesc(doc, outerDeco, innerDeco, dom, view) {
  applyOuterDeco(dom, outerDeco, doc);
  return new NodeViewDesc(null, doc, outerDeco, innerDeco, dom, dom, dom, view, 0);
}
var TextViewDesc = /* @__PURE__ */ function(NodeViewDesc2) {
  function TextViewDesc2(parent, node2, outerDeco, innerDeco, dom, nodeDOM2, view) {
    NodeViewDesc2.call(this, parent, node2, outerDeco, innerDeco, dom, null, nodeDOM2, view);
  }
  if (NodeViewDesc2)
    TextViewDesc2.__proto__ = NodeViewDesc2;
  TextViewDesc2.prototype = Object.create(NodeViewDesc2 && NodeViewDesc2.prototype);
  TextViewDesc2.prototype.constructor = TextViewDesc2;
  var prototypeAccessors$4 = { domAtom: { configurable: true } };
  TextViewDesc2.prototype.parseRule = function parseRule2() {
    var skip = this.nodeDOM.parentNode;
    while (skip && skip != this.dom && !skip.pmIsDeco) {
      skip = skip.parentNode;
    }
    return { skip: skip || true };
  };
  TextViewDesc2.prototype.update = function update2(node2, outerDeco, _, view) {
    if (this.dirty == NODE_DIRTY || this.dirty != NOT_DIRTY && !this.inParent() || !node2.sameMarkup(this.node)) {
      return false;
    }
    this.updateOuterDeco(outerDeco);
    if ((this.dirty != NOT_DIRTY || node2.text != this.node.text) && node2.text != this.nodeDOM.nodeValue) {
      this.nodeDOM.nodeValue = node2.text;
      if (view.trackWrites == this.nodeDOM) {
        view.trackWrites = null;
      }
    }
    this.node = node2;
    this.dirty = NOT_DIRTY;
    return true;
  };
  TextViewDesc2.prototype.inParent = function inParent() {
    var parentDOM = this.parent.contentDOM;
    for (var n = this.nodeDOM; n; n = n.parentNode) {
      if (n == parentDOM) {
        return true;
      }
    }
    return false;
  };
  TextViewDesc2.prototype.domFromPos = function domFromPos2(pos) {
    return { node: this.nodeDOM, offset: pos };
  };
  TextViewDesc2.prototype.localPosFromDOM = function localPosFromDOM2(dom, offset, bias) {
    if (dom == this.nodeDOM) {
      return this.posAtStart + Math.min(offset, this.node.text.length);
    }
    return NodeViewDesc2.prototype.localPosFromDOM.call(this, dom, offset, bias);
  };
  TextViewDesc2.prototype.ignoreMutation = function ignoreMutation2(mutation) {
    return mutation.type != "characterData" && mutation.type != "selection";
  };
  TextViewDesc2.prototype.slice = function slice(from2, to, view) {
    var node2 = this.node.cut(from2, to), dom = document.createTextNode(node2.text);
    return new TextViewDesc2(this.parent, node2, this.outerDeco, this.innerDeco, dom, dom, view);
  };
  TextViewDesc2.prototype.markDirty = function markDirty2(from2, to) {
    NodeViewDesc2.prototype.markDirty.call(this, from2, to);
    if (this.dom != this.nodeDOM && (from2 == 0 || to == this.nodeDOM.nodeValue.length)) {
      this.dirty = NODE_DIRTY;
    }
  };
  prototypeAccessors$4.domAtom.get = function() {
    return false;
  };
  Object.defineProperties(TextViewDesc2.prototype, prototypeAccessors$4);
  return TextViewDesc2;
}(NodeViewDesc);
var TrailingHackViewDesc = /* @__PURE__ */ function(ViewDesc3) {
  function TrailingHackViewDesc2() {
    ViewDesc3.apply(this, arguments);
  }
  if (ViewDesc3)
    TrailingHackViewDesc2.__proto__ = ViewDesc3;
  TrailingHackViewDesc2.prototype = Object.create(ViewDesc3 && ViewDesc3.prototype);
  TrailingHackViewDesc2.prototype.constructor = TrailingHackViewDesc2;
  var prototypeAccessors$5 = { domAtom: { configurable: true }, ignoreForCoords: { configurable: true } };
  TrailingHackViewDesc2.prototype.parseRule = function parseRule2() {
    return { ignore: true };
  };
  TrailingHackViewDesc2.prototype.matchesHack = function matchesHack2(nodeName) {
    return this.dirty == NOT_DIRTY && this.dom.nodeName == nodeName;
  };
  prototypeAccessors$5.domAtom.get = function() {
    return true;
  };
  prototypeAccessors$5.ignoreForCoords.get = function() {
    return this.dom.nodeName == "IMG";
  };
  Object.defineProperties(TrailingHackViewDesc2.prototype, prototypeAccessors$5);
  return TrailingHackViewDesc2;
}(ViewDesc);
var CustomNodeViewDesc = /* @__PURE__ */ function(NodeViewDesc2) {
  function CustomNodeViewDesc2(parent, node2, outerDeco, innerDeco, dom, contentDOM, nodeDOM2, spec, view, pos) {
    NodeViewDesc2.call(this, parent, node2, outerDeco, innerDeco, dom, contentDOM, nodeDOM2, view, pos);
    this.spec = spec;
  }
  if (NodeViewDesc2)
    CustomNodeViewDesc2.__proto__ = NodeViewDesc2;
  CustomNodeViewDesc2.prototype = Object.create(NodeViewDesc2 && NodeViewDesc2.prototype);
  CustomNodeViewDesc2.prototype.constructor = CustomNodeViewDesc2;
  CustomNodeViewDesc2.prototype.update = function update2(node2, outerDeco, innerDeco, view) {
    if (this.dirty == NODE_DIRTY) {
      return false;
    }
    if (this.spec.update) {
      var result2 = this.spec.update(node2, outerDeco, innerDeco);
      if (result2) {
        this.updateInner(node2, outerDeco, innerDeco, view);
      }
      return result2;
    } else if (!this.contentDOM && !node2.isLeaf) {
      return false;
    } else {
      return NodeViewDesc2.prototype.update.call(this, node2, outerDeco, innerDeco, view);
    }
  };
  CustomNodeViewDesc2.prototype.selectNode = function selectNode() {
    this.spec.selectNode ? this.spec.selectNode() : NodeViewDesc2.prototype.selectNode.call(this);
  };
  CustomNodeViewDesc2.prototype.deselectNode = function deselectNode() {
    this.spec.deselectNode ? this.spec.deselectNode() : NodeViewDesc2.prototype.deselectNode.call(this);
  };
  CustomNodeViewDesc2.prototype.setSelection = function setSelection2(anchor, head, root, force) {
    this.spec.setSelection ? this.spec.setSelection(anchor, head, root) : NodeViewDesc2.prototype.setSelection.call(this, anchor, head, root, force);
  };
  CustomNodeViewDesc2.prototype.destroy = function destroy4() {
    if (this.spec.destroy) {
      this.spec.destroy();
    }
    NodeViewDesc2.prototype.destroy.call(this);
  };
  CustomNodeViewDesc2.prototype.stopEvent = function stopEvent2(event) {
    return this.spec.stopEvent ? this.spec.stopEvent(event) : false;
  };
  CustomNodeViewDesc2.prototype.ignoreMutation = function ignoreMutation2(mutation) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(mutation) : NodeViewDesc2.prototype.ignoreMutation.call(this, mutation);
  };
  return CustomNodeViewDesc2;
}(NodeViewDesc);
function renderDescs(parentDOM, descs, view) {
  var dom = parentDOM.firstChild, written = false;
  for (var i = 0; i < descs.length; i++) {
    var desc = descs[i], childDOM = desc.dom;
    if (childDOM.parentNode == parentDOM) {
      while (childDOM != dom) {
        dom = rm(dom);
        written = true;
      }
      dom = dom.nextSibling;
    } else {
      written = true;
      parentDOM.insertBefore(childDOM, dom);
    }
    if (desc instanceof MarkViewDesc) {
      var pos = dom ? dom.previousSibling : parentDOM.lastChild;
      renderDescs(desc.contentDOM, desc.children, view);
      dom = pos ? pos.nextSibling : parentDOM.firstChild;
    }
  }
  while (dom) {
    dom = rm(dom);
    written = true;
  }
  if (written && view.trackWrites == parentDOM) {
    view.trackWrites = null;
  }
}
function OuterDecoLevel(nodeName) {
  if (nodeName) {
    this.nodeName = nodeName;
  }
}
OuterDecoLevel.prototype = /* @__PURE__ */ Object.create(null);
var noDeco = [new OuterDecoLevel()];
function computeOuterDeco(outerDeco, node2, needsWrap) {
  if (outerDeco.length == 0) {
    return noDeco;
  }
  var top = needsWrap ? noDeco[0] : new OuterDecoLevel(), result2 = [top];
  for (var i = 0; i < outerDeco.length; i++) {
    var attrs = outerDeco[i].type.attrs;
    if (!attrs) {
      continue;
    }
    if (attrs.nodeName) {
      result2.push(top = new OuterDecoLevel(attrs.nodeName));
    }
    for (var name in attrs) {
      var val = attrs[name];
      if (val == null) {
        continue;
      }
      if (needsWrap && result2.length == 1) {
        result2.push(top = new OuterDecoLevel(node2.isInline ? "span" : "div"));
      }
      if (name == "class") {
        top.class = (top.class ? top.class + " " : "") + val;
      } else if (name == "style") {
        top.style = (top.style ? top.style + ";" : "") + val;
      } else if (name != "nodeName") {
        top[name] = val;
      }
    }
  }
  return result2;
}
function patchOuterDeco(outerDOM, nodeDOM2, prevComputed, curComputed) {
  if (prevComputed == noDeco && curComputed == noDeco) {
    return nodeDOM2;
  }
  var curDOM = nodeDOM2;
  for (var i = 0; i < curComputed.length; i++) {
    var deco = curComputed[i], prev = prevComputed[i];
    if (i) {
      var parent = void 0;
      if (prev && prev.nodeName == deco.nodeName && curDOM != outerDOM && (parent = curDOM.parentNode) && parent.tagName.toLowerCase() == deco.nodeName) {
        curDOM = parent;
      } else {
        parent = document.createElement(deco.nodeName);
        parent.pmIsDeco = true;
        parent.appendChild(curDOM);
        prev = noDeco[0];
        curDOM = parent;
      }
    }
    patchAttributes(curDOM, prev || noDeco[0], deco);
  }
  return curDOM;
}
function patchAttributes(dom, prev, cur) {
  for (var name in prev) {
    if (name != "class" && name != "style" && name != "nodeName" && !(name in cur)) {
      dom.removeAttribute(name);
    }
  }
  for (var name$1 in cur) {
    if (name$1 != "class" && name$1 != "style" && name$1 != "nodeName" && cur[name$1] != prev[name$1]) {
      dom.setAttribute(name$1, cur[name$1]);
    }
  }
  if (prev.class != cur.class) {
    var prevList = prev.class ? prev.class.split(" ").filter(Boolean) : nothing;
    var curList = cur.class ? cur.class.split(" ").filter(Boolean) : nothing;
    for (var i = 0; i < prevList.length; i++) {
      if (curList.indexOf(prevList[i]) == -1) {
        dom.classList.remove(prevList[i]);
      }
    }
    for (var i$1 = 0; i$1 < curList.length; i$1++) {
      if (prevList.indexOf(curList[i$1]) == -1) {
        dom.classList.add(curList[i$1]);
      }
    }
    if (dom.classList.length == 0) {
      dom.removeAttribute("class");
    }
  }
  if (prev.style != cur.style) {
    if (prev.style) {
      var prop = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, m;
      while (m = prop.exec(prev.style)) {
        dom.style.removeProperty(m[1]);
      }
    }
    if (cur.style) {
      dom.style.cssText += cur.style;
    }
  }
}
function applyOuterDeco(dom, deco, node2) {
  return patchOuterDeco(dom, dom, noDeco, computeOuterDeco(deco, node2, dom.nodeType != 1));
}
function sameOuterDeco(a, b) {
  if (a.length != b.length) {
    return false;
  }
  for (var i = 0; i < a.length; i++) {
    if (!a[i].type.eq(b[i].type)) {
      return false;
    }
  }
  return true;
}
function rm(dom) {
  var next = dom.nextSibling;
  dom.parentNode.removeChild(dom);
  return next;
}
var ViewTreeUpdater = function ViewTreeUpdater2(top, lockedNode) {
  this.top = top;
  this.lock = lockedNode;
  this.index = 0;
  this.stack = [];
  this.changed = false;
  this.preMatch = preMatch(top.node.content, top);
};
ViewTreeUpdater.prototype.destroyBetween = function destroyBetween(start2, end) {
  if (start2 == end) {
    return;
  }
  for (var i = start2; i < end; i++) {
    this.top.children[i].destroy();
  }
  this.top.children.splice(start2, end - start2);
  this.changed = true;
};
ViewTreeUpdater.prototype.destroyRest = function destroyRest() {
  this.destroyBetween(this.index, this.top.children.length);
};
ViewTreeUpdater.prototype.syncToMarks = function syncToMarks(marks, inline2, view) {
  var keep = 0, depth = this.stack.length >> 1;
  var maxKeep = Math.min(depth, marks.length);
  while (keep < maxKeep && (keep == depth - 1 ? this.top : this.stack[keep + 1 << 1]).matchesMark(marks[keep]) && marks[keep].type.spec.spanning !== false) {
    keep++;
  }
  while (keep < depth) {
    this.destroyRest();
    this.top.dirty = NOT_DIRTY;
    this.index = this.stack.pop();
    this.top = this.stack.pop();
    depth--;
  }
  while (depth < marks.length) {
    this.stack.push(this.top, this.index + 1);
    var found = -1;
    for (var i = this.index; i < Math.min(this.index + 3, this.top.children.length); i++) {
      if (this.top.children[i].matchesMark(marks[depth])) {
        found = i;
        break;
      }
    }
    if (found > -1) {
      if (found > this.index) {
        this.changed = true;
        this.destroyBetween(this.index, found);
      }
      this.top = this.top.children[this.index];
    } else {
      var markDesc = MarkViewDesc.create(this.top, marks[depth], inline2, view);
      this.top.children.splice(this.index, 0, markDesc);
      this.top = markDesc;
      this.changed = true;
    }
    this.index = 0;
    depth++;
  }
};
ViewTreeUpdater.prototype.findNodeMatch = function findNodeMatch(node2, outerDeco, innerDeco, index) {
  var found = -1, targetDesc;
  if (index >= this.preMatch.index && (targetDesc = this.preMatch.matches[index - this.preMatch.index]).parent == this.top && targetDesc.matchesNode(node2, outerDeco, innerDeco)) {
    found = this.top.children.indexOf(targetDesc, this.index);
  } else {
    for (var i = this.index, e = Math.min(this.top.children.length, i + 5); i < e; i++) {
      var child = this.top.children[i];
      if (child.matchesNode(node2, outerDeco, innerDeco) && !this.preMatch.matched.has(child)) {
        found = i;
        break;
      }
    }
  }
  if (found < 0) {
    return false;
  }
  this.destroyBetween(this.index, found);
  this.index++;
  return true;
};
ViewTreeUpdater.prototype.updateNodeAt = function updateNodeAt(node2, outerDeco, innerDeco, index, view) {
  var child = this.top.children[index];
  if (!child.update(node2, outerDeco, innerDeco, view)) {
    return false;
  }
  this.destroyBetween(this.index, index);
  this.index = index + 1;
  return true;
};
ViewTreeUpdater.prototype.findIndexWithChild = function findIndexWithChild(domNode) {
  for (; ; ) {
    var parent = domNode.parentNode;
    if (!parent) {
      return -1;
    }
    if (parent == this.top.contentDOM) {
      var desc = domNode.pmViewDesc;
      if (desc) {
        for (var i = this.index; i < this.top.children.length; i++) {
          if (this.top.children[i] == desc) {
            return i;
          }
        }
      }
      return -1;
    }
    domNode = parent;
  }
};
ViewTreeUpdater.prototype.updateNextNode = function updateNextNode(node2, outerDeco, innerDeco, view, index) {
  for (var i = this.index; i < this.top.children.length; i++) {
    var next = this.top.children[i];
    if (next instanceof NodeViewDesc) {
      var preMatch2 = this.preMatch.matched.get(next);
      if (preMatch2 != null && preMatch2 != index) {
        return false;
      }
      var nextDOM = next.dom;
      var locked = this.lock && (nextDOM == this.lock || nextDOM.nodeType == 1 && nextDOM.contains(this.lock.parentNode)) && !(node2.isText && next.node && next.node.isText && next.nodeDOM.nodeValue == node2.text && next.dirty != NODE_DIRTY && sameOuterDeco(outerDeco, next.outerDeco));
      if (!locked && next.update(node2, outerDeco, innerDeco, view)) {
        this.destroyBetween(this.index, i);
        if (next.dom != nextDOM) {
          this.changed = true;
        }
        this.index++;
        return true;
      }
      break;
    }
  }
  return false;
};
ViewTreeUpdater.prototype.addNode = function addNode(node2, outerDeco, innerDeco, view, pos) {
  this.top.children.splice(this.index++, 0, NodeViewDesc.create(this.top, node2, outerDeco, innerDeco, view, pos));
  this.changed = true;
};
ViewTreeUpdater.prototype.placeWidget = function placeWidget(widget2, view, pos) {
  var next = this.index < this.top.children.length ? this.top.children[this.index] : null;
  if (next && next.matchesWidget(widget2) && (widget2 == next.widget || !next.widget.type.toDOM.parentNode)) {
    this.index++;
  } else {
    var desc = new WidgetViewDesc(this.top, widget2, view, pos);
    this.top.children.splice(this.index++, 0, desc);
    this.changed = true;
  }
};
ViewTreeUpdater.prototype.addTextblockHacks = function addTextblockHacks() {
  var lastChild = this.top.children[this.index - 1], parent = this.top;
  while (lastChild instanceof MarkViewDesc) {
    parent = lastChild;
    lastChild = parent.children[parent.children.length - 1];
  }
  if (!lastChild || !(lastChild instanceof TextViewDesc) || /\n$/.test(lastChild.node.text)) {
    if ((result.safari || result.chrome) && lastChild && lastChild.dom.contentEditable == "false") {
      this.addHackNode("IMG", parent);
    }
    this.addHackNode("BR", this.top);
  }
};
ViewTreeUpdater.prototype.addHackNode = function addHackNode(nodeName, parent) {
  if (parent == this.top && this.index < parent.children.length && parent.children[this.index].matchesHack(nodeName)) {
    this.index++;
  } else {
    var dom = document.createElement(nodeName);
    if (nodeName == "IMG") {
      dom.className = "ProseMirror-separator";
      dom.alt = "";
    }
    if (nodeName == "BR") {
      dom.className = "ProseMirror-trailingBreak";
    }
    var hack = new TrailingHackViewDesc(this.top, nothing, dom, null);
    if (parent != this.top) {
      parent.children.push(hack);
    } else {
      parent.children.splice(this.index++, 0, hack);
    }
    this.changed = true;
  }
};
function preMatch(frag, parentDesc) {
  var curDesc = parentDesc, descI = curDesc.children.length;
  var fI = frag.childCount, matched = /* @__PURE__ */ new Map(), matches = [];
  outer:
    while (fI > 0) {
      var desc = void 0;
      for (; ; ) {
        if (descI) {
          var next = curDesc.children[descI - 1];
          if (next instanceof MarkViewDesc) {
            curDesc = next;
            descI = next.children.length;
          } else {
            desc = next;
            descI--;
            break;
          }
        } else if (curDesc == parentDesc) {
          break outer;
        } else {
          descI = curDesc.parent.children.indexOf(curDesc);
          curDesc = curDesc.parent;
        }
      }
      var node2 = desc.node;
      if (!node2) {
        continue;
      }
      if (node2 != frag.child(fI - 1)) {
        break;
      }
      --fI;
      matched.set(desc, fI);
      matches.push(desc);
    }
  return { index: fI, matched, matches: matches.reverse() };
}
function compareSide(a, b) {
  return a.type.side - b.type.side;
}
function iterDeco(parent, deco, onWidget, onNode) {
  var locals3 = deco.locals(parent), offset = 0;
  if (locals3.length == 0) {
    for (var i = 0; i < parent.childCount; i++) {
      var child = parent.child(i);
      onNode(child, locals3, deco.forChild(offset, child), i);
      offset += child.nodeSize;
    }
    return;
  }
  var decoIndex = 0, active = [], restNode = null;
  for (var parentIndex = 0; ; ) {
    if (decoIndex < locals3.length && locals3[decoIndex].to == offset) {
      var widget2 = locals3[decoIndex++], widgets = void 0;
      while (decoIndex < locals3.length && locals3[decoIndex].to == offset) {
        (widgets || (widgets = [widget2])).push(locals3[decoIndex++]);
      }
      if (widgets) {
        widgets.sort(compareSide);
        for (var i$1 = 0; i$1 < widgets.length; i$1++) {
          onWidget(widgets[i$1], parentIndex, !!restNode);
        }
      } else {
        onWidget(widget2, parentIndex, !!restNode);
      }
    }
    var child$1 = void 0, index = void 0;
    if (restNode) {
      index = -1;
      child$1 = restNode;
      restNode = null;
    } else if (parentIndex < parent.childCount) {
      index = parentIndex;
      child$1 = parent.child(parentIndex++);
    } else {
      break;
    }
    for (var i$2 = 0; i$2 < active.length; i$2++) {
      if (active[i$2].to <= offset) {
        active.splice(i$2--, 1);
      }
    }
    while (decoIndex < locals3.length && locals3[decoIndex].from <= offset && locals3[decoIndex].to > offset) {
      active.push(locals3[decoIndex++]);
    }
    var end = offset + child$1.nodeSize;
    if (child$1.isText) {
      var cutAt = end;
      if (decoIndex < locals3.length && locals3[decoIndex].from < cutAt) {
        cutAt = locals3[decoIndex].from;
      }
      for (var i$3 = 0; i$3 < active.length; i$3++) {
        if (active[i$3].to < cutAt) {
          cutAt = active[i$3].to;
        }
      }
      if (cutAt < end) {
        restNode = child$1.cut(cutAt - offset);
        child$1 = child$1.cut(0, cutAt - offset);
        end = cutAt;
        index = -1;
      }
    }
    var outerDeco = !active.length ? nothing : child$1.isInline && !child$1.isLeaf ? active.filter(function(d) {
      return !d.inline;
    }) : active.slice();
    onNode(child$1, outerDeco, deco.forChild(offset, child$1), index);
    offset = end;
  }
}
function iosHacks(dom) {
  if (dom.nodeName == "UL" || dom.nodeName == "OL") {
    var oldCSS = dom.style.cssText;
    dom.style.cssText = oldCSS + "; list-style: square !important";
    window.getComputedStyle(dom).listStyle;
    dom.style.cssText = oldCSS;
  }
}
function nearbyTextNode(node2, offset) {
  for (; ; ) {
    if (node2.nodeType == 3) {
      return node2;
    }
    if (node2.nodeType == 1 && offset > 0) {
      if (node2.childNodes.length > offset && node2.childNodes[offset].nodeType == 3) {
        return node2.childNodes[offset];
      }
      node2 = node2.childNodes[offset - 1];
      offset = nodeSize(node2);
    } else if (node2.nodeType == 1 && offset < node2.childNodes.length) {
      node2 = node2.childNodes[offset];
      offset = 0;
    } else {
      return null;
    }
  }
}
function findTextInFragment(frag, text, from2, to) {
  for (var i = 0, pos = 0; i < frag.childCount && pos <= to; ) {
    var child = frag.child(i++), childStart = pos;
    pos += child.nodeSize;
    if (!child.isText) {
      continue;
    }
    var str = child.text;
    while (i < frag.childCount) {
      var next = frag.child(i++);
      pos += next.nodeSize;
      if (!next.isText) {
        break;
      }
      str += next.text;
    }
    if (pos >= from2) {
      var found = childStart < to ? str.lastIndexOf(text, to - childStart - 1) : -1;
      if (found >= 0 && found + text.length + childStart >= from2) {
        return childStart + found;
      }
      if (from2 == to && str.length >= to + text.length - childStart && str.slice(to - childStart, to - childStart + text.length) == text) {
        return to;
      }
    }
  }
  return -1;
}
function replaceNodes(nodes, from2, to, view, replacement) {
  var result2 = [];
  for (var i = 0, off = 0; i < nodes.length; i++) {
    var child = nodes[i], start2 = off, end = off += child.size;
    if (start2 >= to || end <= from2) {
      result2.push(child);
    } else {
      if (start2 < from2) {
        result2.push(child.slice(0, from2 - start2, view));
      }
      if (replacement) {
        result2.push(replacement);
        replacement = null;
      }
      if (end > to) {
        result2.push(child.slice(to - start2, child.size, view));
      }
    }
  }
  return result2;
}
function selectionFromDOM(view, origin) {
  var domSel = view.root.getSelection(), doc = view.state.doc;
  if (!domSel.focusNode) {
    return null;
  }
  var nearestDesc2 = view.docView.nearestDesc(domSel.focusNode), inWidget = nearestDesc2 && nearestDesc2.size == 0;
  var head = view.docView.posFromDOM(domSel.focusNode, domSel.focusOffset);
  if (head < 0) {
    return null;
  }
  var $head = doc.resolve(head), $anchor, selection;
  if (selectionCollapsed(domSel)) {
    $anchor = $head;
    while (nearestDesc2 && !nearestDesc2.node) {
      nearestDesc2 = nearestDesc2.parent;
    }
    if (nearestDesc2 && nearestDesc2.node.isAtom && NodeSelection.isSelectable(nearestDesc2.node) && nearestDesc2.parent && !(nearestDesc2.node.isInline && isOnEdge(domSel.focusNode, domSel.focusOffset, nearestDesc2.dom))) {
      var pos = nearestDesc2.posBefore;
      selection = new NodeSelection(head == pos ? $head : doc.resolve(pos));
    }
  } else {
    var anchor = view.docView.posFromDOM(domSel.anchorNode, domSel.anchorOffset);
    if (anchor < 0) {
      return null;
    }
    $anchor = doc.resolve(anchor);
  }
  if (!selection) {
    var bias = origin == "pointer" || view.state.selection.head < $head.pos && !inWidget ? 1 : -1;
    selection = selectionBetween(view, $anchor, $head, bias);
  }
  return selection;
}
function editorOwnsSelection(view) {
  return view.editable ? view.hasFocus() : hasSelection(view) && document.activeElement && document.activeElement.contains(view.dom);
}
function selectionToDOM(view, force) {
  var sel = view.state.selection;
  syncNodeSelection(view, sel);
  if (!editorOwnsSelection(view)) {
    return;
  }
  if (!force && view.mouseDown && view.mouseDown.allowDefault && result.chrome) {
    var domSel = view.root.getSelection(), curSel = view.domObserver.currentSelection;
    if (domSel.anchorNode && isEquivalentPosition(domSel.anchorNode, domSel.anchorOffset, curSel.anchorNode, curSel.anchorOffset)) {
      view.mouseDown.delayedSelectionSync = true;
      view.domObserver.setCurSelection();
      return;
    }
  }
  view.domObserver.disconnectSelection();
  if (view.cursorWrapper) {
    selectCursorWrapper(view);
  } else {
    var anchor = sel.anchor;
    var head = sel.head;
    var resetEditableFrom, resetEditableTo;
    if (brokenSelectBetweenUneditable && !(sel instanceof TextSelection)) {
      if (!sel.$from.parent.inlineContent) {
        resetEditableFrom = temporarilyEditableNear(view, sel.from);
      }
      if (!sel.empty && !sel.$from.parent.inlineContent) {
        resetEditableTo = temporarilyEditableNear(view, sel.to);
      }
    }
    view.docView.setSelection(anchor, head, view.root, force);
    if (brokenSelectBetweenUneditable) {
      if (resetEditableFrom) {
        resetEditable(resetEditableFrom);
      }
      if (resetEditableTo) {
        resetEditable(resetEditableTo);
      }
    }
    if (sel.visible) {
      view.dom.classList.remove("ProseMirror-hideselection");
    } else {
      view.dom.classList.add("ProseMirror-hideselection");
      if ("onselectionchange" in document) {
        removeClassOnSelectionChange(view);
      }
    }
  }
  view.domObserver.setCurSelection();
  view.domObserver.connectSelection();
}
var brokenSelectBetweenUneditable = result.safari || result.chrome && result.chrome_version < 63;
function temporarilyEditableNear(view, pos) {
  var ref = view.docView.domFromPos(pos, 0);
  var node2 = ref.node;
  var offset = ref.offset;
  var after = offset < node2.childNodes.length ? node2.childNodes[offset] : null;
  var before = offset ? node2.childNodes[offset - 1] : null;
  if (result.safari && after && after.contentEditable == "false") {
    return setEditable(after);
  }
  if ((!after || after.contentEditable == "false") && (!before || before.contentEditable == "false")) {
    if (after) {
      return setEditable(after);
    } else if (before) {
      return setEditable(before);
    }
  }
}
function setEditable(element) {
  element.contentEditable = "true";
  if (result.safari && element.draggable) {
    element.draggable = false;
    element.wasDraggable = true;
  }
  return element;
}
function resetEditable(element) {
  element.contentEditable = "false";
  if (element.wasDraggable) {
    element.draggable = true;
    element.wasDraggable = null;
  }
}
function removeClassOnSelectionChange(view) {
  var doc = view.dom.ownerDocument;
  doc.removeEventListener("selectionchange", view.hideSelectionGuard);
  var domSel = view.root.getSelection();
  var node2 = domSel.anchorNode, offset = domSel.anchorOffset;
  doc.addEventListener("selectionchange", view.hideSelectionGuard = function() {
    if (domSel.anchorNode != node2 || domSel.anchorOffset != offset) {
      doc.removeEventListener("selectionchange", view.hideSelectionGuard);
      setTimeout(function() {
        if (!editorOwnsSelection(view) || view.state.selection.visible) {
          view.dom.classList.remove("ProseMirror-hideselection");
        }
      }, 20);
    }
  });
}
function selectCursorWrapper(view) {
  var domSel = view.root.getSelection(), range = document.createRange();
  var node2 = view.cursorWrapper.dom, img = node2.nodeName == "IMG";
  if (img) {
    range.setEnd(node2.parentNode, domIndex(node2) + 1);
  } else {
    range.setEnd(node2, 0);
  }
  range.collapse(false);
  domSel.removeAllRanges();
  domSel.addRange(range);
  if (!img && !view.state.selection.visible && result.ie && result.ie_version <= 11) {
    node2.disabled = true;
    node2.disabled = false;
  }
}
function syncNodeSelection(view, sel) {
  if (sel instanceof NodeSelection) {
    var desc = view.docView.descAt(sel.from);
    if (desc != view.lastSelectedViewDesc) {
      clearNodeSelection(view);
      if (desc) {
        desc.selectNode();
      }
      view.lastSelectedViewDesc = desc;
    }
  } else {
    clearNodeSelection(view);
  }
}
function clearNodeSelection(view) {
  if (view.lastSelectedViewDesc) {
    if (view.lastSelectedViewDesc.parent) {
      view.lastSelectedViewDesc.deselectNode();
    }
    view.lastSelectedViewDesc = null;
  }
}
function selectionBetween(view, $anchor, $head, bias) {
  return view.someProp("createSelectionBetween", function(f) {
    return f(view, $anchor, $head);
  }) || TextSelection.between($anchor, $head, bias);
}
function hasFocusAndSelection(view) {
  if (view.editable && view.root.activeElement != view.dom) {
    return false;
  }
  return hasSelection(view);
}
function hasSelection(view) {
  var sel = view.root.getSelection();
  if (!sel.anchorNode) {
    return false;
  }
  try {
    return view.dom.contains(sel.anchorNode.nodeType == 3 ? sel.anchorNode.parentNode : sel.anchorNode) && (view.editable || view.dom.contains(sel.focusNode.nodeType == 3 ? sel.focusNode.parentNode : sel.focusNode));
  } catch (_) {
    return false;
  }
}
function anchorInRightPlace(view) {
  var anchorDOM = view.docView.domFromPos(view.state.selection.anchor, 0);
  var domSel = view.root.getSelection();
  return isEquivalentPosition(anchorDOM.node, anchorDOM.offset, domSel.anchorNode, domSel.anchorOffset);
}
function moveSelectionBlock(state, dir) {
  var ref = state.selection;
  var $anchor = ref.$anchor;
  var $head = ref.$head;
  var $side = dir > 0 ? $anchor.max($head) : $anchor.min($head);
  var $start = !$side.parent.inlineContent ? $side : $side.depth ? state.doc.resolve(dir > 0 ? $side.after() : $side.before()) : null;
  return $start && Selection.findFrom($start, dir);
}
function apply(view, sel) {
  view.dispatch(view.state.tr.setSelection(sel).scrollIntoView());
  return true;
}
function selectHorizontally(view, dir, mods) {
  var sel = view.state.selection;
  if (sel instanceof TextSelection) {
    if (!sel.empty || mods.indexOf("s") > -1) {
      return false;
    } else if (view.endOfTextblock(dir > 0 ? "right" : "left")) {
      var next = moveSelectionBlock(view.state, dir);
      if (next && next instanceof NodeSelection) {
        return apply(view, next);
      }
      return false;
    } else if (!(result.mac && mods.indexOf("m") > -1)) {
      var $head = sel.$head, node2 = $head.textOffset ? null : dir < 0 ? $head.nodeBefore : $head.nodeAfter, desc;
      if (!node2 || node2.isText) {
        return false;
      }
      var nodePos = dir < 0 ? $head.pos - node2.nodeSize : $head.pos;
      if (!(node2.isAtom || (desc = view.docView.descAt(nodePos)) && !desc.contentDOM)) {
        return false;
      }
      if (NodeSelection.isSelectable(node2)) {
        return apply(view, new NodeSelection(dir < 0 ? view.state.doc.resolve($head.pos - node2.nodeSize) : $head));
      } else if (result.webkit) {
        return apply(view, new TextSelection(view.state.doc.resolve(dir < 0 ? nodePos : nodePos + node2.nodeSize)));
      } else {
        return false;
      }
    }
  } else if (sel instanceof NodeSelection && sel.node.isInline) {
    return apply(view, new TextSelection(dir > 0 ? sel.$to : sel.$from));
  } else {
    var next$1 = moveSelectionBlock(view.state, dir);
    if (next$1) {
      return apply(view, next$1);
    }
    return false;
  }
}
function nodeLen(node2) {
  return node2.nodeType == 3 ? node2.nodeValue.length : node2.childNodes.length;
}
function isIgnorable(dom) {
  var desc = dom.pmViewDesc;
  return desc && desc.size == 0 && (dom.nextSibling || dom.nodeName != "BR");
}
function skipIgnoredNodesLeft(view) {
  var sel = view.root.getSelection();
  var node2 = sel.focusNode, offset = sel.focusOffset;
  if (!node2) {
    return;
  }
  var moveNode, moveOffset, force = false;
  if (result.gecko && node2.nodeType == 1 && offset < nodeLen(node2) && isIgnorable(node2.childNodes[offset])) {
    force = true;
  }
  for (; ; ) {
    if (offset > 0) {
      if (node2.nodeType != 1) {
        break;
      } else {
        var before = node2.childNodes[offset - 1];
        if (isIgnorable(before)) {
          moveNode = node2;
          moveOffset = --offset;
        } else if (before.nodeType == 3) {
          node2 = before;
          offset = node2.nodeValue.length;
        } else {
          break;
        }
      }
    } else if (isBlockNode(node2)) {
      break;
    } else {
      var prev = node2.previousSibling;
      while (prev && isIgnorable(prev)) {
        moveNode = node2.parentNode;
        moveOffset = domIndex(prev);
        prev = prev.previousSibling;
      }
      if (!prev) {
        node2 = node2.parentNode;
        if (node2 == view.dom) {
          break;
        }
        offset = 0;
      } else {
        node2 = prev;
        offset = nodeLen(node2);
      }
    }
  }
  if (force) {
    setSelFocus(view, sel, node2, offset);
  } else if (moveNode) {
    setSelFocus(view, sel, moveNode, moveOffset);
  }
}
function skipIgnoredNodesRight(view) {
  var sel = view.root.getSelection();
  var node2 = sel.focusNode, offset = sel.focusOffset;
  if (!node2) {
    return;
  }
  var len = nodeLen(node2);
  var moveNode, moveOffset;
  for (; ; ) {
    if (offset < len) {
      if (node2.nodeType != 1) {
        break;
      }
      var after = node2.childNodes[offset];
      if (isIgnorable(after)) {
        moveNode = node2;
        moveOffset = ++offset;
      } else {
        break;
      }
    } else if (isBlockNode(node2)) {
      break;
    } else {
      var next = node2.nextSibling;
      while (next && isIgnorable(next)) {
        moveNode = next.parentNode;
        moveOffset = domIndex(next) + 1;
        next = next.nextSibling;
      }
      if (!next) {
        node2 = node2.parentNode;
        if (node2 == view.dom) {
          break;
        }
        offset = len = 0;
      } else {
        node2 = next;
        offset = 0;
        len = nodeLen(node2);
      }
    }
  }
  if (moveNode) {
    setSelFocus(view, sel, moveNode, moveOffset);
  }
}
function isBlockNode(dom) {
  var desc = dom.pmViewDesc;
  return desc && desc.node && desc.node.isBlock;
}
function setSelFocus(view, sel, node2, offset) {
  if (selectionCollapsed(sel)) {
    var range = document.createRange();
    range.setEnd(node2, offset);
    range.setStart(node2, offset);
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (sel.extend) {
    sel.extend(node2, offset);
  }
  view.domObserver.setCurSelection();
  var state = view.state;
  setTimeout(function() {
    if (view.state == state) {
      selectionToDOM(view);
    }
  }, 50);
}
function selectVertically(view, dir, mods) {
  var sel = view.state.selection;
  if (sel instanceof TextSelection && !sel.empty || mods.indexOf("s") > -1) {
    return false;
  }
  if (result.mac && mods.indexOf("m") > -1) {
    return false;
  }
  var $from = sel.$from;
  var $to = sel.$to;
  if (!$from.parent.inlineContent || view.endOfTextblock(dir < 0 ? "up" : "down")) {
    var next = moveSelectionBlock(view.state, dir);
    if (next && next instanceof NodeSelection) {
      return apply(view, next);
    }
  }
  if (!$from.parent.inlineContent) {
    var side = dir < 0 ? $from : $to;
    var beyond = sel instanceof AllSelection ? Selection.near(side, dir) : Selection.findFrom(side, dir);
    return beyond ? apply(view, beyond) : false;
  }
  return false;
}
function stopNativeHorizontalDelete(view, dir) {
  if (!(view.state.selection instanceof TextSelection)) {
    return true;
  }
  var ref = view.state.selection;
  var $head = ref.$head;
  var $anchor = ref.$anchor;
  var empty2 = ref.empty;
  if (!$head.sameParent($anchor)) {
    return true;
  }
  if (!empty2) {
    return false;
  }
  if (view.endOfTextblock(dir > 0 ? "forward" : "backward")) {
    return true;
  }
  var nextNode = !$head.textOffset && (dir < 0 ? $head.nodeBefore : $head.nodeAfter);
  if (nextNode && !nextNode.isText) {
    var tr = view.state.tr;
    if (dir < 0) {
      tr.delete($head.pos - nextNode.nodeSize, $head.pos);
    } else {
      tr.delete($head.pos, $head.pos + nextNode.nodeSize);
    }
    view.dispatch(tr);
    return true;
  }
  return false;
}
function switchEditable(view, node2, state) {
  view.domObserver.stop();
  node2.contentEditable = state;
  view.domObserver.start();
}
function safariDownArrowBug(view) {
  if (!result.safari || view.state.selection.$head.parentOffset > 0) {
    return;
  }
  var ref = view.root.getSelection();
  var focusNode = ref.focusNode;
  var focusOffset = ref.focusOffset;
  if (focusNode && focusNode.nodeType == 1 && focusOffset == 0 && focusNode.firstChild && focusNode.firstChild.contentEditable == "false") {
    var child = focusNode.firstChild;
    switchEditable(view, child, true);
    setTimeout(function() {
      return switchEditable(view, child, false);
    }, 20);
  }
}
function getMods(event) {
  var result2 = "";
  if (event.ctrlKey) {
    result2 += "c";
  }
  if (event.metaKey) {
    result2 += "m";
  }
  if (event.altKey) {
    result2 += "a";
  }
  if (event.shiftKey) {
    result2 += "s";
  }
  return result2;
}
function captureKeyDown(view, event) {
  var code = event.keyCode, mods = getMods(event);
  if (code == 8 || result.mac && code == 72 && mods == "c") {
    return stopNativeHorizontalDelete(view, -1) || skipIgnoredNodesLeft(view);
  } else if (code == 46 || result.mac && code == 68 && mods == "c") {
    return stopNativeHorizontalDelete(view, 1) || skipIgnoredNodesRight(view);
  } else if (code == 13 || code == 27) {
    return true;
  } else if (code == 37) {
    return selectHorizontally(view, -1, mods) || skipIgnoredNodesLeft(view);
  } else if (code == 39) {
    return selectHorizontally(view, 1, mods) || skipIgnoredNodesRight(view);
  } else if (code == 38) {
    return selectVertically(view, -1, mods) || skipIgnoredNodesLeft(view);
  } else if (code == 40) {
    return safariDownArrowBug(view) || selectVertically(view, 1, mods) || skipIgnoredNodesRight(view);
  } else if (mods == (result.mac ? "m" : "c") && (code == 66 || code == 73 || code == 89 || code == 90)) {
    return true;
  }
  return false;
}
function parseBetween(view, from_, to_) {
  var ref = view.docView.parseRange(from_, to_);
  var parent = ref.node;
  var fromOffset = ref.fromOffset;
  var toOffset = ref.toOffset;
  var from2 = ref.from;
  var to = ref.to;
  var domSel = view.root.getSelection(), find2 = null, anchor = domSel.anchorNode;
  if (anchor && view.dom.contains(anchor.nodeType == 1 ? anchor : anchor.parentNode)) {
    find2 = [{ node: anchor, offset: domSel.anchorOffset }];
    if (!selectionCollapsed(domSel)) {
      find2.push({ node: domSel.focusNode, offset: domSel.focusOffset });
    }
  }
  if (result.chrome && view.lastKeyCode === 8) {
    for (var off = toOffset; off > fromOffset; off--) {
      var node2 = parent.childNodes[off - 1], desc = node2.pmViewDesc;
      if (node2.nodeName == "BR" && !desc) {
        toOffset = off;
        break;
      }
      if (!desc || desc.size) {
        break;
      }
    }
  }
  var startDoc = view.state.doc;
  var parser = view.someProp("domParser") || DOMParser.fromSchema(view.state.schema);
  var $from = startDoc.resolve(from2);
  var sel = null, doc = parser.parse(parent, {
    topNode: $from.parent,
    topMatch: $from.parent.contentMatchAt($from.index()),
    topOpen: true,
    from: fromOffset,
    to: toOffset,
    preserveWhitespace: $from.parent.type.whitespace == "pre" ? "full" : true,
    editableContent: true,
    findPositions: find2,
    ruleFromNode,
    context: $from
  });
  if (find2 && find2[0].pos != null) {
    var anchor$1 = find2[0].pos, head = find2[1] && find2[1].pos;
    if (head == null) {
      head = anchor$1;
    }
    sel = { anchor: anchor$1 + from2, head: head + from2 };
  }
  return { doc, sel, from: from2, to };
}
function ruleFromNode(dom) {
  var desc = dom.pmViewDesc;
  if (desc) {
    return desc.parseRule();
  } else if (dom.nodeName == "BR" && dom.parentNode) {
    if (result.safari && /^(ul|ol)$/i.test(dom.parentNode.nodeName)) {
      var skip = document.createElement("div");
      skip.appendChild(document.createElement("li"));
      return { skip };
    } else if (dom.parentNode.lastChild == dom || result.safari && /^(tr|table)$/i.test(dom.parentNode.nodeName)) {
      return { ignore: true };
    }
  } else if (dom.nodeName == "IMG" && dom.getAttribute("mark-placeholder")) {
    return { ignore: true };
  }
}
function readDOMChange(view, from2, to, typeOver, addedNodes) {
  if (from2 < 0) {
    var origin = view.lastSelectionTime > Date.now() - 50 ? view.lastSelectionOrigin : null;
    var newSel = selectionFromDOM(view, origin);
    if (newSel && !view.state.selection.eq(newSel)) {
      var tr$1 = view.state.tr.setSelection(newSel);
      if (origin == "pointer") {
        tr$1.setMeta("pointer", true);
      } else if (origin == "key") {
        tr$1.scrollIntoView();
      }
      view.dispatch(tr$1);
    }
    return;
  }
  var $before = view.state.doc.resolve(from2);
  var shared = $before.sharedDepth(to);
  from2 = $before.before(shared + 1);
  to = view.state.doc.resolve(to).after(shared + 1);
  var sel = view.state.selection;
  var parse = parseBetween(view, from2, to);
  if (result.chrome && view.cursorWrapper && parse.sel && parse.sel.anchor == view.cursorWrapper.deco.from) {
    var text = view.cursorWrapper.deco.type.toDOM.nextSibling;
    var size = text && text.nodeValue ? text.nodeValue.length : 1;
    parse.sel = { anchor: parse.sel.anchor + size, head: parse.sel.anchor + size };
  }
  var doc = view.state.doc, compare = doc.slice(parse.from, parse.to);
  var preferredPos, preferredSide;
  if (view.lastKeyCode === 8 && Date.now() - 100 < view.lastKeyCodeTime) {
    preferredPos = view.state.selection.to;
    preferredSide = "end";
  } else {
    preferredPos = view.state.selection.from;
    preferredSide = "start";
  }
  view.lastKeyCode = null;
  var change = findDiff(compare.content, parse.doc.content, parse.from, preferredPos, preferredSide);
  if ((result.ios && view.lastIOSEnter > Date.now() - 225 || result.android) && addedNodes.some(function(n) {
    return n.nodeName == "DIV" || n.nodeName == "P";
  }) && (!change || change.endA >= change.endB) && view.someProp("handleKeyDown", function(f) {
    return f(view, keyEvent(13, "Enter"));
  })) {
    view.lastIOSEnter = 0;
    return;
  }
  if (!change) {
    if (typeOver && sel instanceof TextSelection && !sel.empty && sel.$head.sameParent(sel.$anchor) && !view.composing && !(parse.sel && parse.sel.anchor != parse.sel.head)) {
      change = { start: sel.from, endA: sel.to, endB: sel.to };
    } else {
      if (parse.sel) {
        var sel$1 = resolveSelection(view, view.state.doc, parse.sel);
        if (sel$1 && !sel$1.eq(view.state.selection)) {
          view.dispatch(view.state.tr.setSelection(sel$1));
        }
      }
      return;
    }
  }
  view.domChangeCount++;
  if (view.state.selection.from < view.state.selection.to && change.start == change.endB && view.state.selection instanceof TextSelection) {
    if (change.start > view.state.selection.from && change.start <= view.state.selection.from + 2 && view.state.selection.from >= parse.from) {
      change.start = view.state.selection.from;
    } else if (change.endA < view.state.selection.to && change.endA >= view.state.selection.to - 2 && view.state.selection.to <= parse.to) {
      change.endB += view.state.selection.to - change.endA;
      change.endA = view.state.selection.to;
    }
  }
  if (result.ie && result.ie_version <= 11 && change.endB == change.start + 1 && change.endA == change.start && change.start > parse.from && parse.doc.textBetween(change.start - parse.from - 1, change.start - parse.from + 1) == " \xA0") {
    change.start--;
    change.endA--;
    change.endB--;
  }
  var $from = parse.doc.resolveNoCache(change.start - parse.from);
  var $to = parse.doc.resolveNoCache(change.endB - parse.from);
  var inlineChange = $from.sameParent($to) && $from.parent.inlineContent;
  var nextSel;
  if ((result.ios && view.lastIOSEnter > Date.now() - 225 && (!inlineChange || addedNodes.some(function(n) {
    return n.nodeName == "DIV" || n.nodeName == "P";
  })) || !inlineChange && $from.pos < parse.doc.content.size && (nextSel = Selection.findFrom(parse.doc.resolve($from.pos + 1), 1, true)) && nextSel.head == $to.pos) && view.someProp("handleKeyDown", function(f) {
    return f(view, keyEvent(13, "Enter"));
  })) {
    view.lastIOSEnter = 0;
    return;
  }
  if (view.state.selection.anchor > change.start && looksLikeJoin(doc, change.start, change.endA, $from, $to) && view.someProp("handleKeyDown", function(f) {
    return f(view, keyEvent(8, "Backspace"));
  })) {
    if (result.android && result.chrome) {
      view.domObserver.suppressSelectionUpdates();
    }
    return;
  }
  if (result.chrome && result.android && change.toB == change.from) {
    view.lastAndroidDelete = Date.now();
  }
  if (result.android && !inlineChange && $from.start() != $to.start() && $to.parentOffset == 0 && $from.depth == $to.depth && parse.sel && parse.sel.anchor == parse.sel.head && parse.sel.head == change.endA) {
    change.endB -= 2;
    $to = parse.doc.resolveNoCache(change.endB - parse.from);
    setTimeout(function() {
      view.someProp("handleKeyDown", function(f) {
        return f(view, keyEvent(13, "Enter"));
      });
    }, 20);
  }
  var chFrom = change.start, chTo = change.endA;
  var tr, storedMarks, markChange, $from1;
  if (inlineChange) {
    if ($from.pos == $to.pos) {
      if (result.ie && result.ie_version <= 11 && $from.parentOffset == 0) {
        view.domObserver.suppressSelectionUpdates();
        setTimeout(function() {
          return selectionToDOM(view);
        }, 20);
      }
      tr = view.state.tr.delete(chFrom, chTo);
      storedMarks = doc.resolve(change.start).marksAcross(doc.resolve(change.endA));
    } else if (change.endA == change.endB && ($from1 = doc.resolve(change.start)) && (markChange = isMarkChange($from.parent.content.cut($from.parentOffset, $to.parentOffset), $from1.parent.content.cut($from1.parentOffset, change.endA - $from1.start())))) {
      tr = view.state.tr;
      if (markChange.type == "add") {
        tr.addMark(chFrom, chTo, markChange.mark);
      } else {
        tr.removeMark(chFrom, chTo, markChange.mark);
      }
    } else if ($from.parent.child($from.index()).isText && $from.index() == $to.index() - ($to.textOffset ? 0 : 1)) {
      var text$1 = $from.parent.textBetween($from.parentOffset, $to.parentOffset);
      if (view.someProp("handleTextInput", function(f) {
        return f(view, chFrom, chTo, text$1);
      })) {
        return;
      }
      tr = view.state.tr.insertText(text$1, chFrom, chTo);
    }
  }
  if (!tr) {
    tr = view.state.tr.replace(chFrom, chTo, parse.doc.slice(change.start - parse.from, change.endB - parse.from));
  }
  if (parse.sel) {
    var sel$2 = resolveSelection(view, tr.doc, parse.sel);
    if (sel$2 && !(result.chrome && result.android && view.composing && sel$2.empty && (change.start != change.endB || view.lastAndroidDelete < Date.now() - 100) && (sel$2.head == chFrom || sel$2.head == tr.mapping.map(chTo) - 1) || result.ie && sel$2.empty && sel$2.head == chFrom)) {
      tr.setSelection(sel$2);
    }
  }
  if (storedMarks) {
    tr.ensureMarks(storedMarks);
  }
  view.dispatch(tr.scrollIntoView());
}
function resolveSelection(view, doc, parsedSel) {
  if (Math.max(parsedSel.anchor, parsedSel.head) > doc.content.size) {
    return null;
  }
  return selectionBetween(view, doc.resolve(parsedSel.anchor), doc.resolve(parsedSel.head));
}
function isMarkChange(cur, prev) {
  var curMarks = cur.firstChild.marks, prevMarks = prev.firstChild.marks;
  var added = curMarks, removed = prevMarks, type, mark, update2;
  for (var i = 0; i < prevMarks.length; i++) {
    added = prevMarks[i].removeFromSet(added);
  }
  for (var i$1 = 0; i$1 < curMarks.length; i$1++) {
    removed = curMarks[i$1].removeFromSet(removed);
  }
  if (added.length == 1 && removed.length == 0) {
    mark = added[0];
    type = "add";
    update2 = function(node2) {
      return node2.mark(mark.addToSet(node2.marks));
    };
  } else if (added.length == 0 && removed.length == 1) {
    mark = removed[0];
    type = "remove";
    update2 = function(node2) {
      return node2.mark(mark.removeFromSet(node2.marks));
    };
  } else {
    return null;
  }
  var updated = [];
  for (var i$2 = 0; i$2 < prev.childCount; i$2++) {
    updated.push(update2(prev.child(i$2)));
  }
  if (Fragment.from(updated).eq(cur)) {
    return { mark, type };
  }
}
function looksLikeJoin(old, start2, end, $newStart, $newEnd) {
  if (!$newStart.parent.isTextblock || end - start2 <= $newEnd.pos - $newStart.pos || skipClosingAndOpening($newStart, true, false) < $newEnd.pos) {
    return false;
  }
  var $start = old.resolve(start2);
  if ($start.parentOffset < $start.parent.content.size || !$start.parent.isTextblock) {
    return false;
  }
  var $next = old.resolve(skipClosingAndOpening($start, true, true));
  if (!$next.parent.isTextblock || $next.pos > end || skipClosingAndOpening($next, true, false) < end) {
    return false;
  }
  return $newStart.parent.content.cut($newStart.parentOffset).eq($next.parent.content);
}
function skipClosingAndOpening($pos, fromEnd, mayOpen) {
  var depth = $pos.depth, end = fromEnd ? $pos.end() : $pos.pos;
  while (depth > 0 && (fromEnd || $pos.indexAfter(depth) == $pos.node(depth).childCount)) {
    depth--;
    end++;
    fromEnd = false;
  }
  if (mayOpen) {
    var next = $pos.node(depth).maybeChild($pos.indexAfter(depth));
    while (next && !next.isLeaf) {
      next = next.firstChild;
      end++;
    }
  }
  return end;
}
function findDiff(a, b, pos, preferredPos, preferredSide) {
  var start2 = a.findDiffStart(b, pos);
  if (start2 == null) {
    return null;
  }
  var ref = a.findDiffEnd(b, pos + a.size, pos + b.size);
  var endA = ref.a;
  var endB = ref.b;
  if (preferredSide == "end") {
    var adjust = Math.max(0, start2 - Math.min(endA, endB));
    preferredPos -= endA + adjust - start2;
  }
  if (endA < start2 && a.size < b.size) {
    var move2 = preferredPos <= start2 && preferredPos >= endA ? start2 - preferredPos : 0;
    start2 -= move2;
    endB = start2 + (endB - endA);
    endA = start2;
  } else if (endB < start2) {
    var move$1 = preferredPos <= start2 && preferredPos >= endB ? start2 - preferredPos : 0;
    start2 -= move$1;
    endA = start2 + (endA - endB);
    endB = start2;
  }
  return { start: start2, endA, endB };
}
function serializeForClipboard(view, slice) {
  var context = [];
  var content = slice.content;
  var openStart = slice.openStart;
  var openEnd = slice.openEnd;
  while (openStart > 1 && openEnd > 1 && content.childCount == 1 && content.firstChild.childCount == 1) {
    openStart--;
    openEnd--;
    var node2 = content.firstChild;
    context.push(node2.type.name, node2.attrs != node2.type.defaultAttrs ? node2.attrs : null);
    content = node2.content;
  }
  var serializer = view.someProp("clipboardSerializer") || DOMSerializer.fromSchema(view.state.schema);
  var doc = detachedDoc(), wrap = doc.createElement("div");
  wrap.appendChild(serializer.serializeFragment(content, { document: doc }));
  var firstChild = wrap.firstChild, needsWrap;
  while (firstChild && firstChild.nodeType == 1 && (needsWrap = wrapMap[firstChild.nodeName.toLowerCase()])) {
    for (var i = needsWrap.length - 1; i >= 0; i--) {
      var wrapper = doc.createElement(needsWrap[i]);
      while (wrap.firstChild) {
        wrapper.appendChild(wrap.firstChild);
      }
      wrap.appendChild(wrapper);
      if (needsWrap[i] != "tbody") {
        openStart++;
        openEnd++;
      }
    }
    firstChild = wrap.firstChild;
  }
  if (firstChild && firstChild.nodeType == 1) {
    firstChild.setAttribute("data-pm-slice", openStart + " " + openEnd + " " + JSON.stringify(context));
  }
  var text = view.someProp("clipboardTextSerializer", function(f) {
    return f(slice);
  }) || slice.content.textBetween(0, slice.content.size, "\n\n");
  return { dom: wrap, text };
}
function parseFromClipboard(view, text, html, plainText, $context) {
  var dom, inCode = $context.parent.type.spec.code, slice;
  if (!html && !text) {
    return null;
  }
  var asText = text && (plainText || inCode || !html);
  if (asText) {
    view.someProp("transformPastedText", function(f) {
      text = f(text, inCode || plainText);
    });
    if (inCode) {
      return text ? new Slice(Fragment.from(view.state.schema.text(text.replace(/\r\n?/g, "\n"))), 0, 0) : Slice.empty;
    }
    var parsed = view.someProp("clipboardTextParser", function(f) {
      return f(text, $context, plainText);
    });
    if (parsed) {
      slice = parsed;
    } else {
      var marks = $context.marks();
      var ref = view.state;
      var schema = ref.schema;
      var serializer = DOMSerializer.fromSchema(schema);
      dom = document.createElement("div");
      text.split(/(?:\r\n?|\n)+/).forEach(function(block) {
        var p = dom.appendChild(document.createElement("p"));
        if (block) {
          p.appendChild(serializer.serializeNode(schema.text(block, marks)));
        }
      });
    }
  } else {
    view.someProp("transformPastedHTML", function(f) {
      html = f(html);
    });
    dom = readHTML(html);
    if (result.webkit) {
      restoreReplacedSpaces(dom);
    }
  }
  var contextNode = dom && dom.querySelector("[data-pm-slice]");
  var sliceData = contextNode && /^(\d+) (\d+) (.*)/.exec(contextNode.getAttribute("data-pm-slice"));
  if (!slice) {
    var parser = view.someProp("clipboardParser") || view.someProp("domParser") || DOMParser.fromSchema(view.state.schema);
    slice = parser.parseSlice(dom, {
      preserveWhitespace: !!(asText || sliceData),
      context: $context,
      ruleFromNode: function ruleFromNode2(dom2) {
        if (dom2.nodeName == "BR" && !dom2.nextSibling && dom2.parentNode && !inlineParents.test(dom2.parentNode.nodeName)) {
          return { ignore: true };
        }
      }
    });
  }
  if (sliceData) {
    slice = addContext(closeSlice(slice, +sliceData[1], +sliceData[2]), sliceData[3]);
  } else {
    slice = Slice.maxOpen(normalizeSiblings(slice.content, $context), true);
    if (slice.openStart || slice.openEnd) {
      var openStart = 0, openEnd = 0;
      for (var node2 = slice.content.firstChild; openStart < slice.openStart && !node2.type.spec.isolating; openStart++, node2 = node2.firstChild) {
      }
      for (var node$1 = slice.content.lastChild; openEnd < slice.openEnd && !node$1.type.spec.isolating; openEnd++, node$1 = node$1.lastChild) {
      }
      slice = closeSlice(slice, openStart, openEnd);
    }
  }
  view.someProp("transformPasted", function(f) {
    slice = f(slice);
  });
  return slice;
}
var inlineParents = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function normalizeSiblings(fragment, $context) {
  if (fragment.childCount < 2) {
    return fragment;
  }
  var loop = function(d2) {
    var parent = $context.node(d2);
    var match = parent.contentMatchAt($context.index(d2));
    var lastWrap = void 0, result2 = [];
    fragment.forEach(function(node2) {
      if (!result2) {
        return;
      }
      var wrap = match.findWrapping(node2.type), inLast;
      if (!wrap) {
        return result2 = null;
      }
      if (inLast = result2.length && lastWrap.length && addToSibling(wrap, lastWrap, node2, result2[result2.length - 1], 0)) {
        result2[result2.length - 1] = inLast;
      } else {
        if (result2.length) {
          result2[result2.length - 1] = closeRight(result2[result2.length - 1], lastWrap.length);
        }
        var wrapped = withWrappers(node2, wrap);
        result2.push(wrapped);
        match = match.matchType(wrapped.type, wrapped.attrs);
        lastWrap = wrap;
      }
    });
    if (result2) {
      return { v: Fragment.from(result2) };
    }
  };
  for (var d = $context.depth; d >= 0; d--) {
    var returned = loop(d);
    if (returned)
      return returned.v;
  }
  return fragment;
}
function withWrappers(node2, wrap, from2) {
  if (from2 === void 0)
    from2 = 0;
  for (var i = wrap.length - 1; i >= from2; i--) {
    node2 = wrap[i].create(null, Fragment.from(node2));
  }
  return node2;
}
function addToSibling(wrap, lastWrap, node2, sibling, depth) {
  if (depth < wrap.length && depth < lastWrap.length && wrap[depth] == lastWrap[depth]) {
    var inner = addToSibling(wrap, lastWrap, node2, sibling.lastChild, depth + 1);
    if (inner) {
      return sibling.copy(sibling.content.replaceChild(sibling.childCount - 1, inner));
    }
    var match = sibling.contentMatchAt(sibling.childCount);
    if (match.matchType(depth == wrap.length - 1 ? node2.type : wrap[depth + 1])) {
      return sibling.copy(sibling.content.append(Fragment.from(withWrappers(node2, wrap, depth + 1))));
    }
  }
}
function closeRight(node2, depth) {
  if (depth == 0) {
    return node2;
  }
  var fragment = node2.content.replaceChild(node2.childCount - 1, closeRight(node2.lastChild, depth - 1));
  var fill = node2.contentMatchAt(node2.childCount).fillBefore(Fragment.empty, true);
  return node2.copy(fragment.append(fill));
}
function closeRange(fragment, side, from2, to, depth, openEnd) {
  var node2 = side < 0 ? fragment.firstChild : fragment.lastChild, inner = node2.content;
  if (depth < to - 1) {
    inner = closeRange(inner, side, from2, to, depth + 1, openEnd);
  }
  if (depth >= from2) {
    inner = side < 0 ? node2.contentMatchAt(0).fillBefore(inner, fragment.childCount > 1 || openEnd <= depth).append(inner) : inner.append(node2.contentMatchAt(node2.childCount).fillBefore(Fragment.empty, true));
  }
  return fragment.replaceChild(side < 0 ? 0 : fragment.childCount - 1, node2.copy(inner));
}
function closeSlice(slice, openStart, openEnd) {
  if (openStart < slice.openStart) {
    slice = new Slice(closeRange(slice.content, -1, openStart, slice.openStart, 0, slice.openEnd), openStart, slice.openEnd);
  }
  if (openEnd < slice.openEnd) {
    slice = new Slice(closeRange(slice.content, 1, openEnd, slice.openEnd, 0, 0), slice.openStart, openEnd);
  }
  return slice;
}
var wrapMap = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"]
};
var _detachedDoc = null;
function detachedDoc() {
  return _detachedDoc || (_detachedDoc = document.implementation.createHTMLDocument("title"));
}
function readHTML(html) {
  var metas = /^(\s*<meta [^>]*>)*/.exec(html);
  if (metas) {
    html = html.slice(metas[0].length);
  }
  var elt = detachedDoc().createElement("div");
  var firstTag = /<([a-z][^>\s]+)/i.exec(html), wrap;
  if (wrap = firstTag && wrapMap[firstTag[1].toLowerCase()]) {
    html = wrap.map(function(n) {
      return "<" + n + ">";
    }).join("") + html + wrap.map(function(n) {
      return "</" + n + ">";
    }).reverse().join("");
  }
  elt.innerHTML = html;
  if (wrap) {
    for (var i = 0; i < wrap.length; i++) {
      elt = elt.querySelector(wrap[i]) || elt;
    }
  }
  return elt;
}
function restoreReplacedSpaces(dom) {
  var nodes = dom.querySelectorAll(result.chrome ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (var i = 0; i < nodes.length; i++) {
    var node2 = nodes[i];
    if (node2.childNodes.length == 1 && node2.textContent == "\xA0" && node2.parentNode) {
      node2.parentNode.replaceChild(dom.ownerDocument.createTextNode(" "), node2);
    }
  }
}
function addContext(slice, context) {
  if (!slice.size) {
    return slice;
  }
  var schema = slice.content.firstChild.type.schema, array;
  try {
    array = JSON.parse(context);
  } catch (e) {
    return slice;
  }
  var content = slice.content;
  var openStart = slice.openStart;
  var openEnd = slice.openEnd;
  for (var i = array.length - 2; i >= 0; i -= 2) {
    var type = schema.nodes[array[i]];
    if (!type || type.hasRequiredAttrs()) {
      break;
    }
    content = Fragment.from(type.create(array[i + 1], content));
    openStart++;
    openEnd++;
  }
  return new Slice(content, openStart, openEnd);
}
var observeOptions = {
  childList: true,
  characterData: true,
  characterDataOldValue: true,
  attributes: true,
  attributeOldValue: true,
  subtree: true
};
var useCharData = result.ie && result.ie_version <= 11;
var SelectionState = function SelectionState2() {
  this.anchorNode = this.anchorOffset = this.focusNode = this.focusOffset = null;
};
SelectionState.prototype.set = function set(sel) {
  this.anchorNode = sel.anchorNode;
  this.anchorOffset = sel.anchorOffset;
  this.focusNode = sel.focusNode;
  this.focusOffset = sel.focusOffset;
};
SelectionState.prototype.eq = function eq(sel) {
  return sel.anchorNode == this.anchorNode && sel.anchorOffset == this.anchorOffset && sel.focusNode == this.focusNode && sel.focusOffset == this.focusOffset;
};
var DOMObserver = function DOMObserver2(view, handleDOMChange) {
  var this$1 = this;
  this.view = view;
  this.handleDOMChange = handleDOMChange;
  this.queue = [];
  this.flushingSoon = -1;
  this.observer = window.MutationObserver && new window.MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      this$1.queue.push(mutations[i]);
    }
    if (result.ie && result.ie_version <= 11 && mutations.some(function(m) {
      return m.type == "childList" && m.removedNodes.length || m.type == "characterData" && m.oldValue.length > m.target.nodeValue.length;
    })) {
      this$1.flushSoon();
    } else {
      this$1.flush();
    }
  });
  this.currentSelection = new SelectionState();
  if (useCharData) {
    this.onCharData = function(e) {
      this$1.queue.push({ target: e.target, type: "characterData", oldValue: e.prevValue });
      this$1.flushSoon();
    };
  }
  this.onSelectionChange = this.onSelectionChange.bind(this);
  this.suppressingSelectionUpdates = false;
};
DOMObserver.prototype.flushSoon = function flushSoon() {
  var this$1 = this;
  if (this.flushingSoon < 0) {
    this.flushingSoon = window.setTimeout(function() {
      this$1.flushingSoon = -1;
      this$1.flush();
    }, 20);
  }
};
DOMObserver.prototype.forceFlush = function forceFlush() {
  if (this.flushingSoon > -1) {
    window.clearTimeout(this.flushingSoon);
    this.flushingSoon = -1;
    this.flush();
  }
};
DOMObserver.prototype.start = function start() {
  if (this.observer) {
    this.observer.observe(this.view.dom, observeOptions);
  }
  if (useCharData) {
    this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData);
  }
  this.connectSelection();
};
DOMObserver.prototype.stop = function stop() {
  var this$1 = this;
  if (this.observer) {
    var take = this.observer.takeRecords();
    if (take.length) {
      for (var i = 0; i < take.length; i++) {
        this.queue.push(take[i]);
      }
      window.setTimeout(function() {
        return this$1.flush();
      }, 20);
    }
    this.observer.disconnect();
  }
  if (useCharData) {
    this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData);
  }
  this.disconnectSelection();
};
DOMObserver.prototype.connectSelection = function connectSelection() {
  this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
};
DOMObserver.prototype.disconnectSelection = function disconnectSelection() {
  this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
};
DOMObserver.prototype.suppressSelectionUpdates = function suppressSelectionUpdates() {
  var this$1 = this;
  this.suppressingSelectionUpdates = true;
  setTimeout(function() {
    return this$1.suppressingSelectionUpdates = false;
  }, 50);
};
DOMObserver.prototype.onSelectionChange = function onSelectionChange() {
  if (!hasFocusAndSelection(this.view)) {
    return;
  }
  if (this.suppressingSelectionUpdates) {
    return selectionToDOM(this.view);
  }
  if (result.ie && result.ie_version <= 11 && !this.view.state.selection.empty) {
    var sel = this.view.root.getSelection();
    if (sel.focusNode && isEquivalentPosition(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset)) {
      return this.flushSoon();
    }
  }
  this.flush();
};
DOMObserver.prototype.setCurSelection = function setCurSelection() {
  this.currentSelection.set(this.view.root.getSelection());
};
DOMObserver.prototype.ignoreSelectionChange = function ignoreSelectionChange(sel) {
  if (sel.rangeCount == 0) {
    return true;
  }
  var container = sel.getRangeAt(0).commonAncestorContainer;
  var desc = this.view.docView.nearestDesc(container);
  if (desc && desc.ignoreMutation({ type: "selection", target: container.nodeType == 3 ? container.parentNode : container })) {
    this.setCurSelection();
    return true;
  }
};
DOMObserver.prototype.flush = function flush() {
  if (!this.view.docView || this.flushingSoon > -1) {
    return;
  }
  var mutations = this.observer ? this.observer.takeRecords() : [];
  if (this.queue.length) {
    mutations = this.queue.concat(mutations);
    this.queue.length = 0;
  }
  var sel = this.view.root.getSelection();
  var newSel = !this.suppressingSelectionUpdates && !this.currentSelection.eq(sel) && hasFocusAndSelection(this.view) && !this.ignoreSelectionChange(sel);
  var from2 = -1, to = -1, typeOver = false, added = [];
  if (this.view.editable) {
    for (var i = 0; i < mutations.length; i++) {
      var result$1 = this.registerMutation(mutations[i], added);
      if (result$1) {
        from2 = from2 < 0 ? result$1.from : Math.min(result$1.from, from2);
        to = to < 0 ? result$1.to : Math.max(result$1.to, to);
        if (result$1.typeOver) {
          typeOver = true;
        }
      }
    }
  }
  if (result.gecko && added.length > 1) {
    var brs = added.filter(function(n) {
      return n.nodeName == "BR";
    });
    if (brs.length == 2) {
      var a = brs[0];
      var b = brs[1];
      if (a.parentNode && a.parentNode.parentNode == b.parentNode) {
        b.remove();
      } else {
        a.remove();
      }
    }
  }
  if (from2 > -1 || newSel) {
    if (from2 > -1) {
      this.view.docView.markDirty(from2, to);
      checkCSS(this.view);
    }
    this.handleDOMChange(from2, to, typeOver, added);
    if (this.view.docView && this.view.docView.dirty) {
      this.view.updateState(this.view.state);
    } else if (!this.currentSelection.eq(sel)) {
      selectionToDOM(this.view);
    }
    this.currentSelection.set(sel);
  }
};
DOMObserver.prototype.registerMutation = function registerMutation(mut, added) {
  if (added.indexOf(mut.target) > -1) {
    return null;
  }
  var desc = this.view.docView.nearestDesc(mut.target);
  if (mut.type == "attributes" && (desc == this.view.docView || mut.attributeName == "contenteditable" || mut.attributeName == "style" && !mut.oldValue && !mut.target.getAttribute("style"))) {
    return null;
  }
  if (!desc || desc.ignoreMutation(mut)) {
    return null;
  }
  if (mut.type == "childList") {
    for (var i = 0; i < mut.addedNodes.length; i++) {
      added.push(mut.addedNodes[i]);
    }
    if (desc.contentDOM && desc.contentDOM != desc.dom && !desc.contentDOM.contains(mut.target)) {
      return { from: desc.posBefore, to: desc.posAfter };
    }
    var prev = mut.previousSibling, next = mut.nextSibling;
    if (result.ie && result.ie_version <= 11 && mut.addedNodes.length) {
      for (var i$1 = 0; i$1 < mut.addedNodes.length; i$1++) {
        var ref = mut.addedNodes[i$1];
        var previousSibling = ref.previousSibling;
        var nextSibling = ref.nextSibling;
        if (!previousSibling || Array.prototype.indexOf.call(mut.addedNodes, previousSibling) < 0) {
          prev = previousSibling;
        }
        if (!nextSibling || Array.prototype.indexOf.call(mut.addedNodes, nextSibling) < 0) {
          next = nextSibling;
        }
      }
    }
    var fromOffset = prev && prev.parentNode == mut.target ? domIndex(prev) + 1 : 0;
    var from2 = desc.localPosFromDOM(mut.target, fromOffset, -1);
    var toOffset = next && next.parentNode == mut.target ? domIndex(next) : mut.target.childNodes.length;
    var to = desc.localPosFromDOM(mut.target, toOffset, 1);
    return { from: from2, to };
  } else if (mut.type == "attributes") {
    return { from: desc.posAtStart - desc.border, to: desc.posAtEnd + desc.border };
  } else {
    return {
      from: desc.posAtStart,
      to: desc.posAtEnd,
      typeOver: mut.target.nodeValue == mut.oldValue
    };
  }
};
var cssChecked = false;
function checkCSS(view) {
  if (cssChecked) {
    return;
  }
  cssChecked = true;
  if (getComputedStyle(view.dom).whiteSpace == "normal") {
    console["warn"]("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package.");
  }
}
var handlers = {};
var editHandlers = {};
function initInput(view) {
  view.shiftKey = false;
  view.mouseDown = null;
  view.lastKeyCode = null;
  view.lastKeyCodeTime = 0;
  view.lastClick = { time: 0, x: 0, y: 0, type: "" };
  view.lastSelectionOrigin = null;
  view.lastSelectionTime = 0;
  view.lastIOSEnter = 0;
  view.lastIOSEnterFallbackTimeout = null;
  view.lastAndroidDelete = 0;
  view.composing = false;
  view.composingTimeout = null;
  view.compositionNodes = [];
  view.compositionEndedAt = -2e8;
  view.domObserver = new DOMObserver(view, function(from2, to, typeOver, added) {
    return readDOMChange(view, from2, to, typeOver, added);
  });
  view.domObserver.start();
  view.domChangeCount = 0;
  view.eventHandlers = /* @__PURE__ */ Object.create(null);
  var loop = function(event2) {
    var handler = handlers[event2];
    view.dom.addEventListener(event2, view.eventHandlers[event2] = function(event3) {
      if (eventBelongsToView(view, event3) && !runCustomHandler(view, event3) && (view.editable || !(event3.type in editHandlers))) {
        handler(view, event3);
      }
    });
  };
  for (var event in handlers)
    loop(event);
  if (result.safari) {
    view.dom.addEventListener("input", function() {
      return null;
    });
  }
  ensureListeners(view);
}
function setSelectionOrigin(view, origin) {
  view.lastSelectionOrigin = origin;
  view.lastSelectionTime = Date.now();
}
function destroyInput(view) {
  view.domObserver.stop();
  for (var type in view.eventHandlers) {
    view.dom.removeEventListener(type, view.eventHandlers[type]);
  }
  clearTimeout(view.composingTimeout);
  clearTimeout(view.lastIOSEnterFallbackTimeout);
}
function ensureListeners(view) {
  view.someProp("handleDOMEvents", function(currentHandlers) {
    for (var type in currentHandlers) {
      if (!view.eventHandlers[type]) {
        view.dom.addEventListener(type, view.eventHandlers[type] = function(event) {
          return runCustomHandler(view, event);
        });
      }
    }
  });
}
function runCustomHandler(view, event) {
  return view.someProp("handleDOMEvents", function(handlers2) {
    var handler = handlers2[event.type];
    return handler ? handler(view, event) || event.defaultPrevented : false;
  });
}
function eventBelongsToView(view, event) {
  if (!event.bubbles) {
    return true;
  }
  if (event.defaultPrevented) {
    return false;
  }
  for (var node2 = event.target; node2 != view.dom; node2 = node2.parentNode) {
    if (!node2 || node2.nodeType == 11 || node2.pmViewDesc && node2.pmViewDesc.stopEvent(event)) {
      return false;
    }
  }
  return true;
}
function dispatchEvent(view, event) {
  if (!runCustomHandler(view, event) && handlers[event.type] && (view.editable || !(event.type in editHandlers))) {
    handlers[event.type](view, event);
  }
}
editHandlers.keydown = function(view, event) {
  view.shiftKey = event.keyCode == 16 || event.shiftKey;
  if (inOrNearComposition(view, event)) {
    return;
  }
  view.lastKeyCode = event.keyCode;
  view.lastKeyCodeTime = Date.now();
  if (result.android && result.chrome && event.keyCode == 13) {
    return;
  }
  if (event.keyCode != 229) {
    view.domObserver.forceFlush();
  }
  if (result.ios && event.keyCode == 13 && !event.ctrlKey && !event.altKey && !event.metaKey) {
    var now = Date.now();
    view.lastIOSEnter = now;
    view.lastIOSEnterFallbackTimeout = setTimeout(function() {
      if (view.lastIOSEnter == now) {
        view.someProp("handleKeyDown", function(f) {
          return f(view, keyEvent(13, "Enter"));
        });
        view.lastIOSEnter = 0;
      }
    }, 200);
  } else if (view.someProp("handleKeyDown", function(f) {
    return f(view, event);
  }) || captureKeyDown(view, event)) {
    event.preventDefault();
  } else {
    setSelectionOrigin(view, "key");
  }
};
editHandlers.keyup = function(view, e) {
  if (e.keyCode == 16) {
    view.shiftKey = false;
  }
};
editHandlers.keypress = function(view, event) {
  if (inOrNearComposition(view, event) || !event.charCode || event.ctrlKey && !event.altKey || result.mac && event.metaKey) {
    return;
  }
  if (view.someProp("handleKeyPress", function(f) {
    return f(view, event);
  })) {
    event.preventDefault();
    return;
  }
  var sel = view.state.selection;
  if (!(sel instanceof TextSelection) || !sel.$from.sameParent(sel.$to)) {
    var text = String.fromCharCode(event.charCode);
    if (!view.someProp("handleTextInput", function(f) {
      return f(view, sel.$from.pos, sel.$to.pos, text);
    })) {
      view.dispatch(view.state.tr.insertText(text).scrollIntoView());
    }
    event.preventDefault();
  }
};
function eventCoords(event) {
  return { left: event.clientX, top: event.clientY };
}
function isNear(event, click) {
  var dx = click.x - event.clientX, dy = click.y - event.clientY;
  return dx * dx + dy * dy < 100;
}
function runHandlerOnContext(view, propName, pos, inside, event) {
  if (inside == -1) {
    return false;
  }
  var $pos = view.state.doc.resolve(inside);
  var loop = function(i2) {
    if (view.someProp(propName, function(f) {
      return i2 > $pos.depth ? f(view, pos, $pos.nodeAfter, $pos.before(i2), event, true) : f(view, pos, $pos.node(i2), $pos.before(i2), event, false);
    })) {
      return { v: true };
    }
  };
  for (var i = $pos.depth + 1; i > 0; i--) {
    var returned = loop(i);
    if (returned)
      return returned.v;
  }
  return false;
}
function updateSelection(view, selection, origin) {
  if (!view.focused) {
    view.focus();
  }
  var tr = view.state.tr.setSelection(selection);
  if (origin == "pointer") {
    tr.setMeta("pointer", true);
  }
  view.dispatch(tr);
}
function selectClickedLeaf(view, inside) {
  if (inside == -1) {
    return false;
  }
  var $pos = view.state.doc.resolve(inside), node2 = $pos.nodeAfter;
  if (node2 && node2.isAtom && NodeSelection.isSelectable(node2)) {
    updateSelection(view, new NodeSelection($pos), "pointer");
    return true;
  }
  return false;
}
function selectClickedNode(view, inside) {
  if (inside == -1) {
    return false;
  }
  var sel = view.state.selection, selectedNode, selectAt;
  if (sel instanceof NodeSelection) {
    selectedNode = sel.node;
  }
  var $pos = view.state.doc.resolve(inside);
  for (var i = $pos.depth + 1; i > 0; i--) {
    var node2 = i > $pos.depth ? $pos.nodeAfter : $pos.node(i);
    if (NodeSelection.isSelectable(node2)) {
      if (selectedNode && sel.$from.depth > 0 && i >= sel.$from.depth && $pos.before(sel.$from.depth + 1) == sel.$from.pos) {
        selectAt = $pos.before(sel.$from.depth);
      } else {
        selectAt = $pos.before(i);
      }
      break;
    }
  }
  if (selectAt != null) {
    updateSelection(view, NodeSelection.create(view.state.doc, selectAt), "pointer");
    return true;
  } else {
    return false;
  }
}
function handleSingleClick(view, pos, inside, event, selectNode) {
  return runHandlerOnContext(view, "handleClickOn", pos, inside, event) || view.someProp("handleClick", function(f) {
    return f(view, pos, event);
  }) || (selectNode ? selectClickedNode(view, inside) : selectClickedLeaf(view, inside));
}
function handleDoubleClick(view, pos, inside, event) {
  return runHandlerOnContext(view, "handleDoubleClickOn", pos, inside, event) || view.someProp("handleDoubleClick", function(f) {
    return f(view, pos, event);
  });
}
function handleTripleClick(view, pos, inside, event) {
  return runHandlerOnContext(view, "handleTripleClickOn", pos, inside, event) || view.someProp("handleTripleClick", function(f) {
    return f(view, pos, event);
  }) || defaultTripleClick(view, inside, event);
}
function defaultTripleClick(view, inside, event) {
  if (event.button != 0) {
    return false;
  }
  var doc = view.state.doc;
  if (inside == -1) {
    if (doc.inlineContent) {
      updateSelection(view, TextSelection.create(doc, 0, doc.content.size), "pointer");
      return true;
    }
    return false;
  }
  var $pos = doc.resolve(inside);
  for (var i = $pos.depth + 1; i > 0; i--) {
    var node2 = i > $pos.depth ? $pos.nodeAfter : $pos.node(i);
    var nodePos = $pos.before(i);
    if (node2.inlineContent) {
      updateSelection(view, TextSelection.create(doc, nodePos + 1, nodePos + 1 + node2.content.size), "pointer");
    } else if (NodeSelection.isSelectable(node2)) {
      updateSelection(view, NodeSelection.create(doc, nodePos), "pointer");
    } else {
      continue;
    }
    return true;
  }
}
function forceDOMFlush(view) {
  return endComposition(view);
}
var selectNodeModifier = result.mac ? "metaKey" : "ctrlKey";
handlers.mousedown = function(view, event) {
  view.shiftKey = event.shiftKey;
  var flushed = forceDOMFlush(view);
  var now = Date.now(), type = "singleClick";
  if (now - view.lastClick.time < 500 && isNear(event, view.lastClick) && !event[selectNodeModifier]) {
    if (view.lastClick.type == "singleClick") {
      type = "doubleClick";
    } else if (view.lastClick.type == "doubleClick") {
      type = "tripleClick";
    }
  }
  view.lastClick = { time: now, x: event.clientX, y: event.clientY, type };
  var pos = view.posAtCoords(eventCoords(event));
  if (!pos) {
    return;
  }
  if (type == "singleClick") {
    if (view.mouseDown) {
      view.mouseDown.done();
    }
    view.mouseDown = new MouseDown(view, pos, event, flushed);
  } else if ((type == "doubleClick" ? handleDoubleClick : handleTripleClick)(view, pos.pos, pos.inside, event)) {
    event.preventDefault();
  } else {
    setSelectionOrigin(view, "pointer");
  }
};
var MouseDown = function MouseDown2(view, pos, event, flushed) {
  var this$1 = this;
  this.view = view;
  this.startDoc = view.state.doc;
  this.pos = pos;
  this.event = event;
  this.flushed = flushed;
  this.selectNode = event[selectNodeModifier];
  this.allowDefault = event.shiftKey;
  this.delayedSelectionSync = false;
  var targetNode, targetPos;
  if (pos.inside > -1) {
    targetNode = view.state.doc.nodeAt(pos.inside);
    targetPos = pos.inside;
  } else {
    var $pos = view.state.doc.resolve(pos.pos);
    targetNode = $pos.parent;
    targetPos = $pos.depth ? $pos.before() : 0;
  }
  this.mightDrag = null;
  var target = flushed ? null : event.target;
  var targetDesc = target ? view.docView.nearestDesc(target, true) : null;
  this.target = targetDesc ? targetDesc.dom : null;
  var ref = view.state;
  var selection = ref.selection;
  if (event.button == 0 && targetNode.type.spec.draggable && targetNode.type.spec.selectable !== false || selection instanceof NodeSelection && selection.from <= targetPos && selection.to > targetPos) {
    this.mightDrag = {
      node: targetNode,
      pos: targetPos,
      addAttr: this.target && !this.target.draggable,
      setUneditable: this.target && result.gecko && !this.target.hasAttribute("contentEditable")
    };
  }
  if (this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable)) {
    this.view.domObserver.stop();
    if (this.mightDrag.addAttr) {
      this.target.draggable = true;
    }
    if (this.mightDrag.setUneditable) {
      setTimeout(function() {
        if (this$1.view.mouseDown == this$1) {
          this$1.target.setAttribute("contentEditable", "false");
        }
      }, 20);
    }
    this.view.domObserver.start();
  }
  view.root.addEventListener("mouseup", this.up = this.up.bind(this));
  view.root.addEventListener("mousemove", this.move = this.move.bind(this));
  setSelectionOrigin(view, "pointer");
};
MouseDown.prototype.done = function done() {
  var this$1 = this;
  this.view.root.removeEventListener("mouseup", this.up);
  this.view.root.removeEventListener("mousemove", this.move);
  if (this.mightDrag && this.target) {
    this.view.domObserver.stop();
    if (this.mightDrag.addAttr) {
      this.target.removeAttribute("draggable");
    }
    if (this.mightDrag.setUneditable) {
      this.target.removeAttribute("contentEditable");
    }
    this.view.domObserver.start();
  }
  if (this.delayedSelectionSync) {
    setTimeout(function() {
      return selectionToDOM(this$1.view);
    });
  }
  this.view.mouseDown = null;
};
MouseDown.prototype.up = function up(event) {
  this.done();
  if (!this.view.dom.contains(event.target.nodeType == 3 ? event.target.parentNode : event.target)) {
    return;
  }
  var pos = this.pos;
  if (this.view.state.doc != this.startDoc) {
    pos = this.view.posAtCoords(eventCoords(event));
  }
  if (this.allowDefault || !pos) {
    setSelectionOrigin(this.view, "pointer");
  } else if (handleSingleClick(this.view, pos.pos, pos.inside, event, this.selectNode)) {
    event.preventDefault();
  } else if (event.button == 0 && (this.flushed || result.safari && this.mightDrag && !this.mightDrag.node.isAtom || result.chrome && !(this.view.state.selection instanceof TextSelection) && Math.min(Math.abs(pos.pos - this.view.state.selection.from), Math.abs(pos.pos - this.view.state.selection.to)) <= 2)) {
    updateSelection(this.view, Selection.near(this.view.state.doc.resolve(pos.pos)), "pointer");
    event.preventDefault();
  } else {
    setSelectionOrigin(this.view, "pointer");
  }
};
MouseDown.prototype.move = function move(event) {
  if (!this.allowDefault && (Math.abs(this.event.x - event.clientX) > 4 || Math.abs(this.event.y - event.clientY) > 4)) {
    this.allowDefault = true;
  }
  setSelectionOrigin(this.view, "pointer");
  if (event.buttons == 0) {
    this.done();
  }
};
handlers.touchdown = function(view) {
  forceDOMFlush(view);
  setSelectionOrigin(view, "pointer");
};
handlers.contextmenu = function(view) {
  return forceDOMFlush(view);
};
function inOrNearComposition(view, event) {
  if (view.composing) {
    return true;
  }
  if (result.safari && Math.abs(event.timeStamp - view.compositionEndedAt) < 500) {
    view.compositionEndedAt = -2e8;
    return true;
  }
  return false;
}
var timeoutComposition = result.android ? 5e3 : -1;
editHandlers.compositionstart = editHandlers.compositionupdate = function(view) {
  if (!view.composing) {
    view.domObserver.flush();
    var state = view.state;
    var $pos = state.selection.$from;
    if (state.selection.empty && (state.storedMarks || !$pos.textOffset && $pos.parentOffset && $pos.nodeBefore.marks.some(function(m) {
      return m.type.spec.inclusive === false;
    }))) {
      view.markCursor = view.state.storedMarks || $pos.marks();
      endComposition(view, true);
      view.markCursor = null;
    } else {
      endComposition(view);
      if (result.gecko && state.selection.empty && $pos.parentOffset && !$pos.textOffset && $pos.nodeBefore.marks.length) {
        var sel = view.root.getSelection();
        for (var node2 = sel.focusNode, offset = sel.focusOffset; node2 && node2.nodeType == 1 && offset != 0; ) {
          var before = offset < 0 ? node2.lastChild : node2.childNodes[offset - 1];
          if (!before) {
            break;
          }
          if (before.nodeType == 3) {
            sel.collapse(before, before.nodeValue.length);
            break;
          } else {
            node2 = before;
            offset = -1;
          }
        }
      }
    }
    view.composing = true;
  }
  scheduleComposeEnd(view, timeoutComposition);
};
editHandlers.compositionend = function(view, event) {
  if (view.composing) {
    view.composing = false;
    view.compositionEndedAt = event.timeStamp;
    scheduleComposeEnd(view, 20);
  }
};
function scheduleComposeEnd(view, delay) {
  clearTimeout(view.composingTimeout);
  if (delay > -1) {
    view.composingTimeout = setTimeout(function() {
      return endComposition(view);
    }, delay);
  }
}
function clearComposition(view) {
  if (view.composing) {
    view.composing = false;
    view.compositionEndedAt = timestampFromCustomEvent();
  }
  while (view.compositionNodes.length > 0) {
    view.compositionNodes.pop().markParentsDirty();
  }
}
function timestampFromCustomEvent() {
  var event = document.createEvent("Event");
  event.initEvent("event", true, true);
  return event.timeStamp;
}
function endComposition(view, forceUpdate) {
  if (result.android && view.domObserver.flushingSoon >= 0) {
    return;
  }
  view.domObserver.forceFlush();
  clearComposition(view);
  if (forceUpdate || view.docView && view.docView.dirty) {
    var sel = selectionFromDOM(view);
    if (sel && !sel.eq(view.state.selection)) {
      view.dispatch(view.state.tr.setSelection(sel));
    } else {
      view.updateState(view.state);
    }
    return true;
  }
  return false;
}
function captureCopy(view, dom) {
  if (!view.dom.parentNode) {
    return;
  }
  var wrap = view.dom.parentNode.appendChild(document.createElement("div"));
  wrap.appendChild(dom);
  wrap.style.cssText = "position: fixed; left: -10000px; top: 10px";
  var sel = getSelection(), range = document.createRange();
  range.selectNodeContents(dom);
  view.dom.blur();
  sel.removeAllRanges();
  sel.addRange(range);
  setTimeout(function() {
    if (wrap.parentNode) {
      wrap.parentNode.removeChild(wrap);
    }
    view.focus();
  }, 50);
}
var brokenClipboardAPI = result.ie && result.ie_version < 15 || result.ios && result.webkit_version < 604;
handlers.copy = editHandlers.cut = function(view, e) {
  var sel = view.state.selection, cut = e.type == "cut";
  if (sel.empty) {
    return;
  }
  var data = brokenClipboardAPI ? null : e.clipboardData;
  var slice = sel.content();
  var ref = serializeForClipboard(view, slice);
  var dom = ref.dom;
  var text = ref.text;
  if (data) {
    e.preventDefault();
    data.clearData();
    data.setData("text/html", dom.innerHTML);
    data.setData("text/plain", text);
  } else {
    captureCopy(view, dom);
  }
  if (cut) {
    view.dispatch(view.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
  }
};
function sliceSingleNode(slice) {
  return slice.openStart == 0 && slice.openEnd == 0 && slice.content.childCount == 1 ? slice.content.firstChild : null;
}
function capturePaste(view, e) {
  if (!view.dom.parentNode) {
    return;
  }
  var plainText = view.shiftKey || view.state.selection.$from.parent.type.spec.code;
  var target = view.dom.parentNode.appendChild(document.createElement(plainText ? "textarea" : "div"));
  if (!plainText) {
    target.contentEditable = "true";
  }
  target.style.cssText = "position: fixed; left: -10000px; top: 10px";
  target.focus();
  setTimeout(function() {
    view.focus();
    if (target.parentNode) {
      target.parentNode.removeChild(target);
    }
    if (plainText) {
      doPaste(view, target.value, null, e);
    } else {
      doPaste(view, target.textContent, target.innerHTML, e);
    }
  }, 50);
}
function doPaste(view, text, html, e) {
  var slice = parseFromClipboard(view, text, html, view.shiftKey, view.state.selection.$from);
  if (view.someProp("handlePaste", function(f) {
    return f(view, e, slice || Slice.empty);
  })) {
    return true;
  }
  if (!slice) {
    return false;
  }
  var singleNode = sliceSingleNode(slice);
  var tr = singleNode ? view.state.tr.replaceSelectionWith(singleNode, view.shiftKey) : view.state.tr.replaceSelection(slice);
  view.dispatch(tr.scrollIntoView().setMeta("paste", true).setMeta("uiEvent", "paste"));
  return true;
}
editHandlers.paste = function(view, e) {
  if (view.composing && !result.android) {
    return;
  }
  var data = brokenClipboardAPI ? null : e.clipboardData;
  if (data && doPaste(view, data.getData("text/plain"), data.getData("text/html"), e)) {
    e.preventDefault();
  } else {
    capturePaste(view, e);
  }
};
var Dragging = function Dragging2(slice, move2) {
  this.slice = slice;
  this.move = move2;
};
var dragCopyModifier = result.mac ? "altKey" : "ctrlKey";
handlers.dragstart = function(view, e) {
  var mouseDown = view.mouseDown;
  if (mouseDown) {
    mouseDown.done();
  }
  if (!e.dataTransfer) {
    return;
  }
  var sel = view.state.selection;
  var pos = sel.empty ? null : view.posAtCoords(eventCoords(e));
  if (pos && pos.pos >= sel.from && pos.pos <= (sel instanceof NodeSelection ? sel.to - 1 : sel.to))
    ;
  else if (mouseDown && mouseDown.mightDrag) {
    view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, mouseDown.mightDrag.pos)));
  } else if (e.target && e.target.nodeType == 1) {
    var desc = view.docView.nearestDesc(e.target, true);
    if (desc && desc.node.type.spec.draggable && desc != view.docView) {
      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, desc.posBefore)));
    }
  }
  var slice = view.state.selection.content();
  var ref = serializeForClipboard(view, slice);
  var dom = ref.dom;
  var text = ref.text;
  e.dataTransfer.clearData();
  e.dataTransfer.setData(brokenClipboardAPI ? "Text" : "text/html", dom.innerHTML);
  e.dataTransfer.effectAllowed = "copyMove";
  if (!brokenClipboardAPI) {
    e.dataTransfer.setData("text/plain", text);
  }
  view.dragging = new Dragging(slice, !e[dragCopyModifier]);
};
handlers.dragend = function(view) {
  var dragging = view.dragging;
  window.setTimeout(function() {
    if (view.dragging == dragging) {
      view.dragging = null;
    }
  }, 50);
};
editHandlers.dragover = editHandlers.dragenter = function(_, e) {
  return e.preventDefault();
};
editHandlers.drop = function(view, e) {
  var dragging = view.dragging;
  view.dragging = null;
  if (!e.dataTransfer) {
    return;
  }
  var eventPos = view.posAtCoords(eventCoords(e));
  if (!eventPos) {
    return;
  }
  var $mouse = view.state.doc.resolve(eventPos.pos);
  if (!$mouse) {
    return;
  }
  var slice = dragging && dragging.slice;
  if (slice) {
    view.someProp("transformPasted", function(f) {
      slice = f(slice);
    });
  } else {
    slice = parseFromClipboard(view, e.dataTransfer.getData(brokenClipboardAPI ? "Text" : "text/plain"), brokenClipboardAPI ? null : e.dataTransfer.getData("text/html"), false, $mouse);
  }
  var move2 = dragging && !e[dragCopyModifier];
  if (view.someProp("handleDrop", function(f) {
    return f(view, e, slice || Slice.empty, move2);
  })) {
    e.preventDefault();
    return;
  }
  if (!slice) {
    return;
  }
  e.preventDefault();
  var insertPos = slice ? dropPoint(view.state.doc, $mouse.pos, slice) : $mouse.pos;
  if (insertPos == null) {
    insertPos = $mouse.pos;
  }
  var tr = view.state.tr;
  if (move2) {
    tr.deleteSelection();
  }
  var pos = tr.mapping.map(insertPos);
  var isNode = slice.openStart == 0 && slice.openEnd == 0 && slice.content.childCount == 1;
  var beforeInsert = tr.doc;
  if (isNode) {
    tr.replaceRangeWith(pos, pos, slice.content.firstChild);
  } else {
    tr.replaceRange(pos, pos, slice);
  }
  if (tr.doc.eq(beforeInsert)) {
    return;
  }
  var $pos = tr.doc.resolve(pos);
  if (isNode && NodeSelection.isSelectable(slice.content.firstChild) && $pos.nodeAfter && $pos.nodeAfter.sameMarkup(slice.content.firstChild)) {
    tr.setSelection(new NodeSelection($pos));
  } else {
    var end = tr.mapping.map(insertPos);
    tr.mapping.maps[tr.mapping.maps.length - 1].forEach(function(_from, _to, _newFrom, newTo) {
      return end = newTo;
    });
    tr.setSelection(selectionBetween(view, $pos, tr.doc.resolve(end)));
  }
  view.focus();
  view.dispatch(tr.setMeta("uiEvent", "drop"));
};
handlers.focus = function(view) {
  if (!view.focused) {
    view.domObserver.stop();
    view.dom.classList.add("ProseMirror-focused");
    view.domObserver.start();
    view.focused = true;
    setTimeout(function() {
      if (view.docView && view.hasFocus() && !view.domObserver.currentSelection.eq(view.root.getSelection())) {
        selectionToDOM(view);
      }
    }, 20);
  }
};
handlers.blur = function(view, e) {
  if (view.focused) {
    view.domObserver.stop();
    view.dom.classList.remove("ProseMirror-focused");
    view.domObserver.start();
    if (e.relatedTarget && view.dom.contains(e.relatedTarget)) {
      view.domObserver.currentSelection.set({});
    }
    view.focused = false;
  }
};
handlers.beforeinput = function(view, event) {
  if (result.chrome && result.android && event.inputType == "deleteContentBackward") {
    view.domObserver.flushSoon();
    var domChangeCount = view.domChangeCount;
    setTimeout(function() {
      if (view.domChangeCount != domChangeCount) {
        return;
      }
      view.dom.blur();
      view.focus();
      if (view.someProp("handleKeyDown", function(f) {
        return f(view, keyEvent(8, "Backspace"));
      })) {
        return;
      }
      var ref = view.state.selection;
      var $cursor = ref.$cursor;
      if ($cursor && $cursor.pos > 0) {
        view.dispatch(view.state.tr.delete($cursor.pos - 1, $cursor.pos).scrollIntoView());
      }
    }, 50);
  }
};
for (prop in editHandlers) {
  handlers[prop] = editHandlers[prop];
}
var prop;
function compareObjs(a, b) {
  if (a == b) {
    return true;
  }
  for (var p in a) {
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (var p$1 in b) {
    if (!(p$1 in a)) {
      return false;
    }
  }
  return true;
}
var WidgetType = function WidgetType2(toDOM, spec) {
  this.spec = spec || noSpec;
  this.side = this.spec.side || 0;
  this.toDOM = toDOM;
};
WidgetType.prototype.map = function map(mapping, span, offset, oldOffset) {
  var ref = mapping.mapResult(span.from + oldOffset, this.side < 0 ? -1 : 1);
  var pos = ref.pos;
  var deleted = ref.deleted;
  return deleted ? null : new Decoration(pos - offset, pos - offset, this);
};
WidgetType.prototype.valid = function valid() {
  return true;
};
WidgetType.prototype.eq = function eq2(other) {
  return this == other || other instanceof WidgetType && (this.spec.key && this.spec.key == other.spec.key || this.toDOM == other.toDOM && compareObjs(this.spec, other.spec));
};
WidgetType.prototype.destroy = function destroy2(node2) {
  if (this.spec.destroy) {
    this.spec.destroy(node2);
  }
};
var InlineType = function InlineType2(attrs, spec) {
  this.spec = spec || noSpec;
  this.attrs = attrs;
};
InlineType.prototype.map = function map2(mapping, span, offset, oldOffset) {
  var from2 = mapping.map(span.from + oldOffset, this.spec.inclusiveStart ? -1 : 1) - offset;
  var to = mapping.map(span.to + oldOffset, this.spec.inclusiveEnd ? 1 : -1) - offset;
  return from2 >= to ? null : new Decoration(from2, to, this);
};
InlineType.prototype.valid = function valid2(_, span) {
  return span.from < span.to;
};
InlineType.prototype.eq = function eq3(other) {
  return this == other || other instanceof InlineType && compareObjs(this.attrs, other.attrs) && compareObjs(this.spec, other.spec);
};
InlineType.is = function is(span) {
  return span.type instanceof InlineType;
};
var NodeType = function NodeType2(attrs, spec) {
  this.spec = spec || noSpec;
  this.attrs = attrs;
};
NodeType.prototype.map = function map3(mapping, span, offset, oldOffset) {
  var from2 = mapping.mapResult(span.from + oldOffset, 1);
  if (from2.deleted) {
    return null;
  }
  var to = mapping.mapResult(span.to + oldOffset, -1);
  if (to.deleted || to.pos <= from2.pos) {
    return null;
  }
  return new Decoration(from2.pos - offset, to.pos - offset, this);
};
NodeType.prototype.valid = function valid3(node2, span) {
  var ref = node2.content.findIndex(span.from);
  var index = ref.index;
  var offset = ref.offset;
  var child;
  return offset == span.from && !(child = node2.child(index)).isText && offset + child.nodeSize == span.to;
};
NodeType.prototype.eq = function eq4(other) {
  return this == other || other instanceof NodeType && compareObjs(this.attrs, other.attrs) && compareObjs(this.spec, other.spec);
};
var Decoration = function Decoration2(from2, to, type) {
  this.from = from2;
  this.to = to;
  this.type = type;
};
var prototypeAccessors$1 = { spec: { configurable: true }, inline: { configurable: true } };
Decoration.prototype.copy = function copy(from2, to) {
  return new Decoration(from2, to, this.type);
};
Decoration.prototype.eq = function eq5(other, offset) {
  if (offset === void 0)
    offset = 0;
  return this.type.eq(other.type) && this.from + offset == other.from && this.to + offset == other.to;
};
Decoration.prototype.map = function map4(mapping, offset, oldOffset) {
  return this.type.map(mapping, this, offset, oldOffset);
};
Decoration.widget = function widget(pos, toDOM, spec) {
  return new Decoration(pos, pos, new WidgetType(toDOM, spec));
};
Decoration.inline = function inline(from2, to, attrs, spec) {
  return new Decoration(from2, to, new InlineType(attrs, spec));
};
Decoration.node = function node(from2, to, attrs, spec) {
  return new Decoration(from2, to, new NodeType(attrs, spec));
};
prototypeAccessors$1.spec.get = function() {
  return this.type.spec;
};
prototypeAccessors$1.inline.get = function() {
  return this.type instanceof InlineType;
};
Object.defineProperties(Decoration.prototype, prototypeAccessors$1);
var none = [];
var noSpec = {};
var DecorationSet = function DecorationSet2(local, children) {
  this.local = local && local.length ? local : none;
  this.children = children && children.length ? children : none;
};
DecorationSet.create = function create(doc, decorations) {
  return decorations.length ? buildTree(decorations, doc, 0, noSpec) : empty;
};
DecorationSet.prototype.find = function find(start2, end, predicate) {
  var result2 = [];
  this.findInner(start2 == null ? 0 : start2, end == null ? 1e9 : end, result2, 0, predicate);
  return result2;
};
DecorationSet.prototype.findInner = function findInner(start2, end, result2, offset, predicate) {
  for (var i = 0; i < this.local.length; i++) {
    var span = this.local[i];
    if (span.from <= end && span.to >= start2 && (!predicate || predicate(span.spec))) {
      result2.push(span.copy(span.from + offset, span.to + offset));
    }
  }
  for (var i$1 = 0; i$1 < this.children.length; i$1 += 3) {
    if (this.children[i$1] < end && this.children[i$1 + 1] > start2) {
      var childOff = this.children[i$1] + 1;
      this.children[i$1 + 2].findInner(start2 - childOff, end - childOff, result2, offset + childOff, predicate);
    }
  }
};
DecorationSet.prototype.map = function map5(mapping, doc, options) {
  if (this == empty || mapping.maps.length == 0) {
    return this;
  }
  return this.mapInner(mapping, doc, 0, 0, options || noSpec);
};
DecorationSet.prototype.mapInner = function mapInner(mapping, node2, offset, oldOffset, options) {
  var newLocal;
  for (var i = 0; i < this.local.length; i++) {
    var mapped = this.local[i].map(mapping, offset, oldOffset);
    if (mapped && mapped.type.valid(node2, mapped)) {
      (newLocal || (newLocal = [])).push(mapped);
    } else if (options.onRemove) {
      options.onRemove(this.local[i].spec);
    }
  }
  if (this.children.length) {
    return mapChildren(this.children, newLocal, mapping, node2, offset, oldOffset, options);
  } else {
    return newLocal ? new DecorationSet(newLocal.sort(byPos)) : empty;
  }
};
DecorationSet.prototype.add = function add(doc, decorations) {
  if (!decorations.length) {
    return this;
  }
  if (this == empty) {
    return DecorationSet.create(doc, decorations);
  }
  return this.addInner(doc, decorations, 0);
};
DecorationSet.prototype.addInner = function addInner(doc, decorations, offset) {
  var this$1 = this;
  var children, childIndex = 0;
  doc.forEach(function(childNode, childOffset) {
    var baseOffset = childOffset + offset, found;
    if (!(found = takeSpansForNode(decorations, childNode, baseOffset))) {
      return;
    }
    if (!children) {
      children = this$1.children.slice();
    }
    while (childIndex < children.length && children[childIndex] < childOffset) {
      childIndex += 3;
    }
    if (children[childIndex] == childOffset) {
      children[childIndex + 2] = children[childIndex + 2].addInner(childNode, found, baseOffset + 1);
    } else {
      children.splice(childIndex, 0, childOffset, childOffset + childNode.nodeSize, buildTree(found, childNode, baseOffset + 1, noSpec));
    }
    childIndex += 3;
  });
  var local = moveSpans(childIndex ? withoutNulls(decorations) : decorations, -offset);
  for (var i = 0; i < local.length; i++) {
    if (!local[i].type.valid(doc, local[i])) {
      local.splice(i--, 1);
    }
  }
  return new DecorationSet(local.length ? this.local.concat(local).sort(byPos) : this.local, children || this.children);
};
DecorationSet.prototype.remove = function remove(decorations) {
  if (decorations.length == 0 || this == empty) {
    return this;
  }
  return this.removeInner(decorations, 0);
};
DecorationSet.prototype.removeInner = function removeInner(decorations, offset) {
  var children = this.children, local = this.local;
  for (var i = 0; i < children.length; i += 3) {
    var found = void 0, from2 = children[i] + offset, to = children[i + 1] + offset;
    for (var j = 0, span = void 0; j < decorations.length; j++) {
      if (span = decorations[j]) {
        if (span.from > from2 && span.to < to) {
          decorations[j] = null;
          (found || (found = [])).push(span);
        }
      }
    }
    if (!found) {
      continue;
    }
    if (children == this.children) {
      children = this.children.slice();
    }
    var removed = children[i + 2].removeInner(found, from2 + 1);
    if (removed != empty) {
      children[i + 2] = removed;
    } else {
      children.splice(i, 3);
      i -= 3;
    }
  }
  if (local.length) {
    for (var i$1 = 0, span$1 = void 0; i$1 < decorations.length; i$1++) {
      if (span$1 = decorations[i$1]) {
        for (var j$1 = 0; j$1 < local.length; j$1++) {
          if (local[j$1].eq(span$1, offset)) {
            if (local == this.local) {
              local = this.local.slice();
            }
            local.splice(j$1--, 1);
          }
        }
      }
    }
  }
  if (children == this.children && local == this.local) {
    return this;
  }
  return local.length || children.length ? new DecorationSet(local, children) : empty;
};
DecorationSet.prototype.forChild = function forChild(offset, node2) {
  if (this == empty) {
    return this;
  }
  if (node2.isLeaf) {
    return DecorationSet.empty;
  }
  var child, local;
  for (var i = 0; i < this.children.length; i += 3) {
    if (this.children[i] >= offset) {
      if (this.children[i] == offset) {
        child = this.children[i + 2];
      }
      break;
    }
  }
  var start2 = offset + 1, end = start2 + node2.content.size;
  for (var i$1 = 0; i$1 < this.local.length; i$1++) {
    var dec = this.local[i$1];
    if (dec.from < end && dec.to > start2 && dec.type instanceof InlineType) {
      var from2 = Math.max(start2, dec.from) - start2, to = Math.min(end, dec.to) - start2;
      if (from2 < to) {
        (local || (local = [])).push(dec.copy(from2, to));
      }
    }
  }
  if (local) {
    var localSet = new DecorationSet(local.sort(byPos));
    return child ? new DecorationGroup([localSet, child]) : localSet;
  }
  return child || empty;
};
DecorationSet.prototype.eq = function eq6(other) {
  if (this == other) {
    return true;
  }
  if (!(other instanceof DecorationSet) || this.local.length != other.local.length || this.children.length != other.children.length) {
    return false;
  }
  for (var i = 0; i < this.local.length; i++) {
    if (!this.local[i].eq(other.local[i])) {
      return false;
    }
  }
  for (var i$1 = 0; i$1 < this.children.length; i$1 += 3) {
    if (this.children[i$1] != other.children[i$1] || this.children[i$1 + 1] != other.children[i$1 + 1] || !this.children[i$1 + 2].eq(other.children[i$1 + 2])) {
      return false;
    }
  }
  return true;
};
DecorationSet.prototype.locals = function locals(node2) {
  return removeOverlap(this.localsInner(node2));
};
DecorationSet.prototype.localsInner = function localsInner(node2) {
  if (this == empty) {
    return none;
  }
  if (node2.inlineContent || !this.local.some(InlineType.is)) {
    return this.local;
  }
  var result2 = [];
  for (var i = 0; i < this.local.length; i++) {
    if (!(this.local[i].type instanceof InlineType)) {
      result2.push(this.local[i]);
    }
  }
  return result2;
};
var empty = new DecorationSet();
DecorationSet.empty = empty;
DecorationSet.removeOverlap = removeOverlap;
var DecorationGroup = function DecorationGroup2(members) {
  this.members = members;
};
DecorationGroup.prototype.map = function map6(mapping, doc) {
  var mappedDecos = this.members.map(function(member) {
    return member.map(mapping, doc, noSpec);
  });
  return DecorationGroup.from(mappedDecos);
};
DecorationGroup.prototype.forChild = function forChild2(offset, child) {
  if (child.isLeaf) {
    return DecorationSet.empty;
  }
  var found = [];
  for (var i = 0; i < this.members.length; i++) {
    var result2 = this.members[i].forChild(offset, child);
    if (result2 == empty) {
      continue;
    }
    if (result2 instanceof DecorationGroup) {
      found = found.concat(result2.members);
    } else {
      found.push(result2);
    }
  }
  return DecorationGroup.from(found);
};
DecorationGroup.prototype.eq = function eq7(other) {
  if (!(other instanceof DecorationGroup) || other.members.length != this.members.length) {
    return false;
  }
  for (var i = 0; i < this.members.length; i++) {
    if (!this.members[i].eq(other.members[i])) {
      return false;
    }
  }
  return true;
};
DecorationGroup.prototype.locals = function locals2(node2) {
  var result2, sorted = true;
  for (var i = 0; i < this.members.length; i++) {
    var locals3 = this.members[i].localsInner(node2);
    if (!locals3.length) {
      continue;
    }
    if (!result2) {
      result2 = locals3;
    } else {
      if (sorted) {
        result2 = result2.slice();
        sorted = false;
      }
      for (var j = 0; j < locals3.length; j++) {
        result2.push(locals3[j]);
      }
    }
  }
  return result2 ? removeOverlap(sorted ? result2 : result2.sort(byPos)) : none;
};
DecorationGroup.from = function from(members) {
  switch (members.length) {
    case 0:
      return empty;
    case 1:
      return members[0];
    default:
      return new DecorationGroup(members);
  }
};
function mapChildren(oldChildren, newLocal, mapping, node2, offset, oldOffset, options) {
  var children = oldChildren.slice();
  var shift = function(oldStart, oldEnd, newStart, newEnd) {
    for (var i2 = 0; i2 < children.length; i2 += 3) {
      var end = children[i2 + 1], dSize = void 0;
      if (end < 0 || oldStart > end + oldOffset) {
        continue;
      }
      var start2 = children[i2] + oldOffset;
      if (oldEnd >= start2) {
        children[i2 + 1] = oldStart <= start2 ? -2 : -1;
      } else if (newStart >= offset && (dSize = newEnd - newStart - (oldEnd - oldStart))) {
        children[i2] += dSize;
        children[i2 + 1] += dSize;
      }
    }
  };
  for (var i = 0; i < mapping.maps.length; i++) {
    mapping.maps[i].forEach(shift);
  }
  var mustRebuild = false;
  for (var i$1 = 0; i$1 < children.length; i$1 += 3) {
    if (children[i$1 + 1] < 0) {
      if (children[i$1 + 1] == -2) {
        mustRebuild = true;
        children[i$1 + 1] = -1;
        continue;
      }
      var from2 = mapping.map(oldChildren[i$1] + oldOffset), fromLocal = from2 - offset;
      if (fromLocal < 0 || fromLocal >= node2.content.size) {
        mustRebuild = true;
        continue;
      }
      var to = mapping.map(oldChildren[i$1 + 1] + oldOffset, -1), toLocal = to - offset;
      var ref = node2.content.findIndex(fromLocal);
      var index = ref.index;
      var childOffset = ref.offset;
      var childNode = node2.maybeChild(index);
      if (childNode && childOffset == fromLocal && childOffset + childNode.nodeSize == toLocal) {
        var mapped = children[i$1 + 2].mapInner(mapping, childNode, from2 + 1, oldChildren[i$1] + oldOffset + 1, options);
        if (mapped != empty) {
          children[i$1] = fromLocal;
          children[i$1 + 1] = toLocal;
          children[i$1 + 2] = mapped;
        } else {
          children[i$1 + 1] = -2;
          mustRebuild = true;
        }
      } else {
        mustRebuild = true;
      }
    }
  }
  if (mustRebuild) {
    var decorations = mapAndGatherRemainingDecorations(children, oldChildren, newLocal || [], mapping, offset, oldOffset, options);
    var built = buildTree(decorations, node2, 0, options);
    newLocal = built.local;
    for (var i$2 = 0; i$2 < children.length; i$2 += 3) {
      if (children[i$2 + 1] < 0) {
        children.splice(i$2, 3);
        i$2 -= 3;
      }
    }
    for (var i$3 = 0, j = 0; i$3 < built.children.length; i$3 += 3) {
      var from$1 = built.children[i$3];
      while (j < children.length && children[j] < from$1) {
        j += 3;
      }
      children.splice(j, 0, built.children[i$3], built.children[i$3 + 1], built.children[i$3 + 2]);
    }
  }
  return new DecorationSet(newLocal && newLocal.sort(byPos), children);
}
function moveSpans(spans, offset) {
  if (!offset || !spans.length) {
    return spans;
  }
  var result2 = [];
  for (var i = 0; i < spans.length; i++) {
    var span = spans[i];
    result2.push(new Decoration(span.from + offset, span.to + offset, span.type));
  }
  return result2;
}
function mapAndGatherRemainingDecorations(children, oldChildren, decorations, mapping, offset, oldOffset, options) {
  function gather(set2, oldOffset2) {
    for (var i2 = 0; i2 < set2.local.length; i2++) {
      var mapped = set2.local[i2].map(mapping, offset, oldOffset2);
      if (mapped) {
        decorations.push(mapped);
      } else if (options.onRemove) {
        options.onRemove(set2.local[i2].spec);
      }
    }
    for (var i$1 = 0; i$1 < set2.children.length; i$1 += 3) {
      gather(set2.children[i$1 + 2], set2.children[i$1] + oldOffset2 + 1);
    }
  }
  for (var i = 0; i < children.length; i += 3) {
    if (children[i + 1] == -1) {
      gather(children[i + 2], oldChildren[i] + oldOffset + 1);
    }
  }
  return decorations;
}
function takeSpansForNode(spans, node2, offset) {
  if (node2.isLeaf) {
    return null;
  }
  var end = offset + node2.nodeSize, found = null;
  for (var i = 0, span = void 0; i < spans.length; i++) {
    if ((span = spans[i]) && span.from > offset && span.to < end) {
      (found || (found = [])).push(span);
      spans[i] = null;
    }
  }
  return found;
}
function withoutNulls(array) {
  var result2 = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i] != null) {
      result2.push(array[i]);
    }
  }
  return result2;
}
function buildTree(spans, node2, offset, options) {
  var children = [], hasNulls = false;
  node2.forEach(function(childNode, localStart) {
    var found = takeSpansForNode(spans, childNode, localStart + offset);
    if (found) {
      hasNulls = true;
      var subtree = buildTree(found, childNode, offset + localStart + 1, options);
      if (subtree != empty) {
        children.push(localStart, localStart + childNode.nodeSize, subtree);
      }
    }
  });
  var locals3 = moveSpans(hasNulls ? withoutNulls(spans) : spans, -offset).sort(byPos);
  for (var i = 0; i < locals3.length; i++) {
    if (!locals3[i].type.valid(node2, locals3[i])) {
      if (options.onRemove) {
        options.onRemove(locals3[i].spec);
      }
      locals3.splice(i--, 1);
    }
  }
  return locals3.length || children.length ? new DecorationSet(locals3, children) : empty;
}
function byPos(a, b) {
  return a.from - b.from || a.to - b.to;
}
function removeOverlap(spans) {
  var working = spans;
  for (var i = 0; i < working.length - 1; i++) {
    var span = working[i];
    if (span.from != span.to) {
      for (var j = i + 1; j < working.length; j++) {
        var next = working[j];
        if (next.from == span.from) {
          if (next.to != span.to) {
            if (working == spans) {
              working = spans.slice();
            }
            working[j] = next.copy(next.from, span.to);
            insertAhead(working, j + 1, next.copy(span.to, next.to));
          }
          continue;
        } else {
          if (next.from < span.to) {
            if (working == spans) {
              working = spans.slice();
            }
            working[i] = span.copy(span.from, next.from);
            insertAhead(working, j, span.copy(next.from, span.to));
          }
          break;
        }
      }
    }
  }
  return working;
}
function insertAhead(array, i, deco) {
  while (i < array.length && byPos(deco, array[i]) > 0) {
    i++;
  }
  array.splice(i, 0, deco);
}
function viewDecorations(view) {
  var found = [];
  view.someProp("decorations", function(f) {
    var result2 = f(view.state);
    if (result2 && result2 != empty) {
      found.push(result2);
    }
  });
  if (view.cursorWrapper) {
    found.push(DecorationSet.create(view.state.doc, [view.cursorWrapper.deco]));
  }
  return DecorationGroup.from(found);
}
var EditorView = function EditorView2(place, props) {
  this._props = props;
  this.state = props.state;
  this.directPlugins = props.plugins || [];
  this.directPlugins.forEach(checkStateComponent);
  this.dispatch = this.dispatch.bind(this);
  this._root = null;
  this.focused = false;
  this.trackWrites = null;
  this.dom = place && place.mount || document.createElement("div");
  if (place) {
    if (place.appendChild) {
      place.appendChild(this.dom);
    } else if (place.apply) {
      place(this.dom);
    } else if (place.mount) {
      this.mounted = true;
    }
  }
  this.editable = getEditable(this);
  this.markCursor = null;
  this.cursorWrapper = null;
  updateCursorWrapper(this);
  this.nodeViews = buildNodeViews(this);
  this.docView = docViewDesc(this.state.doc, computeDocDeco(this), viewDecorations(this), this.dom, this);
  this.lastSelectedViewDesc = null;
  this.dragging = null;
  initInput(this);
  this.prevDirectPlugins = [];
  this.pluginViews = [];
  this.updatePluginViews();
};
var prototypeAccessors$2 = { props: { configurable: true }, root: { configurable: true }, isDestroyed: { configurable: true } };
prototypeAccessors$2.props.get = function() {
  if (this._props.state != this.state) {
    var prev = this._props;
    this._props = {};
    for (var name in prev) {
      this._props[name] = prev[name];
    }
    this._props.state = this.state;
  }
  return this._props;
};
EditorView.prototype.update = function update(props) {
  if (props.handleDOMEvents != this._props.handleDOMEvents) {
    ensureListeners(this);
  }
  this._props = props;
  if (props.plugins) {
    props.plugins.forEach(checkStateComponent);
    this.directPlugins = props.plugins;
  }
  this.updateStateInner(props.state, true);
};
EditorView.prototype.setProps = function setProps(props) {
  var updated = {};
  for (var name in this._props) {
    updated[name] = this._props[name];
  }
  updated.state = this.state;
  for (var name$1 in props) {
    updated[name$1] = props[name$1];
  }
  this.update(updated);
};
EditorView.prototype.updateState = function updateState(state) {
  this.updateStateInner(state, this.state.plugins != state.plugins);
};
EditorView.prototype.updateStateInner = function updateStateInner(state, reconfigured) {
  var this$1 = this;
  var prev = this.state, redraw = false, updateSel = false;
  if (state.storedMarks && this.composing) {
    clearComposition(this);
    updateSel = true;
  }
  this.state = state;
  if (reconfigured) {
    var nodeViews = buildNodeViews(this);
    if (changedNodeViews(nodeViews, this.nodeViews)) {
      this.nodeViews = nodeViews;
      redraw = true;
    }
    ensureListeners(this);
  }
  this.editable = getEditable(this);
  updateCursorWrapper(this);
  var innerDeco = viewDecorations(this), outerDeco = computeDocDeco(this);
  var scroll = reconfigured ? "reset" : state.scrollToSelection > prev.scrollToSelection ? "to selection" : "preserve";
  var updateDoc = redraw || !this.docView.matchesNode(state.doc, outerDeco, innerDeco);
  if (updateDoc || !state.selection.eq(prev.selection)) {
    updateSel = true;
  }
  var oldScrollPos = scroll == "preserve" && updateSel && this.dom.style.overflowAnchor == null && storeScrollPos(this);
  if (updateSel) {
    this.domObserver.stop();
    var forceSelUpdate = updateDoc && (result.ie || result.chrome) && !this.composing && !prev.selection.empty && !state.selection.empty && selectionContextChanged(prev.selection, state.selection);
    if (updateDoc) {
      var chromeKludge = result.chrome ? this.trackWrites = this.root.getSelection().focusNode : null;
      if (redraw || !this.docView.update(state.doc, outerDeco, innerDeco, this)) {
        this.docView.updateOuterDeco([]);
        this.docView.destroy();
        this.docView = docViewDesc(state.doc, outerDeco, innerDeco, this.dom, this);
      }
      if (chromeKludge && !this.trackWrites) {
        forceSelUpdate = true;
      }
    }
    if (forceSelUpdate || !(this.mouseDown && this.domObserver.currentSelection.eq(this.root.getSelection()) && anchorInRightPlace(this))) {
      selectionToDOM(this, forceSelUpdate);
    } else {
      syncNodeSelection(this, state.selection);
      this.domObserver.setCurSelection();
    }
    this.domObserver.start();
  }
  this.updatePluginViews(prev);
  if (scroll == "reset") {
    this.dom.scrollTop = 0;
  } else if (scroll == "to selection") {
    var startDOM = this.root.getSelection().focusNode;
    if (this.someProp("handleScrollToSelection", function(f) {
      return f(this$1);
    }))
      ;
    else if (state.selection instanceof NodeSelection) {
      scrollRectIntoView(this, this.docView.domAfterPos(state.selection.from).getBoundingClientRect(), startDOM);
    } else {
      scrollRectIntoView(this, this.coordsAtPos(state.selection.head, 1), startDOM);
    }
  } else if (oldScrollPos) {
    resetScrollPos(oldScrollPos);
  }
};
EditorView.prototype.destroyPluginViews = function destroyPluginViews() {
  var view;
  while (view = this.pluginViews.pop()) {
    if (view.destroy) {
      view.destroy();
    }
  }
};
EditorView.prototype.updatePluginViews = function updatePluginViews(prevState) {
  if (!prevState || prevState.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
    this.prevDirectPlugins = this.directPlugins;
    this.destroyPluginViews();
    for (var i = 0; i < this.directPlugins.length; i++) {
      var plugin = this.directPlugins[i];
      if (plugin.spec.view) {
        this.pluginViews.push(plugin.spec.view(this));
      }
    }
    for (var i$1 = 0; i$1 < this.state.plugins.length; i$1++) {
      var plugin$1 = this.state.plugins[i$1];
      if (plugin$1.spec.view) {
        this.pluginViews.push(plugin$1.spec.view(this));
      }
    }
  } else {
    for (var i$2 = 0; i$2 < this.pluginViews.length; i$2++) {
      var pluginView = this.pluginViews[i$2];
      if (pluginView.update) {
        pluginView.update(this, prevState);
      }
    }
  }
};
EditorView.prototype.someProp = function someProp(propName, f) {
  var prop = this._props && this._props[propName], value;
  if (prop != null && (value = f ? f(prop) : prop)) {
    return value;
  }
  for (var i = 0; i < this.directPlugins.length; i++) {
    var prop$1 = this.directPlugins[i].props[propName];
    if (prop$1 != null && (value = f ? f(prop$1) : prop$1)) {
      return value;
    }
  }
  var plugins = this.state.plugins;
  if (plugins) {
    for (var i$1 = 0; i$1 < plugins.length; i$1++) {
      var prop$2 = plugins[i$1].props[propName];
      if (prop$2 != null && (value = f ? f(prop$2) : prop$2)) {
        return value;
      }
    }
  }
};
EditorView.prototype.hasFocus = function hasFocus() {
  return this.root.activeElement == this.dom;
};
EditorView.prototype.focus = function focus() {
  this.domObserver.stop();
  if (this.editable) {
    focusPreventScroll(this.dom);
  }
  selectionToDOM(this);
  this.domObserver.start();
};
prototypeAccessors$2.root.get = function() {
  var cached = this._root;
  if (cached == null) {
    for (var search = this.dom.parentNode; search; search = search.parentNode) {
      if (search.nodeType == 9 || search.nodeType == 11 && search.host) {
        if (!search.getSelection) {
          Object.getPrototypeOf(search).getSelection = function() {
            return document.getSelection();
          };
        }
        return this._root = search;
      }
    }
  }
  return cached || document;
};
EditorView.prototype.posAtCoords = function posAtCoords$1(coords) {
  return posAtCoords(this, coords);
};
EditorView.prototype.coordsAtPos = function coordsAtPos$1(pos, side) {
  if (side === void 0)
    side = 1;
  return coordsAtPos(this, pos, side);
};
EditorView.prototype.domAtPos = function domAtPos(pos, side) {
  if (side === void 0)
    side = 0;
  return this.docView.domFromPos(pos, side);
};
EditorView.prototype.nodeDOM = function nodeDOM(pos) {
  var desc = this.docView.descAt(pos);
  return desc ? desc.nodeDOM : null;
};
EditorView.prototype.posAtDOM = function posAtDOM(node2, offset, bias) {
  if (bias === void 0)
    bias = -1;
  var pos = this.docView.posFromDOM(node2, offset, bias);
  if (pos == null) {
    throw new RangeError("DOM position not inside the editor");
  }
  return pos;
};
EditorView.prototype.endOfTextblock = function endOfTextblock$1(dir, state) {
  return endOfTextblock(this, state || this.state, dir);
};
EditorView.prototype.destroy = function destroy3() {
  if (!this.docView) {
    return;
  }
  destroyInput(this);
  this.destroyPluginViews();
  if (this.mounted) {
    this.docView.update(this.state.doc, [], viewDecorations(this), this);
    this.dom.textContent = "";
  } else if (this.dom.parentNode) {
    this.dom.parentNode.removeChild(this.dom);
  }
  this.docView.destroy();
  this.docView = null;
};
prototypeAccessors$2.isDestroyed.get = function() {
  return this.docView == null;
};
EditorView.prototype.dispatchEvent = function dispatchEvent$1(event) {
  return dispatchEvent(this, event);
};
EditorView.prototype.dispatch = function dispatch(tr) {
  var dispatchTransaction = this._props.dispatchTransaction;
  if (dispatchTransaction) {
    dispatchTransaction.call(this, tr);
  } else {
    this.updateState(this.state.apply(tr));
  }
};
Object.defineProperties(EditorView.prototype, prototypeAccessors$2);
function computeDocDeco(view) {
  var attrs = /* @__PURE__ */ Object.create(null);
  attrs.class = "ProseMirror";
  attrs.contenteditable = String(view.editable);
  attrs.translate = "no";
  view.someProp("attributes", function(value) {
    if (typeof value == "function") {
      value = value(view.state);
    }
    if (value) {
      for (var attr in value) {
        if (attr == "class") {
          attrs.class += " " + value[attr];
        }
        if (attr == "style") {
          attrs.style = (attrs.style ? attrs.style + ";" : "") + value[attr];
        } else if (!attrs[attr] && attr != "contenteditable" && attr != "nodeName") {
          attrs[attr] = String(value[attr]);
        }
      }
    }
  });
  return [Decoration.node(0, view.state.doc.content.size, attrs)];
}
function updateCursorWrapper(view) {
  if (view.markCursor) {
    var dom = document.createElement("img");
    dom.className = "ProseMirror-separator";
    dom.setAttribute("mark-placeholder", "true");
    dom.setAttribute("alt", "");
    view.cursorWrapper = { dom, deco: Decoration.widget(view.state.selection.head, dom, { raw: true, marks: view.markCursor }) };
  } else {
    view.cursorWrapper = null;
  }
}
function getEditable(view) {
  return !view.someProp("editable", function(value) {
    return value(view.state) === false;
  });
}
function selectionContextChanged(sel1, sel2) {
  var depth = Math.min(sel1.$anchor.sharedDepth(sel1.head), sel2.$anchor.sharedDepth(sel2.head));
  return sel1.$anchor.start(depth) != sel2.$anchor.start(depth);
}
function buildNodeViews(view) {
  var result2 = {};
  view.someProp("nodeViews", function(obj) {
    for (var prop in obj) {
      if (!Object.prototype.hasOwnProperty.call(result2, prop)) {
        result2[prop] = obj[prop];
      }
    }
  });
  return result2;
}
function changedNodeViews(a, b) {
  var nA = 0, nB = 0;
  for (var prop in a) {
    if (a[prop] != b[prop]) {
      return true;
    }
    nA++;
  }
  for (var _ in b) {
    nB++;
  }
  return nA != nB;
}
function checkStateComponent(plugin) {
  if (plugin.spec.state || plugin.spec.filterTransaction || plugin.spec.appendTransaction) {
    throw new RangeError("Plugins passed directly to the view must not have a state component");
  }
}

export {
  Decoration,
  DecorationSet,
  EditorView
};
