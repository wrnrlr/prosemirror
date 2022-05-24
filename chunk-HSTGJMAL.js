import {
  Fragment,
  MarkType,
  ReplaceError,
  Slice
} from "./chunk-O5MLGE4X.js";

// node_modules/prosemirror-transform/dist/index.es.js
var lower16 = 65535;
var factor16 = Math.pow(2, 16);
function makeRecover(index, offset2) {
  return index + offset2 * factor16;
}
function recoverIndex(value) {
  return value & lower16;
}
function recoverOffset(value) {
  return (value - (value & lower16)) / factor16;
}
var MapResult = function MapResult2(pos, deleted, recover2) {
  if (deleted === void 0)
    deleted = false;
  if (recover2 === void 0)
    recover2 = null;
  this.pos = pos;
  this.deleted = deleted;
  this.recover = recover2;
};
var StepMap = function StepMap2(ranges, inverted) {
  if (inverted === void 0)
    inverted = false;
  if (!ranges.length && StepMap2.empty) {
    return StepMap2.empty;
  }
  this.ranges = ranges;
  this.inverted = inverted;
};
StepMap.prototype.recover = function recover(value) {
  var diff = 0, index = recoverIndex(value);
  if (!this.inverted) {
    for (var i = 0; i < index; i++) {
      diff += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    }
  }
  return this.ranges[index * 3] + diff + recoverOffset(value);
};
StepMap.prototype.mapResult = function mapResult(pos, assoc) {
  if (assoc === void 0)
    assoc = 1;
  return this._map(pos, assoc, false);
};
StepMap.prototype.map = function map(pos, assoc) {
  if (assoc === void 0)
    assoc = 1;
  return this._map(pos, assoc, true);
};
StepMap.prototype._map = function _map(pos, assoc, simple) {
  var diff = 0, oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
  for (var i = 0; i < this.ranges.length; i += 3) {
    var start = this.ranges[i] - (this.inverted ? diff : 0);
    if (start > pos) {
      break;
    }
    var oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex], end = start + oldSize;
    if (pos <= end) {
      var side = !oldSize ? assoc : pos == start ? -1 : pos == end ? 1 : assoc;
      var result = start + diff + (side < 0 ? 0 : newSize);
      if (simple) {
        return result;
      }
      var recover2 = pos == (assoc < 0 ? start : end) ? null : makeRecover(i / 3, pos - start);
      return new MapResult(result, assoc < 0 ? pos != start : pos != end, recover2);
    }
    diff += newSize - oldSize;
  }
  return simple ? pos + diff : new MapResult(pos + diff);
};
StepMap.prototype.touches = function touches(pos, recover2) {
  var diff = 0, index = recoverIndex(recover2);
  var oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
  for (var i = 0; i < this.ranges.length; i += 3) {
    var start = this.ranges[i] - (this.inverted ? diff : 0);
    if (start > pos) {
      break;
    }
    var oldSize = this.ranges[i + oldIndex], end = start + oldSize;
    if (pos <= end && i == index * 3) {
      return true;
    }
    diff += this.ranges[i + newIndex] - oldSize;
  }
  return false;
};
StepMap.prototype.forEach = function forEach(f) {
  var oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
  for (var i = 0, diff = 0; i < this.ranges.length; i += 3) {
    var start = this.ranges[i], oldStart = start - (this.inverted ? diff : 0), newStart = start + (this.inverted ? 0 : diff);
    var oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex];
    f(oldStart, oldStart + oldSize, newStart, newStart + newSize);
    diff += newSize - oldSize;
  }
};
StepMap.prototype.invert = function invert() {
  return new StepMap(this.ranges, !this.inverted);
};
StepMap.prototype.toString = function toString() {
  return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
};
StepMap.offset = function offset(n) {
  return n == 0 ? StepMap.empty : new StepMap(n < 0 ? [0, -n, 0] : [0, 0, n]);
};
StepMap.empty = new StepMap([]);
var Mapping = function Mapping2(maps, mirror, from, to) {
  this.maps = maps || [];
  this.from = from || 0;
  this.to = to == null ? this.maps.length : to;
  this.mirror = mirror;
};
Mapping.prototype.slice = function slice(from, to) {
  if (from === void 0)
    from = 0;
  if (to === void 0)
    to = this.maps.length;
  return new Mapping(this.maps, this.mirror, from, to);
};
Mapping.prototype.copy = function copy() {
  return new Mapping(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
};
Mapping.prototype.appendMap = function appendMap(map4, mirrors) {
  this.to = this.maps.push(map4);
  if (mirrors != null) {
    this.setMirror(this.maps.length - 1, mirrors);
  }
};
Mapping.prototype.appendMapping = function appendMapping(mapping) {
  for (var i = 0, startSize = this.maps.length; i < mapping.maps.length; i++) {
    var mirr = mapping.getMirror(i);
    this.appendMap(mapping.maps[i], mirr != null && mirr < i ? startSize + mirr : null);
  }
};
Mapping.prototype.getMirror = function getMirror(n) {
  if (this.mirror) {
    for (var i = 0; i < this.mirror.length; i++) {
      if (this.mirror[i] == n) {
        return this.mirror[i + (i % 2 ? -1 : 1)];
      }
    }
  }
};
Mapping.prototype.setMirror = function setMirror(n, m) {
  if (!this.mirror) {
    this.mirror = [];
  }
  this.mirror.push(n, m);
};
Mapping.prototype.appendMappingInverted = function appendMappingInverted(mapping) {
  for (var i = mapping.maps.length - 1, totalSize = this.maps.length + mapping.maps.length; i >= 0; i--) {
    var mirr = mapping.getMirror(i);
    this.appendMap(mapping.maps[i].invert(), mirr != null && mirr > i ? totalSize - mirr - 1 : null);
  }
};
Mapping.prototype.invert = function invert2() {
  var inverse = new Mapping();
  inverse.appendMappingInverted(this);
  return inverse;
};
Mapping.prototype.map = function map2(pos, assoc) {
  if (assoc === void 0)
    assoc = 1;
  if (this.mirror) {
    return this._map(pos, assoc, true);
  }
  for (var i = this.from; i < this.to; i++) {
    pos = this.maps[i].map(pos, assoc);
  }
  return pos;
};
Mapping.prototype.mapResult = function mapResult2(pos, assoc) {
  if (assoc === void 0)
    assoc = 1;
  return this._map(pos, assoc, false);
};
Mapping.prototype._map = function _map2(pos, assoc, simple) {
  var deleted = false;
  for (var i = this.from; i < this.to; i++) {
    var map4 = this.maps[i], result = map4.mapResult(pos, assoc);
    if (result.recover != null) {
      var corr = this.getMirror(i);
      if (corr != null && corr > i && corr < this.to) {
        i = corr;
        pos = this.maps[corr].recover(result.recover);
        continue;
      }
    }
    if (result.deleted) {
      deleted = true;
    }
    pos = result.pos;
  }
  return simple ? pos : new MapResult(pos, deleted);
};
function TransformError(message) {
  var err = Error.call(this, message);
  err.__proto__ = TransformError.prototype;
  return err;
}
TransformError.prototype = Object.create(Error.prototype);
TransformError.prototype.constructor = TransformError;
TransformError.prototype.name = "TransformError";
var Transform = function Transform2(doc) {
  this.doc = doc;
  this.steps = [];
  this.docs = [];
  this.mapping = new Mapping();
};
var prototypeAccessors = { before: { configurable: true }, docChanged: { configurable: true } };
prototypeAccessors.before.get = function() {
  return this.docs.length ? this.docs[0] : this.doc;
};
Transform.prototype.step = function step(object) {
  var result = this.maybeStep(object);
  if (result.failed) {
    throw new TransformError(result.failed);
  }
  return this;
};
Transform.prototype.maybeStep = function maybeStep(step2) {
  var result = step2.apply(this.doc);
  if (!result.failed) {
    this.addStep(step2, result.doc);
  }
  return result;
};
prototypeAccessors.docChanged.get = function() {
  return this.steps.length > 0;
};
Transform.prototype.addStep = function addStep(step2, doc) {
  this.docs.push(this.doc);
  this.steps.push(step2);
  this.mapping.appendMap(step2.getMap());
  this.doc = doc;
};
Object.defineProperties(Transform.prototype, prototypeAccessors);
function mustOverride() {
  throw new Error("Override me");
}
var stepsByID = /* @__PURE__ */ Object.create(null);
var Step = function Step2() {
};
Step.prototype.apply = function apply(_doc) {
  return mustOverride();
};
Step.prototype.getMap = function getMap() {
  return StepMap.empty;
};
Step.prototype.invert = function invert3(_doc) {
  return mustOverride();
};
Step.prototype.map = function map3(_mapping) {
  return mustOverride();
};
Step.prototype.merge = function merge(_other) {
  return null;
};
Step.prototype.toJSON = function toJSON() {
  return mustOverride();
};
Step.fromJSON = function fromJSON(schema, json) {
  if (!json || !json.stepType) {
    throw new RangeError("Invalid input for Step.fromJSON");
  }
  var type = stepsByID[json.stepType];
  if (!type) {
    throw new RangeError("No step type " + json.stepType + " defined");
  }
  return type.fromJSON(schema, json);
};
Step.jsonID = function jsonID(id, stepClass) {
  if (id in stepsByID) {
    throw new RangeError("Duplicate use of step JSON ID " + id);
  }
  stepsByID[id] = stepClass;
  stepClass.prototype.jsonID = id;
  return stepClass;
};
var StepResult = function StepResult2(doc, failed) {
  this.doc = doc;
  this.failed = failed;
};
StepResult.ok = function ok(doc) {
  return new StepResult(doc, null);
};
StepResult.fail = function fail(message) {
  return new StepResult(null, message);
};
StepResult.fromReplace = function fromReplace(doc, from, to, slice2) {
  try {
    return StepResult.ok(doc.replace(from, to, slice2));
  } catch (e) {
    if (e instanceof ReplaceError) {
      return StepResult.fail(e.message);
    }
    throw e;
  }
};
var ReplaceStep = /* @__PURE__ */ function(Step3) {
  function ReplaceStep2(from, to, slice2, structure) {
    Step3.call(this);
    this.from = from;
    this.to = to;
    this.slice = slice2;
    this.structure = !!structure;
  }
  if (Step3)
    ReplaceStep2.__proto__ = Step3;
  ReplaceStep2.prototype = Object.create(Step3 && Step3.prototype);
  ReplaceStep2.prototype.constructor = ReplaceStep2;
  ReplaceStep2.prototype.apply = function apply2(doc) {
    if (this.structure && contentBetween(doc, this.from, this.to)) {
      return StepResult.fail("Structure replace would overwrite content");
    }
    return StepResult.fromReplace(doc, this.from, this.to, this.slice);
  };
  ReplaceStep2.prototype.getMap = function getMap2() {
    return new StepMap([this.from, this.to - this.from, this.slice.size]);
  };
  ReplaceStep2.prototype.invert = function invert4(doc) {
    return new ReplaceStep2(this.from, this.from + this.slice.size, doc.slice(this.from, this.to));
  };
  ReplaceStep2.prototype.map = function map4(mapping) {
    var from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
    if (from.deleted && to.deleted) {
      return null;
    }
    return new ReplaceStep2(from.pos, Math.max(from.pos, to.pos), this.slice);
  };
  ReplaceStep2.prototype.merge = function merge2(other) {
    if (!(other instanceof ReplaceStep2) || other.structure || this.structure) {
      return null;
    }
    if (this.from + this.slice.size == other.from && !this.slice.openEnd && !other.slice.openStart) {
      var slice2 = this.slice.size + other.slice.size == 0 ? Slice.empty : new Slice(this.slice.content.append(other.slice.content), this.slice.openStart, other.slice.openEnd);
      return new ReplaceStep2(this.from, this.to + (other.to - other.from), slice2, this.structure);
    } else if (other.to == this.from && !this.slice.openStart && !other.slice.openEnd) {
      var slice$1 = this.slice.size + other.slice.size == 0 ? Slice.empty : new Slice(other.slice.content.append(this.slice.content), other.slice.openStart, this.slice.openEnd);
      return new ReplaceStep2(other.from, this.to, slice$1, this.structure);
    } else {
      return null;
    }
  };
  ReplaceStep2.prototype.toJSON = function toJSON2() {
    var json = { stepType: "replace", from: this.from, to: this.to };
    if (this.slice.size) {
      json.slice = this.slice.toJSON();
    }
    if (this.structure) {
      json.structure = true;
    }
    return json;
  };
  ReplaceStep2.fromJSON = function fromJSON2(schema, json) {
    if (typeof json.from != "number" || typeof json.to != "number") {
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    }
    return new ReplaceStep2(json.from, json.to, Slice.fromJSON(schema, json.slice), !!json.structure);
  };
  return ReplaceStep2;
}(Step);
Step.jsonID("replace", ReplaceStep);
var ReplaceAroundStep = /* @__PURE__ */ function(Step3) {
  function ReplaceAroundStep2(from, to, gapFrom, gapTo, slice2, insert, structure) {
    Step3.call(this);
    this.from = from;
    this.to = to;
    this.gapFrom = gapFrom;
    this.gapTo = gapTo;
    this.slice = slice2;
    this.insert = insert;
    this.structure = !!structure;
  }
  if (Step3)
    ReplaceAroundStep2.__proto__ = Step3;
  ReplaceAroundStep2.prototype = Object.create(Step3 && Step3.prototype);
  ReplaceAroundStep2.prototype.constructor = ReplaceAroundStep2;
  ReplaceAroundStep2.prototype.apply = function apply2(doc) {
    if (this.structure && (contentBetween(doc, this.from, this.gapFrom) || contentBetween(doc, this.gapTo, this.to))) {
      return StepResult.fail("Structure gap-replace would overwrite content");
    }
    var gap = doc.slice(this.gapFrom, this.gapTo);
    if (gap.openStart || gap.openEnd) {
      return StepResult.fail("Gap is not a flat range");
    }
    var inserted = this.slice.insertAt(this.insert, gap.content);
    if (!inserted) {
      return StepResult.fail("Content does not fit in gap");
    }
    return StepResult.fromReplace(doc, this.from, this.to, inserted);
  };
  ReplaceAroundStep2.prototype.getMap = function getMap2() {
    return new StepMap([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  };
  ReplaceAroundStep2.prototype.invert = function invert4(doc) {
    var gap = this.gapTo - this.gapFrom;
    return new ReplaceAroundStep2(this.from, this.from + this.slice.size + gap, this.from + this.insert, this.from + this.insert + gap, doc.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  };
  ReplaceAroundStep2.prototype.map = function map4(mapping) {
    var from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
    var gapFrom = mapping.map(this.gapFrom, -1), gapTo = mapping.map(this.gapTo, 1);
    if (from.deleted && to.deleted || gapFrom < from.pos || gapTo > to.pos) {
      return null;
    }
    return new ReplaceAroundStep2(from.pos, to.pos, gapFrom, gapTo, this.slice, this.insert, this.structure);
  };
  ReplaceAroundStep2.prototype.toJSON = function toJSON2() {
    var json = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    if (this.slice.size) {
      json.slice = this.slice.toJSON();
    }
    if (this.structure) {
      json.structure = true;
    }
    return json;
  };
  ReplaceAroundStep2.fromJSON = function fromJSON2(schema, json) {
    if (typeof json.from != "number" || typeof json.to != "number" || typeof json.gapFrom != "number" || typeof json.gapTo != "number" || typeof json.insert != "number") {
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    }
    return new ReplaceAroundStep2(json.from, json.to, json.gapFrom, json.gapTo, Slice.fromJSON(schema, json.slice), json.insert, !!json.structure);
  };
  return ReplaceAroundStep2;
}(Step);
Step.jsonID("replaceAround", ReplaceAroundStep);
function contentBetween(doc, from, to) {
  var $from = doc.resolve(from), dist = to - from, depth = $from.depth;
  while (dist > 0 && depth > 0 && $from.indexAfter(depth) == $from.node(depth).childCount) {
    depth--;
    dist--;
  }
  if (dist > 0) {
    var next = $from.node(depth).maybeChild($from.indexAfter(depth));
    while (dist > 0) {
      if (!next || next.isLeaf) {
        return true;
      }
      next = next.firstChild;
      dist--;
    }
  }
  return false;
}
function canCut(node, start, end) {
  return (start == 0 || node.canReplace(start, node.childCount)) && (end == node.childCount || node.canReplace(0, end));
}
function liftTarget(range) {
  var parent = range.parent;
  var content = parent.content.cutByIndex(range.startIndex, range.endIndex);
  for (var depth = range.depth; ; --depth) {
    var node = range.$from.node(depth);
    var index = range.$from.index(depth), endIndex = range.$to.indexAfter(depth);
    if (depth < range.depth && node.canReplace(index, endIndex, content)) {
      return depth;
    }
    if (depth == 0 || node.type.spec.isolating || !canCut(node, index, endIndex)) {
      break;
    }
  }
}
Transform.prototype.lift = function(range, target) {
  var $from = range.$from;
  var $to = range.$to;
  var depth = range.depth;
  var gapStart = $from.before(depth + 1), gapEnd = $to.after(depth + 1);
  var start = gapStart, end = gapEnd;
  var before = Fragment.empty, openStart = 0;
  for (var d = depth, splitting = false; d > target; d--) {
    if (splitting || $from.index(d) > 0) {
      splitting = true;
      before = Fragment.from($from.node(d).copy(before));
      openStart++;
    } else {
      start--;
    }
  }
  var after = Fragment.empty, openEnd = 0;
  for (var d$1 = depth, splitting$1 = false; d$1 > target; d$1--) {
    if (splitting$1 || $to.after(d$1 + 1) < $to.end(d$1)) {
      splitting$1 = true;
      after = Fragment.from($to.node(d$1).copy(after));
      openEnd++;
    } else {
      end++;
    }
  }
  return this.step(new ReplaceAroundStep(start, end, gapStart, gapEnd, new Slice(before.append(after), openStart, openEnd), before.size - openStart, true));
};
function findWrapping(range, nodeType, attrs, innerRange) {
  if (innerRange === void 0)
    innerRange = range;
  var around = findWrappingOutside(range, nodeType);
  var inner = around && findWrappingInside(innerRange, nodeType);
  if (!inner) {
    return null;
  }
  return around.map(withAttrs).concat({ type: nodeType, attrs }).concat(inner.map(withAttrs));
}
function withAttrs(type) {
  return { type, attrs: null };
}
function findWrappingOutside(range, type) {
  var parent = range.parent;
  var startIndex = range.startIndex;
  var endIndex = range.endIndex;
  var around = parent.contentMatchAt(startIndex).findWrapping(type);
  if (!around) {
    return null;
  }
  var outer = around.length ? around[0] : type;
  return parent.canReplaceWith(startIndex, endIndex, outer) ? around : null;
}
function findWrappingInside(range, type) {
  var parent = range.parent;
  var startIndex = range.startIndex;
  var endIndex = range.endIndex;
  var inner = parent.child(startIndex);
  var inside = type.contentMatch.findWrapping(inner.type);
  if (!inside) {
    return null;
  }
  var lastType = inside.length ? inside[inside.length - 1] : type;
  var innerMatch = lastType.contentMatch;
  for (var i = startIndex; innerMatch && i < endIndex; i++) {
    innerMatch = innerMatch.matchType(parent.child(i).type);
  }
  if (!innerMatch || !innerMatch.validEnd) {
    return null;
  }
  return inside;
}
Transform.prototype.wrap = function(range, wrappers) {
  var content = Fragment.empty;
  for (var i = wrappers.length - 1; i >= 0; i--) {
    if (content.size) {
      var match = wrappers[i].type.contentMatch.matchFragment(content);
      if (!match || !match.validEnd) {
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
      }
    }
    content = Fragment.from(wrappers[i].type.create(wrappers[i].attrs, content));
  }
  var start = range.start, end = range.end;
  return this.step(new ReplaceAroundStep(start, end, start, end, new Slice(content, 0, 0), wrappers.length, true));
};
Transform.prototype.setBlockType = function(from, to, type, attrs) {
  var this$1 = this;
  if (to === void 0)
    to = from;
  if (!type.isTextblock) {
    throw new RangeError("Type given to setBlockType should be a textblock");
  }
  var mapFrom = this.steps.length;
  this.doc.nodesBetween(from, to, function(node, pos) {
    if (node.isTextblock && !node.hasMarkup(type, attrs) && canChangeType(this$1.doc, this$1.mapping.slice(mapFrom).map(pos), type)) {
      this$1.clearIncompatible(this$1.mapping.slice(mapFrom).map(pos, 1), type);
      var mapping = this$1.mapping.slice(mapFrom);
      var startM = mapping.map(pos, 1), endM = mapping.map(pos + node.nodeSize, 1);
      this$1.step(new ReplaceAroundStep(startM, endM, startM + 1, endM - 1, new Slice(Fragment.from(type.create(attrs, null, node.marks)), 0, 0), 1, true));
      return false;
    }
  });
  return this;
};
function canChangeType(doc, pos, type) {
  var $pos = doc.resolve(pos), index = $pos.index();
  return $pos.parent.canReplaceWith(index, index + 1, type);
}
Transform.prototype.setNodeMarkup = function(pos, type, attrs, marks) {
  var node = this.doc.nodeAt(pos);
  if (!node) {
    throw new RangeError("No node at given position");
  }
  if (!type) {
    type = node.type;
  }
  var newNode = type.create(attrs, null, marks || node.marks);
  if (node.isLeaf) {
    return this.replaceWith(pos, pos + node.nodeSize, newNode);
  }
  if (!type.validContent(node.content)) {
    throw new RangeError("Invalid content for node type " + type.name);
  }
  return this.step(new ReplaceAroundStep(pos, pos + node.nodeSize, pos + 1, pos + node.nodeSize - 1, new Slice(Fragment.from(newNode), 0, 0), 1, true));
};
function canSplit(doc, pos, depth, typesAfter) {
  if (depth === void 0)
    depth = 1;
  var $pos = doc.resolve(pos), base = $pos.depth - depth;
  var innerType = typesAfter && typesAfter[typesAfter.length - 1] || $pos.parent;
  if (base < 0 || $pos.parent.type.spec.isolating || !$pos.parent.canReplace($pos.index(), $pos.parent.childCount) || !innerType.type.validContent($pos.parent.content.cutByIndex($pos.index(), $pos.parent.childCount))) {
    return false;
  }
  for (var d = $pos.depth - 1, i = depth - 2; d > base; d--, i--) {
    var node = $pos.node(d), index$1 = $pos.index(d);
    if (node.type.spec.isolating) {
      return false;
    }
    var rest = node.content.cutByIndex(index$1, node.childCount);
    var after = typesAfter && typesAfter[i] || node;
    if (after != node) {
      rest = rest.replaceChild(0, after.type.create(after.attrs));
    }
    if (!node.canReplace(index$1 + 1, node.childCount) || !after.type.validContent(rest)) {
      return false;
    }
  }
  var index = $pos.indexAfter(base);
  var baseType = typesAfter && typesAfter[0];
  return $pos.node(base).canReplaceWith(index, index, baseType ? baseType.type : $pos.node(base + 1).type);
}
Transform.prototype.split = function(pos, depth, typesAfter) {
  if (depth === void 0)
    depth = 1;
  var $pos = this.doc.resolve(pos), before = Fragment.empty, after = Fragment.empty;
  for (var d = $pos.depth, e = $pos.depth - depth, i = depth - 1; d > e; d--, i--) {
    before = Fragment.from($pos.node(d).copy(before));
    var typeAfter = typesAfter && typesAfter[i];
    after = Fragment.from(typeAfter ? typeAfter.type.create(typeAfter.attrs, after) : $pos.node(d).copy(after));
  }
  return this.step(new ReplaceStep(pos, pos, new Slice(before.append(after), depth, depth), true));
};
function canJoin(doc, pos) {
  var $pos = doc.resolve(pos), index = $pos.index();
  return joinable($pos.nodeBefore, $pos.nodeAfter) && $pos.parent.canReplace(index, index + 1);
}
function joinable(a, b) {
  return a && b && !a.isLeaf && a.canAppend(b);
}
function joinPoint(doc, pos, dir) {
  if (dir === void 0)
    dir = -1;
  var $pos = doc.resolve(pos);
  for (var d = $pos.depth; ; d--) {
    var before = void 0, after = void 0, index = $pos.index(d);
    if (d == $pos.depth) {
      before = $pos.nodeBefore;
      after = $pos.nodeAfter;
    } else if (dir > 0) {
      before = $pos.node(d + 1);
      index++;
      after = $pos.node(d).maybeChild(index);
    } else {
      before = $pos.node(d).maybeChild(index - 1);
      after = $pos.node(d + 1);
    }
    if (before && !before.isTextblock && joinable(before, after) && $pos.node(d).canReplace(index, index + 1)) {
      return pos;
    }
    if (d == 0) {
      break;
    }
    pos = dir < 0 ? $pos.before(d) : $pos.after(d);
  }
}
Transform.prototype.join = function(pos, depth) {
  if (depth === void 0)
    depth = 1;
  var step2 = new ReplaceStep(pos - depth, pos + depth, Slice.empty, true);
  return this.step(step2);
};
function insertPoint(doc, pos, nodeType) {
  var $pos = doc.resolve(pos);
  if ($pos.parent.canReplaceWith($pos.index(), $pos.index(), nodeType)) {
    return pos;
  }
  if ($pos.parentOffset == 0) {
    for (var d = $pos.depth - 1; d >= 0; d--) {
      var index = $pos.index(d);
      if ($pos.node(d).canReplaceWith(index, index, nodeType)) {
        return $pos.before(d + 1);
      }
      if (index > 0) {
        return null;
      }
    }
  }
  if ($pos.parentOffset == $pos.parent.content.size) {
    for (var d$1 = $pos.depth - 1; d$1 >= 0; d$1--) {
      var index$1 = $pos.indexAfter(d$1);
      if ($pos.node(d$1).canReplaceWith(index$1, index$1, nodeType)) {
        return $pos.after(d$1 + 1);
      }
      if (index$1 < $pos.node(d$1).childCount) {
        return null;
      }
    }
  }
}
function dropPoint(doc, pos, slice2) {
  var $pos = doc.resolve(pos);
  if (!slice2.content.size) {
    return pos;
  }
  var content = slice2.content;
  for (var i = 0; i < slice2.openStart; i++) {
    content = content.firstChild.content;
  }
  for (var pass = 1; pass <= (slice2.openStart == 0 && slice2.size ? 2 : 1); pass++) {
    for (var d = $pos.depth; d >= 0; d--) {
      var bias = d == $pos.depth ? 0 : $pos.pos <= ($pos.start(d + 1) + $pos.end(d + 1)) / 2 ? -1 : 1;
      var insertPos = $pos.index(d) + (bias > 0 ? 1 : 0);
      var parent = $pos.node(d), fits = false;
      if (pass == 1) {
        fits = parent.canReplace(insertPos, insertPos, content);
      } else {
        var wrapping = parent.contentMatchAt(insertPos).findWrapping(content.firstChild.type);
        fits = wrapping && parent.canReplaceWith(insertPos, insertPos, wrapping[0]);
      }
      if (fits) {
        return bias == 0 ? $pos.pos : bias < 0 ? $pos.before(d + 1) : $pos.after(d + 1);
      }
    }
  }
  return null;
}
function mapFragment(fragment, f, parent) {
  var mapped = [];
  for (var i = 0; i < fragment.childCount; i++) {
    var child = fragment.child(i);
    if (child.content.size) {
      child = child.copy(mapFragment(child.content, f, child));
    }
    if (child.isInline) {
      child = f(child, parent, i);
    }
    mapped.push(child);
  }
  return Fragment.fromArray(mapped);
}
var AddMarkStep = /* @__PURE__ */ function(Step3) {
  function AddMarkStep2(from, to, mark) {
    Step3.call(this);
    this.from = from;
    this.to = to;
    this.mark = mark;
  }
  if (Step3)
    AddMarkStep2.__proto__ = Step3;
  AddMarkStep2.prototype = Object.create(Step3 && Step3.prototype);
  AddMarkStep2.prototype.constructor = AddMarkStep2;
  AddMarkStep2.prototype.apply = function apply2(doc) {
    var this$1 = this;
    var oldSlice = doc.slice(this.from, this.to), $from = doc.resolve(this.from);
    var parent = $from.node($from.sharedDepth(this.to));
    var slice2 = new Slice(mapFragment(oldSlice.content, function(node, parent2) {
      if (!node.isAtom || !parent2.type.allowsMarkType(this$1.mark.type)) {
        return node;
      }
      return node.mark(this$1.mark.addToSet(node.marks));
    }, parent), oldSlice.openStart, oldSlice.openEnd);
    return StepResult.fromReplace(doc, this.from, this.to, slice2);
  };
  AddMarkStep2.prototype.invert = function invert4() {
    return new RemoveMarkStep(this.from, this.to, this.mark);
  };
  AddMarkStep2.prototype.map = function map4(mapping) {
    var from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
    if (from.deleted && to.deleted || from.pos >= to.pos) {
      return null;
    }
    return new AddMarkStep2(from.pos, to.pos, this.mark);
  };
  AddMarkStep2.prototype.merge = function merge2(other) {
    if (other instanceof AddMarkStep2 && other.mark.eq(this.mark) && this.from <= other.to && this.to >= other.from) {
      return new AddMarkStep2(Math.min(this.from, other.from), Math.max(this.to, other.to), this.mark);
    }
  };
  AddMarkStep2.prototype.toJSON = function toJSON2() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  };
  AddMarkStep2.fromJSON = function fromJSON2(schema, json) {
    if (typeof json.from != "number" || typeof json.to != "number") {
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    }
    return new AddMarkStep2(json.from, json.to, schema.markFromJSON(json.mark));
  };
  return AddMarkStep2;
}(Step);
Step.jsonID("addMark", AddMarkStep);
var RemoveMarkStep = /* @__PURE__ */ function(Step3) {
  function RemoveMarkStep2(from, to, mark) {
    Step3.call(this);
    this.from = from;
    this.to = to;
    this.mark = mark;
  }
  if (Step3)
    RemoveMarkStep2.__proto__ = Step3;
  RemoveMarkStep2.prototype = Object.create(Step3 && Step3.prototype);
  RemoveMarkStep2.prototype.constructor = RemoveMarkStep2;
  RemoveMarkStep2.prototype.apply = function apply2(doc) {
    var this$1 = this;
    var oldSlice = doc.slice(this.from, this.to);
    var slice2 = new Slice(mapFragment(oldSlice.content, function(node) {
      return node.mark(this$1.mark.removeFromSet(node.marks));
    }), oldSlice.openStart, oldSlice.openEnd);
    return StepResult.fromReplace(doc, this.from, this.to, slice2);
  };
  RemoveMarkStep2.prototype.invert = function invert4() {
    return new AddMarkStep(this.from, this.to, this.mark);
  };
  RemoveMarkStep2.prototype.map = function map4(mapping) {
    var from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
    if (from.deleted && to.deleted || from.pos >= to.pos) {
      return null;
    }
    return new RemoveMarkStep2(from.pos, to.pos, this.mark);
  };
  RemoveMarkStep2.prototype.merge = function merge2(other) {
    if (other instanceof RemoveMarkStep2 && other.mark.eq(this.mark) && this.from <= other.to && this.to >= other.from) {
      return new RemoveMarkStep2(Math.min(this.from, other.from), Math.max(this.to, other.to), this.mark);
    }
  };
  RemoveMarkStep2.prototype.toJSON = function toJSON2() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  };
  RemoveMarkStep2.fromJSON = function fromJSON2(schema, json) {
    if (typeof json.from != "number" || typeof json.to != "number") {
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    }
    return new RemoveMarkStep2(json.from, json.to, schema.markFromJSON(json.mark));
  };
  return RemoveMarkStep2;
}(Step);
Step.jsonID("removeMark", RemoveMarkStep);
Transform.prototype.addMark = function(from, to, mark) {
  var this$1 = this;
  var removed = [], added = [], removing = null, adding = null;
  this.doc.nodesBetween(from, to, function(node, pos, parent) {
    if (!node.isInline) {
      return;
    }
    var marks = node.marks;
    if (!mark.isInSet(marks) && parent.type.allowsMarkType(mark.type)) {
      var start = Math.max(pos, from), end = Math.min(pos + node.nodeSize, to);
      var newSet = mark.addToSet(marks);
      for (var i = 0; i < marks.length; i++) {
        if (!marks[i].isInSet(newSet)) {
          if (removing && removing.to == start && removing.mark.eq(marks[i])) {
            removing.to = end;
          } else {
            removed.push(removing = new RemoveMarkStep(start, end, marks[i]));
          }
        }
      }
      if (adding && adding.to == start) {
        adding.to = end;
      } else {
        added.push(adding = new AddMarkStep(start, end, mark));
      }
    }
  });
  removed.forEach(function(s) {
    return this$1.step(s);
  });
  added.forEach(function(s) {
    return this$1.step(s);
  });
  return this;
};
Transform.prototype.removeMark = function(from, to, mark) {
  var this$1 = this;
  if (mark === void 0)
    mark = null;
  var matched = [], step2 = 0;
  this.doc.nodesBetween(from, to, function(node, pos) {
    if (!node.isInline) {
      return;
    }
    step2++;
    var toRemove = null;
    if (mark instanceof MarkType) {
      var set = node.marks, found;
      while (found = mark.isInSet(set)) {
        (toRemove || (toRemove = [])).push(found);
        set = found.removeFromSet(set);
      }
    } else if (mark) {
      if (mark.isInSet(node.marks)) {
        toRemove = [mark];
      }
    } else {
      toRemove = node.marks;
    }
    if (toRemove && toRemove.length) {
      var end = Math.min(pos + node.nodeSize, to);
      for (var i = 0; i < toRemove.length; i++) {
        var style = toRemove[i], found$1 = void 0;
        for (var j = 0; j < matched.length; j++) {
          var m = matched[j];
          if (m.step == step2 - 1 && style.eq(matched[j].style)) {
            found$1 = m;
          }
        }
        if (found$1) {
          found$1.to = end;
          found$1.step = step2;
        } else {
          matched.push({ style, from: Math.max(pos, from), to: end, step: step2 });
        }
      }
    }
  });
  matched.forEach(function(m) {
    return this$1.step(new RemoveMarkStep(m.from, m.to, m.style));
  });
  return this;
};
Transform.prototype.clearIncompatible = function(pos, parentType, match) {
  if (match === void 0)
    match = parentType.contentMatch;
  var node = this.doc.nodeAt(pos);
  var delSteps = [], cur = pos + 1;
  for (var i = 0; i < node.childCount; i++) {
    var child = node.child(i), end = cur + child.nodeSize;
    var allowed = match.matchType(child.type, child.attrs);
    if (!allowed) {
      delSteps.push(new ReplaceStep(cur, end, Slice.empty));
    } else {
      match = allowed;
      for (var j = 0; j < child.marks.length; j++) {
        if (!parentType.allowsMarkType(child.marks[j].type)) {
          this.step(new RemoveMarkStep(cur, end, child.marks[j]));
        }
      }
    }
    cur = end;
  }
  if (!match.validEnd) {
    var fill = match.fillBefore(Fragment.empty, true);
    this.replace(cur, cur, new Slice(fill, 0, 0));
  }
  for (var i$1 = delSteps.length - 1; i$1 >= 0; i$1--) {
    this.step(delSteps[i$1]);
  }
  return this;
};
function replaceStep(doc, from, to, slice2) {
  if (to === void 0)
    to = from;
  if (slice2 === void 0)
    slice2 = Slice.empty;
  if (from == to && !slice2.size) {
    return null;
  }
  var $from = doc.resolve(from), $to = doc.resolve(to);
  if (fitsTrivially($from, $to, slice2)) {
    return new ReplaceStep(from, to, slice2);
  }
  return new Fitter($from, $to, slice2).fit();
}
Transform.prototype.replace = function(from, to, slice2) {
  if (to === void 0)
    to = from;
  if (slice2 === void 0)
    slice2 = Slice.empty;
  var step2 = replaceStep(this.doc, from, to, slice2);
  if (step2) {
    this.step(step2);
  }
  return this;
};
Transform.prototype.replaceWith = function(from, to, content) {
  return this.replace(from, to, new Slice(Fragment.from(content), 0, 0));
};
Transform.prototype.delete = function(from, to) {
  return this.replace(from, to, Slice.empty);
};
Transform.prototype.insert = function(pos, content) {
  return this.replaceWith(pos, pos, content);
};
function fitsTrivially($from, $to, slice2) {
  return !slice2.openStart && !slice2.openEnd && $from.start() == $to.start() && $from.parent.canReplace($from.index(), $to.index(), slice2.content);
}
var Fitter = function Fitter2($from, $to, slice2) {
  this.$to = $to;
  this.$from = $from;
  this.unplaced = slice2;
  this.frontier = [];
  for (var i = 0; i <= $from.depth; i++) {
    var node = $from.node(i);
    this.frontier.push({
      type: node.type,
      match: node.contentMatchAt($from.indexAfter(i))
    });
  }
  this.placed = Fragment.empty;
  for (var i$1 = $from.depth; i$1 > 0; i$1--) {
    this.placed = Fragment.from($from.node(i$1).copy(this.placed));
  }
};
var prototypeAccessors$1 = { depth: { configurable: true } };
prototypeAccessors$1.depth.get = function() {
  return this.frontier.length - 1;
};
Fitter.prototype.fit = function fit() {
  while (this.unplaced.size) {
    var fit2 = this.findFittable();
    if (fit2) {
      this.placeNodes(fit2);
    } else {
      this.openMore() || this.dropNode();
    }
  }
  var moveInline = this.mustMoveInline(), placedSize = this.placed.size - this.depth - this.$from.depth;
  var $from = this.$from, $to = this.close(moveInline < 0 ? this.$to : $from.doc.resolve(moveInline));
  if (!$to) {
    return null;
  }
  var content = this.placed, openStart = $from.depth, openEnd = $to.depth;
  while (openStart && openEnd && content.childCount == 1) {
    content = content.firstChild.content;
    openStart--;
    openEnd--;
  }
  var slice2 = new Slice(content, openStart, openEnd);
  if (moveInline > -1) {
    return new ReplaceAroundStep($from.pos, moveInline, this.$to.pos, this.$to.end(), slice2, placedSize);
  }
  if (slice2.size || $from.pos != this.$to.pos) {
    return new ReplaceStep($from.pos, $to.pos, slice2);
  }
};
Fitter.prototype.findFittable = function findFittable() {
  for (var pass = 1; pass <= 2; pass++) {
    for (var sliceDepth = this.unplaced.openStart; sliceDepth >= 0; sliceDepth--) {
      var fragment = void 0, parent = void 0;
      if (sliceDepth) {
        parent = contentAt(this.unplaced.content, sliceDepth - 1).firstChild;
        fragment = parent.content;
      } else {
        fragment = this.unplaced.content;
      }
      var first = fragment.firstChild;
      for (var frontierDepth = this.depth; frontierDepth >= 0; frontierDepth--) {
        var ref = this.frontier[frontierDepth];
        var type = ref.type;
        var match = ref.match;
        var wrap = void 0, inject = void 0;
        if (pass == 1 && (first ? match.matchType(first.type) || (inject = match.fillBefore(Fragment.from(first), false)) : type.compatibleContent(parent.type))) {
          return { sliceDepth, frontierDepth, parent, inject };
        } else if (pass == 2 && first && (wrap = match.findWrapping(first.type))) {
          return { sliceDepth, frontierDepth, parent, wrap };
        }
        if (parent && match.matchType(parent.type)) {
          break;
        }
      }
    }
  }
};
Fitter.prototype.openMore = function openMore() {
  var ref = this.unplaced;
  var content = ref.content;
  var openStart = ref.openStart;
  var openEnd = ref.openEnd;
  var inner = contentAt(content, openStart);
  if (!inner.childCount || inner.firstChild.isLeaf) {
    return false;
  }
  this.unplaced = new Slice(content, openStart + 1, Math.max(openEnd, inner.size + openStart >= content.size - openEnd ? openStart + 1 : 0));
  return true;
};
Fitter.prototype.dropNode = function dropNode() {
  var ref = this.unplaced;
  var content = ref.content;
  var openStart = ref.openStart;
  var openEnd = ref.openEnd;
  var inner = contentAt(content, openStart);
  if (inner.childCount <= 1 && openStart > 0) {
    var openAtEnd = content.size - openStart <= openStart + inner.size;
    this.unplaced = new Slice(dropFromFragment(content, openStart - 1, 1), openStart - 1, openAtEnd ? openStart - 1 : openEnd);
  } else {
    this.unplaced = new Slice(dropFromFragment(content, openStart, 1), openStart, openEnd);
  }
};
Fitter.prototype.placeNodes = function placeNodes(ref) {
  var sliceDepth = ref.sliceDepth;
  var frontierDepth = ref.frontierDepth;
  var parent = ref.parent;
  var inject = ref.inject;
  var wrap = ref.wrap;
  while (this.depth > frontierDepth) {
    this.closeFrontierNode();
  }
  if (wrap) {
    for (var i = 0; i < wrap.length; i++) {
      this.openFrontierNode(wrap[i]);
    }
  }
  var slice2 = this.unplaced, fragment = parent ? parent.content : slice2.content;
  var openStart = slice2.openStart - sliceDepth;
  var taken = 0, add = [];
  var ref$1 = this.frontier[frontierDepth];
  var match = ref$1.match;
  var type = ref$1.type;
  if (inject) {
    for (var i$1 = 0; i$1 < inject.childCount; i$1++) {
      add.push(inject.child(i$1));
    }
    match = match.matchFragment(inject);
  }
  var openEndCount = fragment.size + sliceDepth - (slice2.content.size - slice2.openEnd);
  while (taken < fragment.childCount) {
    var next = fragment.child(taken), matches = match.matchType(next.type);
    if (!matches) {
      break;
    }
    taken++;
    if (taken > 1 || openStart == 0 || next.content.size) {
      match = matches;
      add.push(closeNodeStart(next.mark(type.allowedMarks(next.marks)), taken == 1 ? openStart : 0, taken == fragment.childCount ? openEndCount : -1));
    }
  }
  var toEnd = taken == fragment.childCount;
  if (!toEnd) {
    openEndCount = -1;
  }
  this.placed = addToFragment(this.placed, frontierDepth, Fragment.from(add));
  this.frontier[frontierDepth].match = match;
  if (toEnd && openEndCount < 0 && parent && parent.type == this.frontier[this.depth].type && this.frontier.length > 1) {
    this.closeFrontierNode();
  }
  for (var i$2 = 0, cur = fragment; i$2 < openEndCount; i$2++) {
    var node = cur.lastChild;
    this.frontier.push({ type: node.type, match: node.contentMatchAt(node.childCount) });
    cur = node.content;
  }
  this.unplaced = !toEnd ? new Slice(dropFromFragment(slice2.content, sliceDepth, taken), slice2.openStart, slice2.openEnd) : sliceDepth == 0 ? Slice.empty : new Slice(dropFromFragment(slice2.content, sliceDepth - 1, 1), sliceDepth - 1, openEndCount < 0 ? slice2.openEnd : sliceDepth - 1);
};
Fitter.prototype.mustMoveInline = function mustMoveInline() {
  if (!this.$to.parent.isTextblock) {
    return -1;
  }
  var top = this.frontier[this.depth], level;
  if (!top.type.isTextblock || !contentAfterFits(this.$to, this.$to.depth, top.type, top.match, false) || this.$to.depth == this.depth && (level = this.findCloseLevel(this.$to)) && level.depth == this.depth) {
    return -1;
  }
  var ref = this.$to;
  var depth = ref.depth;
  var after = this.$to.after(depth);
  while (depth > 1 && after == this.$to.end(--depth)) {
    ++after;
  }
  return after;
};
Fitter.prototype.findCloseLevel = function findCloseLevel($to) {
  scan:
    for (var i = Math.min(this.depth, $to.depth); i >= 0; i--) {
      var ref = this.frontier[i];
      var match = ref.match;
      var type = ref.type;
      var dropInner = i < $to.depth && $to.end(i + 1) == $to.pos + ($to.depth - (i + 1));
      var fit2 = contentAfterFits($to, i, type, match, dropInner);
      if (!fit2) {
        continue;
      }
      for (var d = i - 1; d >= 0; d--) {
        var ref$1 = this.frontier[d];
        var match$1 = ref$1.match;
        var type$1 = ref$1.type;
        var matches = contentAfterFits($to, d, type$1, match$1, true);
        if (!matches || matches.childCount) {
          continue scan;
        }
      }
      return { depth: i, fit: fit2, move: dropInner ? $to.doc.resolve($to.after(i + 1)) : $to };
    }
};
Fitter.prototype.close = function close($to) {
  var close2 = this.findCloseLevel($to);
  if (!close2) {
    return null;
  }
  while (this.depth > close2.depth) {
    this.closeFrontierNode();
  }
  if (close2.fit.childCount) {
    this.placed = addToFragment(this.placed, close2.depth, close2.fit);
  }
  $to = close2.move;
  for (var d = close2.depth + 1; d <= $to.depth; d++) {
    var node = $to.node(d), add = node.type.contentMatch.fillBefore(node.content, true, $to.index(d));
    this.openFrontierNode(node.type, node.attrs, add);
  }
  return $to;
};
Fitter.prototype.openFrontierNode = function openFrontierNode(type, attrs, content) {
  var top = this.frontier[this.depth];
  top.match = top.match.matchType(type);
  this.placed = addToFragment(this.placed, this.depth, Fragment.from(type.create(attrs, content)));
  this.frontier.push({ type, match: type.contentMatch });
};
Fitter.prototype.closeFrontierNode = function closeFrontierNode() {
  var open = this.frontier.pop();
  var add = open.match.fillBefore(Fragment.empty, true);
  if (add.childCount) {
    this.placed = addToFragment(this.placed, this.frontier.length, add);
  }
};
Object.defineProperties(Fitter.prototype, prototypeAccessors$1);
function dropFromFragment(fragment, depth, count) {
  if (depth == 0) {
    return fragment.cutByIndex(count);
  }
  return fragment.replaceChild(0, fragment.firstChild.copy(dropFromFragment(fragment.firstChild.content, depth - 1, count)));
}
function addToFragment(fragment, depth, content) {
  if (depth == 0) {
    return fragment.append(content);
  }
  return fragment.replaceChild(fragment.childCount - 1, fragment.lastChild.copy(addToFragment(fragment.lastChild.content, depth - 1, content)));
}
function contentAt(fragment, depth) {
  for (var i = 0; i < depth; i++) {
    fragment = fragment.firstChild.content;
  }
  return fragment;
}
function closeNodeStart(node, openStart, openEnd) {
  if (openStart <= 0) {
    return node;
  }
  var frag = node.content;
  if (openStart > 1) {
    frag = frag.replaceChild(0, closeNodeStart(frag.firstChild, openStart - 1, frag.childCount == 1 ? openEnd - 1 : 0));
  }
  if (openStart > 0) {
    frag = node.type.contentMatch.fillBefore(frag).append(frag);
    if (openEnd <= 0) {
      frag = frag.append(node.type.contentMatch.matchFragment(frag).fillBefore(Fragment.empty, true));
    }
  }
  return node.copy(frag);
}
function contentAfterFits($to, depth, type, match, open) {
  var node = $to.node(depth), index = open ? $to.indexAfter(depth) : $to.index(depth);
  if (index == node.childCount && !type.compatibleContent(node.type)) {
    return null;
  }
  var fit2 = match.fillBefore(node.content, true, index);
  return fit2 && !invalidMarks(type, node.content, index) ? fit2 : null;
}
function invalidMarks(type, fragment, start) {
  for (var i = start; i < fragment.childCount; i++) {
    if (!type.allowsMarks(fragment.child(i).marks)) {
      return true;
    }
  }
  return false;
}
function definesContent(type) {
  return type.spec.defining || type.spec.definingForContent;
}
Transform.prototype.replaceRange = function(from, to, slice2) {
  if (!slice2.size) {
    return this.deleteRange(from, to);
  }
  var $from = this.doc.resolve(from), $to = this.doc.resolve(to);
  if (fitsTrivially($from, $to, slice2)) {
    return this.step(new ReplaceStep(from, to, slice2));
  }
  var targetDepths = coveredDepths($from, this.doc.resolve(to));
  if (targetDepths[targetDepths.length - 1] == 0) {
    targetDepths.pop();
  }
  var preferredTarget = -($from.depth + 1);
  targetDepths.unshift(preferredTarget);
  for (var d = $from.depth, pos = $from.pos - 1; d > 0; d--, pos--) {
    var spec = $from.node(d).type.spec;
    if (spec.defining || spec.definingAsContext || spec.isolating) {
      break;
    }
    if (targetDepths.indexOf(d) > -1) {
      preferredTarget = d;
    } else if ($from.before(d) == pos) {
      targetDepths.splice(1, 0, -d);
    }
  }
  var preferredTargetIndex = targetDepths.indexOf(preferredTarget);
  var leftNodes = [], preferredDepth = slice2.openStart;
  for (var content = slice2.content, i = 0; ; i++) {
    var node = content.firstChild;
    leftNodes.push(node);
    if (i == slice2.openStart) {
      break;
    }
    content = node.content;
  }
  for (var d$1 = preferredDepth - 1; d$1 >= 0; d$1--) {
    var type = leftNodes[d$1].type, def = definesContent(type);
    if (def && $from.node(preferredTargetIndex).type != type) {
      preferredDepth = d$1;
    } else if (def || !type.isTextblock) {
      break;
    }
  }
  for (var j = slice2.openStart; j >= 0; j--) {
    var openDepth = (j + preferredDepth + 1) % (slice2.openStart + 1);
    var insert = leftNodes[openDepth];
    if (!insert) {
      continue;
    }
    for (var i$1 = 0; i$1 < targetDepths.length; i$1++) {
      var targetDepth = targetDepths[(i$1 + preferredTargetIndex) % targetDepths.length], expand = true;
      if (targetDepth < 0) {
        expand = false;
        targetDepth = -targetDepth;
      }
      var parent = $from.node(targetDepth - 1), index = $from.index(targetDepth - 1);
      if (parent.canReplaceWith(index, index, insert.type, insert.marks)) {
        return this.replace($from.before(targetDepth), expand ? $to.after(targetDepth) : to, new Slice(closeFragment(slice2.content, 0, slice2.openStart, openDepth), openDepth, slice2.openEnd));
      }
    }
  }
  var startSteps = this.steps.length;
  for (var i$2 = targetDepths.length - 1; i$2 >= 0; i$2--) {
    this.replace(from, to, slice2);
    if (this.steps.length > startSteps) {
      break;
    }
    var depth = targetDepths[i$2];
    if (depth < 0) {
      continue;
    }
    from = $from.before(depth);
    to = $to.after(depth);
  }
  return this;
};
function closeFragment(fragment, depth, oldOpen, newOpen, parent) {
  if (depth < oldOpen) {
    var first = fragment.firstChild;
    fragment = fragment.replaceChild(0, first.copy(closeFragment(first.content, depth + 1, oldOpen, newOpen, first)));
  }
  if (depth > newOpen) {
    var match = parent.contentMatchAt(0);
    var start = match.fillBefore(fragment).append(fragment);
    fragment = start.append(match.matchFragment(start).fillBefore(Fragment.empty, true));
  }
  return fragment;
}
Transform.prototype.replaceRangeWith = function(from, to, node) {
  if (!node.isInline && from == to && this.doc.resolve(from).parent.content.size) {
    var point = insertPoint(this.doc, from, node.type);
    if (point != null) {
      from = to = point;
    }
  }
  return this.replaceRange(from, to, new Slice(Fragment.from(node), 0, 0));
};
Transform.prototype.deleteRange = function(from, to) {
  var $from = this.doc.resolve(from), $to = this.doc.resolve(to);
  var covered = coveredDepths($from, $to);
  for (var i = 0; i < covered.length; i++) {
    var depth = covered[i], last = i == covered.length - 1;
    if (last && depth == 0 || $from.node(depth).type.contentMatch.validEnd) {
      return this.delete($from.start(depth), $to.end(depth));
    }
    if (depth > 0 && (last || $from.node(depth - 1).canReplace($from.index(depth - 1), $to.indexAfter(depth - 1)))) {
      return this.delete($from.before(depth), $to.after(depth));
    }
  }
  for (var d = 1; d <= $from.depth && d <= $to.depth; d++) {
    if (from - $from.start(d) == $from.depth - d && to > $from.end(d) && $to.end(d) - to != $to.depth - d) {
      return this.delete($from.before(d), to);
    }
  }
  return this.delete(from, to);
};
function coveredDepths($from, $to) {
  var result = [], minDepth = Math.min($from.depth, $to.depth);
  for (var d = minDepth; d >= 0; d--) {
    var start = $from.start(d);
    if (start < $from.pos - ($from.depth - d) || $to.end(d) > $to.pos + ($to.depth - d) || $from.node(d).type.spec.isolating || $to.node(d).type.spec.isolating) {
      break;
    }
    if (start == $to.start(d) || d == $from.depth && d == $to.depth && $from.parent.inlineContent && $to.parent.inlineContent && d && $to.start(d - 1) == start - 1) {
      result.push(d);
    }
  }
  return result;
}

export {
  MapResult,
  StepMap,
  Mapping,
  TransformError,
  Transform,
  Step,
  StepResult,
  ReplaceStep,
  ReplaceAroundStep,
  liftTarget,
  findWrapping,
  canSplit,
  canJoin,
  joinPoint,
  insertPoint,
  dropPoint,
  AddMarkStep,
  RemoveMarkStep,
  replaceStep
};
