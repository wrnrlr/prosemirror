import {
  Plugin
} from "./chunk-UIQZLVQX.js";
import {
  dropPoint
} from "./chunk-HSTGJMAL.js";
import "./chunk-O5MLGE4X.js";

// node_modules/prosemirror-dropcursor/dist/index.es.js
function dropCursor(options) {
  if (options === void 0)
    options = {};
  return new Plugin({
    view: function view(editorView) {
      return new DropCursorView(editorView, options);
    }
  });
}
var DropCursorView = function DropCursorView2(editorView, options) {
  var this$1 = this;
  this.editorView = editorView;
  this.width = options.width || 1;
  this.color = options.color || "black";
  this.class = options.class;
  this.cursorPos = null;
  this.element = null;
  this.timeout = null;
  this.handlers = ["dragover", "dragend", "drop", "dragleave"].map(function(name) {
    var handler = function(e) {
      return this$1[name](e);
    };
    editorView.dom.addEventListener(name, handler);
    return { name, handler };
  });
};
DropCursorView.prototype.destroy = function destroy() {
  var this$1 = this;
  this.handlers.forEach(function(ref) {
    var name = ref.name;
    var handler = ref.handler;
    return this$1.editorView.dom.removeEventListener(name, handler);
  });
};
DropCursorView.prototype.update = function update(editorView, prevState) {
  if (this.cursorPos != null && prevState.doc != editorView.state.doc) {
    if (this.cursorPos > editorView.state.doc.content.size) {
      this.setCursor(null);
    } else {
      this.updateOverlay();
    }
  }
};
DropCursorView.prototype.setCursor = function setCursor(pos) {
  if (pos == this.cursorPos) {
    return;
  }
  this.cursorPos = pos;
  if (pos == null) {
    this.element.parentNode.removeChild(this.element);
    this.element = null;
  } else {
    this.updateOverlay();
  }
};
DropCursorView.prototype.updateOverlay = function updateOverlay() {
  var $pos = this.editorView.state.doc.resolve(this.cursorPos), rect;
  if (!$pos.parent.inlineContent) {
    var before = $pos.nodeBefore, after = $pos.nodeAfter;
    if (before || after) {
      var nodeRect = this.editorView.nodeDOM(this.cursorPos - (before ? before.nodeSize : 0)).getBoundingClientRect();
      var top = before ? nodeRect.bottom : nodeRect.top;
      if (before && after) {
        top = (top + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2;
      }
      rect = { left: nodeRect.left, right: nodeRect.right, top: top - this.width / 2, bottom: top + this.width / 2 };
    }
  }
  if (!rect) {
    var coords = this.editorView.coordsAtPos(this.cursorPos);
    rect = { left: coords.left - this.width / 2, right: coords.left + this.width / 2, top: coords.top, bottom: coords.bottom };
  }
  var parent = this.editorView.dom.offsetParent;
  if (!this.element) {
    this.element = parent.appendChild(document.createElement("div"));
    if (this.class) {
      this.element.className = this.class;
    }
    this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none; background-color: " + this.color;
  }
  var parentLeft, parentTop;
  if (!parent || parent == document.body && getComputedStyle(parent).position == "static") {
    parentLeft = -pageXOffset;
    parentTop = -pageYOffset;
  } else {
    var rect$1 = parent.getBoundingClientRect();
    parentLeft = rect$1.left - parent.scrollLeft;
    parentTop = rect$1.top - parent.scrollTop;
  }
  this.element.style.left = rect.left - parentLeft + "px";
  this.element.style.top = rect.top - parentTop + "px";
  this.element.style.width = rect.right - rect.left + "px";
  this.element.style.height = rect.bottom - rect.top + "px";
};
DropCursorView.prototype.scheduleRemoval = function scheduleRemoval(timeout) {
  var this$1 = this;
  clearTimeout(this.timeout);
  this.timeout = setTimeout(function() {
    return this$1.setCursor(null);
  }, timeout);
};
DropCursorView.prototype.dragover = function dragover(event) {
  if (!this.editorView.editable) {
    return;
  }
  var pos = this.editorView.posAtCoords({ left: event.clientX, top: event.clientY });
  var node = pos && pos.inside >= 0 && this.editorView.state.doc.nodeAt(pos.inside);
  var disableDropCursor = node && node.type.spec.disableDropCursor;
  var disabled = typeof disableDropCursor == "function" ? disableDropCursor(this.editorView, pos) : disableDropCursor;
  if (pos && !disabled) {
    var target = pos.pos;
    if (this.editorView.dragging && this.editorView.dragging.slice) {
      target = dropPoint(this.editorView.state.doc, target, this.editorView.dragging.slice);
      if (target == null) {
        return this.setCursor(null);
      }
    }
    this.setCursor(target);
    this.scheduleRemoval(5e3);
  }
};
DropCursorView.prototype.dragend = function dragend() {
  this.scheduleRemoval(20);
};
DropCursorView.prototype.drop = function drop() {
  this.scheduleRemoval(20);
};
DropCursorView.prototype.dragleave = function dragleave(event) {
  if (event.target == this.editorView.dom || !this.editorView.dom.contains(event.relatedTarget)) {
    this.setCursor(null);
  }
};
export {
  dropCursor
};
