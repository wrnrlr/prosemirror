// node_modules/orderedmap/dist/index-es.js
function OrderedMap(content) {
  this.content = content;
}
OrderedMap.prototype = {
  constructor: OrderedMap,
  find: function(key) {
    for (var i = 0; i < this.content.length; i += 2)
      if (this.content[i] === key)
        return i;
    return -1;
  },
  get: function(key) {
    var found2 = this.find(key);
    return found2 == -1 ? void 0 : this.content[found2 + 1];
  },
  update: function(key, value, newKey) {
    var self = newKey && newKey != key ? this.remove(newKey) : this;
    var found2 = self.find(key), content = self.content.slice();
    if (found2 == -1) {
      content.push(newKey || key, value);
    } else {
      content[found2 + 1] = value;
      if (newKey)
        content[found2] = newKey;
    }
    return new OrderedMap(content);
  },
  remove: function(key) {
    var found2 = this.find(key);
    if (found2 == -1)
      return this;
    var content = this.content.slice();
    content.splice(found2, 2);
    return new OrderedMap(content);
  },
  addToStart: function(key, value) {
    return new OrderedMap([key, value].concat(this.remove(key).content));
  },
  addToEnd: function(key, value) {
    var content = this.remove(key).content.slice();
    content.push(key, value);
    return new OrderedMap(content);
  },
  addBefore: function(place, key, value) {
    var without = this.remove(key), content = without.content.slice();
    var found2 = without.find(place);
    content.splice(found2 == -1 ? content.length : found2, 0, key, value);
    return new OrderedMap(content);
  },
  forEach: function(f) {
    for (var i = 0; i < this.content.length; i += 2)
      f(this.content[i], this.content[i + 1]);
  },
  prepend: function(map) {
    map = OrderedMap.from(map);
    if (!map.size)
      return this;
    return new OrderedMap(map.content.concat(this.subtract(map).content));
  },
  append: function(map) {
    map = OrderedMap.from(map);
    if (!map.size)
      return this;
    return new OrderedMap(this.subtract(map).content.concat(map.content));
  },
  subtract: function(map) {
    var result = this;
    map = OrderedMap.from(map);
    for (var i = 0; i < map.content.length; i += 2)
      result = result.remove(map.content[i]);
    return result;
  },
  get size() {
    return this.content.length >> 1;
  }
};
OrderedMap.from = function(value) {
  if (value instanceof OrderedMap)
    return value;
  var content = [];
  if (value)
    for (var prop in value)
      content.push(prop, value[prop]);
  return new OrderedMap(content);
};
var index_es_default = OrderedMap;

// node_modules/prosemirror-model/dist/index.es.js
function findDiffStart(a, b, pos) {
  for (var i = 0; ; i++) {
    if (i == a.childCount || i == b.childCount) {
      return a.childCount == b.childCount ? null : pos;
    }
    var childA = a.child(i), childB = b.child(i);
    if (childA == childB) {
      pos += childA.nodeSize;
      continue;
    }
    if (!childA.sameMarkup(childB)) {
      return pos;
    }
    if (childA.isText && childA.text != childB.text) {
      for (var j = 0; childA.text[j] == childB.text[j]; j++) {
        pos++;
      }
      return pos;
    }
    if (childA.content.size || childB.content.size) {
      var inner = findDiffStart(childA.content, childB.content, pos + 1);
      if (inner != null) {
        return inner;
      }
    }
    pos += childA.nodeSize;
  }
}
function findDiffEnd(a, b, posA, posB) {
  for (var iA = a.childCount, iB = b.childCount; ; ) {
    if (iA == 0 || iB == 0) {
      return iA == iB ? null : { a: posA, b: posB };
    }
    var childA = a.child(--iA), childB = b.child(--iB), size = childA.nodeSize;
    if (childA == childB) {
      posA -= size;
      posB -= size;
      continue;
    }
    if (!childA.sameMarkup(childB)) {
      return { a: posA, b: posB };
    }
    if (childA.isText && childA.text != childB.text) {
      var same = 0, minSize = Math.min(childA.text.length, childB.text.length);
      while (same < minSize && childA.text[childA.text.length - same - 1] == childB.text[childB.text.length - same - 1]) {
        same++;
        posA--;
        posB--;
      }
      return { a: posA, b: posB };
    }
    if (childA.content.size || childB.content.size) {
      var inner = findDiffEnd(childA.content, childB.content, posA - 1, posB - 1);
      if (inner) {
        return inner;
      }
    }
    posA -= size;
    posB -= size;
  }
}
var Fragment = function Fragment2(content, size) {
  this.content = content;
  this.size = size || 0;
  if (size == null) {
    for (var i = 0; i < content.length; i++) {
      this.size += content[i].nodeSize;
    }
  }
};
var prototypeAccessors = { firstChild: { configurable: true }, lastChild: { configurable: true }, childCount: { configurable: true } };
Fragment.prototype.nodesBetween = function nodesBetween(from2, to, f, nodeStart, parent) {
  if (nodeStart === void 0)
    nodeStart = 0;
  for (var i = 0, pos = 0; pos < to; i++) {
    var child3 = this.content[i], end2 = pos + child3.nodeSize;
    if (end2 > from2 && f(child3, nodeStart + pos, parent, i) !== false && child3.content.size) {
      var start2 = pos + 1;
      child3.nodesBetween(Math.max(0, from2 - start2), Math.min(child3.content.size, to - start2), f, nodeStart + start2);
    }
    pos = end2;
  }
};
Fragment.prototype.descendants = function descendants(f) {
  this.nodesBetween(0, this.size, f);
};
Fragment.prototype.textBetween = function textBetween(from2, to, blockSeparator, leafText) {
  var text2 = "", separated = true;
  this.nodesBetween(from2, to, function(node3, pos) {
    if (node3.isText) {
      text2 += node3.text.slice(Math.max(from2, pos) - pos, to - pos);
      separated = !blockSeparator;
    } else if (node3.isLeaf && leafText) {
      text2 += typeof leafText === "function" ? leafText(node3) : leafText;
      separated = !blockSeparator;
    } else if (!separated && node3.isBlock) {
      text2 += blockSeparator;
      separated = true;
    }
  }, 0);
  return text2;
};
Fragment.prototype.append = function append(other) {
  if (!other.size) {
    return this;
  }
  if (!this.size) {
    return other;
  }
  var last = this.lastChild, first = other.firstChild, content = this.content.slice(), i = 0;
  if (last.isText && last.sameMarkup(first)) {
    content[content.length - 1] = last.withText(last.text + first.text);
    i = 1;
  }
  for (; i < other.content.length; i++) {
    content.push(other.content[i]);
  }
  return new Fragment(content, this.size + other.size);
};
Fragment.prototype.cut = function cut(from2, to) {
  if (to == null) {
    to = this.size;
  }
  if (from2 == 0 && to == this.size) {
    return this;
  }
  var result = [], size = 0;
  if (to > from2) {
    for (var i = 0, pos = 0; pos < to; i++) {
      var child3 = this.content[i], end2 = pos + child3.nodeSize;
      if (end2 > from2) {
        if (pos < from2 || end2 > to) {
          if (child3.isText) {
            child3 = child3.cut(Math.max(0, from2 - pos), Math.min(child3.text.length, to - pos));
          } else {
            child3 = child3.cut(Math.max(0, from2 - pos - 1), Math.min(child3.content.size, to - pos - 1));
          }
        }
        result.push(child3);
        size += child3.nodeSize;
      }
      pos = end2;
    }
  }
  return new Fragment(result, size);
};
Fragment.prototype.cutByIndex = function cutByIndex(from2, to) {
  if (from2 == to) {
    return Fragment.empty;
  }
  if (from2 == 0 && to == this.content.length) {
    return this;
  }
  return new Fragment(this.content.slice(from2, to));
};
Fragment.prototype.replaceChild = function replaceChild(index2, node3) {
  var current = this.content[index2];
  if (current == node3) {
    return this;
  }
  var copy3 = this.content.slice();
  var size = this.size + node3.nodeSize - current.nodeSize;
  copy3[index2] = node3;
  return new Fragment(copy3, size);
};
Fragment.prototype.addToStart = function addToStart(node3) {
  return new Fragment([node3].concat(this.content), this.size + node3.nodeSize);
};
Fragment.prototype.addToEnd = function addToEnd(node3) {
  return new Fragment(this.content.concat(node3), this.size + node3.nodeSize);
};
Fragment.prototype.eq = function eq(other) {
  if (this.content.length != other.content.length) {
    return false;
  }
  for (var i = 0; i < this.content.length; i++) {
    if (!this.content[i].eq(other.content[i])) {
      return false;
    }
  }
  return true;
};
prototypeAccessors.firstChild.get = function() {
  return this.content.length ? this.content[0] : null;
};
prototypeAccessors.lastChild.get = function() {
  return this.content.length ? this.content[this.content.length - 1] : null;
};
prototypeAccessors.childCount.get = function() {
  return this.content.length;
};
Fragment.prototype.child = function child(index2) {
  var found2 = this.content[index2];
  if (!found2) {
    throw new RangeError("Index " + index2 + " out of range for " + this);
  }
  return found2;
};
Fragment.prototype.maybeChild = function maybeChild(index2) {
  return this.content[index2];
};
Fragment.prototype.forEach = function forEach(f) {
  for (var i = 0, p = 0; i < this.content.length; i++) {
    var child3 = this.content[i];
    f(child3, p, i);
    p += child3.nodeSize;
  }
};
Fragment.prototype.findDiffStart = function findDiffStart$1(other, pos) {
  if (pos === void 0)
    pos = 0;
  return findDiffStart(this, other, pos);
};
Fragment.prototype.findDiffEnd = function findDiffEnd$1(other, pos, otherPos) {
  if (pos === void 0)
    pos = this.size;
  if (otherPos === void 0)
    otherPos = other.size;
  return findDiffEnd(this, other, pos, otherPos);
};
Fragment.prototype.findIndex = function findIndex(pos, round) {
  if (round === void 0)
    round = -1;
  if (pos == 0) {
    return retIndex(0, pos);
  }
  if (pos == this.size) {
    return retIndex(this.content.length, pos);
  }
  if (pos > this.size || pos < 0) {
    throw new RangeError("Position " + pos + " outside of fragment (" + this + ")");
  }
  for (var i = 0, curPos = 0; ; i++) {
    var cur = this.child(i), end2 = curPos + cur.nodeSize;
    if (end2 >= pos) {
      if (end2 == pos || round > 0) {
        return retIndex(i + 1, end2);
      }
      return retIndex(i, curPos);
    }
    curPos = end2;
  }
};
Fragment.prototype.toString = function toString() {
  return "<" + this.toStringInner() + ">";
};
Fragment.prototype.toStringInner = function toStringInner() {
  return this.content.join(", ");
};
Fragment.prototype.toJSON = function toJSON() {
  return this.content.length ? this.content.map(function(n) {
    return n.toJSON();
  }) : null;
};
Fragment.fromJSON = function fromJSON(schema, value) {
  if (!value) {
    return Fragment.empty;
  }
  if (!Array.isArray(value)) {
    throw new RangeError("Invalid input for Fragment.fromJSON");
  }
  return new Fragment(value.map(schema.nodeFromJSON));
};
Fragment.fromArray = function fromArray(array) {
  if (!array.length) {
    return Fragment.empty;
  }
  var joined, size = 0;
  for (var i = 0; i < array.length; i++) {
    var node3 = array[i];
    size += node3.nodeSize;
    if (i && node3.isText && array[i - 1].sameMarkup(node3)) {
      if (!joined) {
        joined = array.slice(0, i);
      }
      joined[joined.length - 1] = node3.withText(joined[joined.length - 1].text + node3.text);
    } else if (joined) {
      joined.push(node3);
    }
  }
  return new Fragment(joined || array, size);
};
Fragment.from = function from(nodes) {
  if (!nodes) {
    return Fragment.empty;
  }
  if (nodes instanceof Fragment) {
    return nodes;
  }
  if (Array.isArray(nodes)) {
    return this.fromArray(nodes);
  }
  if (nodes.attrs) {
    return new Fragment([nodes], nodes.nodeSize);
  }
  throw new RangeError("Can not convert " + nodes + " to a Fragment" + (nodes.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
};
Object.defineProperties(Fragment.prototype, prototypeAccessors);
var found = { index: 0, offset: 0 };
function retIndex(index2, offset) {
  found.index = index2;
  found.offset = offset;
  return found;
}
Fragment.empty = new Fragment([], 0);
function compareDeep(a, b) {
  if (a === b) {
    return true;
  }
  if (!(a && typeof a == "object") || !(b && typeof b == "object")) {
    return false;
  }
  var array = Array.isArray(a);
  if (Array.isArray(b) != array) {
    return false;
  }
  if (array) {
    if (a.length != b.length) {
      return false;
    }
    for (var i = 0; i < a.length; i++) {
      if (!compareDeep(a[i], b[i])) {
        return false;
      }
    }
  } else {
    for (var p in a) {
      if (!(p in b) || !compareDeep(a[p], b[p])) {
        return false;
      }
    }
    for (var p$1 in b) {
      if (!(p$1 in a)) {
        return false;
      }
    }
  }
  return true;
}
var Mark = function Mark2(type, attrs) {
  this.type = type;
  this.attrs = attrs;
};
Mark.prototype.addToSet = function addToSet(set) {
  var copy3, placed = false;
  for (var i = 0; i < set.length; i++) {
    var other = set[i];
    if (this.eq(other)) {
      return set;
    }
    if (this.type.excludes(other.type)) {
      if (!copy3) {
        copy3 = set.slice(0, i);
      }
    } else if (other.type.excludes(this.type)) {
      return set;
    } else {
      if (!placed && other.type.rank > this.type.rank) {
        if (!copy3) {
          copy3 = set.slice(0, i);
        }
        copy3.push(this);
        placed = true;
      }
      if (copy3) {
        copy3.push(other);
      }
    }
  }
  if (!copy3) {
    copy3 = set.slice();
  }
  if (!placed) {
    copy3.push(this);
  }
  return copy3;
};
Mark.prototype.removeFromSet = function removeFromSet(set) {
  for (var i = 0; i < set.length; i++) {
    if (this.eq(set[i])) {
      return set.slice(0, i).concat(set.slice(i + 1));
    }
  }
  return set;
};
Mark.prototype.isInSet = function isInSet(set) {
  for (var i = 0; i < set.length; i++) {
    if (this.eq(set[i])) {
      return true;
    }
  }
  return false;
};
Mark.prototype.eq = function eq2(other) {
  return this == other || this.type == other.type && compareDeep(this.attrs, other.attrs);
};
Mark.prototype.toJSON = function toJSON2() {
  var obj = { type: this.type.name };
  for (var _ in this.attrs) {
    obj.attrs = this.attrs;
    break;
  }
  return obj;
};
Mark.fromJSON = function fromJSON2(schema, json) {
  if (!json) {
    throw new RangeError("Invalid input for Mark.fromJSON");
  }
  var type = schema.marks[json.type];
  if (!type) {
    throw new RangeError("There is no mark type " + json.type + " in this schema");
  }
  return type.create(json.attrs);
};
Mark.sameSet = function sameSet(a, b) {
  if (a == b) {
    return true;
  }
  if (a.length != b.length) {
    return false;
  }
  for (var i = 0; i < a.length; i++) {
    if (!a[i].eq(b[i])) {
      return false;
    }
  }
  return true;
};
Mark.setFrom = function setFrom(marks2) {
  if (!marks2 || marks2.length == 0) {
    return Mark.none;
  }
  if (marks2 instanceof Mark) {
    return [marks2];
  }
  var copy3 = marks2.slice();
  copy3.sort(function(a, b) {
    return a.type.rank - b.type.rank;
  });
  return copy3;
};
Mark.none = [];
function ReplaceError(message) {
  var err2 = Error.call(this, message);
  err2.__proto__ = ReplaceError.prototype;
  return err2;
}
ReplaceError.prototype = Object.create(Error.prototype);
ReplaceError.prototype.constructor = ReplaceError;
ReplaceError.prototype.name = "ReplaceError";
var Slice = function Slice2(content, openStart, openEnd) {
  this.content = content;
  this.openStart = openStart;
  this.openEnd = openEnd;
};
var prototypeAccessors$1 = { size: { configurable: true } };
prototypeAccessors$1.size.get = function() {
  return this.content.size - this.openStart - this.openEnd;
};
Slice.prototype.insertAt = function insertAt(pos, fragment) {
  var content = insertInto(this.content, pos + this.openStart, fragment, null);
  return content && new Slice(content, this.openStart, this.openEnd);
};
Slice.prototype.removeBetween = function removeBetween(from2, to) {
  return new Slice(removeRange(this.content, from2 + this.openStart, to + this.openStart), this.openStart, this.openEnd);
};
Slice.prototype.eq = function eq3(other) {
  return this.content.eq(other.content) && this.openStart == other.openStart && this.openEnd == other.openEnd;
};
Slice.prototype.toString = function toString2() {
  return this.content + "(" + this.openStart + "," + this.openEnd + ")";
};
Slice.prototype.toJSON = function toJSON3() {
  if (!this.content.size) {
    return null;
  }
  var json = { content: this.content.toJSON() };
  if (this.openStart > 0) {
    json.openStart = this.openStart;
  }
  if (this.openEnd > 0) {
    json.openEnd = this.openEnd;
  }
  return json;
};
Slice.fromJSON = function fromJSON3(schema, json) {
  if (!json) {
    return Slice.empty;
  }
  var openStart = json.openStart || 0, openEnd = json.openEnd || 0;
  if (typeof openStart != "number" || typeof openEnd != "number") {
    throw new RangeError("Invalid input for Slice.fromJSON");
  }
  return new Slice(Fragment.fromJSON(schema, json.content), openStart, openEnd);
};
Slice.maxOpen = function maxOpen(fragment, openIsolating) {
  if (openIsolating === void 0)
    openIsolating = true;
  var openStart = 0, openEnd = 0;
  for (var n = fragment.firstChild; n && !n.isLeaf && (openIsolating || !n.type.spec.isolating); n = n.firstChild) {
    openStart++;
  }
  for (var n$1 = fragment.lastChild; n$1 && !n$1.isLeaf && (openIsolating || !n$1.type.spec.isolating); n$1 = n$1.lastChild) {
    openEnd++;
  }
  return new Slice(fragment, openStart, openEnd);
};
Object.defineProperties(Slice.prototype, prototypeAccessors$1);
function removeRange(content, from2, to) {
  var ref = content.findIndex(from2);
  var index2 = ref.index;
  var offset = ref.offset;
  var child3 = content.maybeChild(index2);
  var ref$1 = content.findIndex(to);
  var indexTo = ref$1.index;
  var offsetTo = ref$1.offset;
  if (offset == from2 || child3.isText) {
    if (offsetTo != to && !content.child(indexTo).isText) {
      throw new RangeError("Removing non-flat range");
    }
    return content.cut(0, from2).append(content.cut(to));
  }
  if (index2 != indexTo) {
    throw new RangeError("Removing non-flat range");
  }
  return content.replaceChild(index2, child3.copy(removeRange(child3.content, from2 - offset - 1, to - offset - 1)));
}
function insertInto(content, dist, insert, parent) {
  var ref = content.findIndex(dist);
  var index2 = ref.index;
  var offset = ref.offset;
  var child3 = content.maybeChild(index2);
  if (offset == dist || child3.isText) {
    if (parent && !parent.canReplace(index2, index2, insert)) {
      return null;
    }
    return content.cut(0, dist).append(insert).append(content.cut(dist));
  }
  var inner = insertInto(child3.content, dist - offset - 1, insert);
  return inner && content.replaceChild(index2, child3.copy(inner));
}
Slice.empty = new Slice(Fragment.empty, 0, 0);
function replace($from, $to, slice2) {
  if (slice2.openStart > $from.depth) {
    throw new ReplaceError("Inserted content deeper than insertion position");
  }
  if ($from.depth - slice2.openStart != $to.depth - slice2.openEnd) {
    throw new ReplaceError("Inconsistent open depths");
  }
  return replaceOuter($from, $to, slice2, 0);
}
function replaceOuter($from, $to, slice2, depth) {
  var index2 = $from.index(depth), node3 = $from.node(depth);
  if (index2 == $to.index(depth) && depth < $from.depth - slice2.openStart) {
    var inner = replaceOuter($from, $to, slice2, depth + 1);
    return node3.copy(node3.content.replaceChild(index2, inner));
  } else if (!slice2.content.size) {
    return close(node3, replaceTwoWay($from, $to, depth));
  } else if (!slice2.openStart && !slice2.openEnd && $from.depth == depth && $to.depth == depth) {
    var parent = $from.parent, content = parent.content;
    return close(parent, content.cut(0, $from.parentOffset).append(slice2.content).append(content.cut($to.parentOffset)));
  } else {
    var ref = prepareSliceForReplace(slice2, $from);
    var start2 = ref.start;
    var end2 = ref.end;
    return close(node3, replaceThreeWay($from, start2, end2, $to, depth));
  }
}
function checkJoin(main, sub) {
  if (!sub.type.compatibleContent(main.type)) {
    throw new ReplaceError("Cannot join " + sub.type.name + " onto " + main.type.name);
  }
}
function joinable($before, $after, depth) {
  var node3 = $before.node(depth);
  checkJoin(node3, $after.node(depth));
  return node3;
}
function addNode(child3, target) {
  var last = target.length - 1;
  if (last >= 0 && child3.isText && child3.sameMarkup(target[last])) {
    target[last] = child3.withText(target[last].text + child3.text);
  } else {
    target.push(child3);
  }
}
function addRange($start, $end, depth, target) {
  var node3 = ($end || $start).node(depth);
  var startIndex = 0, endIndex = $end ? $end.index(depth) : node3.childCount;
  if ($start) {
    startIndex = $start.index(depth);
    if ($start.depth > depth) {
      startIndex++;
    } else if ($start.textOffset) {
      addNode($start.nodeAfter, target);
      startIndex++;
    }
  }
  for (var i = startIndex; i < endIndex; i++) {
    addNode(node3.child(i), target);
  }
  if ($end && $end.depth == depth && $end.textOffset) {
    addNode($end.nodeBefore, target);
  }
}
function close(node3, content) {
  if (!node3.type.validContent(content)) {
    throw new ReplaceError("Invalid content for node " + node3.type.name);
  }
  return node3.copy(content);
}
function replaceThreeWay($from, $start, $end, $to, depth) {
  var openStart = $from.depth > depth && joinable($from, $start, depth + 1);
  var openEnd = $to.depth > depth && joinable($end, $to, depth + 1);
  var content = [];
  addRange(null, $from, depth, content);
  if (openStart && openEnd && $start.index(depth) == $end.index(depth)) {
    checkJoin(openStart, openEnd);
    addNode(close(openStart, replaceThreeWay($from, $start, $end, $to, depth + 1)), content);
  } else {
    if (openStart) {
      addNode(close(openStart, replaceTwoWay($from, $start, depth + 1)), content);
    }
    addRange($start, $end, depth, content);
    if (openEnd) {
      addNode(close(openEnd, replaceTwoWay($end, $to, depth + 1)), content);
    }
  }
  addRange($to, null, depth, content);
  return new Fragment(content);
}
function replaceTwoWay($from, $to, depth) {
  var content = [];
  addRange(null, $from, depth, content);
  if ($from.depth > depth) {
    var type = joinable($from, $to, depth + 1);
    addNode(close(type, replaceTwoWay($from, $to, depth + 1)), content);
  }
  addRange($to, null, depth, content);
  return new Fragment(content);
}
function prepareSliceForReplace(slice2, $along) {
  var extra = $along.depth - slice2.openStart, parent = $along.node(extra);
  var node3 = parent.copy(slice2.content);
  for (var i = extra - 1; i >= 0; i--) {
    node3 = $along.node(i).copy(Fragment.from(node3));
  }
  return {
    start: node3.resolveNoCache(slice2.openStart + extra),
    end: node3.resolveNoCache(node3.content.size - slice2.openEnd - extra)
  };
}
var ResolvedPos = function ResolvedPos2(pos, path, parentOffset) {
  this.pos = pos;
  this.path = path;
  this.depth = path.length / 3 - 1;
  this.parentOffset = parentOffset;
};
var prototypeAccessors$2 = { parent: { configurable: true }, doc: { configurable: true }, textOffset: { configurable: true }, nodeAfter: { configurable: true }, nodeBefore: { configurable: true } };
ResolvedPos.prototype.resolveDepth = function resolveDepth(val) {
  if (val == null) {
    return this.depth;
  }
  if (val < 0) {
    return this.depth + val;
  }
  return val;
};
prototypeAccessors$2.parent.get = function() {
  return this.node(this.depth);
};
prototypeAccessors$2.doc.get = function() {
  return this.node(0);
};
ResolvedPos.prototype.node = function node(depth) {
  return this.path[this.resolveDepth(depth) * 3];
};
ResolvedPos.prototype.index = function index(depth) {
  return this.path[this.resolveDepth(depth) * 3 + 1];
};
ResolvedPos.prototype.indexAfter = function indexAfter(depth) {
  depth = this.resolveDepth(depth);
  return this.index(depth) + (depth == this.depth && !this.textOffset ? 0 : 1);
};
ResolvedPos.prototype.start = function start(depth) {
  depth = this.resolveDepth(depth);
  return depth == 0 ? 0 : this.path[depth * 3 - 1] + 1;
};
ResolvedPos.prototype.end = function end(depth) {
  depth = this.resolveDepth(depth);
  return this.start(depth) + this.node(depth).content.size;
};
ResolvedPos.prototype.before = function before(depth) {
  depth = this.resolveDepth(depth);
  if (!depth) {
    throw new RangeError("There is no position before the top-level node");
  }
  return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1];
};
ResolvedPos.prototype.after = function after(depth) {
  depth = this.resolveDepth(depth);
  if (!depth) {
    throw new RangeError("There is no position after the top-level node");
  }
  return depth == this.depth + 1 ? this.pos : this.path[depth * 3 - 1] + this.path[depth * 3].nodeSize;
};
prototypeAccessors$2.textOffset.get = function() {
  return this.pos - this.path[this.path.length - 1];
};
prototypeAccessors$2.nodeAfter.get = function() {
  var parent = this.parent, index2 = this.index(this.depth);
  if (index2 == parent.childCount) {
    return null;
  }
  var dOff = this.pos - this.path[this.path.length - 1], child3 = parent.child(index2);
  return dOff ? parent.child(index2).cut(dOff) : child3;
};
prototypeAccessors$2.nodeBefore.get = function() {
  var index2 = this.index(this.depth);
  var dOff = this.pos - this.path[this.path.length - 1];
  if (dOff) {
    return this.parent.child(index2).cut(0, dOff);
  }
  return index2 == 0 ? null : this.parent.child(index2 - 1);
};
ResolvedPos.prototype.posAtIndex = function posAtIndex(index2, depth) {
  depth = this.resolveDepth(depth);
  var node3 = this.path[depth * 3], pos = depth == 0 ? 0 : this.path[depth * 3 - 1] + 1;
  for (var i = 0; i < index2; i++) {
    pos += node3.child(i).nodeSize;
  }
  return pos;
};
ResolvedPos.prototype.marks = function marks() {
  var parent = this.parent, index2 = this.index();
  if (parent.content.size == 0) {
    return Mark.none;
  }
  if (this.textOffset) {
    return parent.child(index2).marks;
  }
  var main = parent.maybeChild(index2 - 1), other = parent.maybeChild(index2);
  if (!main) {
    var tmp = main;
    main = other;
    other = tmp;
  }
  var marks2 = main.marks;
  for (var i = 0; i < marks2.length; i++) {
    if (marks2[i].type.spec.inclusive === false && (!other || !marks2[i].isInSet(other.marks))) {
      marks2 = marks2[i--].removeFromSet(marks2);
    }
  }
  return marks2;
};
ResolvedPos.prototype.marksAcross = function marksAcross($end) {
  var after2 = this.parent.maybeChild(this.index());
  if (!after2 || !after2.isInline) {
    return null;
  }
  var marks2 = after2.marks, next = $end.parent.maybeChild($end.index());
  for (var i = 0; i < marks2.length; i++) {
    if (marks2[i].type.spec.inclusive === false && (!next || !marks2[i].isInSet(next.marks))) {
      marks2 = marks2[i--].removeFromSet(marks2);
    }
  }
  return marks2;
};
ResolvedPos.prototype.sharedDepth = function sharedDepth(pos) {
  for (var depth = this.depth; depth > 0; depth--) {
    if (this.start(depth) <= pos && this.end(depth) >= pos) {
      return depth;
    }
  }
  return 0;
};
ResolvedPos.prototype.blockRange = function blockRange(other, pred) {
  if (other === void 0)
    other = this;
  if (other.pos < this.pos) {
    return other.blockRange(this);
  }
  for (var d = this.depth - (this.parent.inlineContent || this.pos == other.pos ? 1 : 0); d >= 0; d--) {
    if (other.pos <= this.end(d) && (!pred || pred(this.node(d)))) {
      return new NodeRange(this, other, d);
    }
  }
};
ResolvedPos.prototype.sameParent = function sameParent(other) {
  return this.pos - this.parentOffset == other.pos - other.parentOffset;
};
ResolvedPos.prototype.max = function max(other) {
  return other.pos > this.pos ? other : this;
};
ResolvedPos.prototype.min = function min(other) {
  return other.pos < this.pos ? other : this;
};
ResolvedPos.prototype.toString = function toString3() {
  var str = "";
  for (var i = 1; i <= this.depth; i++) {
    str += (str ? "/" : "") + this.node(i).type.name + "_" + this.index(i - 1);
  }
  return str + ":" + this.parentOffset;
};
ResolvedPos.resolve = function resolve(doc2, pos) {
  if (!(pos >= 0 && pos <= doc2.content.size)) {
    throw new RangeError("Position " + pos + " out of range");
  }
  var path = [];
  var start2 = 0, parentOffset = pos;
  for (var node3 = doc2; ; ) {
    var ref = node3.content.findIndex(parentOffset);
    var index2 = ref.index;
    var offset = ref.offset;
    var rem = parentOffset - offset;
    path.push(node3, index2, start2 + offset);
    if (!rem) {
      break;
    }
    node3 = node3.child(index2);
    if (node3.isText) {
      break;
    }
    parentOffset = rem - 1;
    start2 += offset + 1;
  }
  return new ResolvedPos(pos, path, parentOffset);
};
ResolvedPos.resolveCached = function resolveCached(doc2, pos) {
  for (var i = 0; i < resolveCache.length; i++) {
    var cached = resolveCache[i];
    if (cached.pos == pos && cached.doc == doc2) {
      return cached;
    }
  }
  var result = resolveCache[resolveCachePos] = ResolvedPos.resolve(doc2, pos);
  resolveCachePos = (resolveCachePos + 1) % resolveCacheSize;
  return result;
};
Object.defineProperties(ResolvedPos.prototype, prototypeAccessors$2);
var resolveCache = [];
var resolveCachePos = 0;
var resolveCacheSize = 12;
var NodeRange = function NodeRange2($from, $to, depth) {
  this.$from = $from;
  this.$to = $to;
  this.depth = depth;
};
var prototypeAccessors$1$1 = { start: { configurable: true }, end: { configurable: true }, parent: { configurable: true }, startIndex: { configurable: true }, endIndex: { configurable: true } };
prototypeAccessors$1$1.start.get = function() {
  return this.$from.before(this.depth + 1);
};
prototypeAccessors$1$1.end.get = function() {
  return this.$to.after(this.depth + 1);
};
prototypeAccessors$1$1.parent.get = function() {
  return this.$from.node(this.depth);
};
prototypeAccessors$1$1.startIndex.get = function() {
  return this.$from.index(this.depth);
};
prototypeAccessors$1$1.endIndex.get = function() {
  return this.$to.indexAfter(this.depth);
};
Object.defineProperties(NodeRange.prototype, prototypeAccessors$1$1);
var emptyAttrs = /* @__PURE__ */ Object.create(null);
var Node = function Node2(type, attrs, content, marks2) {
  this.type = type;
  this.attrs = attrs;
  this.content = content || Fragment.empty;
  this.marks = marks2 || Mark.none;
};
var prototypeAccessors$3 = { nodeSize: { configurable: true }, childCount: { configurable: true }, textContent: { configurable: true }, firstChild: { configurable: true }, lastChild: { configurable: true }, isBlock: { configurable: true }, isTextblock: { configurable: true }, inlineContent: { configurable: true }, isInline: { configurable: true }, isText: { configurable: true }, isLeaf: { configurable: true }, isAtom: { configurable: true } };
prototypeAccessors$3.nodeSize.get = function() {
  return this.isLeaf ? 1 : 2 + this.content.size;
};
prototypeAccessors$3.childCount.get = function() {
  return this.content.childCount;
};
Node.prototype.child = function child2(index2) {
  return this.content.child(index2);
};
Node.prototype.maybeChild = function maybeChild2(index2) {
  return this.content.maybeChild(index2);
};
Node.prototype.forEach = function forEach2(f) {
  this.content.forEach(f);
};
Node.prototype.nodesBetween = function nodesBetween2(from2, to, f, startPos) {
  if (startPos === void 0)
    startPos = 0;
  this.content.nodesBetween(from2, to, f, startPos, this);
};
Node.prototype.descendants = function descendants2(f) {
  this.nodesBetween(0, this.content.size, f);
};
prototypeAccessors$3.textContent.get = function() {
  return this.textBetween(0, this.content.size, "");
};
Node.prototype.textBetween = function textBetween2(from2, to, blockSeparator, leafText) {
  return this.content.textBetween(from2, to, blockSeparator, leafText);
};
prototypeAccessors$3.firstChild.get = function() {
  return this.content.firstChild;
};
prototypeAccessors$3.lastChild.get = function() {
  return this.content.lastChild;
};
Node.prototype.eq = function eq4(other) {
  return this == other || this.sameMarkup(other) && this.content.eq(other.content);
};
Node.prototype.sameMarkup = function sameMarkup(other) {
  return this.hasMarkup(other.type, other.attrs, other.marks);
};
Node.prototype.hasMarkup = function hasMarkup(type, attrs, marks2) {
  return this.type == type && compareDeep(this.attrs, attrs || type.defaultAttrs || emptyAttrs) && Mark.sameSet(this.marks, marks2 || Mark.none);
};
Node.prototype.copy = function copy(content) {
  if (content === void 0)
    content = null;
  if (content == this.content) {
    return this;
  }
  return new this.constructor(this.type, this.attrs, content, this.marks);
};
Node.prototype.mark = function mark(marks2) {
  return marks2 == this.marks ? this : new this.constructor(this.type, this.attrs, this.content, marks2);
};
Node.prototype.cut = function cut2(from2, to) {
  if (from2 == 0 && to == this.content.size) {
    return this;
  }
  return this.copy(this.content.cut(from2, to));
};
Node.prototype.slice = function slice(from2, to, includeParents) {
  if (to === void 0)
    to = this.content.size;
  if (includeParents === void 0)
    includeParents = false;
  if (from2 == to) {
    return Slice.empty;
  }
  var $from = this.resolve(from2), $to = this.resolve(to);
  var depth = includeParents ? 0 : $from.sharedDepth(to);
  var start2 = $from.start(depth), node3 = $from.node(depth);
  var content = node3.content.cut($from.pos - start2, $to.pos - start2);
  return new Slice(content, $from.depth - depth, $to.depth - depth);
};
Node.prototype.replace = function replace$1(from2, to, slice2) {
  return replace(this.resolve(from2), this.resolve(to), slice2);
};
Node.prototype.nodeAt = function nodeAt(pos) {
  for (var node3 = this; ; ) {
    var ref = node3.content.findIndex(pos);
    var index2 = ref.index;
    var offset = ref.offset;
    node3 = node3.maybeChild(index2);
    if (!node3) {
      return null;
    }
    if (offset == pos || node3.isText) {
      return node3;
    }
    pos -= offset + 1;
  }
};
Node.prototype.childAfter = function childAfter(pos) {
  var ref = this.content.findIndex(pos);
  var index2 = ref.index;
  var offset = ref.offset;
  return { node: this.content.maybeChild(index2), index: index2, offset };
};
Node.prototype.childBefore = function childBefore(pos) {
  if (pos == 0) {
    return { node: null, index: 0, offset: 0 };
  }
  var ref = this.content.findIndex(pos);
  var index2 = ref.index;
  var offset = ref.offset;
  if (offset < pos) {
    return { node: this.content.child(index2), index: index2, offset };
  }
  var node3 = this.content.child(index2 - 1);
  return { node: node3, index: index2 - 1, offset: offset - node3.nodeSize };
};
Node.prototype.resolve = function resolve2(pos) {
  return ResolvedPos.resolveCached(this, pos);
};
Node.prototype.resolveNoCache = function resolveNoCache(pos) {
  return ResolvedPos.resolve(this, pos);
};
Node.prototype.rangeHasMark = function rangeHasMark(from2, to, type) {
  var found2 = false;
  if (to > from2) {
    this.nodesBetween(from2, to, function(node3) {
      if (type.isInSet(node3.marks)) {
        found2 = true;
      }
      return !found2;
    });
  }
  return found2;
};
prototypeAccessors$3.isBlock.get = function() {
  return this.type.isBlock;
};
prototypeAccessors$3.isTextblock.get = function() {
  return this.type.isTextblock;
};
prototypeAccessors$3.inlineContent.get = function() {
  return this.type.inlineContent;
};
prototypeAccessors$3.isInline.get = function() {
  return this.type.isInline;
};
prototypeAccessors$3.isText.get = function() {
  return this.type.isText;
};
prototypeAccessors$3.isLeaf.get = function() {
  return this.type.isLeaf;
};
prototypeAccessors$3.isAtom.get = function() {
  return this.type.isAtom;
};
Node.prototype.toString = function toString4() {
  if (this.type.spec.toDebugString) {
    return this.type.spec.toDebugString(this);
  }
  var name = this.type.name;
  if (this.content.size) {
    name += "(" + this.content.toStringInner() + ")";
  }
  return wrapMarks(this.marks, name);
};
Node.prototype.contentMatchAt = function contentMatchAt(index2) {
  var match = this.type.contentMatch.matchFragment(this.content, 0, index2);
  if (!match) {
    throw new Error("Called contentMatchAt on a node with invalid content");
  }
  return match;
};
Node.prototype.canReplace = function canReplace(from2, to, replacement, start2, end2) {
  if (replacement === void 0)
    replacement = Fragment.empty;
  if (start2 === void 0)
    start2 = 0;
  if (end2 === void 0)
    end2 = replacement.childCount;
  var one = this.contentMatchAt(from2).matchFragment(replacement, start2, end2);
  var two = one && one.matchFragment(this.content, to);
  if (!two || !two.validEnd) {
    return false;
  }
  for (var i = start2; i < end2; i++) {
    if (!this.type.allowsMarks(replacement.child(i).marks)) {
      return false;
    }
  }
  return true;
};
Node.prototype.canReplaceWith = function canReplaceWith(from2, to, type, marks2) {
  if (marks2 && !this.type.allowsMarks(marks2)) {
    return false;
  }
  var start2 = this.contentMatchAt(from2).matchType(type);
  var end2 = start2 && start2.matchFragment(this.content, to);
  return end2 ? end2.validEnd : false;
};
Node.prototype.canAppend = function canAppend(other) {
  if (other.content.size) {
    return this.canReplace(this.childCount, this.childCount, other.content);
  } else {
    return this.type.compatibleContent(other.type);
  }
};
Node.prototype.check = function check() {
  if (!this.type.validContent(this.content)) {
    throw new RangeError("Invalid content for node " + this.type.name + ": " + this.content.toString().slice(0, 50));
  }
  var copy3 = Mark.none;
  for (var i = 0; i < this.marks.length; i++) {
    copy3 = this.marks[i].addToSet(copy3);
  }
  if (!Mark.sameSet(copy3, this.marks)) {
    throw new RangeError("Invalid collection of marks for node " + this.type.name + ": " + this.marks.map(function(m) {
      return m.type.name;
    }));
  }
  this.content.forEach(function(node3) {
    return node3.check();
  });
};
Node.prototype.toJSON = function toJSON4() {
  var obj = { type: this.type.name };
  for (var _ in this.attrs) {
    obj.attrs = this.attrs;
    break;
  }
  if (this.content.size) {
    obj.content = this.content.toJSON();
  }
  if (this.marks.length) {
    obj.marks = this.marks.map(function(n) {
      return n.toJSON();
    });
  }
  return obj;
};
Node.fromJSON = function fromJSON4(schema, json) {
  if (!json) {
    throw new RangeError("Invalid input for Node.fromJSON");
  }
  var marks2 = null;
  if (json.marks) {
    if (!Array.isArray(json.marks)) {
      throw new RangeError("Invalid mark data for Node.fromJSON");
    }
    marks2 = json.marks.map(schema.markFromJSON);
  }
  if (json.type == "text") {
    if (typeof json.text != "string") {
      throw new RangeError("Invalid text node in JSON");
    }
    return schema.text(json.text, marks2);
  }
  var content = Fragment.fromJSON(schema, json.content);
  return schema.nodeType(json.type).create(json.attrs, content, marks2);
};
Object.defineProperties(Node.prototype, prototypeAccessors$3);
var TextNode = /* @__PURE__ */ function(Node3) {
  function TextNode2(type, attrs, content, marks2) {
    Node3.call(this, type, attrs, null, marks2);
    if (!content) {
      throw new RangeError("Empty text nodes are not allowed");
    }
    this.text = content;
  }
  if (Node3)
    TextNode2.__proto__ = Node3;
  TextNode2.prototype = Object.create(Node3 && Node3.prototype);
  TextNode2.prototype.constructor = TextNode2;
  var prototypeAccessors$12 = { textContent: { configurable: true }, nodeSize: { configurable: true } };
  TextNode2.prototype.toString = function toString6() {
    if (this.type.spec.toDebugString) {
      return this.type.spec.toDebugString(this);
    }
    return wrapMarks(this.marks, JSON.stringify(this.text));
  };
  prototypeAccessors$12.textContent.get = function() {
    return this.text;
  };
  TextNode2.prototype.textBetween = function textBetween3(from2, to) {
    return this.text.slice(from2, to);
  };
  prototypeAccessors$12.nodeSize.get = function() {
    return this.text.length;
  };
  TextNode2.prototype.mark = function mark3(marks2) {
    return marks2 == this.marks ? this : new TextNode2(this.type, this.attrs, this.text, marks2);
  };
  TextNode2.prototype.withText = function withText(text2) {
    if (text2 == this.text) {
      return this;
    }
    return new TextNode2(this.type, this.attrs, text2, this.marks);
  };
  TextNode2.prototype.cut = function cut3(from2, to) {
    if (from2 === void 0)
      from2 = 0;
    if (to === void 0)
      to = this.text.length;
    if (from2 == 0 && to == this.text.length) {
      return this;
    }
    return this.withText(this.text.slice(from2, to));
  };
  TextNode2.prototype.eq = function eq5(other) {
    return this.sameMarkup(other) && this.text == other.text;
  };
  TextNode2.prototype.toJSON = function toJSON5() {
    var base = Node3.prototype.toJSON.call(this);
    base.text = this.text;
    return base;
  };
  Object.defineProperties(TextNode2.prototype, prototypeAccessors$12);
  return TextNode2;
}(Node);
function wrapMarks(marks2, str) {
  for (var i = marks2.length - 1; i >= 0; i--) {
    str = marks2[i].type.name + "(" + str + ")";
  }
  return str;
}
var ContentMatch = function ContentMatch2(validEnd) {
  this.validEnd = validEnd;
  this.next = [];
  this.wrapCache = [];
};
var prototypeAccessors$4 = { inlineContent: { configurable: true }, defaultType: { configurable: true }, edgeCount: { configurable: true } };
ContentMatch.parse = function parse(string, nodeTypes) {
  var stream = new TokenStream(string, nodeTypes);
  if (stream.next == null) {
    return ContentMatch.empty;
  }
  var expr = parseExpr(stream);
  if (stream.next) {
    stream.err("Unexpected trailing text");
  }
  var match = dfa(nfa(expr));
  checkForDeadEnds(match, stream);
  return match;
};
ContentMatch.prototype.matchType = function matchType(type) {
  for (var i = 0; i < this.next.length; i += 2) {
    if (this.next[i] == type) {
      return this.next[i + 1];
    }
  }
  return null;
};
ContentMatch.prototype.matchFragment = function matchFragment(frag, start2, end2) {
  if (start2 === void 0)
    start2 = 0;
  if (end2 === void 0)
    end2 = frag.childCount;
  var cur = this;
  for (var i = start2; cur && i < end2; i++) {
    cur = cur.matchType(frag.child(i).type);
  }
  return cur;
};
prototypeAccessors$4.inlineContent.get = function() {
  var first = this.next[0];
  return first ? first.isInline : false;
};
prototypeAccessors$4.defaultType.get = function() {
  for (var i = 0; i < this.next.length; i += 2) {
    var type = this.next[i];
    if (!(type.isText || type.hasRequiredAttrs())) {
      return type;
    }
  }
};
ContentMatch.prototype.compatible = function compatible(other) {
  for (var i = 0; i < this.next.length; i += 2) {
    for (var j = 0; j < other.next.length; j += 2) {
      if (this.next[i] == other.next[j]) {
        return true;
      }
    }
  }
  return false;
};
ContentMatch.prototype.fillBefore = function fillBefore(after2, toEnd, startIndex) {
  if (toEnd === void 0)
    toEnd = false;
  if (startIndex === void 0)
    startIndex = 0;
  var seen = [this];
  function search(match, types) {
    var finished = match.matchFragment(after2, startIndex);
    if (finished && (!toEnd || finished.validEnd)) {
      return Fragment.from(types.map(function(tp) {
        return tp.createAndFill();
      }));
    }
    for (var i = 0; i < match.next.length; i += 2) {
      var type = match.next[i], next = match.next[i + 1];
      if (!(type.isText || type.hasRequiredAttrs()) && seen.indexOf(next) == -1) {
        seen.push(next);
        var found2 = search(next, types.concat(type));
        if (found2) {
          return found2;
        }
      }
    }
  }
  return search(this, []);
};
ContentMatch.prototype.findWrapping = function findWrapping(target) {
  for (var i = 0; i < this.wrapCache.length; i += 2) {
    if (this.wrapCache[i] == target) {
      return this.wrapCache[i + 1];
    }
  }
  var computed = this.computeWrapping(target);
  this.wrapCache.push(target, computed);
  return computed;
};
ContentMatch.prototype.computeWrapping = function computeWrapping(target) {
  var seen = /* @__PURE__ */ Object.create(null), active = [{ match: this, type: null, via: null }];
  while (active.length) {
    var current = active.shift(), match = current.match;
    if (match.matchType(target)) {
      var result = [];
      for (var obj = current; obj.type; obj = obj.via) {
        result.push(obj.type);
      }
      return result.reverse();
    }
    for (var i = 0; i < match.next.length; i += 2) {
      var type = match.next[i];
      if (!type.isLeaf && !type.hasRequiredAttrs() && !(type.name in seen) && (!current.type || match.next[i + 1].validEnd)) {
        active.push({ match: type.contentMatch, type, via: current });
        seen[type.name] = true;
      }
    }
  }
};
prototypeAccessors$4.edgeCount.get = function() {
  return this.next.length >> 1;
};
ContentMatch.prototype.edge = function edge(n) {
  var i = n << 1;
  if (i >= this.next.length) {
    throw new RangeError("There's no " + n + "th edge in this content match");
  }
  return { type: this.next[i], next: this.next[i + 1] };
};
ContentMatch.prototype.toString = function toString5() {
  var seen = [];
  function scan(m) {
    seen.push(m);
    for (var i = 1; i < m.next.length; i += 2) {
      if (seen.indexOf(m.next[i]) == -1) {
        scan(m.next[i]);
      }
    }
  }
  scan(this);
  return seen.map(function(m, i) {
    var out = i + (m.validEnd ? "*" : " ") + " ";
    for (var i$1 = 0; i$1 < m.next.length; i$1 += 2) {
      out += (i$1 ? ", " : "") + m.next[i$1].name + "->" + seen.indexOf(m.next[i$1 + 1]);
    }
    return out;
  }).join("\n");
};
Object.defineProperties(ContentMatch.prototype, prototypeAccessors$4);
ContentMatch.empty = new ContentMatch(true);
var TokenStream = function TokenStream2(string, nodeTypes) {
  this.string = string;
  this.nodeTypes = nodeTypes;
  this.inline = null;
  this.pos = 0;
  this.tokens = string.split(/\s*(?=\b|\W|$)/);
  if (this.tokens[this.tokens.length - 1] == "") {
    this.tokens.pop();
  }
  if (this.tokens[0] == "") {
    this.tokens.shift();
  }
};
var prototypeAccessors$1$2 = { next: { configurable: true } };
prototypeAccessors$1$2.next.get = function() {
  return this.tokens[this.pos];
};
TokenStream.prototype.eat = function eat(tok) {
  return this.next == tok && (this.pos++ || true);
};
TokenStream.prototype.err = function err(str) {
  throw new SyntaxError(str + " (in content expression '" + this.string + "')");
};
Object.defineProperties(TokenStream.prototype, prototypeAccessors$1$2);
function parseExpr(stream) {
  var exprs = [];
  do {
    exprs.push(parseExprSeq(stream));
  } while (stream.eat("|"));
  return exprs.length == 1 ? exprs[0] : { type: "choice", exprs };
}
function parseExprSeq(stream) {
  var exprs = [];
  do {
    exprs.push(parseExprSubscript(stream));
  } while (stream.next && stream.next != ")" && stream.next != "|");
  return exprs.length == 1 ? exprs[0] : { type: "seq", exprs };
}
function parseExprSubscript(stream) {
  var expr = parseExprAtom(stream);
  for (; ; ) {
    if (stream.eat("+")) {
      expr = { type: "plus", expr };
    } else if (stream.eat("*")) {
      expr = { type: "star", expr };
    } else if (stream.eat("?")) {
      expr = { type: "opt", expr };
    } else if (stream.eat("{")) {
      expr = parseExprRange(stream, expr);
    } else {
      break;
    }
  }
  return expr;
}
function parseNum(stream) {
  if (/\D/.test(stream.next)) {
    stream.err("Expected number, got '" + stream.next + "'");
  }
  var result = Number(stream.next);
  stream.pos++;
  return result;
}
function parseExprRange(stream, expr) {
  var min2 = parseNum(stream), max2 = min2;
  if (stream.eat(",")) {
    if (stream.next != "}") {
      max2 = parseNum(stream);
    } else {
      max2 = -1;
    }
  }
  if (!stream.eat("}")) {
    stream.err("Unclosed braced range");
  }
  return { type: "range", min: min2, max: max2, expr };
}
function resolveName(stream, name) {
  var types = stream.nodeTypes, type = types[name];
  if (type) {
    return [type];
  }
  var result = [];
  for (var typeName in types) {
    var type$1 = types[typeName];
    if (type$1.groups.indexOf(name) > -1) {
      result.push(type$1);
    }
  }
  if (result.length == 0) {
    stream.err("No node type or group '" + name + "' found");
  }
  return result;
}
function parseExprAtom(stream) {
  if (stream.eat("(")) {
    var expr = parseExpr(stream);
    if (!stream.eat(")")) {
      stream.err("Missing closing paren");
    }
    return expr;
  } else if (!/\W/.test(stream.next)) {
    var exprs = resolveName(stream, stream.next).map(function(type) {
      if (stream.inline == null) {
        stream.inline = type.isInline;
      } else if (stream.inline != type.isInline) {
        stream.err("Mixing inline and block content");
      }
      return { type: "name", value: type };
    });
    stream.pos++;
    return exprs.length == 1 ? exprs[0] : { type: "choice", exprs };
  } else {
    stream.err("Unexpected token '" + stream.next + "'");
  }
}
function nfa(expr) {
  var nfa2 = [[]];
  connect(compile3(expr, 0), node3());
  return nfa2;
  function node3() {
    return nfa2.push([]) - 1;
  }
  function edge2(from2, to, term) {
    var edge3 = { term, to };
    nfa2[from2].push(edge3);
    return edge3;
  }
  function connect(edges, to) {
    edges.forEach(function(edge3) {
      return edge3.to = to;
    });
  }
  function compile3(expr2, from2) {
    if (expr2.type == "choice") {
      return expr2.exprs.reduce(function(out, expr3) {
        return out.concat(compile3(expr3, from2));
      }, []);
    } else if (expr2.type == "seq") {
      for (var i = 0; ; i++) {
        var next = compile3(expr2.exprs[i], from2);
        if (i == expr2.exprs.length - 1) {
          return next;
        }
        connect(next, from2 = node3());
      }
    } else if (expr2.type == "star") {
      var loop = node3();
      edge2(from2, loop);
      connect(compile3(expr2.expr, loop), loop);
      return [edge2(loop)];
    } else if (expr2.type == "plus") {
      var loop$1 = node3();
      connect(compile3(expr2.expr, from2), loop$1);
      connect(compile3(expr2.expr, loop$1), loop$1);
      return [edge2(loop$1)];
    } else if (expr2.type == "opt") {
      return [edge2(from2)].concat(compile3(expr2.expr, from2));
    } else if (expr2.type == "range") {
      var cur = from2;
      for (var i$1 = 0; i$1 < expr2.min; i$1++) {
        var next$1 = node3();
        connect(compile3(expr2.expr, cur), next$1);
        cur = next$1;
      }
      if (expr2.max == -1) {
        connect(compile3(expr2.expr, cur), cur);
      } else {
        for (var i$2 = expr2.min; i$2 < expr2.max; i$2++) {
          var next$2 = node3();
          edge2(cur, next$2);
          connect(compile3(expr2.expr, cur), next$2);
          cur = next$2;
        }
      }
      return [edge2(cur)];
    } else if (expr2.type == "name") {
      return [edge2(from2, null, expr2.value)];
    }
  }
}
function cmp(a, b) {
  return b - a;
}
function nullFrom(nfa2, node3) {
  var result = [];
  scan(node3);
  return result.sort(cmp);
  function scan(node4) {
    var edges = nfa2[node4];
    if (edges.length == 1 && !edges[0].term) {
      return scan(edges[0].to);
    }
    result.push(node4);
    for (var i = 0; i < edges.length; i++) {
      var ref = edges[i];
      var term = ref.term;
      var to = ref.to;
      if (!term && result.indexOf(to) == -1) {
        scan(to);
      }
    }
  }
}
function dfa(nfa2) {
  var labeled = /* @__PURE__ */ Object.create(null);
  return explore(nullFrom(nfa2, 0));
  function explore(states) {
    var out = [];
    states.forEach(function(node3) {
      nfa2[node3].forEach(function(ref) {
        var term = ref.term;
        var to = ref.to;
        if (!term) {
          return;
        }
        var known = out.indexOf(term), set = known > -1 && out[known + 1];
        nullFrom(nfa2, to).forEach(function(node4) {
          if (!set) {
            out.push(term, set = []);
          }
          if (set.indexOf(node4) == -1) {
            set.push(node4);
          }
        });
      });
    });
    var state = labeled[states.join(",")] = new ContentMatch(states.indexOf(nfa2.length - 1) > -1);
    for (var i = 0; i < out.length; i += 2) {
      var states$1 = out[i + 1].sort(cmp);
      state.next.push(out[i], labeled[states$1.join(",")] || explore(states$1));
    }
    return state;
  }
}
function checkForDeadEnds(match, stream) {
  for (var i = 0, work = [match]; i < work.length; i++) {
    var state = work[i], dead = !state.validEnd, nodes = [];
    for (var j = 0; j < state.next.length; j += 2) {
      var node3 = state.next[j], next = state.next[j + 1];
      nodes.push(node3.name);
      if (dead && !(node3.isText || node3.hasRequiredAttrs())) {
        dead = false;
      }
      if (work.indexOf(next) == -1) {
        work.push(next);
      }
    }
    if (dead) {
      stream.err("Only non-generatable nodes (" + nodes.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
    }
  }
}
function defaultAttrs(attrs) {
  var defaults = /* @__PURE__ */ Object.create(null);
  for (var attrName in attrs) {
    var attr = attrs[attrName];
    if (!attr.hasDefault) {
      return null;
    }
    defaults[attrName] = attr.default;
  }
  return defaults;
}
function computeAttrs(attrs, value) {
  var built = /* @__PURE__ */ Object.create(null);
  for (var name in attrs) {
    var given = value && value[name];
    if (given === void 0) {
      var attr = attrs[name];
      if (attr.hasDefault) {
        given = attr.default;
      } else {
        throw new RangeError("No value supplied for attribute " + name);
      }
    }
    built[name] = given;
  }
  return built;
}
function initAttrs(attrs) {
  var result = /* @__PURE__ */ Object.create(null);
  if (attrs) {
    for (var name in attrs) {
      result[name] = new Attribute(attrs[name]);
    }
  }
  return result;
}
var NodeType = function NodeType2(name, schema, spec) {
  this.name = name;
  this.schema = schema;
  this.spec = spec;
  this.groups = spec.group ? spec.group.split(" ") : [];
  this.attrs = initAttrs(spec.attrs);
  this.defaultAttrs = defaultAttrs(this.attrs);
  this.contentMatch = null;
  this.markSet = null;
  this.inlineContent = null;
  this.isBlock = !(spec.inline || name == "text");
  this.isText = name == "text";
};
var prototypeAccessors$5 = { isInline: { configurable: true }, isTextblock: { configurable: true }, isLeaf: { configurable: true }, isAtom: { configurable: true }, whitespace: { configurable: true } };
prototypeAccessors$5.isInline.get = function() {
  return !this.isBlock;
};
prototypeAccessors$5.isTextblock.get = function() {
  return this.isBlock && this.inlineContent;
};
prototypeAccessors$5.isLeaf.get = function() {
  return this.contentMatch == ContentMatch.empty;
};
prototypeAccessors$5.isAtom.get = function() {
  return this.isLeaf || this.spec.atom;
};
prototypeAccessors$5.whitespace.get = function() {
  return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
};
NodeType.prototype.hasRequiredAttrs = function hasRequiredAttrs() {
  for (var n in this.attrs) {
    if (this.attrs[n].isRequired) {
      return true;
    }
  }
  return false;
};
NodeType.prototype.compatibleContent = function compatibleContent(other) {
  return this == other || this.contentMatch.compatible(other.contentMatch);
};
NodeType.prototype.computeAttrs = function computeAttrs$1(attrs) {
  if (!attrs && this.defaultAttrs) {
    return this.defaultAttrs;
  } else {
    return computeAttrs(this.attrs, attrs);
  }
};
NodeType.prototype.create = function create(attrs, content, marks2) {
  if (this.isText) {
    throw new Error("NodeType.create can't construct text nodes");
  }
  return new Node(this, this.computeAttrs(attrs), Fragment.from(content), Mark.setFrom(marks2));
};
NodeType.prototype.createChecked = function createChecked(attrs, content, marks2) {
  content = Fragment.from(content);
  if (!this.validContent(content)) {
    throw new RangeError("Invalid content for node " + this.name);
  }
  return new Node(this, this.computeAttrs(attrs), content, Mark.setFrom(marks2));
};
NodeType.prototype.createAndFill = function createAndFill(attrs, content, marks2) {
  attrs = this.computeAttrs(attrs);
  content = Fragment.from(content);
  if (content.size) {
    var before2 = this.contentMatch.fillBefore(content);
    if (!before2) {
      return null;
    }
    content = before2.append(content);
  }
  var after2 = this.contentMatch.matchFragment(content).fillBefore(Fragment.empty, true);
  if (!after2) {
    return null;
  }
  return new Node(this, attrs, content.append(after2), Mark.setFrom(marks2));
};
NodeType.prototype.validContent = function validContent(content) {
  var result = this.contentMatch.matchFragment(content);
  if (!result || !result.validEnd) {
    return false;
  }
  for (var i = 0; i < content.childCount; i++) {
    if (!this.allowsMarks(content.child(i).marks)) {
      return false;
    }
  }
  return true;
};
NodeType.prototype.allowsMarkType = function allowsMarkType(markType) {
  return this.markSet == null || this.markSet.indexOf(markType) > -1;
};
NodeType.prototype.allowsMarks = function allowsMarks(marks2) {
  if (this.markSet == null) {
    return true;
  }
  for (var i = 0; i < marks2.length; i++) {
    if (!this.allowsMarkType(marks2[i].type)) {
      return false;
    }
  }
  return true;
};
NodeType.prototype.allowedMarks = function allowedMarks(marks2) {
  if (this.markSet == null) {
    return marks2;
  }
  var copy3;
  for (var i = 0; i < marks2.length; i++) {
    if (!this.allowsMarkType(marks2[i].type)) {
      if (!copy3) {
        copy3 = marks2.slice(0, i);
      }
    } else if (copy3) {
      copy3.push(marks2[i]);
    }
  }
  return !copy3 ? marks2 : copy3.length ? copy3 : Mark.empty;
};
NodeType.compile = function compile(nodes, schema) {
  var result = /* @__PURE__ */ Object.create(null);
  nodes.forEach(function(name, spec) {
    return result[name] = new NodeType(name, schema, spec);
  });
  var topType = schema.spec.topNode || "doc";
  if (!result[topType]) {
    throw new RangeError("Schema is missing its top node type ('" + topType + "')");
  }
  if (!result.text) {
    throw new RangeError("Every schema needs a 'text' type");
  }
  for (var _ in result.text.attrs) {
    throw new RangeError("The text node type should not have attributes");
  }
  return result;
};
Object.defineProperties(NodeType.prototype, prototypeAccessors$5);
var Attribute = function Attribute2(options) {
  this.hasDefault = Object.prototype.hasOwnProperty.call(options, "default");
  this.default = options.default;
};
var prototypeAccessors$1$3 = { isRequired: { configurable: true } };
prototypeAccessors$1$3.isRequired.get = function() {
  return !this.hasDefault;
};
Object.defineProperties(Attribute.prototype, prototypeAccessors$1$3);
var MarkType = function MarkType2(name, rank, schema, spec) {
  this.name = name;
  this.schema = schema;
  this.spec = spec;
  this.attrs = initAttrs(spec.attrs);
  this.rank = rank;
  this.excluded = null;
  var defaults = defaultAttrs(this.attrs);
  this.instance = defaults && new Mark(this, defaults);
};
MarkType.prototype.create = function create2(attrs) {
  if (!attrs && this.instance) {
    return this.instance;
  }
  return new Mark(this, computeAttrs(this.attrs, attrs));
};
MarkType.compile = function compile2(marks2, schema) {
  var result = /* @__PURE__ */ Object.create(null), rank = 0;
  marks2.forEach(function(name, spec) {
    return result[name] = new MarkType(name, rank++, schema, spec);
  });
  return result;
};
MarkType.prototype.removeFromSet = function removeFromSet2(set) {
  for (var i = 0; i < set.length; i++) {
    if (set[i].type == this) {
      set = set.slice(0, i).concat(set.slice(i + 1));
      i--;
    }
  }
  return set;
};
MarkType.prototype.isInSet = function isInSet2(set) {
  for (var i = 0; i < set.length; i++) {
    if (set[i].type == this) {
      return set[i];
    }
  }
};
MarkType.prototype.excludes = function excludes(other) {
  return this.excluded.indexOf(other) > -1;
};
var Schema = function Schema2(spec) {
  this.spec = {};
  for (var prop in spec) {
    this.spec[prop] = spec[prop];
  }
  this.spec.nodes = index_es_default.from(spec.nodes);
  this.spec.marks = index_es_default.from(spec.marks);
  this.nodes = NodeType.compile(this.spec.nodes, this);
  this.marks = MarkType.compile(this.spec.marks, this);
  var contentExprCache = /* @__PURE__ */ Object.create(null);
  for (var prop$1 in this.nodes) {
    if (prop$1 in this.marks) {
      throw new RangeError(prop$1 + " can not be both a node and a mark");
    }
    var type = this.nodes[prop$1], contentExpr = type.spec.content || "", markExpr = type.spec.marks;
    type.contentMatch = contentExprCache[contentExpr] || (contentExprCache[contentExpr] = ContentMatch.parse(contentExpr, this.nodes));
    type.inlineContent = type.contentMatch.inlineContent;
    type.markSet = markExpr == "_" ? null : markExpr ? gatherMarks(this, markExpr.split(" ")) : markExpr == "" || !type.inlineContent ? [] : null;
  }
  for (var prop$2 in this.marks) {
    var type$1 = this.marks[prop$2], excl = type$1.spec.excludes;
    type$1.excluded = excl == null ? [type$1] : excl == "" ? [] : gatherMarks(this, excl.split(" "));
  }
  this.nodeFromJSON = this.nodeFromJSON.bind(this);
  this.markFromJSON = this.markFromJSON.bind(this);
  this.topNodeType = this.nodes[this.spec.topNode || "doc"];
  this.cached = /* @__PURE__ */ Object.create(null);
  this.cached.wrappings = /* @__PURE__ */ Object.create(null);
};
Schema.prototype.node = function node2(type, attrs, content, marks2) {
  if (typeof type == "string") {
    type = this.nodeType(type);
  } else if (!(type instanceof NodeType)) {
    throw new RangeError("Invalid node type: " + type);
  } else if (type.schema != this) {
    throw new RangeError("Node type from different schema used (" + type.name + ")");
  }
  return type.createChecked(attrs, content, marks2);
};
Schema.prototype.text = function text(text$1, marks2) {
  var type = this.nodes.text;
  return new TextNode(type, type.defaultAttrs, text$1, Mark.setFrom(marks2));
};
Schema.prototype.mark = function mark2(type, attrs) {
  if (typeof type == "string") {
    type = this.marks[type];
  }
  return type.create(attrs);
};
Schema.prototype.nodeFromJSON = function nodeFromJSON(json) {
  return Node.fromJSON(this, json);
};
Schema.prototype.markFromJSON = function markFromJSON(json) {
  return Mark.fromJSON(this, json);
};
Schema.prototype.nodeType = function nodeType(name) {
  var found2 = this.nodes[name];
  if (!found2) {
    throw new RangeError("Unknown node type: " + name);
  }
  return found2;
};
function gatherMarks(schema, marks2) {
  var found2 = [];
  for (var i = 0; i < marks2.length; i++) {
    var name = marks2[i], mark3 = schema.marks[name], ok = mark3;
    if (mark3) {
      found2.push(mark3);
    } else {
      for (var prop in schema.marks) {
        var mark$1 = schema.marks[prop];
        if (name == "_" || mark$1.spec.group && mark$1.spec.group.split(" ").indexOf(name) > -1) {
          found2.push(ok = mark$1);
        }
      }
    }
    if (!ok) {
      throw new SyntaxError("Unknown mark type: '" + marks2[i] + "'");
    }
  }
  return found2;
}
var DOMParser = function DOMParser2(schema, rules) {
  var this$1 = this;
  this.schema = schema;
  this.rules = rules;
  this.tags = [];
  this.styles = [];
  rules.forEach(function(rule) {
    if (rule.tag) {
      this$1.tags.push(rule);
    } else if (rule.style) {
      this$1.styles.push(rule);
    }
  });
  this.normalizeLists = !this.tags.some(function(r) {
    if (!/^(ul|ol)\b/.test(r.tag) || !r.node) {
      return false;
    }
    var node3 = schema.nodes[r.node];
    return node3.contentMatch.matchType(node3);
  });
};
DOMParser.prototype.parse = function parse2(dom, options) {
  if (options === void 0)
    options = {};
  var context = new ParseContext(this, options, false);
  context.addAll(dom, null, options.from, options.to);
  return context.finish();
};
DOMParser.prototype.parseSlice = function parseSlice(dom, options) {
  if (options === void 0)
    options = {};
  var context = new ParseContext(this, options, true);
  context.addAll(dom, null, options.from, options.to);
  return Slice.maxOpen(context.finish());
};
DOMParser.prototype.matchTag = function matchTag(dom, context, after2) {
  for (var i = after2 ? this.tags.indexOf(after2) + 1 : 0; i < this.tags.length; i++) {
    var rule = this.tags[i];
    if (matches(dom, rule.tag) && (rule.namespace === void 0 || dom.namespaceURI == rule.namespace) && (!rule.context || context.matchesContext(rule.context))) {
      if (rule.getAttrs) {
        var result = rule.getAttrs(dom);
        if (result === false) {
          continue;
        }
        rule.attrs = result;
      }
      return rule;
    }
  }
};
DOMParser.prototype.matchStyle = function matchStyle(prop, value, context, after2) {
  for (var i = after2 ? this.styles.indexOf(after2) + 1 : 0; i < this.styles.length; i++) {
    var rule = this.styles[i];
    if (rule.style.indexOf(prop) != 0 || rule.context && !context.matchesContext(rule.context) || rule.style.length > prop.length && (rule.style.charCodeAt(prop.length) != 61 || rule.style.slice(prop.length + 1) != value)) {
      continue;
    }
    if (rule.getAttrs) {
      var result = rule.getAttrs(value);
      if (result === false) {
        continue;
      }
      rule.attrs = result;
    }
    return rule;
  }
};
DOMParser.schemaRules = function schemaRules(schema) {
  var result = [];
  function insert(rule) {
    var priority = rule.priority == null ? 50 : rule.priority, i = 0;
    for (; i < result.length; i++) {
      var next = result[i], nextPriority = next.priority == null ? 50 : next.priority;
      if (nextPriority < priority) {
        break;
      }
    }
    result.splice(i, 0, rule);
  }
  var loop = function(name2) {
    var rules = schema.marks[name2].spec.parseDOM;
    if (rules) {
      rules.forEach(function(rule) {
        insert(rule = copy2(rule));
        rule.mark = name2;
      });
    }
  };
  for (var name in schema.marks)
    loop(name);
  var loop$1 = function(name2) {
    var rules$1 = schema.nodes[name$1].spec.parseDOM;
    if (rules$1) {
      rules$1.forEach(function(rule) {
        insert(rule = copy2(rule));
        rule.node = name$1;
      });
    }
  };
  for (var name$1 in schema.nodes)
    loop$1();
  return result;
};
DOMParser.fromSchema = function fromSchema(schema) {
  return schema.cached.domParser || (schema.cached.domParser = new DOMParser(schema, DOMParser.schemaRules(schema)));
};
var blockTags = {
  address: true,
  article: true,
  aside: true,
  blockquote: true,
  canvas: true,
  dd: true,
  div: true,
  dl: true,
  fieldset: true,
  figcaption: true,
  figure: true,
  footer: true,
  form: true,
  h1: true,
  h2: true,
  h3: true,
  h4: true,
  h5: true,
  h6: true,
  header: true,
  hgroup: true,
  hr: true,
  li: true,
  noscript: true,
  ol: true,
  output: true,
  p: true,
  pre: true,
  section: true,
  table: true,
  tfoot: true,
  ul: true
};
var ignoreTags = {
  head: true,
  noscript: true,
  object: true,
  script: true,
  style: true,
  title: true
};
var listTags = { ol: true, ul: true };
var OPT_PRESERVE_WS = 1;
var OPT_PRESERVE_WS_FULL = 2;
var OPT_OPEN_LEFT = 4;
function wsOptionsFor(type, preserveWhitespace, base) {
  if (preserveWhitespace != null) {
    return (preserveWhitespace ? OPT_PRESERVE_WS : 0) | (preserveWhitespace === "full" ? OPT_PRESERVE_WS_FULL : 0);
  }
  return type && type.whitespace == "pre" ? OPT_PRESERVE_WS | OPT_PRESERVE_WS_FULL : base & ~OPT_OPEN_LEFT;
}
var NodeContext = function NodeContext2(type, attrs, marks2, pendingMarks, solid, match, options) {
  this.type = type;
  this.attrs = attrs;
  this.solid = solid;
  this.match = match || (options & OPT_OPEN_LEFT ? null : type.contentMatch);
  this.options = options;
  this.content = [];
  this.marks = marks2;
  this.activeMarks = Mark.none;
  this.pendingMarks = pendingMarks;
  this.stashMarks = [];
};
NodeContext.prototype.findWrapping = function findWrapping2(node3) {
  if (!this.match) {
    if (!this.type) {
      return [];
    }
    var fill = this.type.contentMatch.fillBefore(Fragment.from(node3));
    if (fill) {
      this.match = this.type.contentMatch.matchFragment(fill);
    } else {
      var start2 = this.type.contentMatch, wrap;
      if (wrap = start2.findWrapping(node3.type)) {
        this.match = start2;
        return wrap;
      } else {
        return null;
      }
    }
  }
  return this.match.findWrapping(node3.type);
};
NodeContext.prototype.finish = function finish(openEnd) {
  if (!(this.options & OPT_PRESERVE_WS)) {
    var last = this.content[this.content.length - 1], m;
    if (last && last.isText && (m = /[ \t\r\n\u000c]+$/.exec(last.text))) {
      if (last.text.length == m[0].length) {
        this.content.pop();
      } else {
        this.content[this.content.length - 1] = last.withText(last.text.slice(0, last.text.length - m[0].length));
      }
    }
  }
  var content = Fragment.from(this.content);
  if (!openEnd && this.match) {
    content = content.append(this.match.fillBefore(Fragment.empty, true));
  }
  return this.type ? this.type.create(this.attrs, content, this.marks) : content;
};
NodeContext.prototype.popFromStashMark = function popFromStashMark(mark3) {
  for (var i = this.stashMarks.length - 1; i >= 0; i--) {
    if (mark3.eq(this.stashMarks[i])) {
      return this.stashMarks.splice(i, 1)[0];
    }
  }
};
NodeContext.prototype.applyPending = function applyPending(nextType) {
  for (var i = 0, pending = this.pendingMarks; i < pending.length; i++) {
    var mark3 = pending[i];
    if ((this.type ? this.type.allowsMarkType(mark3.type) : markMayApply(mark3.type, nextType)) && !mark3.isInSet(this.activeMarks)) {
      this.activeMarks = mark3.addToSet(this.activeMarks);
      this.pendingMarks = mark3.removeFromSet(this.pendingMarks);
    }
  }
};
NodeContext.prototype.inlineContext = function inlineContext(node3) {
  if (this.type) {
    return this.type.inlineContent;
  }
  if (this.content.length) {
    return this.content[0].isInline;
  }
  return node3.parentNode && !blockTags.hasOwnProperty(node3.parentNode.nodeName.toLowerCase());
};
var ParseContext = function ParseContext2(parser, options, open) {
  this.parser = parser;
  this.options = options;
  this.isOpen = open;
  var topNode = options.topNode, topContext;
  var topOptions = wsOptionsFor(null, options.preserveWhitespace, 0) | (open ? OPT_OPEN_LEFT : 0);
  if (topNode) {
    topContext = new NodeContext(topNode.type, topNode.attrs, Mark.none, Mark.none, true, options.topMatch || topNode.type.contentMatch, topOptions);
  } else if (open) {
    topContext = new NodeContext(null, null, Mark.none, Mark.none, true, null, topOptions);
  } else {
    topContext = new NodeContext(parser.schema.topNodeType, null, Mark.none, Mark.none, true, null, topOptions);
  }
  this.nodes = [topContext];
  this.open = 0;
  this.find = options.findPositions;
  this.needsBlock = false;
};
var prototypeAccessors$6 = { top: { configurable: true }, currentPos: { configurable: true } };
prototypeAccessors$6.top.get = function() {
  return this.nodes[this.open];
};
ParseContext.prototype.addDOM = function addDOM(dom) {
  if (dom.nodeType == 3) {
    this.addTextNode(dom);
  } else if (dom.nodeType == 1) {
    var style = dom.getAttribute("style");
    var marks2 = style ? this.readStyles(parseStyles(style)) : null, top = this.top;
    if (marks2 != null) {
      for (var i = 0; i < marks2.length; i++) {
        this.addPendingMark(marks2[i]);
      }
    }
    this.addElement(dom);
    if (marks2 != null) {
      for (var i$1 = 0; i$1 < marks2.length; i$1++) {
        this.removePendingMark(marks2[i$1], top);
      }
    }
  }
};
ParseContext.prototype.addTextNode = function addTextNode(dom) {
  var value = dom.nodeValue;
  var top = this.top;
  if (top.options & OPT_PRESERVE_WS_FULL || top.inlineContext(dom) || /[^ \t\r\n\u000c]/.test(value)) {
    if (!(top.options & OPT_PRESERVE_WS)) {
      value = value.replace(/[ \t\r\n\u000c]+/g, " ");
      if (/^[ \t\r\n\u000c]/.test(value) && this.open == this.nodes.length - 1) {
        var nodeBefore = top.content[top.content.length - 1];
        var domNodeBefore = dom.previousSibling;
        if (!nodeBefore || domNodeBefore && domNodeBefore.nodeName == "BR" || nodeBefore.isText && /[ \t\r\n\u000c]$/.test(nodeBefore.text)) {
          value = value.slice(1);
        }
      }
    } else if (!(top.options & OPT_PRESERVE_WS_FULL)) {
      value = value.replace(/\r?\n|\r/g, " ");
    } else {
      value = value.replace(/\r\n?/g, "\n");
    }
    if (value) {
      this.insertNode(this.parser.schema.text(value));
    }
    this.findInText(dom);
  } else {
    this.findInside(dom);
  }
};
ParseContext.prototype.addElement = function addElement(dom, matchAfter) {
  var name = dom.nodeName.toLowerCase(), ruleID;
  if (listTags.hasOwnProperty(name) && this.parser.normalizeLists) {
    normalizeList(dom);
  }
  var rule = this.options.ruleFromNode && this.options.ruleFromNode(dom) || (ruleID = this.parser.matchTag(dom, this, matchAfter));
  if (rule ? rule.ignore : ignoreTags.hasOwnProperty(name)) {
    this.findInside(dom);
    this.ignoreFallback(dom);
  } else if (!rule || rule.skip || rule.closeParent) {
    if (rule && rule.closeParent) {
      this.open = Math.max(0, this.open - 1);
    } else if (rule && rule.skip.nodeType) {
      dom = rule.skip;
    }
    var sync2, top = this.top, oldNeedsBlock = this.needsBlock;
    if (blockTags.hasOwnProperty(name)) {
      sync2 = true;
      if (!top.type) {
        this.needsBlock = true;
      }
    } else if (!dom.firstChild) {
      this.leafFallback(dom);
      return;
    }
    this.addAll(dom);
    if (sync2) {
      this.sync(top);
    }
    this.needsBlock = oldNeedsBlock;
  } else {
    this.addElementByRule(dom, rule, rule.consuming === false ? ruleID : null);
  }
};
ParseContext.prototype.leafFallback = function leafFallback(dom) {
  if (dom.nodeName == "BR" && this.top.type && this.top.type.inlineContent) {
    this.addTextNode(dom.ownerDocument.createTextNode("\n"));
  }
};
ParseContext.prototype.ignoreFallback = function ignoreFallback(dom) {
  if (dom.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent)) {
    this.findPlace(this.parser.schema.text("-"));
  }
};
ParseContext.prototype.readStyles = function readStyles(styles) {
  var marks2 = Mark.none;
  style:
    for (var i = 0; i < styles.length; i += 2) {
      for (var after2 = null; ; ) {
        var rule = this.parser.matchStyle(styles[i], styles[i + 1], this, after2);
        if (!rule) {
          continue style;
        }
        if (rule.ignore) {
          return null;
        }
        marks2 = this.parser.schema.marks[rule.mark].create(rule.attrs).addToSet(marks2);
        if (rule.consuming === false) {
          after2 = rule;
        } else {
          break;
        }
      }
    }
  return marks2;
};
ParseContext.prototype.addElementByRule = function addElementByRule(dom, rule, continueAfter) {
  var this$1 = this;
  var sync2, nodeType2, markType, mark3;
  if (rule.node) {
    nodeType2 = this.parser.schema.nodes[rule.node];
    if (!nodeType2.isLeaf) {
      sync2 = this.enter(nodeType2, rule.attrs, rule.preserveWhitespace);
    } else if (!this.insertNode(nodeType2.create(rule.attrs))) {
      this.leafFallback(dom);
    }
  } else {
    markType = this.parser.schema.marks[rule.mark];
    mark3 = markType.create(rule.attrs);
    this.addPendingMark(mark3);
  }
  var startIn = this.top;
  if (nodeType2 && nodeType2.isLeaf) {
    this.findInside(dom);
  } else if (continueAfter) {
    this.addElement(dom, continueAfter);
  } else if (rule.getContent) {
    this.findInside(dom);
    rule.getContent(dom, this.parser.schema).forEach(function(node3) {
      return this$1.insertNode(node3);
    });
  } else {
    var contentDOM = rule.contentElement;
    if (typeof contentDOM == "string") {
      contentDOM = dom.querySelector(contentDOM);
    } else if (typeof contentDOM == "function") {
      contentDOM = contentDOM(dom);
    }
    if (!contentDOM) {
      contentDOM = dom;
    }
    this.findAround(dom, contentDOM, true);
    this.addAll(contentDOM, sync2);
  }
  if (sync2) {
    this.sync(startIn);
    this.open--;
  }
  if (mark3) {
    this.removePendingMark(mark3, startIn);
  }
};
ParseContext.prototype.addAll = function addAll(parent, sync2, startIndex, endIndex) {
  var index2 = startIndex || 0;
  for (var dom = startIndex ? parent.childNodes[startIndex] : parent.firstChild, end2 = endIndex == null ? null : parent.childNodes[endIndex]; dom != end2; dom = dom.nextSibling, ++index2) {
    this.findAtPoint(parent, index2);
    this.addDOM(dom);
    if (sync2 && blockTags.hasOwnProperty(dom.nodeName.toLowerCase())) {
      this.sync(sync2);
    }
  }
  this.findAtPoint(parent, index2);
};
ParseContext.prototype.findPlace = function findPlace(node3) {
  var route, sync2;
  for (var depth = this.open; depth >= 0; depth--) {
    var cx = this.nodes[depth];
    var found2 = cx.findWrapping(node3);
    if (found2 && (!route || route.length > found2.length)) {
      route = found2;
      sync2 = cx;
      if (!found2.length) {
        break;
      }
    }
    if (cx.solid) {
      break;
    }
  }
  if (!route) {
    return false;
  }
  this.sync(sync2);
  for (var i = 0; i < route.length; i++) {
    this.enterInner(route[i], null, false);
  }
  return true;
};
ParseContext.prototype.insertNode = function insertNode(node3) {
  if (node3.isInline && this.needsBlock && !this.top.type) {
    var block = this.textblockFromContext();
    if (block) {
      this.enterInner(block);
    }
  }
  if (this.findPlace(node3)) {
    this.closeExtra();
    var top = this.top;
    top.applyPending(node3.type);
    if (top.match) {
      top.match = top.match.matchType(node3.type);
    }
    var marks2 = top.activeMarks;
    for (var i = 0; i < node3.marks.length; i++) {
      if (!top.type || top.type.allowsMarkType(node3.marks[i].type)) {
        marks2 = node3.marks[i].addToSet(marks2);
      }
    }
    top.content.push(node3.mark(marks2));
    return true;
  }
  return false;
};
ParseContext.prototype.enter = function enter(type, attrs, preserveWS) {
  var ok = this.findPlace(type.create(attrs));
  if (ok) {
    this.enterInner(type, attrs, true, preserveWS);
  }
  return ok;
};
ParseContext.prototype.enterInner = function enterInner(type, attrs, solid, preserveWS) {
  this.closeExtra();
  var top = this.top;
  top.applyPending(type);
  top.match = top.match && top.match.matchType(type, attrs);
  var options = wsOptionsFor(type, preserveWS, top.options);
  if (top.options & OPT_OPEN_LEFT && top.content.length == 0) {
    options |= OPT_OPEN_LEFT;
  }
  this.nodes.push(new NodeContext(type, attrs, top.activeMarks, top.pendingMarks, solid, null, options));
  this.open++;
};
ParseContext.prototype.closeExtra = function closeExtra(openEnd) {
  var i = this.nodes.length - 1;
  if (i > this.open) {
    for (; i > this.open; i--) {
      this.nodes[i - 1].content.push(this.nodes[i].finish(openEnd));
    }
    this.nodes.length = this.open + 1;
  }
};
ParseContext.prototype.finish = function finish2() {
  this.open = 0;
  this.closeExtra(this.isOpen);
  return this.nodes[0].finish(this.isOpen || this.options.topOpen);
};
ParseContext.prototype.sync = function sync(to) {
  for (var i = this.open; i >= 0; i--) {
    if (this.nodes[i] == to) {
      this.open = i;
      return;
    }
  }
};
prototypeAccessors$6.currentPos.get = function() {
  this.closeExtra();
  var pos = 0;
  for (var i = this.open; i >= 0; i--) {
    var content = this.nodes[i].content;
    for (var j = content.length - 1; j >= 0; j--) {
      pos += content[j].nodeSize;
    }
    if (i) {
      pos++;
    }
  }
  return pos;
};
ParseContext.prototype.findAtPoint = function findAtPoint(parent, offset) {
  if (this.find) {
    for (var i = 0; i < this.find.length; i++) {
      if (this.find[i].node == parent && this.find[i].offset == offset) {
        this.find[i].pos = this.currentPos;
      }
    }
  }
};
ParseContext.prototype.findInside = function findInside(parent) {
  if (this.find) {
    for (var i = 0; i < this.find.length; i++) {
      if (this.find[i].pos == null && parent.nodeType == 1 && parent.contains(this.find[i].node)) {
        this.find[i].pos = this.currentPos;
      }
    }
  }
};
ParseContext.prototype.findAround = function findAround(parent, content, before2) {
  if (parent != content && this.find) {
    for (var i = 0; i < this.find.length; i++) {
      if (this.find[i].pos == null && parent.nodeType == 1 && parent.contains(this.find[i].node)) {
        var pos = content.compareDocumentPosition(this.find[i].node);
        if (pos & (before2 ? 2 : 4)) {
          this.find[i].pos = this.currentPos;
        }
      }
    }
  }
};
ParseContext.prototype.findInText = function findInText(textNode) {
  if (this.find) {
    for (var i = 0; i < this.find.length; i++) {
      if (this.find[i].node == textNode) {
        this.find[i].pos = this.currentPos - (textNode.nodeValue.length - this.find[i].offset);
      }
    }
  }
};
ParseContext.prototype.matchesContext = function matchesContext(context) {
  var this$1 = this;
  if (context.indexOf("|") > -1) {
    return context.split(/\s*\|\s*/).some(this.matchesContext, this);
  }
  var parts = context.split("/");
  var option = this.options.context;
  var useRoot = !this.isOpen && (!option || option.parent.type == this.nodes[0].type);
  var minDepth = -(option ? option.depth + 1 : 0) + (useRoot ? 0 : 1);
  var match = function(i, depth) {
    for (; i >= 0; i--) {
      var part = parts[i];
      if (part == "") {
        if (i == parts.length - 1 || i == 0) {
          continue;
        }
        for (; depth >= minDepth; depth--) {
          if (match(i - 1, depth)) {
            return true;
          }
        }
        return false;
      } else {
        var next = depth > 0 || depth == 0 && useRoot ? this$1.nodes[depth].type : option && depth >= minDepth ? option.node(depth - minDepth).type : null;
        if (!next || next.name != part && next.groups.indexOf(part) == -1) {
          return false;
        }
        depth--;
      }
    }
    return true;
  };
  return match(parts.length - 1, this.open);
};
ParseContext.prototype.textblockFromContext = function textblockFromContext() {
  var $context = this.options.context;
  if ($context) {
    for (var d = $context.depth; d >= 0; d--) {
      var deflt = $context.node(d).contentMatchAt($context.indexAfter(d)).defaultType;
      if (deflt && deflt.isTextblock && deflt.defaultAttrs) {
        return deflt;
      }
    }
  }
  for (var name in this.parser.schema.nodes) {
    var type = this.parser.schema.nodes[name];
    if (type.isTextblock && type.defaultAttrs) {
      return type;
    }
  }
};
ParseContext.prototype.addPendingMark = function addPendingMark(mark3) {
  var found2 = findSameMarkInSet(mark3, this.top.pendingMarks);
  if (found2) {
    this.top.stashMarks.push(found2);
  }
  this.top.pendingMarks = mark3.addToSet(this.top.pendingMarks);
};
ParseContext.prototype.removePendingMark = function removePendingMark(mark3, upto) {
  for (var depth = this.open; depth >= 0; depth--) {
    var level = this.nodes[depth];
    var found2 = level.pendingMarks.lastIndexOf(mark3);
    if (found2 > -1) {
      level.pendingMarks = mark3.removeFromSet(level.pendingMarks);
    } else {
      level.activeMarks = mark3.removeFromSet(level.activeMarks);
      var stashMark = level.popFromStashMark(mark3);
      if (stashMark && level.type && level.type.allowsMarkType(stashMark.type)) {
        level.activeMarks = stashMark.addToSet(level.activeMarks);
      }
    }
    if (level == upto) {
      break;
    }
  }
};
Object.defineProperties(ParseContext.prototype, prototypeAccessors$6);
function normalizeList(dom) {
  for (var child3 = dom.firstChild, prevItem = null; child3; child3 = child3.nextSibling) {
    var name = child3.nodeType == 1 ? child3.nodeName.toLowerCase() : null;
    if (name && listTags.hasOwnProperty(name) && prevItem) {
      prevItem.appendChild(child3);
      child3 = prevItem;
    } else if (name == "li") {
      prevItem = child3;
    } else if (name) {
      prevItem = null;
    }
  }
}
function matches(dom, selector) {
  return (dom.matches || dom.msMatchesSelector || dom.webkitMatchesSelector || dom.mozMatchesSelector).call(dom, selector);
}
function parseStyles(style) {
  var re = /\s*([\w-]+)\s*:\s*([^;]+)/g, m, result = [];
  while (m = re.exec(style)) {
    result.push(m[1], m[2].trim());
  }
  return result;
}
function copy2(obj) {
  var copy3 = {};
  for (var prop in obj) {
    copy3[prop] = obj[prop];
  }
  return copy3;
}
function markMayApply(markType, nodeType2) {
  var nodes = nodeType2.schema.nodes;
  var loop = function(name2) {
    var parent = nodes[name2];
    if (!parent.allowsMarkType(markType)) {
      return;
    }
    var seen = [], scan = function(match) {
      seen.push(match);
      for (var i = 0; i < match.edgeCount; i++) {
        var ref = match.edge(i);
        var type = ref.type;
        var next = ref.next;
        if (type == nodeType2) {
          return true;
        }
        if (seen.indexOf(next) < 0 && scan(next)) {
          return true;
        }
      }
    };
    if (scan(parent.contentMatch)) {
      return { v: true };
    }
  };
  for (var name in nodes) {
    var returned = loop(name);
    if (returned)
      return returned.v;
  }
}
function findSameMarkInSet(mark3, set) {
  for (var i = 0; i < set.length; i++) {
    if (mark3.eq(set[i])) {
      return set[i];
    }
  }
}
var DOMSerializer = function DOMSerializer2(nodes, marks2) {
  this.nodes = nodes || {};
  this.marks = marks2 || {};
};
DOMSerializer.prototype.serializeFragment = function serializeFragment(fragment, options, target) {
  var this$1 = this;
  if (options === void 0)
    options = {};
  if (!target) {
    target = doc(options).createDocumentFragment();
  }
  var top = target, active = null;
  fragment.forEach(function(node3) {
    if (active || node3.marks.length) {
      if (!active) {
        active = [];
      }
      var keep = 0, rendered = 0;
      while (keep < active.length && rendered < node3.marks.length) {
        var next = node3.marks[rendered];
        if (!this$1.marks[next.type.name]) {
          rendered++;
          continue;
        }
        if (!next.eq(active[keep]) || next.type.spec.spanning === false) {
          break;
        }
        keep += 2;
        rendered++;
      }
      while (keep < active.length) {
        top = active.pop();
        active.pop();
      }
      while (rendered < node3.marks.length) {
        var add = node3.marks[rendered++];
        var markDOM = this$1.serializeMark(add, node3.isInline, options);
        if (markDOM) {
          active.push(add, top);
          top.appendChild(markDOM.dom);
          top = markDOM.contentDOM || markDOM.dom;
        }
      }
    }
    top.appendChild(this$1.serializeNodeInner(node3, options));
  });
  return target;
};
DOMSerializer.prototype.serializeNodeInner = function serializeNodeInner(node3, options) {
  if (options === void 0)
    options = {};
  var ref = DOMSerializer.renderSpec(doc(options), this.nodes[node3.type.name](node3));
  var dom = ref.dom;
  var contentDOM = ref.contentDOM;
  if (contentDOM) {
    if (node3.isLeaf) {
      throw new RangeError("Content hole not allowed in a leaf node spec");
    }
    if (options.onContent) {
      options.onContent(node3, contentDOM, options);
    } else {
      this.serializeFragment(node3.content, options, contentDOM);
    }
  }
  return dom;
};
DOMSerializer.prototype.serializeNode = function serializeNode(node3, options) {
  if (options === void 0)
    options = {};
  var dom = this.serializeNodeInner(node3, options);
  for (var i = node3.marks.length - 1; i >= 0; i--) {
    var wrap = this.serializeMark(node3.marks[i], node3.isInline, options);
    if (wrap) {
      (wrap.contentDOM || wrap.dom).appendChild(dom);
      dom = wrap.dom;
    }
  }
  return dom;
};
DOMSerializer.prototype.serializeMark = function serializeMark(mark3, inline, options) {
  if (options === void 0)
    options = {};
  var toDOM = this.marks[mark3.type.name];
  return toDOM && DOMSerializer.renderSpec(doc(options), toDOM(mark3, inline));
};
DOMSerializer.renderSpec = function renderSpec(doc2, structure, xmlNS) {
  if (xmlNS === void 0)
    xmlNS = null;
  if (typeof structure == "string") {
    return { dom: doc2.createTextNode(structure) };
  }
  if (structure.nodeType != null) {
    return { dom: structure };
  }
  if (structure.dom && structure.dom.nodeType != null) {
    return structure;
  }
  var tagName = structure[0], space = tagName.indexOf(" ");
  if (space > 0) {
    xmlNS = tagName.slice(0, space);
    tagName = tagName.slice(space + 1);
  }
  var contentDOM = null, dom = xmlNS ? doc2.createElementNS(xmlNS, tagName) : doc2.createElement(tagName);
  var attrs = structure[1], start2 = 1;
  if (attrs && typeof attrs == "object" && attrs.nodeType == null && !Array.isArray(attrs)) {
    start2 = 2;
    for (var name in attrs) {
      if (attrs[name] != null) {
        var space$1 = name.indexOf(" ");
        if (space$1 > 0) {
          dom.setAttributeNS(name.slice(0, space$1), name.slice(space$1 + 1), attrs[name]);
        } else {
          dom.setAttribute(name, attrs[name]);
        }
      }
    }
  }
  for (var i = start2; i < structure.length; i++) {
    var child3 = structure[i];
    if (child3 === 0) {
      if (i < structure.length - 1 || i > start2) {
        throw new RangeError("Content hole must be the only child of its parent node");
      }
      return { dom, contentDOM: dom };
    } else {
      var ref = DOMSerializer.renderSpec(doc2, child3, xmlNS);
      var inner = ref.dom;
      var innerContent = ref.contentDOM;
      dom.appendChild(inner);
      if (innerContent) {
        if (contentDOM) {
          throw new RangeError("Multiple content holes");
        }
        contentDOM = innerContent;
      }
    }
  }
  return { dom, contentDOM };
};
DOMSerializer.fromSchema = function fromSchema2(schema) {
  return schema.cached.domSerializer || (schema.cached.domSerializer = new DOMSerializer(this.nodesFromSchema(schema), this.marksFromSchema(schema)));
};
DOMSerializer.nodesFromSchema = function nodesFromSchema(schema) {
  var result = gatherToDOM(schema.nodes);
  if (!result.text) {
    result.text = function(node3) {
      return node3.text;
    };
  }
  return result;
};
DOMSerializer.marksFromSchema = function marksFromSchema(schema) {
  return gatherToDOM(schema.marks);
};
function gatherToDOM(obj) {
  var result = {};
  for (var name in obj) {
    var toDOM = obj[name].spec.toDOM;
    if (toDOM) {
      result[name] = toDOM;
    }
  }
  return result;
}
function doc(options) {
  return options.document || window.document;
}

export {
  Fragment,
  Mark,
  ReplaceError,
  Slice,
  ResolvedPos,
  NodeRange,
  Node,
  ContentMatch,
  NodeType,
  MarkType,
  Schema,
  DOMParser,
  DOMSerializer
};
