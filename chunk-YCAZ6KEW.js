import {
  AllSelection,
  NodeSelection,
  Selection,
  TextSelection
} from "./chunk-UIQZLVQX.js";
import {
  ReplaceAroundStep,
  canJoin,
  canSplit,
  findWrapping,
  joinPoint,
  liftTarget,
  replaceStep
} from "./chunk-HSTGJMAL.js";
import {
  Fragment,
  Slice
} from "./chunk-O5MLGE4X.js";

// node_modules/prosemirror-commands/dist/index.es.js
function deleteSelection(state, dispatch) {
  if (state.selection.empty) {
    return false;
  }
  if (dispatch) {
    dispatch(state.tr.deleteSelection().scrollIntoView());
  }
  return true;
}
function joinBackward(state, dispatch, view) {
  var ref = state.selection;
  var $cursor = ref.$cursor;
  if (!$cursor || (view ? !view.endOfTextblock("backward", state) : $cursor.parentOffset > 0)) {
    return false;
  }
  var $cut = findCutBefore($cursor);
  if (!$cut) {
    var range = $cursor.blockRange(), target = range && liftTarget(range);
    if (target == null) {
      return false;
    }
    if (dispatch) {
      dispatch(state.tr.lift(range, target).scrollIntoView());
    }
    return true;
  }
  var before = $cut.nodeBefore;
  if (!before.type.spec.isolating && deleteBarrier(state, $cut, dispatch)) {
    return true;
  }
  if ($cursor.parent.content.size == 0 && (textblockAt(before, "end") || NodeSelection.isSelectable(before))) {
    var delStep = replaceStep(state.doc, $cursor.before(), $cursor.after(), Slice.empty);
    if (delStep.slice.size < delStep.to - delStep.from) {
      if (dispatch) {
        var tr = state.tr.step(delStep);
        tr.setSelection(textblockAt(before, "end") ? Selection.findFrom(tr.doc.resolve(tr.mapping.map($cut.pos, -1)), -1) : NodeSelection.create(tr.doc, $cut.pos - before.nodeSize));
        dispatch(tr.scrollIntoView());
      }
      return true;
    }
  }
  if (before.isAtom && $cut.depth == $cursor.depth - 1) {
    if (dispatch) {
      dispatch(state.tr.delete($cut.pos - before.nodeSize, $cut.pos).scrollIntoView());
    }
    return true;
  }
  return false;
}
function textblockAt(node, side, only) {
  for (; node; node = side == "start" ? node.firstChild : node.lastChild) {
    if (node.isTextblock) {
      return true;
    }
    if (only && node.childCount != 1) {
      return false;
    }
  }
  return false;
}
function selectNodeBackward(state, dispatch, view) {
  var ref = state.selection;
  var $head = ref.$head;
  var empty = ref.empty;
  var $cut = $head;
  if (!empty) {
    return false;
  }
  if ($head.parent.isTextblock) {
    if (view ? !view.endOfTextblock("backward", state) : $head.parentOffset > 0) {
      return false;
    }
    $cut = findCutBefore($head);
  }
  var node = $cut && $cut.nodeBefore;
  if (!node || !NodeSelection.isSelectable(node)) {
    return false;
  }
  if (dispatch) {
    dispatch(state.tr.setSelection(NodeSelection.create(state.doc, $cut.pos - node.nodeSize)).scrollIntoView());
  }
  return true;
}
function findCutBefore($pos) {
  if (!$pos.parent.type.spec.isolating) {
    for (var i = $pos.depth - 1; i >= 0; i--) {
      if ($pos.index(i) > 0) {
        return $pos.doc.resolve($pos.before(i + 1));
      }
      if ($pos.node(i).type.spec.isolating) {
        break;
      }
    }
  }
  return null;
}
function joinForward(state, dispatch, view) {
  var ref = state.selection;
  var $cursor = ref.$cursor;
  if (!$cursor || (view ? !view.endOfTextblock("forward", state) : $cursor.parentOffset < $cursor.parent.content.size)) {
    return false;
  }
  var $cut = findCutAfter($cursor);
  if (!$cut) {
    return false;
  }
  var after = $cut.nodeAfter;
  if (deleteBarrier(state, $cut, dispatch)) {
    return true;
  }
  if ($cursor.parent.content.size == 0 && (textblockAt(after, "start") || NodeSelection.isSelectable(after))) {
    var delStep = replaceStep(state.doc, $cursor.before(), $cursor.after(), Slice.empty);
    if (delStep.slice.size < delStep.to - delStep.from) {
      if (dispatch) {
        var tr = state.tr.step(delStep);
        tr.setSelection(textblockAt(after, "start") ? Selection.findFrom(tr.doc.resolve(tr.mapping.map($cut.pos)), 1) : NodeSelection.create(tr.doc, tr.mapping.map($cut.pos)));
        dispatch(tr.scrollIntoView());
      }
      return true;
    }
  }
  if (after.isAtom && $cut.depth == $cursor.depth - 1) {
    if (dispatch) {
      dispatch(state.tr.delete($cut.pos, $cut.pos + after.nodeSize).scrollIntoView());
    }
    return true;
  }
  return false;
}
function selectNodeForward(state, dispatch, view) {
  var ref = state.selection;
  var $head = ref.$head;
  var empty = ref.empty;
  var $cut = $head;
  if (!empty) {
    return false;
  }
  if ($head.parent.isTextblock) {
    if (view ? !view.endOfTextblock("forward", state) : $head.parentOffset < $head.parent.content.size) {
      return false;
    }
    $cut = findCutAfter($head);
  }
  var node = $cut && $cut.nodeAfter;
  if (!node || !NodeSelection.isSelectable(node)) {
    return false;
  }
  if (dispatch) {
    dispatch(state.tr.setSelection(NodeSelection.create(state.doc, $cut.pos)).scrollIntoView());
  }
  return true;
}
function findCutAfter($pos) {
  if (!$pos.parent.type.spec.isolating) {
    for (var i = $pos.depth - 1; i >= 0; i--) {
      var parent = $pos.node(i);
      if ($pos.index(i) + 1 < parent.childCount) {
        return $pos.doc.resolve($pos.after(i + 1));
      }
      if (parent.type.spec.isolating) {
        break;
      }
    }
  }
  return null;
}
function joinUp(state, dispatch) {
  var sel = state.selection, nodeSel = sel instanceof NodeSelection, point;
  if (nodeSel) {
    if (sel.node.isTextblock || !canJoin(state.doc, sel.from)) {
      return false;
    }
    point = sel.from;
  } else {
    point = joinPoint(state.doc, sel.from, -1);
    if (point == null) {
      return false;
    }
  }
  if (dispatch) {
    var tr = state.tr.join(point);
    if (nodeSel) {
      tr.setSelection(NodeSelection.create(tr.doc, point - state.doc.resolve(point).nodeBefore.nodeSize));
    }
    dispatch(tr.scrollIntoView());
  }
  return true;
}
function joinDown(state, dispatch) {
  var sel = state.selection, point;
  if (sel instanceof NodeSelection) {
    if (sel.node.isTextblock || !canJoin(state.doc, sel.to)) {
      return false;
    }
    point = sel.to;
  } else {
    point = joinPoint(state.doc, sel.to, 1);
    if (point == null) {
      return false;
    }
  }
  if (dispatch) {
    dispatch(state.tr.join(point).scrollIntoView());
  }
  return true;
}
function lift(state, dispatch) {
  var ref = state.selection;
  var $from = ref.$from;
  var $to = ref.$to;
  var range = $from.blockRange($to), target = range && liftTarget(range);
  if (target == null) {
    return false;
  }
  if (dispatch) {
    dispatch(state.tr.lift(range, target).scrollIntoView());
  }
  return true;
}
function newlineInCode(state, dispatch) {
  var ref = state.selection;
  var $head = ref.$head;
  var $anchor = ref.$anchor;
  if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) {
    return false;
  }
  if (dispatch) {
    dispatch(state.tr.insertText("\n").scrollIntoView());
  }
  return true;
}
function defaultBlockAt(match) {
  for (var i = 0; i < match.edgeCount; i++) {
    var ref = match.edge(i);
    var type = ref.type;
    if (type.isTextblock && !type.hasRequiredAttrs()) {
      return type;
    }
  }
  return null;
}
function exitCode(state, dispatch) {
  var ref = state.selection;
  var $head = ref.$head;
  var $anchor = ref.$anchor;
  if (!$head.parent.type.spec.code || !$head.sameParent($anchor)) {
    return false;
  }
  var above = $head.node(-1), after = $head.indexAfter(-1), type = defaultBlockAt(above.contentMatchAt(after));
  if (!above.canReplaceWith(after, after, type)) {
    return false;
  }
  if (dispatch) {
    var pos = $head.after(), tr = state.tr.replaceWith(pos, pos, type.createAndFill());
    tr.setSelection(Selection.near(tr.doc.resolve(pos), 1));
    dispatch(tr.scrollIntoView());
  }
  return true;
}
function createParagraphNear(state, dispatch) {
  var sel = state.selection;
  var $from = sel.$from;
  var $to = sel.$to;
  if (sel instanceof AllSelection || $from.parent.inlineContent || $to.parent.inlineContent) {
    return false;
  }
  var type = defaultBlockAt($to.parent.contentMatchAt($to.indexAfter()));
  if (!type || !type.isTextblock) {
    return false;
  }
  if (dispatch) {
    var side = (!$from.parentOffset && $to.index() < $to.parent.childCount ? $from : $to).pos;
    var tr = state.tr.insert(side, type.createAndFill());
    tr.setSelection(TextSelection.create(tr.doc, side + 1));
    dispatch(tr.scrollIntoView());
  }
  return true;
}
function liftEmptyBlock(state, dispatch) {
  var ref = state.selection;
  var $cursor = ref.$cursor;
  if (!$cursor || $cursor.parent.content.size) {
    return false;
  }
  if ($cursor.depth > 1 && $cursor.after() != $cursor.end(-1)) {
    var before = $cursor.before();
    if (canSplit(state.doc, before)) {
      if (dispatch) {
        dispatch(state.tr.split(before).scrollIntoView());
      }
      return true;
    }
  }
  var range = $cursor.blockRange(), target = range && liftTarget(range);
  if (target == null) {
    return false;
  }
  if (dispatch) {
    dispatch(state.tr.lift(range, target).scrollIntoView());
  }
  return true;
}
function splitBlock(state, dispatch) {
  var ref = state.selection;
  var $from = ref.$from;
  var $to = ref.$to;
  if (state.selection instanceof NodeSelection && state.selection.node.isBlock) {
    if (!$from.parentOffset || !canSplit(state.doc, $from.pos)) {
      return false;
    }
    if (dispatch) {
      dispatch(state.tr.split($from.pos).scrollIntoView());
    }
    return true;
  }
  if (!$from.parent.isBlock) {
    return false;
  }
  if (dispatch) {
    var atEnd = $to.parentOffset == $to.parent.content.size;
    var tr = state.tr;
    if (state.selection instanceof TextSelection || state.selection instanceof AllSelection) {
      tr.deleteSelection();
    }
    var deflt = $from.depth == 0 ? null : defaultBlockAt($from.node(-1).contentMatchAt($from.indexAfter(-1)));
    var types = atEnd && deflt ? [{ type: deflt }] : null;
    var can = canSplit(tr.doc, tr.mapping.map($from.pos), 1, types);
    if (!types && !can && canSplit(tr.doc, tr.mapping.map($from.pos), 1, deflt && [{ type: deflt }])) {
      types = [{ type: deflt }];
      can = true;
    }
    if (can) {
      tr.split(tr.mapping.map($from.pos), 1, types);
      if (!atEnd && !$from.parentOffset && $from.parent.type != deflt) {
        var first = tr.mapping.map($from.before()), $first = tr.doc.resolve(first);
        if ($from.node(-1).canReplaceWith($first.index(), $first.index() + 1, deflt)) {
          tr.setNodeMarkup(tr.mapping.map($from.before()), deflt);
        }
      }
    }
    dispatch(tr.scrollIntoView());
  }
  return true;
}
function splitBlockKeepMarks(state, dispatch) {
  return splitBlock(state, dispatch && function(tr) {
    var marks = state.storedMarks || state.selection.$to.parentOffset && state.selection.$from.marks();
    if (marks) {
      tr.ensureMarks(marks);
    }
    dispatch(tr);
  });
}
function selectParentNode(state, dispatch) {
  var ref = state.selection;
  var $from = ref.$from;
  var to = ref.to;
  var pos;
  var same = $from.sharedDepth(to);
  if (same == 0) {
    return false;
  }
  pos = $from.before(same);
  if (dispatch) {
    dispatch(state.tr.setSelection(NodeSelection.create(state.doc, pos)));
  }
  return true;
}
function selectAll(state, dispatch) {
  if (dispatch) {
    dispatch(state.tr.setSelection(new AllSelection(state.doc)));
  }
  return true;
}
function joinMaybeClear(state, $pos, dispatch) {
  var before = $pos.nodeBefore, after = $pos.nodeAfter, index = $pos.index();
  if (!before || !after || !before.type.compatibleContent(after.type)) {
    return false;
  }
  if (!before.content.size && $pos.parent.canReplace(index - 1, index)) {
    if (dispatch) {
      dispatch(state.tr.delete($pos.pos - before.nodeSize, $pos.pos).scrollIntoView());
    }
    return true;
  }
  if (!$pos.parent.canReplace(index, index + 1) || !(after.isTextblock || canJoin(state.doc, $pos.pos))) {
    return false;
  }
  if (dispatch) {
    dispatch(state.tr.clearIncompatible($pos.pos, before.type, before.contentMatchAt(before.childCount)).join($pos.pos).scrollIntoView());
  }
  return true;
}
function deleteBarrier(state, $cut, dispatch) {
  var before = $cut.nodeBefore, after = $cut.nodeAfter, conn, match;
  if (before.type.spec.isolating || after.type.spec.isolating) {
    return false;
  }
  if (joinMaybeClear(state, $cut, dispatch)) {
    return true;
  }
  var canDelAfter = $cut.parent.canReplace($cut.index(), $cut.index() + 1);
  if (canDelAfter && (conn = (match = before.contentMatchAt(before.childCount)).findWrapping(after.type)) && match.matchType(conn[0] || after.type).validEnd) {
    if (dispatch) {
      var end = $cut.pos + after.nodeSize, wrap = Fragment.empty;
      for (var i = conn.length - 1; i >= 0; i--) {
        wrap = Fragment.from(conn[i].create(null, wrap));
      }
      wrap = Fragment.from(before.copy(wrap));
      var tr = state.tr.step(new ReplaceAroundStep($cut.pos - 1, end, $cut.pos, end, new Slice(wrap, 1, 0), conn.length, true));
      var joinAt = end + 2 * conn.length;
      if (canJoin(tr.doc, joinAt)) {
        tr.join(joinAt);
      }
      dispatch(tr.scrollIntoView());
    }
    return true;
  }
  var selAfter = Selection.findFrom($cut, 1);
  var range = selAfter && selAfter.$from.blockRange(selAfter.$to), target = range && liftTarget(range);
  if (target != null && target >= $cut.depth) {
    if (dispatch) {
      dispatch(state.tr.lift(range, target).scrollIntoView());
    }
    return true;
  }
  if (canDelAfter && textblockAt(after, "start", true) && textblockAt(before, "end")) {
    var at = before, wrap$1 = [];
    for (; ; ) {
      wrap$1.push(at);
      if (at.isTextblock) {
        break;
      }
      at = at.lastChild;
    }
    var afterText = after, afterDepth = 1;
    for (; !afterText.isTextblock; afterText = afterText.firstChild) {
      afterDepth++;
    }
    if (at.canReplace(at.childCount, at.childCount, afterText.content)) {
      if (dispatch) {
        var end$1 = Fragment.empty;
        for (var i$1 = wrap$1.length - 1; i$1 >= 0; i$1--) {
          end$1 = Fragment.from(wrap$1[i$1].copy(end$1));
        }
        var tr$1 = state.tr.step(new ReplaceAroundStep($cut.pos - wrap$1.length, $cut.pos + after.nodeSize, $cut.pos + afterDepth, $cut.pos + after.nodeSize - afterDepth, new Slice(end$1, wrap$1.length, 0), 0, true));
        dispatch(tr$1.scrollIntoView());
      }
      return true;
    }
  }
  return false;
}
function selectTextblockSide(side) {
  return function(state, dispatch) {
    var sel = state.selection, $pos = side < 0 ? sel.$from : sel.$to;
    var depth = $pos.depth;
    while ($pos.node(depth).isInline) {
      if (!depth) {
        return false;
      }
      depth--;
    }
    if (!$pos.node(depth).isTextblock) {
      return false;
    }
    if (dispatch) {
      dispatch(state.tr.setSelection(TextSelection.create(state.doc, side < 0 ? $pos.start(depth) : $pos.end(depth))));
    }
    return true;
  };
}
var selectTextblockStart = selectTextblockSide(-1);
var selectTextblockEnd = selectTextblockSide(1);
function wrapIn(nodeType, attrs) {
  return function(state, dispatch) {
    var ref = state.selection;
    var $from = ref.$from;
    var $to = ref.$to;
    var range = $from.blockRange($to), wrapping = range && findWrapping(range, nodeType, attrs);
    if (!wrapping) {
      return false;
    }
    if (dispatch) {
      dispatch(state.tr.wrap(range, wrapping).scrollIntoView());
    }
    return true;
  };
}
function setBlockType(nodeType, attrs) {
  return function(state, dispatch) {
    var ref = state.selection;
    var from = ref.from;
    var to = ref.to;
    var applicable = false;
    state.doc.nodesBetween(from, to, function(node, pos) {
      if (applicable) {
        return false;
      }
      if (!node.isTextblock || node.hasMarkup(nodeType, attrs)) {
        return;
      }
      if (node.type == nodeType) {
        applicable = true;
      } else {
        var $pos = state.doc.resolve(pos), index = $pos.index();
        applicable = $pos.parent.canReplaceWith(index, index + 1, nodeType);
      }
    });
    if (!applicable) {
      return false;
    }
    if (dispatch) {
      dispatch(state.tr.setBlockType(from, to, nodeType, attrs).scrollIntoView());
    }
    return true;
  };
}
function markApplies(doc, ranges, type) {
  var loop = function(i2) {
    var ref = ranges[i2];
    var $from = ref.$from;
    var $to = ref.$to;
    var can = $from.depth == 0 ? doc.type.allowsMarkType(type) : false;
    doc.nodesBetween($from.pos, $to.pos, function(node) {
      if (can) {
        return false;
      }
      can = node.inlineContent && node.type.allowsMarkType(type);
    });
    if (can) {
      return { v: true };
    }
  };
  for (var i = 0; i < ranges.length; i++) {
    var returned = loop(i);
    if (returned)
      return returned.v;
  }
  return false;
}
function toggleMark(markType, attrs) {
  return function(state, dispatch) {
    var ref = state.selection;
    var empty = ref.empty;
    var $cursor = ref.$cursor;
    var ranges = ref.ranges;
    if (empty && !$cursor || !markApplies(state.doc, ranges, markType)) {
      return false;
    }
    if (dispatch) {
      if ($cursor) {
        if (markType.isInSet(state.storedMarks || $cursor.marks())) {
          dispatch(state.tr.removeStoredMark(markType));
        } else {
          dispatch(state.tr.addStoredMark(markType.create(attrs)));
        }
      } else {
        var has = false, tr = state.tr;
        for (var i = 0; !has && i < ranges.length; i++) {
          var ref$1 = ranges[i];
          var $from = ref$1.$from;
          var $to = ref$1.$to;
          has = state.doc.rangeHasMark($from.pos, $to.pos, markType);
        }
        for (var i$1 = 0; i$1 < ranges.length; i$1++) {
          var ref$2 = ranges[i$1];
          var $from$1 = ref$2.$from;
          var $to$1 = ref$2.$to;
          if (has) {
            tr.removeMark($from$1.pos, $to$1.pos, markType);
          } else {
            var from = $from$1.pos, to = $to$1.pos, start = $from$1.nodeAfter, end = $to$1.nodeBefore;
            var spaceStart = start && start.isText ? /^\s*/.exec(start.text)[0].length : 0;
            var spaceEnd = end && end.isText ? /\s*$/.exec(end.text)[0].length : 0;
            if (from + spaceStart < to) {
              from += spaceStart;
              to -= spaceEnd;
            }
            tr.addMark(from, to, markType.create(attrs));
          }
        }
        dispatch(tr.scrollIntoView());
      }
    }
    return true;
  };
}
function wrapDispatchForJoin(dispatch, isJoinable) {
  return function(tr) {
    if (!tr.isGeneric) {
      return dispatch(tr);
    }
    var ranges = [];
    for (var i = 0; i < tr.mapping.maps.length; i++) {
      var map = tr.mapping.maps[i];
      for (var j = 0; j < ranges.length; j++) {
        ranges[j] = map.map(ranges[j]);
      }
      map.forEach(function(_s, _e, from2, to2) {
        return ranges.push(from2, to2);
      });
    }
    var joinable = [];
    for (var i$1 = 0; i$1 < ranges.length; i$1 += 2) {
      var from = ranges[i$1], to = ranges[i$1 + 1];
      var $from = tr.doc.resolve(from), depth = $from.sharedDepth(to), parent = $from.node(depth);
      for (var index = $from.indexAfter(depth), pos = $from.after(depth + 1); pos <= to; ++index) {
        var after = parent.maybeChild(index);
        if (!after) {
          break;
        }
        if (index && joinable.indexOf(pos) == -1) {
          var before = parent.child(index - 1);
          if (before.type == after.type && isJoinable(before, after)) {
            joinable.push(pos);
          }
        }
        pos += after.nodeSize;
      }
    }
    joinable.sort(function(a, b) {
      return a - b;
    });
    for (var i$2 = joinable.length - 1; i$2 >= 0; i$2--) {
      if (canJoin(tr.doc, joinable[i$2])) {
        tr.join(joinable[i$2]);
      }
    }
    dispatch(tr);
  };
}
function autoJoin(command, isJoinable) {
  if (Array.isArray(isJoinable)) {
    var types = isJoinable;
    isJoinable = function(node) {
      return types.indexOf(node.type.name) > -1;
    };
  }
  return function(state, dispatch, view) {
    return command(state, dispatch && wrapDispatchForJoin(dispatch, isJoinable), view);
  };
}
function chainCommands() {
  var commands = [], len = arguments.length;
  while (len--)
    commands[len] = arguments[len];
  return function(state, dispatch, view) {
    for (var i = 0; i < commands.length; i++) {
      if (commands[i](state, dispatch, view)) {
        return true;
      }
    }
    return false;
  };
}
var backspace = chainCommands(deleteSelection, joinBackward, selectNodeBackward);
var del = chainCommands(deleteSelection, joinForward, selectNodeForward);
var pcBaseKeymap = {
  "Enter": chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock),
  "Mod-Enter": exitCode,
  "Backspace": backspace,
  "Mod-Backspace": backspace,
  "Shift-Backspace": backspace,
  "Delete": del,
  "Mod-Delete": del,
  "Mod-a": selectAll
};
var macBaseKeymap = {
  "Ctrl-h": pcBaseKeymap["Backspace"],
  "Alt-Backspace": pcBaseKeymap["Mod-Backspace"],
  "Ctrl-d": pcBaseKeymap["Delete"],
  "Ctrl-Alt-Backspace": pcBaseKeymap["Mod-Delete"],
  "Alt-Delete": pcBaseKeymap["Mod-Delete"],
  "Alt-d": pcBaseKeymap["Mod-Delete"],
  "Ctrl-a": selectTextblockStart,
  "Ctrl-e": selectTextblockEnd
};
for (key in pcBaseKeymap) {
  macBaseKeymap[key] = pcBaseKeymap[key];
}
var key;
var mac = typeof navigator != "undefined" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os != "undefined" ? os.platform() == "darwin" : false;
var baseKeymap = mac ? macBaseKeymap : pcBaseKeymap;

export {
  deleteSelection,
  joinBackward,
  selectNodeBackward,
  joinForward,
  selectNodeForward,
  joinUp,
  joinDown,
  lift,
  newlineInCode,
  exitCode,
  createParagraphNear,
  liftEmptyBlock,
  splitBlock,
  splitBlockKeepMarks,
  selectParentNode,
  selectAll,
  selectTextblockStart,
  selectTextblockEnd,
  wrapIn,
  setBlockType,
  toggleMark,
  autoJoin,
  chainCommands,
  pcBaseKeymap,
  macBaseKeymap,
  baseKeymap
};
