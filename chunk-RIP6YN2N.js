import {
  Plugin,
  PluginKey
} from "./chunk-UIQZLVQX.js";
import {
  Mapping
} from "./chunk-HSTGJMAL.js";

// node_modules/rope-sequence/dist/index.es.js
var GOOD_LEAF_SIZE = 200;
var RopeSequence = function RopeSequence2() {
};
RopeSequence.prototype.append = function append(other) {
  if (!other.length) {
    return this;
  }
  other = RopeSequence.from(other);
  return !this.length && other || other.length < GOOD_LEAF_SIZE && this.leafAppend(other) || this.length < GOOD_LEAF_SIZE && other.leafPrepend(this) || this.appendInner(other);
};
RopeSequence.prototype.prepend = function prepend(other) {
  if (!other.length) {
    return this;
  }
  return RopeSequence.from(other).append(this);
};
RopeSequence.prototype.appendInner = function appendInner(other) {
  return new Append(this, other);
};
RopeSequence.prototype.slice = function slice(from2, to) {
  if (from2 === void 0)
    from2 = 0;
  if (to === void 0)
    to = this.length;
  if (from2 >= to) {
    return RopeSequence.empty;
  }
  return this.sliceInner(Math.max(0, from2), Math.min(this.length, to));
};
RopeSequence.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) {
    return void 0;
  }
  return this.getInner(i);
};
RopeSequence.prototype.forEach = function forEach(f, from2, to) {
  if (from2 === void 0)
    from2 = 0;
  if (to === void 0)
    to = this.length;
  if (from2 <= to) {
    this.forEachInner(f, from2, to, 0);
  } else {
    this.forEachInvertedInner(f, from2, to, 0);
  }
};
RopeSequence.prototype.map = function map(f, from2, to) {
  if (from2 === void 0)
    from2 = 0;
  if (to === void 0)
    to = this.length;
  var result = [];
  this.forEach(function(elt, i) {
    return result.push(f(elt, i));
  }, from2, to);
  return result;
};
RopeSequence.from = function from(values) {
  if (values instanceof RopeSequence) {
    return values;
  }
  return values && values.length ? new Leaf(values) : RopeSequence.empty;
};
var Leaf = /* @__PURE__ */ function(RopeSequence3) {
  function Leaf2(values) {
    RopeSequence3.call(this);
    this.values = values;
  }
  if (RopeSequence3)
    Leaf2.__proto__ = RopeSequence3;
  Leaf2.prototype = Object.create(RopeSequence3 && RopeSequence3.prototype);
  Leaf2.prototype.constructor = Leaf2;
  var prototypeAccessors = { length: { configurable: true }, depth: { configurable: true } };
  Leaf2.prototype.flatten = function flatten() {
    return this.values;
  };
  Leaf2.prototype.sliceInner = function sliceInner(from2, to) {
    if (from2 == 0 && to == this.length) {
      return this;
    }
    return new Leaf2(this.values.slice(from2, to));
  };
  Leaf2.prototype.getInner = function getInner(i) {
    return this.values[i];
  };
  Leaf2.prototype.forEachInner = function forEachInner(f, from2, to, start) {
    for (var i = from2; i < to; i++) {
      if (f(this.values[i], start + i) === false) {
        return false;
      }
    }
  };
  Leaf2.prototype.forEachInvertedInner = function forEachInvertedInner(f, from2, to, start) {
    for (var i = from2 - 1; i >= to; i--) {
      if (f(this.values[i], start + i) === false) {
        return false;
      }
    }
  };
  Leaf2.prototype.leafAppend = function leafAppend(other) {
    if (this.length + other.length <= GOOD_LEAF_SIZE) {
      return new Leaf2(this.values.concat(other.flatten()));
    }
  };
  Leaf2.prototype.leafPrepend = function leafPrepend(other) {
    if (this.length + other.length <= GOOD_LEAF_SIZE) {
      return new Leaf2(other.flatten().concat(this.values));
    }
  };
  prototypeAccessors.length.get = function() {
    return this.values.length;
  };
  prototypeAccessors.depth.get = function() {
    return 0;
  };
  Object.defineProperties(Leaf2.prototype, prototypeAccessors);
  return Leaf2;
}(RopeSequence);
RopeSequence.empty = new Leaf([]);
var Append = /* @__PURE__ */ function(RopeSequence3) {
  function Append2(left, right) {
    RopeSequence3.call(this);
    this.left = left;
    this.right = right;
    this.length = left.length + right.length;
    this.depth = Math.max(left.depth, right.depth) + 1;
  }
  if (RopeSequence3)
    Append2.__proto__ = RopeSequence3;
  Append2.prototype = Object.create(RopeSequence3 && RopeSequence3.prototype);
  Append2.prototype.constructor = Append2;
  Append2.prototype.flatten = function flatten() {
    return this.left.flatten().concat(this.right.flatten());
  };
  Append2.prototype.getInner = function getInner(i) {
    return i < this.left.length ? this.left.get(i) : this.right.get(i - this.left.length);
  };
  Append2.prototype.forEachInner = function forEachInner(f, from2, to, start) {
    var leftLen = this.left.length;
    if (from2 < leftLen && this.left.forEachInner(f, from2, Math.min(to, leftLen), start) === false) {
      return false;
    }
    if (to > leftLen && this.right.forEachInner(f, Math.max(from2 - leftLen, 0), Math.min(this.length, to) - leftLen, start + leftLen) === false) {
      return false;
    }
  };
  Append2.prototype.forEachInvertedInner = function forEachInvertedInner(f, from2, to, start) {
    var leftLen = this.left.length;
    if (from2 > leftLen && this.right.forEachInvertedInner(f, from2 - leftLen, Math.max(to, leftLen) - leftLen, start + leftLen) === false) {
      return false;
    }
    if (to < leftLen && this.left.forEachInvertedInner(f, Math.min(from2, leftLen), to, start) === false) {
      return false;
    }
  };
  Append2.prototype.sliceInner = function sliceInner(from2, to) {
    if (from2 == 0 && to == this.length) {
      return this;
    }
    var leftLen = this.left.length;
    if (to <= leftLen) {
      return this.left.slice(from2, to);
    }
    if (from2 >= leftLen) {
      return this.right.slice(from2 - leftLen, to - leftLen);
    }
    return this.left.slice(from2, leftLen).append(this.right.slice(0, to - leftLen));
  };
  Append2.prototype.leafAppend = function leafAppend(other) {
    var inner = this.right.leafAppend(other);
    if (inner) {
      return new Append2(this.left, inner);
    }
  };
  Append2.prototype.leafPrepend = function leafPrepend(other) {
    var inner = this.left.leafPrepend(other);
    if (inner) {
      return new Append2(inner, this.right);
    }
  };
  Append2.prototype.appendInner = function appendInner2(other) {
    if (this.left.depth >= Math.max(this.right.depth, other.depth) + 1) {
      return new Append2(this.left, new Append2(this.right, other));
    }
    return new Append2(this, other);
  };
  return Append2;
}(RopeSequence);
var ropeSequence = RopeSequence;
var index_es_default = ropeSequence;

// node_modules/prosemirror-history/dist/index.es.js
var max_empty_items = 500;
var Branch = function Branch2(items, eventCount) {
  this.items = items;
  this.eventCount = eventCount;
};
Branch.prototype.popEvent = function popEvent(state, preserveItems) {
  var this$1 = this;
  if (this.eventCount == 0) {
    return null;
  }
  var end = this.items.length;
  for (; ; end--) {
    var next = this.items.get(end - 1);
    if (next.selection) {
      --end;
      break;
    }
  }
  var remap, mapFrom;
  if (preserveItems) {
    remap = this.remapping(end, this.items.length);
    mapFrom = remap.maps.length;
  }
  var transform = state.tr;
  var selection, remaining;
  var addAfter = [], addBefore = [];
  this.items.forEach(function(item, i) {
    if (!item.step) {
      if (!remap) {
        remap = this$1.remapping(end, i + 1);
        mapFrom = remap.maps.length;
      }
      mapFrom--;
      addBefore.push(item);
      return;
    }
    if (remap) {
      addBefore.push(new Item(item.map));
      var step = item.step.map(remap.slice(mapFrom)), map2;
      if (step && transform.maybeStep(step).doc) {
        map2 = transform.mapping.maps[transform.mapping.maps.length - 1];
        addAfter.push(new Item(map2, null, null, addAfter.length + addBefore.length));
      }
      mapFrom--;
      if (map2) {
        remap.appendMap(map2, mapFrom);
      }
    } else {
      transform.maybeStep(item.step);
    }
    if (item.selection) {
      selection = remap ? item.selection.map(remap.slice(mapFrom)) : item.selection;
      remaining = new Branch(this$1.items.slice(0, end).append(addBefore.reverse().concat(addAfter)), this$1.eventCount - 1);
      return false;
    }
  }, this.items.length, 0);
  return { remaining, transform, selection };
};
Branch.prototype.addTransform = function addTransform(transform, selection, histOptions, preserveItems) {
  var newItems = [], eventCount = this.eventCount;
  var oldItems = this.items, lastItem = !preserveItems && oldItems.length ? oldItems.get(oldItems.length - 1) : null;
  for (var i = 0; i < transform.steps.length; i++) {
    var step = transform.steps[i].invert(transform.docs[i]);
    var item = new Item(transform.mapping.maps[i], step, selection), merged = void 0;
    if (merged = lastItem && lastItem.merge(item)) {
      item = merged;
      if (i) {
        newItems.pop();
      } else {
        oldItems = oldItems.slice(0, oldItems.length - 1);
      }
    }
    newItems.push(item);
    if (selection) {
      eventCount++;
      selection = null;
    }
    if (!preserveItems) {
      lastItem = item;
    }
  }
  var overflow = eventCount - histOptions.depth;
  if (overflow > DEPTH_OVERFLOW) {
    oldItems = cutOffEvents(oldItems, overflow);
    eventCount -= overflow;
  }
  return new Branch(oldItems.append(newItems), eventCount);
};
Branch.prototype.remapping = function remapping(from2, to) {
  var maps = new Mapping();
  this.items.forEach(function(item, i) {
    var mirrorPos = item.mirrorOffset != null && i - item.mirrorOffset >= from2 ? maps.maps.length - item.mirrorOffset : null;
    maps.appendMap(item.map, mirrorPos);
  }, from2, to);
  return maps;
};
Branch.prototype.addMaps = function addMaps(array) {
  if (this.eventCount == 0) {
    return this;
  }
  return new Branch(this.items.append(array.map(function(map2) {
    return new Item(map2);
  })), this.eventCount);
};
Branch.prototype.rebased = function rebased(rebasedTransform, rebasedCount) {
  if (!this.eventCount) {
    return this;
  }
  var rebasedItems = [], start = Math.max(0, this.items.length - rebasedCount);
  var mapping = rebasedTransform.mapping;
  var newUntil = rebasedTransform.steps.length;
  var eventCount = this.eventCount;
  this.items.forEach(function(item) {
    if (item.selection) {
      eventCount--;
    }
  }, start);
  var iRebased = rebasedCount;
  this.items.forEach(function(item) {
    var pos = mapping.getMirror(--iRebased);
    if (pos == null) {
      return;
    }
    newUntil = Math.min(newUntil, pos);
    var map2 = mapping.maps[pos];
    if (item.step) {
      var step = rebasedTransform.steps[pos].invert(rebasedTransform.docs[pos]);
      var selection = item.selection && item.selection.map(mapping.slice(iRebased + 1, pos));
      if (selection) {
        eventCount++;
      }
      rebasedItems.push(new Item(map2, step, selection));
    } else {
      rebasedItems.push(new Item(map2));
    }
  }, start);
  var newMaps = [];
  for (var i = rebasedCount; i < newUntil; i++) {
    newMaps.push(new Item(mapping.maps[i]));
  }
  var items = this.items.slice(0, start).append(newMaps).append(rebasedItems);
  var branch = new Branch(items, eventCount);
  if (branch.emptyItemCount() > max_empty_items) {
    branch = branch.compress(this.items.length - rebasedItems.length);
  }
  return branch;
};
Branch.prototype.emptyItemCount = function emptyItemCount() {
  var count = 0;
  this.items.forEach(function(item) {
    if (!item.step) {
      count++;
    }
  });
  return count;
};
Branch.prototype.compress = function compress(upto) {
  if (upto === void 0)
    upto = this.items.length;
  var remap = this.remapping(0, upto), mapFrom = remap.maps.length;
  var items = [], events = 0;
  this.items.forEach(function(item, i) {
    if (i >= upto) {
      items.push(item);
      if (item.selection) {
        events++;
      }
    } else if (item.step) {
      var step = item.step.map(remap.slice(mapFrom)), map2 = step && step.getMap();
      mapFrom--;
      if (map2) {
        remap.appendMap(map2, mapFrom);
      }
      if (step) {
        var selection = item.selection && item.selection.map(remap.slice(mapFrom));
        if (selection) {
          events++;
        }
        var newItem = new Item(map2.invert(), step, selection), merged, last = items.length - 1;
        if (merged = items.length && items[last].merge(newItem)) {
          items[last] = merged;
        } else {
          items.push(newItem);
        }
      }
    } else if (item.map) {
      mapFrom--;
    }
  }, this.items.length, 0);
  return new Branch(index_es_default.from(items.reverse()), events);
};
Branch.empty = new Branch(index_es_default.empty, 0);
function cutOffEvents(items, n) {
  var cutPoint;
  items.forEach(function(item, i) {
    if (item.selection && n-- == 0) {
      cutPoint = i;
      return false;
    }
  });
  return items.slice(cutPoint);
}
var Item = function Item2(map2, step, selection, mirrorOffset) {
  this.map = map2;
  this.step = step;
  this.selection = selection;
  this.mirrorOffset = mirrorOffset;
};
Item.prototype.merge = function merge(other) {
  if (this.step && other.step && !other.selection) {
    var step = other.step.merge(this.step);
    if (step) {
      return new Item(step.getMap().invert(), step, this.selection);
    }
  }
};
var HistoryState = function HistoryState2(done, undone, prevRanges, prevTime) {
  this.done = done;
  this.undone = undone;
  this.prevRanges = prevRanges;
  this.prevTime = prevTime;
};
var DEPTH_OVERFLOW = 20;
function applyTransaction(history2, state, tr, options) {
  var historyTr = tr.getMeta(historyKey), rebased2;
  if (historyTr) {
    return historyTr.historyState;
  }
  if (tr.getMeta(closeHistoryKey)) {
    history2 = new HistoryState(history2.done, history2.undone, null, 0);
  }
  var appended = tr.getMeta("appendedTransaction");
  if (tr.steps.length == 0) {
    return history2;
  } else if (appended && appended.getMeta(historyKey)) {
    if (appended.getMeta(historyKey).redo) {
      return new HistoryState(history2.done.addTransform(tr, null, options, mustPreserveItems(state)), history2.undone, rangesFor(tr.mapping.maps[tr.steps.length - 1]), history2.prevTime);
    } else {
      return new HistoryState(history2.done, history2.undone.addTransform(tr, null, options, mustPreserveItems(state)), null, history2.prevTime);
    }
  } else if (tr.getMeta("addToHistory") !== false && !(appended && appended.getMeta("addToHistory") === false)) {
    var newGroup = history2.prevTime == 0 || !appended && (history2.prevTime < (tr.time || 0) - options.newGroupDelay || !isAdjacentTo(tr, history2.prevRanges));
    var prevRanges = appended ? mapRanges(history2.prevRanges, tr.mapping) : rangesFor(tr.mapping.maps[tr.steps.length - 1]);
    return new HistoryState(history2.done.addTransform(tr, newGroup ? state.selection.getBookmark() : null, options, mustPreserveItems(state)), Branch.empty, prevRanges, tr.time);
  } else if (rebased2 = tr.getMeta("rebased")) {
    return new HistoryState(history2.done.rebased(tr, rebased2), history2.undone.rebased(tr, rebased2), mapRanges(history2.prevRanges, tr.mapping), history2.prevTime);
  } else {
    return new HistoryState(history2.done.addMaps(tr.mapping.maps), history2.undone.addMaps(tr.mapping.maps), mapRanges(history2.prevRanges, tr.mapping), history2.prevTime);
  }
}
function isAdjacentTo(transform, prevRanges) {
  if (!prevRanges) {
    return false;
  }
  if (!transform.docChanged) {
    return true;
  }
  var adjacent = false;
  transform.mapping.maps[0].forEach(function(start, end) {
    for (var i = 0; i < prevRanges.length; i += 2) {
      if (start <= prevRanges[i + 1] && end >= prevRanges[i]) {
        adjacent = true;
      }
    }
  });
  return adjacent;
}
function rangesFor(map2) {
  var result = [];
  map2.forEach(function(_from, _to, from2, to) {
    return result.push(from2, to);
  });
  return result;
}
function mapRanges(ranges, mapping) {
  if (!ranges) {
    return null;
  }
  var result = [];
  for (var i = 0; i < ranges.length; i += 2) {
    var from2 = mapping.map(ranges[i], 1), to = mapping.map(ranges[i + 1], -1);
    if (from2 <= to) {
      result.push(from2, to);
    }
  }
  return result;
}
function histTransaction(history2, state, dispatch, redo2) {
  var preserveItems = mustPreserveItems(state), histOptions = historyKey.get(state).spec.config;
  var pop = (redo2 ? history2.undone : history2.done).popEvent(state, preserveItems);
  if (!pop) {
    return;
  }
  var selection = pop.selection.resolve(pop.transform.doc);
  var added = (redo2 ? history2.done : history2.undone).addTransform(pop.transform, state.selection.getBookmark(), histOptions, preserveItems);
  var newHist = new HistoryState(redo2 ? added : pop.remaining, redo2 ? pop.remaining : added, null, 0);
  dispatch(pop.transform.setSelection(selection).setMeta(historyKey, { redo: redo2, historyState: newHist }).scrollIntoView());
}
var cachedPreserveItems = false;
var cachedPreserveItemsPlugins = null;
function mustPreserveItems(state) {
  var plugins = state.plugins;
  if (cachedPreserveItemsPlugins != plugins) {
    cachedPreserveItems = false;
    cachedPreserveItemsPlugins = plugins;
    for (var i = 0; i < plugins.length; i++) {
      if (plugins[i].spec.historyPreserveItems) {
        cachedPreserveItems = true;
        break;
      }
    }
  }
  return cachedPreserveItems;
}
var historyKey = new PluginKey("history");
var closeHistoryKey = new PluginKey("closeHistory");
function history(config) {
  config = {
    depth: config && config.depth || 100,
    newGroupDelay: config && config.newGroupDelay || 500
  };
  return new Plugin({
    key: historyKey,
    state: {
      init: function init() {
        return new HistoryState(Branch.empty, Branch.empty, null, 0);
      },
      apply: function apply(tr, hist, state) {
        return applyTransaction(hist, state, tr, config);
      }
    },
    config,
    props: {
      handleDOMEvents: {
        beforeinput: function beforeinput(view, e) {
          var handled = e.inputType == "historyUndo" ? undo(view.state, view.dispatch) : e.inputType == "historyRedo" ? redo(view.state, view.dispatch) : false;
          if (handled) {
            e.preventDefault();
          }
          return handled;
        }
      }
    }
  });
}
function undo(state, dispatch) {
  var hist = historyKey.getState(state);
  if (!hist || hist.done.eventCount == 0) {
    return false;
  }
  if (dispatch) {
    histTransaction(hist, state, dispatch, false);
  }
  return true;
}
function redo(state, dispatch) {
  var hist = historyKey.getState(state);
  if (!hist || hist.undone.eventCount == 0) {
    return false;
  }
  if (dispatch) {
    histTransaction(hist, state, dispatch, true);
  }
  return true;
}

export {
  history,
  undo,
  redo
};
