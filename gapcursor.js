import {
  Decoration,
  DecorationSet
} from "./chunk-RGPLCND3.js";
import {
  keydownHandler
} from "./chunk-EP2TKYSN.js";
import {
  NodeSelection,
  Plugin,
  Selection,
  TextSelection
} from "./chunk-UIQZLVQX.js";
import "./chunk-HSTGJMAL.js";
import {
  Fragment,
  Slice
} from "./chunk-O5MLGE4X.js";

// node_modules/prosemirror-gapcursor/dist/index.es.js
var GapCursor = /* @__PURE__ */ function(Selection2) {
  function GapCursor2($pos) {
    Selection2.call(this, $pos, $pos);
  }
  if (Selection2)
    GapCursor2.__proto__ = Selection2;
  GapCursor2.prototype = Object.create(Selection2 && Selection2.prototype);
  GapCursor2.prototype.constructor = GapCursor2;
  GapCursor2.prototype.map = function map2(doc, mapping) {
    var $pos = doc.resolve(mapping.map(this.head));
    return GapCursor2.valid($pos) ? new GapCursor2($pos) : Selection2.near($pos);
  };
  GapCursor2.prototype.content = function content() {
    return Slice.empty;
  };
  GapCursor2.prototype.eq = function eq(other) {
    return other instanceof GapCursor2 && other.head == this.head;
  };
  GapCursor2.prototype.toJSON = function toJSON() {
    return { type: "gapcursor", pos: this.head };
  };
  GapCursor2.fromJSON = function fromJSON(doc, json) {
    if (typeof json.pos != "number") {
      throw new RangeError("Invalid input for GapCursor.fromJSON");
    }
    return new GapCursor2(doc.resolve(json.pos));
  };
  GapCursor2.prototype.getBookmark = function getBookmark() {
    return new GapBookmark(this.anchor);
  };
  GapCursor2.valid = function valid($pos) {
    var parent = $pos.parent;
    if (parent.isTextblock || !closedBefore($pos) || !closedAfter($pos)) {
      return false;
    }
    var override = parent.type.spec.allowGapCursor;
    if (override != null) {
      return override;
    }
    var deflt = parent.contentMatchAt($pos.index()).defaultType;
    return deflt && deflt.isTextblock;
  };
  GapCursor2.findFrom = function findFrom($pos, dir, mustMove) {
    search:
      for (; ; ) {
        if (!mustMove && GapCursor2.valid($pos)) {
          return $pos;
        }
        var pos = $pos.pos, next = null;
        for (var d = $pos.depth; ; d--) {
          var parent = $pos.node(d);
          if (dir > 0 ? $pos.indexAfter(d) < parent.childCount : $pos.index(d) > 0) {
            next = parent.child(dir > 0 ? $pos.indexAfter(d) : $pos.index(d) - 1);
            break;
          } else if (d == 0) {
            return null;
          }
          pos += dir;
          var $cur = $pos.doc.resolve(pos);
          if (GapCursor2.valid($cur)) {
            return $cur;
          }
        }
        for (; ; ) {
          var inside = dir > 0 ? next.firstChild : next.lastChild;
          if (!inside) {
            if (next.isAtom && !next.isText && !NodeSelection.isSelectable(next)) {
              $pos = $pos.doc.resolve(pos + next.nodeSize * dir);
              mustMove = false;
              continue search;
            }
            break;
          }
          next = inside;
          pos += dir;
          var $cur$1 = $pos.doc.resolve(pos);
          if (GapCursor2.valid($cur$1)) {
            return $cur$1;
          }
        }
        return null;
      }
  };
  return GapCursor2;
}(Selection);
GapCursor.prototype.visible = false;
Selection.jsonID("gapcursor", GapCursor);
var GapBookmark = function GapBookmark2(pos) {
  this.pos = pos;
};
GapBookmark.prototype.map = function map(mapping) {
  return new GapBookmark(mapping.map(this.pos));
};
GapBookmark.prototype.resolve = function resolve(doc) {
  var $pos = doc.resolve(this.pos);
  return GapCursor.valid($pos) ? new GapCursor($pos) : Selection.near($pos);
};
function closedBefore($pos) {
  for (var d = $pos.depth; d >= 0; d--) {
    var index = $pos.index(d), parent = $pos.node(d);
    if (index == 0) {
      if (parent.type.spec.isolating) {
        return true;
      }
      continue;
    }
    for (var before = parent.child(index - 1); ; before = before.lastChild) {
      if (before.childCount == 0 && !before.inlineContent || before.isAtom || before.type.spec.isolating) {
        return true;
      }
      if (before.inlineContent) {
        return false;
      }
    }
  }
  return true;
}
function closedAfter($pos) {
  for (var d = $pos.depth; d >= 0; d--) {
    var index = $pos.indexAfter(d), parent = $pos.node(d);
    if (index == parent.childCount) {
      if (parent.type.spec.isolating) {
        return true;
      }
      continue;
    }
    for (var after = parent.child(index); ; after = after.firstChild) {
      if (after.childCount == 0 && !after.inlineContent || after.isAtom || after.type.spec.isolating) {
        return true;
      }
      if (after.inlineContent) {
        return false;
      }
    }
  }
  return true;
}
var gapCursor = function() {
  return new Plugin({
    props: {
      decorations: drawGapCursor,
      createSelectionBetween: function createSelectionBetween(_view, $anchor, $head) {
        if ($anchor.pos == $head.pos && GapCursor.valid($head)) {
          return new GapCursor($head);
        }
      },
      handleClick,
      handleKeyDown,
      handleDOMEvents: { beforeinput }
    }
  });
};
var handleKeyDown = keydownHandler({
  "ArrowLeft": arrow("horiz", -1),
  "ArrowRight": arrow("horiz", 1),
  "ArrowUp": arrow("vert", -1),
  "ArrowDown": arrow("vert", 1)
});
function arrow(axis, dir) {
  var dirStr = axis == "vert" ? dir > 0 ? "down" : "up" : dir > 0 ? "right" : "left";
  return function(state, dispatch, view) {
    var sel = state.selection;
    var $start = dir > 0 ? sel.$to : sel.$from, mustMove = sel.empty;
    if (sel instanceof TextSelection) {
      if (!view.endOfTextblock(dirStr) || $start.depth == 0) {
        return false;
      }
      mustMove = false;
      $start = state.doc.resolve(dir > 0 ? $start.after() : $start.before());
    }
    var $found = GapCursor.findFrom($start, dir, mustMove);
    if (!$found) {
      return false;
    }
    if (dispatch) {
      dispatch(state.tr.setSelection(new GapCursor($found)));
    }
    return true;
  };
}
function handleClick(view, pos, event) {
  if (!view.editable) {
    return false;
  }
  var $pos = view.state.doc.resolve(pos);
  if (!GapCursor.valid($pos)) {
    return false;
  }
  var ref = view.posAtCoords({ left: event.clientX, top: event.clientY });
  var inside = ref.inside;
  if (inside > -1 && NodeSelection.isSelectable(view.state.doc.nodeAt(inside))) {
    return false;
  }
  view.dispatch(view.state.tr.setSelection(new GapCursor($pos)));
  return true;
}
function beforeinput(view, event) {
  if (event.inputType != "insertCompositionText" || !(view.state.selection instanceof GapCursor)) {
    return false;
  }
  var ref = view.state.selection;
  var $from = ref.$from;
  var insert = $from.parent.contentMatchAt($from.index()).findWrapping(view.state.schema.nodes.text);
  if (!insert) {
    return false;
  }
  var frag = Fragment.empty;
  for (var i = insert.length - 1; i >= 0; i--) {
    frag = Fragment.from(insert[i].createAndFill(null, frag));
  }
  var tr = view.state.tr.replace($from.pos, $from.pos, new Slice(frag, 0, 0));
  tr.setSelection(TextSelection.near(tr.doc.resolve($from.pos + 1)));
  view.dispatch(tr);
  return false;
}
function drawGapCursor(state) {
  if (!(state.selection instanceof GapCursor)) {
    return null;
  }
  var node = document.createElement("div");
  node.className = "ProseMirror-gapcursor";
  return DecorationSet.create(state.doc, [Decoration.widget(state.selection.head, node, { key: "gapcursor" })]);
}
export {
  gapCursor
};
