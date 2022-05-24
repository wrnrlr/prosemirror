import {
  ReplaceAroundStep,
  canSplit,
  findWrapping,
  liftTarget
} from "./chunk-HSTGJMAL.js";
import {
  Fragment,
  NodeRange,
  Slice
} from "./chunk-O5MLGE4X.js";

// node_modules/prosemirror-schema-list/dist/index.es.js
var olDOM = ["ol", 0];
var ulDOM = ["ul", 0];
var liDOM = ["li", 0];
var orderedList = {
  attrs: { order: { default: 1 } },
  parseDOM: [{ tag: "ol", getAttrs: function getAttrs(dom) {
    return { order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1 };
  } }],
  toDOM: function toDOM(node) {
    return node.attrs.order == 1 ? olDOM : ["ol", { start: node.attrs.order }, 0];
  }
};
var bulletList = {
  parseDOM: [{ tag: "ul" }],
  toDOM: function toDOM2() {
    return ulDOM;
  }
};
var listItem = {
  parseDOM: [{ tag: "li" }],
  toDOM: function toDOM3() {
    return liDOM;
  },
  defining: true
};
function add(obj, props) {
  var copy = {};
  for (var prop in obj) {
    copy[prop] = obj[prop];
  }
  for (var prop$1 in props) {
    copy[prop$1] = props[prop$1];
  }
  return copy;
}
function addListNodes(nodes2, itemContent, listGroup) {
  return nodes2.append({
    ordered_list: add(orderedList, { content: "list_item+", group: listGroup }),
    bullet_list: add(bulletList, { content: "list_item+", group: listGroup }),
    list_item: add(listItem, { content: itemContent })
  });
}
function wrapInList(listType, attrs) {
  return function(state, dispatch) {
    var ref = state.selection;
    var $from = ref.$from;
    var $to = ref.$to;
    var range = $from.blockRange($to), doJoin = false, outerRange = range;
    if (!range) {
      return false;
    }
    if (range.depth >= 2 && $from.node(range.depth - 1).type.compatibleContent(listType) && range.startIndex == 0) {
      if ($from.index(range.depth - 1) == 0) {
        return false;
      }
      var $insert = state.doc.resolve(range.start - 2);
      outerRange = new NodeRange($insert, $insert, range.depth);
      if (range.endIndex < range.parent.childCount) {
        range = new NodeRange($from, state.doc.resolve($to.end(range.depth)), range.depth);
      }
      doJoin = true;
    }
    var wrap = findWrapping(outerRange, listType, attrs, range);
    if (!wrap) {
      return false;
    }
    if (dispatch) {
      dispatch(doWrapInList(state.tr, range, wrap, doJoin, listType).scrollIntoView());
    }
    return true;
  };
}
function doWrapInList(tr, range, wrappers, joinBefore, listType) {
  var content = Fragment.empty;
  for (var i = wrappers.length - 1; i >= 0; i--) {
    content = Fragment.from(wrappers[i].type.create(wrappers[i].attrs, content));
  }
  tr.step(new ReplaceAroundStep(range.start - (joinBefore ? 2 : 0), range.end, range.start, range.end, new Slice(content, 0, 0), wrappers.length, true));
  var found = 0;
  for (var i$1 = 0; i$1 < wrappers.length; i$1++) {
    if (wrappers[i$1].type == listType) {
      found = i$1 + 1;
    }
  }
  var splitDepth = wrappers.length - found;
  var splitPos = range.start + wrappers.length - (joinBefore ? 2 : 0), parent = range.parent;
  for (var i$2 = range.startIndex, e = range.endIndex, first = true; i$2 < e; i$2++, first = false) {
    if (!first && canSplit(tr.doc, splitPos, splitDepth)) {
      tr.split(splitPos, splitDepth);
      splitPos += 2 * splitDepth;
    }
    splitPos += parent.child(i$2).nodeSize;
  }
  return tr;
}
function splitListItem(itemType) {
  return function(state, dispatch) {
    var ref = state.selection;
    var $from = ref.$from;
    var $to = ref.$to;
    var node = ref.node;
    if (node && node.isBlock || $from.depth < 2 || !$from.sameParent($to)) {
      return false;
    }
    var grandParent = $from.node(-1);
    if (grandParent.type != itemType) {
      return false;
    }
    if ($from.parent.content.size == 0 && $from.node(-1).childCount == $from.indexAfter(-1)) {
      if ($from.depth == 2 || $from.node(-3).type != itemType || $from.index(-2) != $from.node(-2).childCount - 1) {
        return false;
      }
      if (dispatch) {
        var wrap = Fragment.empty;
        var depthBefore = $from.index(-1) ? 1 : $from.index(-2) ? 2 : 3;
        for (var d = $from.depth - depthBefore; d >= $from.depth - 3; d--) {
          wrap = Fragment.from($from.node(d).copy(wrap));
        }
        var depthAfter = $from.indexAfter(-1) < $from.node(-2).childCount ? 1 : $from.indexAfter(-2) < $from.node(-3).childCount ? 2 : 3;
        wrap = wrap.append(Fragment.from(itemType.createAndFill()));
        var start = $from.before($from.depth - (depthBefore - 1));
        var tr$1 = state.tr.replace(start, $from.after(-depthAfter), new Slice(wrap, 4 - depthBefore, 0));
        var sel = -1;
        tr$1.doc.nodesBetween(start, tr$1.doc.content.size, function(node2, pos) {
          if (sel > -1) {
            return false;
          }
          if (node2.isTextblock && node2.content.size == 0) {
            sel = pos + 1;
          }
        });
        if (sel > -1) {
          tr$1.setSelection(state.selection.constructor.near(tr$1.doc.resolve(sel)));
        }
        dispatch(tr$1.scrollIntoView());
      }
      return true;
    }
    var nextType = $to.pos == $from.end() ? grandParent.contentMatchAt(0).defaultType : null;
    var tr = state.tr.delete($from.pos, $to.pos);
    var types = nextType && [null, { type: nextType }];
    if (!canSplit(tr.doc, $from.pos, 2, types)) {
      return false;
    }
    if (dispatch) {
      dispatch(tr.split($from.pos, 2, types).scrollIntoView());
    }
    return true;
  };
}
function liftListItem(itemType) {
  return function(state, dispatch) {
    var ref = state.selection;
    var $from = ref.$from;
    var $to = ref.$to;
    var range = $from.blockRange($to, function(node) {
      return node.childCount && node.firstChild.type == itemType;
    });
    if (!range) {
      return false;
    }
    if (!dispatch) {
      return true;
    }
    if ($from.node(range.depth - 1).type == itemType) {
      return liftToOuterList(state, dispatch, itemType, range);
    } else {
      return liftOutOfList(state, dispatch, range);
    }
  };
}
function liftToOuterList(state, dispatch, itemType, range) {
  var tr = state.tr, end = range.end, endOfList = range.$to.end(range.depth);
  if (end < endOfList) {
    tr.step(new ReplaceAroundStep(end - 1, endOfList, end, endOfList, new Slice(Fragment.from(itemType.create(null, range.parent.copy())), 1, 0), 1, true));
    range = new NodeRange(tr.doc.resolve(range.$from.pos), tr.doc.resolve(endOfList), range.depth);
  }
  dispatch(tr.lift(range, liftTarget(range)).scrollIntoView());
  return true;
}
function liftOutOfList(state, dispatch, range) {
  var tr = state.tr, list = range.parent;
  for (var pos = range.end, i = range.endIndex - 1, e = range.startIndex; i > e; i--) {
    pos -= list.child(i).nodeSize;
    tr.delete(pos - 1, pos + 1);
  }
  var $start = tr.doc.resolve(range.start), item = $start.nodeAfter;
  if (tr.mapping.map(range.end) != range.start + $start.nodeAfter.nodeSize) {
    return false;
  }
  var atStart = range.startIndex == 0, atEnd = range.endIndex == list.childCount;
  var parent = $start.node(-1), indexBefore = $start.index(-1);
  if (!parent.canReplace(indexBefore + (atStart ? 0 : 1), indexBefore + 1, item.content.append(atEnd ? Fragment.empty : Fragment.from(list)))) {
    return false;
  }
  var start = $start.pos, end = start + item.nodeSize;
  tr.step(new ReplaceAroundStep(start - (atStart ? 1 : 0), end + (atEnd ? 1 : 0), start + 1, end - 1, new Slice((atStart ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))).append(atEnd ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))), atStart ? 0 : 1, atEnd ? 0 : 1), atStart ? 0 : 1));
  dispatch(tr.scrollIntoView());
  return true;
}
function sinkListItem(itemType) {
  return function(state, dispatch) {
    var ref = state.selection;
    var $from = ref.$from;
    var $to = ref.$to;
    var range = $from.blockRange($to, function(node) {
      return node.childCount && node.firstChild.type == itemType;
    });
    if (!range) {
      return false;
    }
    var startIndex = range.startIndex;
    if (startIndex == 0) {
      return false;
    }
    var parent = range.parent, nodeBefore = parent.child(startIndex - 1);
    if (nodeBefore.type != itemType) {
      return false;
    }
    if (dispatch) {
      var nestedBefore = nodeBefore.lastChild && nodeBefore.lastChild.type == parent.type;
      var inner = Fragment.from(nestedBefore ? itemType.create() : null);
      var slice = new Slice(Fragment.from(itemType.create(null, Fragment.from(parent.type.create(null, inner)))), nestedBefore ? 3 : 1, 0);
      var before = range.start, after = range.end;
      dispatch(state.tr.step(new ReplaceAroundStep(before - (nestedBefore ? 3 : 1), after, before, after, slice, 1, true)).scrollIntoView());
    }
    return true;
  };
}
export {
  addListNodes,
  bulletList,
  liftListItem,
  listItem,
  orderedList,
  sinkListItem,
  splitListItem,
  wrapInList
};
