import {
  ReplaceAroundStep,
  ReplaceStep,
  Transform
} from "./chunk-HSTGJMAL.js";
import {
  Fragment,
  Mark,
  Node,
  Slice
} from "./chunk-O5MLGE4X.js";

// node_modules/prosemirror-state/dist/index.es.js
var classesById = /* @__PURE__ */ Object.create(null);
var Selection = function Selection2($anchor, $head, ranges) {
  this.ranges = ranges || [new SelectionRange($anchor.min($head), $anchor.max($head))];
  this.$anchor = $anchor;
  this.$head = $head;
};
var prototypeAccessors = { anchor: { configurable: true }, head: { configurable: true }, from: { configurable: true }, to: { configurable: true }, $from: { configurable: true }, $to: { configurable: true }, empty: { configurable: true } };
prototypeAccessors.anchor.get = function() {
  return this.$anchor.pos;
};
prototypeAccessors.head.get = function() {
  return this.$head.pos;
};
prototypeAccessors.from.get = function() {
  return this.$from.pos;
};
prototypeAccessors.to.get = function() {
  return this.$to.pos;
};
prototypeAccessors.$from.get = function() {
  return this.ranges[0].$from;
};
prototypeAccessors.$to.get = function() {
  return this.ranges[0].$to;
};
prototypeAccessors.empty.get = function() {
  var ranges = this.ranges;
  for (var i = 0; i < ranges.length; i++) {
    if (ranges[i].$from.pos != ranges[i].$to.pos) {
      return false;
    }
  }
  return true;
};
Selection.prototype.content = function content() {
  return this.$from.node(0).slice(this.from, this.to, true);
};
Selection.prototype.replace = function replace(tr, content2) {
  if (content2 === void 0)
    content2 = Slice.empty;
  var lastNode = content2.content.lastChild, lastParent = null;
  for (var i = 0; i < content2.openEnd; i++) {
    lastParent = lastNode;
    lastNode = lastNode.lastChild;
  }
  var mapFrom = tr.steps.length, ranges = this.ranges;
  for (var i$1 = 0; i$1 < ranges.length; i$1++) {
    var ref = ranges[i$1];
    var $from = ref.$from;
    var $to = ref.$to;
    var mapping = tr.mapping.slice(mapFrom);
    tr.replaceRange(mapping.map($from.pos), mapping.map($to.pos), i$1 ? Slice.empty : content2);
    if (i$1 == 0) {
      selectionToInsertionEnd(tr, mapFrom, (lastNode ? lastNode.isInline : lastParent && lastParent.isTextblock) ? -1 : 1);
    }
  }
};
Selection.prototype.replaceWith = function replaceWith(tr, node) {
  var mapFrom = tr.steps.length, ranges = this.ranges;
  for (var i = 0; i < ranges.length; i++) {
    var ref = ranges[i];
    var $from = ref.$from;
    var $to = ref.$to;
    var mapping = tr.mapping.slice(mapFrom);
    var from = mapping.map($from.pos), to = mapping.map($to.pos);
    if (i) {
      tr.deleteRange(from, to);
    } else {
      tr.replaceRangeWith(from, to, node);
      selectionToInsertionEnd(tr, mapFrom, node.isInline ? -1 : 1);
    }
  }
};
Selection.findFrom = function findFrom($pos, dir, textOnly) {
  var inner = $pos.parent.inlineContent ? new TextSelection($pos) : findSelectionIn($pos.node(0), $pos.parent, $pos.pos, $pos.index(), dir, textOnly);
  if (inner) {
    return inner;
  }
  for (var depth = $pos.depth - 1; depth >= 0; depth--) {
    var found = dir < 0 ? findSelectionIn($pos.node(0), $pos.node(depth), $pos.before(depth + 1), $pos.index(depth), dir, textOnly) : findSelectionIn($pos.node(0), $pos.node(depth), $pos.after(depth + 1), $pos.index(depth) + 1, dir, textOnly);
    if (found) {
      return found;
    }
  }
};
Selection.near = function near($pos, bias) {
  if (bias === void 0)
    bias = 1;
  return this.findFrom($pos, bias) || this.findFrom($pos, -bias) || new AllSelection($pos.node(0));
};
Selection.atStart = function atStart(doc) {
  return findSelectionIn(doc, doc, 0, 0, 1) || new AllSelection(doc);
};
Selection.atEnd = function atEnd(doc) {
  return findSelectionIn(doc, doc, doc.content.size, doc.childCount, -1) || new AllSelection(doc);
};
Selection.fromJSON = function fromJSON(doc, json) {
  if (!json || !json.type) {
    throw new RangeError("Invalid input for Selection.fromJSON");
  }
  var cls = classesById[json.type];
  if (!cls) {
    throw new RangeError("No selection type " + json.type + " defined");
  }
  return cls.fromJSON(doc, json);
};
Selection.jsonID = function jsonID(id, selectionClass) {
  if (id in classesById) {
    throw new RangeError("Duplicate use of selection JSON ID " + id);
  }
  classesById[id] = selectionClass;
  selectionClass.prototype.jsonID = id;
  return selectionClass;
};
Selection.prototype.getBookmark = function getBookmark() {
  return TextSelection.between(this.$anchor, this.$head).getBookmark();
};
Object.defineProperties(Selection.prototype, prototypeAccessors);
Selection.prototype.visible = true;
var SelectionRange = function SelectionRange2($from, $to) {
  this.$from = $from;
  this.$to = $to;
};
var TextSelection = /* @__PURE__ */ function(Selection3) {
  function TextSelection2($anchor, $head) {
    if ($head === void 0)
      $head = $anchor;
    Selection3.call(this, $anchor, $head);
  }
  if (Selection3)
    TextSelection2.__proto__ = Selection3;
  TextSelection2.prototype = Object.create(Selection3 && Selection3.prototype);
  TextSelection2.prototype.constructor = TextSelection2;
  var prototypeAccessors$12 = { $cursor: { configurable: true } };
  prototypeAccessors$12.$cursor.get = function() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  };
  TextSelection2.prototype.map = function map4(doc, mapping) {
    var $head = doc.resolve(mapping.map(this.head));
    if (!$head.parent.inlineContent) {
      return Selection3.near($head);
    }
    var $anchor = doc.resolve(mapping.map(this.anchor));
    return new TextSelection2($anchor.parent.inlineContent ? $anchor : $head, $head);
  };
  TextSelection2.prototype.replace = function replace2(tr, content2) {
    if (content2 === void 0)
      content2 = Slice.empty;
    Selection3.prototype.replace.call(this, tr, content2);
    if (content2 == Slice.empty) {
      var marks = this.$from.marksAcross(this.$to);
      if (marks) {
        tr.ensureMarks(marks);
      }
    }
  };
  TextSelection2.prototype.eq = function eq(other) {
    return other instanceof TextSelection2 && other.anchor == this.anchor && other.head == this.head;
  };
  TextSelection2.prototype.getBookmark = function getBookmark2() {
    return new TextBookmark(this.anchor, this.head);
  };
  TextSelection2.prototype.toJSON = function toJSON2() {
    return { type: "text", anchor: this.anchor, head: this.head };
  };
  TextSelection2.fromJSON = function fromJSON3(doc, json) {
    if (typeof json.anchor != "number" || typeof json.head != "number") {
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    }
    return new TextSelection2(doc.resolve(json.anchor), doc.resolve(json.head));
  };
  TextSelection2.create = function create2(doc, anchor, head) {
    if (head === void 0)
      head = anchor;
    var $anchor = doc.resolve(anchor);
    return new this($anchor, head == anchor ? $anchor : doc.resolve(head));
  };
  TextSelection2.between = function between($anchor, $head, bias) {
    var dPos = $anchor.pos - $head.pos;
    if (!bias || dPos) {
      bias = dPos >= 0 ? 1 : -1;
    }
    if (!$head.parent.inlineContent) {
      var found = Selection3.findFrom($head, bias, true) || Selection3.findFrom($head, -bias, true);
      if (found) {
        $head = found.$head;
      } else {
        return Selection3.near($head, bias);
      }
    }
    if (!$anchor.parent.inlineContent) {
      if (dPos == 0) {
        $anchor = $head;
      } else {
        $anchor = (Selection3.findFrom($anchor, -bias, true) || Selection3.findFrom($anchor, bias, true)).$anchor;
        if ($anchor.pos < $head.pos != dPos < 0) {
          $anchor = $head;
        }
      }
    }
    return new TextSelection2($anchor, $head);
  };
  Object.defineProperties(TextSelection2.prototype, prototypeAccessors$12);
  return TextSelection2;
}(Selection);
Selection.jsonID("text", TextSelection);
var TextBookmark = function TextBookmark2(anchor, head) {
  this.anchor = anchor;
  this.head = head;
};
TextBookmark.prototype.map = function map(mapping) {
  return new TextBookmark(mapping.map(this.anchor), mapping.map(this.head));
};
TextBookmark.prototype.resolve = function resolve(doc) {
  return TextSelection.between(doc.resolve(this.anchor), doc.resolve(this.head));
};
var NodeSelection = /* @__PURE__ */ function(Selection3) {
  function NodeSelection2($pos) {
    var node = $pos.nodeAfter;
    var $end = $pos.node(0).resolve($pos.pos + node.nodeSize);
    Selection3.call(this, $pos, $end);
    this.node = node;
  }
  if (Selection3)
    NodeSelection2.__proto__ = Selection3;
  NodeSelection2.prototype = Object.create(Selection3 && Selection3.prototype);
  NodeSelection2.prototype.constructor = NodeSelection2;
  NodeSelection2.prototype.map = function map4(doc, mapping) {
    var ref = mapping.mapResult(this.anchor);
    var deleted = ref.deleted;
    var pos = ref.pos;
    var $pos = doc.resolve(pos);
    if (deleted) {
      return Selection3.near($pos);
    }
    return new NodeSelection2($pos);
  };
  NodeSelection2.prototype.content = function content2() {
    return new Slice(Fragment.from(this.node), 0, 0);
  };
  NodeSelection2.prototype.eq = function eq(other) {
    return other instanceof NodeSelection2 && other.anchor == this.anchor;
  };
  NodeSelection2.prototype.toJSON = function toJSON2() {
    return { type: "node", anchor: this.anchor };
  };
  NodeSelection2.prototype.getBookmark = function getBookmark2() {
    return new NodeBookmark(this.anchor);
  };
  NodeSelection2.fromJSON = function fromJSON3(doc, json) {
    if (typeof json.anchor != "number") {
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    }
    return new NodeSelection2(doc.resolve(json.anchor));
  };
  NodeSelection2.create = function create2(doc, from) {
    return new this(doc.resolve(from));
  };
  NodeSelection2.isSelectable = function isSelectable(node) {
    return !node.isText && node.type.spec.selectable !== false;
  };
  return NodeSelection2;
}(Selection);
NodeSelection.prototype.visible = false;
Selection.jsonID("node", NodeSelection);
var NodeBookmark = function NodeBookmark2(anchor) {
  this.anchor = anchor;
};
NodeBookmark.prototype.map = function map2(mapping) {
  var ref = mapping.mapResult(this.anchor);
  var deleted = ref.deleted;
  var pos = ref.pos;
  return deleted ? new TextBookmark(pos, pos) : new NodeBookmark(pos);
};
NodeBookmark.prototype.resolve = function resolve2(doc) {
  var $pos = doc.resolve(this.anchor), node = $pos.nodeAfter;
  if (node && NodeSelection.isSelectable(node)) {
    return new NodeSelection($pos);
  }
  return Selection.near($pos);
};
var AllSelection = /* @__PURE__ */ function(Selection3) {
  function AllSelection2(doc) {
    Selection3.call(this, doc.resolve(0), doc.resolve(doc.content.size));
  }
  if (Selection3)
    AllSelection2.__proto__ = Selection3;
  AllSelection2.prototype = Object.create(Selection3 && Selection3.prototype);
  AllSelection2.prototype.constructor = AllSelection2;
  AllSelection2.prototype.replace = function replace2(tr, content2) {
    if (content2 === void 0)
      content2 = Slice.empty;
    if (content2 == Slice.empty) {
      tr.delete(0, tr.doc.content.size);
      var sel = Selection3.atStart(tr.doc);
      if (!sel.eq(tr.selection)) {
        tr.setSelection(sel);
      }
    } else {
      Selection3.prototype.replace.call(this, tr, content2);
    }
  };
  AllSelection2.prototype.toJSON = function toJSON2() {
    return { type: "all" };
  };
  AllSelection2.fromJSON = function fromJSON3(doc) {
    return new AllSelection2(doc);
  };
  AllSelection2.prototype.map = function map4(doc) {
    return new AllSelection2(doc);
  };
  AllSelection2.prototype.eq = function eq(other) {
    return other instanceof AllSelection2;
  };
  AllSelection2.prototype.getBookmark = function getBookmark2() {
    return AllBookmark;
  };
  return AllSelection2;
}(Selection);
Selection.jsonID("all", AllSelection);
var AllBookmark = {
  map: function map3() {
    return this;
  },
  resolve: function resolve3(doc) {
    return new AllSelection(doc);
  }
};
function findSelectionIn(doc, node, pos, index, dir, text) {
  if (node.inlineContent) {
    return TextSelection.create(doc, pos);
  }
  for (var i = index - (dir > 0 ? 0 : 1); dir > 0 ? i < node.childCount : i >= 0; i += dir) {
    var child = node.child(i);
    if (!child.isAtom) {
      var inner = findSelectionIn(doc, child, pos + dir, dir < 0 ? child.childCount : 0, dir, text);
      if (inner) {
        return inner;
      }
    } else if (!text && NodeSelection.isSelectable(child)) {
      return NodeSelection.create(doc, pos - (dir < 0 ? child.nodeSize : 0));
    }
    pos += child.nodeSize * dir;
  }
}
function selectionToInsertionEnd(tr, startLen, bias) {
  var last = tr.steps.length - 1;
  if (last < startLen) {
    return;
  }
  var step = tr.steps[last];
  if (!(step instanceof ReplaceStep || step instanceof ReplaceAroundStep)) {
    return;
  }
  var map4 = tr.mapping.maps[last], end;
  map4.forEach(function(_from, _to, _newFrom, newTo) {
    if (end == null) {
      end = newTo;
    }
  });
  tr.setSelection(Selection.near(tr.doc.resolve(end), bias));
}
var UPDATED_SEL = 1;
var UPDATED_MARKS = 2;
var UPDATED_SCROLL = 4;
var Transaction = /* @__PURE__ */ function(Transform2) {
  function Transaction2(state) {
    Transform2.call(this, state.doc);
    this.time = Date.now();
    this.curSelection = state.selection;
    this.curSelectionFor = 0;
    this.storedMarks = state.storedMarks;
    this.updated = 0;
    this.meta = /* @__PURE__ */ Object.create(null);
  }
  if (Transform2)
    Transaction2.__proto__ = Transform2;
  Transaction2.prototype = Object.create(Transform2 && Transform2.prototype);
  Transaction2.prototype.constructor = Transaction2;
  var prototypeAccessors2 = { selection: { configurable: true }, selectionSet: { configurable: true }, storedMarksSet: { configurable: true }, isGeneric: { configurable: true }, scrolledIntoView: { configurable: true } };
  prototypeAccessors2.selection.get = function() {
    if (this.curSelectionFor < this.steps.length) {
      this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor));
      this.curSelectionFor = this.steps.length;
    }
    return this.curSelection;
  };
  Transaction2.prototype.setSelection = function setSelection(selection) {
    if (selection.$from.doc != this.doc) {
      throw new RangeError("Selection passed to setSelection must point at the current document");
    }
    this.curSelection = selection;
    this.curSelectionFor = this.steps.length;
    this.updated = (this.updated | UPDATED_SEL) & ~UPDATED_MARKS;
    this.storedMarks = null;
    return this;
  };
  prototypeAccessors2.selectionSet.get = function() {
    return (this.updated & UPDATED_SEL) > 0;
  };
  Transaction2.prototype.setStoredMarks = function setStoredMarks(marks) {
    this.storedMarks = marks;
    this.updated |= UPDATED_MARKS;
    return this;
  };
  Transaction2.prototype.ensureMarks = function ensureMarks(marks) {
    if (!Mark.sameSet(this.storedMarks || this.selection.$from.marks(), marks)) {
      this.setStoredMarks(marks);
    }
    return this;
  };
  Transaction2.prototype.addStoredMark = function addStoredMark(mark) {
    return this.ensureMarks(mark.addToSet(this.storedMarks || this.selection.$head.marks()));
  };
  Transaction2.prototype.removeStoredMark = function removeStoredMark(mark) {
    return this.ensureMarks(mark.removeFromSet(this.storedMarks || this.selection.$head.marks()));
  };
  prototypeAccessors2.storedMarksSet.get = function() {
    return (this.updated & UPDATED_MARKS) > 0;
  };
  Transaction2.prototype.addStep = function addStep(step, doc) {
    Transform2.prototype.addStep.call(this, step, doc);
    this.updated = this.updated & ~UPDATED_MARKS;
    this.storedMarks = null;
  };
  Transaction2.prototype.setTime = function setTime(time) {
    this.time = time;
    return this;
  };
  Transaction2.prototype.replaceSelection = function replaceSelection(slice) {
    this.selection.replace(this, slice);
    return this;
  };
  Transaction2.prototype.replaceSelectionWith = function replaceSelectionWith(node, inheritMarks) {
    var selection = this.selection;
    if (inheritMarks !== false) {
      node = node.mark(this.storedMarks || (selection.empty ? selection.$from.marks() : selection.$from.marksAcross(selection.$to) || Mark.none));
    }
    selection.replaceWith(this, node);
    return this;
  };
  Transaction2.prototype.deleteSelection = function deleteSelection() {
    this.selection.replace(this);
    return this;
  };
  Transaction2.prototype.insertText = function insertText(text, from, to) {
    if (to === void 0)
      to = from;
    var schema = this.doc.type.schema;
    if (from == null) {
      if (!text) {
        return this.deleteSelection();
      }
      return this.replaceSelectionWith(schema.text(text), true);
    } else {
      if (!text) {
        return this.deleteRange(from, to);
      }
      var marks = this.storedMarks;
      if (!marks) {
        var $from = this.doc.resolve(from);
        marks = to == from ? $from.marks() : $from.marksAcross(this.doc.resolve(to));
      }
      this.replaceRangeWith(from, to, schema.text(text, marks));
      if (!this.selection.empty) {
        this.setSelection(Selection.near(this.selection.$to));
      }
      return this;
    }
  };
  Transaction2.prototype.setMeta = function setMeta(key, value) {
    this.meta[typeof key == "string" ? key : key.key] = value;
    return this;
  };
  Transaction2.prototype.getMeta = function getMeta(key) {
    return this.meta[typeof key == "string" ? key : key.key];
  };
  prototypeAccessors2.isGeneric.get = function() {
    for (var _ in this.meta) {
      return false;
    }
    return true;
  };
  Transaction2.prototype.scrollIntoView = function scrollIntoView() {
    this.updated |= UPDATED_SCROLL;
    return this;
  };
  prototypeAccessors2.scrolledIntoView.get = function() {
    return (this.updated & UPDATED_SCROLL) > 0;
  };
  Object.defineProperties(Transaction2.prototype, prototypeAccessors2);
  return Transaction2;
}(Transform);
function bind(f, self) {
  return !self || !f ? f : f.bind(self);
}
var FieldDesc = function FieldDesc2(name, desc, self) {
  this.name = name;
  this.init = bind(desc.init, self);
  this.apply = bind(desc.apply, self);
};
var baseFields = [
  new FieldDesc("doc", {
    init: function init(config) {
      return config.doc || config.schema.topNodeType.createAndFill();
    },
    apply: function apply(tr) {
      return tr.doc;
    }
  }),
  new FieldDesc("selection", {
    init: function init2(config, instance) {
      return config.selection || Selection.atStart(instance.doc);
    },
    apply: function apply2(tr) {
      return tr.selection;
    }
  }),
  new FieldDesc("storedMarks", {
    init: function init3(config) {
      return config.storedMarks || null;
    },
    apply: function apply3(tr, _marks, _old, state) {
      return state.selection.$cursor ? tr.storedMarks : null;
    }
  }),
  new FieldDesc("scrollToSelection", {
    init: function init4() {
      return 0;
    },
    apply: function apply4(tr, prev) {
      return tr.scrolledIntoView ? prev + 1 : prev;
    }
  })
];
var Configuration = function Configuration2(schema, plugins) {
  var this$1 = this;
  this.schema = schema;
  this.fields = baseFields.concat();
  this.plugins = [];
  this.pluginsByKey = /* @__PURE__ */ Object.create(null);
  if (plugins) {
    plugins.forEach(function(plugin) {
      if (this$1.pluginsByKey[plugin.key]) {
        throw new RangeError("Adding different instances of a keyed plugin (" + plugin.key + ")");
      }
      this$1.plugins.push(plugin);
      this$1.pluginsByKey[plugin.key] = plugin;
      if (plugin.spec.state) {
        this$1.fields.push(new FieldDesc(plugin.key, plugin.spec.state, plugin));
      }
    });
  }
};
var EditorState = function EditorState2(config) {
  this.config = config;
};
var prototypeAccessors$1 = { schema: { configurable: true }, plugins: { configurable: true }, tr: { configurable: true } };
prototypeAccessors$1.schema.get = function() {
  return this.config.schema;
};
prototypeAccessors$1.plugins.get = function() {
  return this.config.plugins;
};
EditorState.prototype.apply = function apply5(tr) {
  return this.applyTransaction(tr).state;
};
EditorState.prototype.filterTransaction = function filterTransaction(tr, ignore) {
  if (ignore === void 0)
    ignore = -1;
  for (var i = 0; i < this.config.plugins.length; i++) {
    if (i != ignore) {
      var plugin = this.config.plugins[i];
      if (plugin.spec.filterTransaction && !plugin.spec.filterTransaction.call(plugin, tr, this)) {
        return false;
      }
    }
  }
  return true;
};
EditorState.prototype.applyTransaction = function applyTransaction(rootTr) {
  if (!this.filterTransaction(rootTr)) {
    return { state: this, transactions: [] };
  }
  var trs = [rootTr], newState = this.applyInner(rootTr), seen = null;
  for (; ; ) {
    var haveNew = false;
    for (var i = 0; i < this.config.plugins.length; i++) {
      var plugin = this.config.plugins[i];
      if (plugin.spec.appendTransaction) {
        var n = seen ? seen[i].n : 0, oldState = seen ? seen[i].state : this;
        var tr = n < trs.length && plugin.spec.appendTransaction.call(plugin, n ? trs.slice(n) : trs, oldState, newState);
        if (tr && newState.filterTransaction(tr, i)) {
          tr.setMeta("appendedTransaction", rootTr);
          if (!seen) {
            seen = [];
            for (var j = 0; j < this.config.plugins.length; j++) {
              seen.push(j < i ? { state: newState, n: trs.length } : { state: this, n: 0 });
            }
          }
          trs.push(tr);
          newState = newState.applyInner(tr);
          haveNew = true;
        }
        if (seen) {
          seen[i] = { state: newState, n: trs.length };
        }
      }
    }
    if (!haveNew) {
      return { state: newState, transactions: trs };
    }
  }
};
EditorState.prototype.applyInner = function applyInner(tr) {
  if (!tr.before.eq(this.doc)) {
    throw new RangeError("Applying a mismatched transaction");
  }
  var newInstance = new EditorState(this.config), fields = this.config.fields;
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    newInstance[field.name] = field.apply(tr, this[field.name], this, newInstance);
  }
  for (var i$1 = 0; i$1 < applyListeners.length; i$1++) {
    applyListeners[i$1](this, tr, newInstance);
  }
  return newInstance;
};
prototypeAccessors$1.tr.get = function() {
  return new Transaction(this);
};
EditorState.create = function create(config) {
  var $config = new Configuration(config.doc ? config.doc.type.schema : config.schema, config.plugins);
  var instance = new EditorState($config);
  for (var i = 0; i < $config.fields.length; i++) {
    instance[$config.fields[i].name] = $config.fields[i].init(config, instance);
  }
  return instance;
};
EditorState.prototype.reconfigure = function reconfigure(config) {
  var $config = new Configuration(this.schema, config.plugins);
  var fields = $config.fields, instance = new EditorState($config);
  for (var i = 0; i < fields.length; i++) {
    var name = fields[i].name;
    instance[name] = this.hasOwnProperty(name) ? this[name] : fields[i].init(config, instance);
  }
  return instance;
};
EditorState.prototype.toJSON = function toJSON(pluginFields) {
  var result = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
  if (this.storedMarks) {
    result.storedMarks = this.storedMarks.map(function(m) {
      return m.toJSON();
    });
  }
  if (pluginFields && typeof pluginFields == "object") {
    for (var prop in pluginFields) {
      if (prop == "doc" || prop == "selection") {
        throw new RangeError("The JSON fields `doc` and `selection` are reserved");
      }
      var plugin = pluginFields[prop], state = plugin.spec.state;
      if (state && state.toJSON) {
        result[prop] = state.toJSON.call(plugin, this[plugin.key]);
      }
    }
  }
  return result;
};
EditorState.fromJSON = function fromJSON2(config, json, pluginFields) {
  if (!json) {
    throw new RangeError("Invalid input for EditorState.fromJSON");
  }
  if (!config.schema) {
    throw new RangeError("Required config field 'schema' missing");
  }
  var $config = new Configuration(config.schema, config.plugins);
  var instance = new EditorState($config);
  $config.fields.forEach(function(field) {
    if (field.name == "doc") {
      instance.doc = Node.fromJSON(config.schema, json.doc);
    } else if (field.name == "selection") {
      instance.selection = Selection.fromJSON(instance.doc, json.selection);
    } else if (field.name == "storedMarks") {
      if (json.storedMarks) {
        instance.storedMarks = json.storedMarks.map(config.schema.markFromJSON);
      }
    } else {
      if (pluginFields) {
        for (var prop in pluginFields) {
          var plugin = pluginFields[prop], state = plugin.spec.state;
          if (plugin.key == field.name && state && state.fromJSON && Object.prototype.hasOwnProperty.call(json, prop)) {
            instance[field.name] = state.fromJSON.call(plugin, config, json[prop], instance);
            return;
          }
        }
      }
      instance[field.name] = field.init(config, instance);
    }
  });
  return instance;
};
EditorState.addApplyListener = function addApplyListener(f) {
  applyListeners.push(f);
};
EditorState.removeApplyListener = function removeApplyListener(f) {
  var found = applyListeners.indexOf(f);
  if (found > -1) {
    applyListeners.splice(found, 1);
  }
};
Object.defineProperties(EditorState.prototype, prototypeAccessors$1);
var applyListeners = [];
function bindProps(obj, self, target) {
  for (var prop in obj) {
    var val = obj[prop];
    if (val instanceof Function) {
      val = val.bind(self);
    } else if (prop == "handleDOMEvents") {
      val = bindProps(val, self, {});
    }
    target[prop] = val;
  }
  return target;
}
var Plugin = function Plugin2(spec) {
  this.props = {};
  if (spec.props) {
    bindProps(spec.props, this, this.props);
  }
  this.spec = spec;
  this.key = spec.key ? spec.key.key : createKey("plugin");
};
Plugin.prototype.getState = function getState(state) {
  return state[this.key];
};
var keys = /* @__PURE__ */ Object.create(null);
function createKey(name) {
  if (name in keys) {
    return name + "$" + ++keys[name];
  }
  keys[name] = 0;
  return name + "$";
}
var PluginKey = function PluginKey2(name) {
  if (name === void 0)
    name = "key";
  this.key = createKey(name);
};
PluginKey.prototype.get = function get(state) {
  return state.config.pluginsByKey[this.key];
};
PluginKey.prototype.getState = function getState2(state) {
  return state[this.key];
};

export {
  Selection,
  SelectionRange,
  TextSelection,
  NodeSelection,
  AllSelection,
  Transaction,
  EditorState,
  Plugin,
  PluginKey
};
