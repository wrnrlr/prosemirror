import {
  Plugin
} from "./chunk-UIQZLVQX.js";
import {
  canJoin,
  findWrapping
} from "./chunk-HSTGJMAL.js";
import "./chunk-O5MLGE4X.js";

// node_modules/prosemirror-inputrules/dist/index.es.js
var InputRule = function InputRule2(match, handler) {
  this.match = match;
  this.handler = typeof handler == "string" ? stringHandler(handler) : handler;
};
function stringHandler(string) {
  return function(state, match, start, end) {
    var insert = string;
    if (match[1]) {
      var offset = match[0].lastIndexOf(match[1]);
      insert += match[0].slice(offset + match[1].length);
      start += offset;
      var cutOff = start - end;
      if (cutOff > 0) {
        insert = match[0].slice(offset - cutOff, offset) + insert;
        start = end;
      }
    }
    return state.tr.insertText(insert, start, end);
  };
}
var MAX_MATCH = 500;
function inputRules(ref) {
  var rules = ref.rules;
  var plugin = new Plugin({
    state: {
      init: function init() {
        return null;
      },
      apply: function apply(tr, prev) {
        var stored = tr.getMeta(this);
        if (stored) {
          return stored;
        }
        return tr.selectionSet || tr.docChanged ? null : prev;
      }
    },
    props: {
      handleTextInput: function handleTextInput(view, from, to, text) {
        return run(view, from, to, text, rules, plugin);
      },
      handleDOMEvents: {
        compositionend: function(view) {
          setTimeout(function() {
            var ref2 = view.state.selection;
            var $cursor = ref2.$cursor;
            if ($cursor) {
              run(view, $cursor.pos, $cursor.pos, "", rules, plugin);
            }
          });
        }
      }
    },
    isInputRules: true
  });
  return plugin;
}
function run(view, from, to, text, rules, plugin) {
  if (view.composing) {
    return false;
  }
  var state = view.state, $from = state.doc.resolve(from);
  if ($from.parent.type.spec.code) {
    return false;
  }
  var textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - MAX_MATCH), $from.parentOffset, null, "\uFFFC") + text;
  for (var i = 0; i < rules.length; i++) {
    var match = rules[i].match.exec(textBefore);
    var tr = match && rules[i].handler(state, match, from - (match[0].length - text.length), to);
    if (!tr) {
      continue;
    }
    view.dispatch(tr.setMeta(plugin, { transform: tr, from, to, text }));
    return true;
  }
  return false;
}
function undoInputRule(state, dispatch) {
  var plugins = state.plugins;
  for (var i = 0; i < plugins.length; i++) {
    var plugin = plugins[i], undoable = void 0;
    if (plugin.spec.isInputRules && (undoable = plugin.getState(state))) {
      if (dispatch) {
        var tr = state.tr, toUndo = undoable.transform;
        for (var j = toUndo.steps.length - 1; j >= 0; j--) {
          tr.step(toUndo.steps[j].invert(toUndo.docs[j]));
        }
        if (undoable.text) {
          var marks = tr.doc.resolve(undoable.from).marks();
          tr.replaceWith(undoable.from, undoable.to, state.schema.text(undoable.text, marks));
        } else {
          tr.delete(undoable.from, undoable.to);
        }
        dispatch(tr);
      }
      return true;
    }
  }
  return false;
}
var emDash = new InputRule(/--$/, "\u2014");
var ellipsis = new InputRule(/\.\.\.$/, "\u2026");
var openDoubleQuote = new InputRule(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/, "\u201C");
var closeDoubleQuote = new InputRule(/"$/, "\u201D");
var openSingleQuote = new InputRule(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/, "\u2018");
var closeSingleQuote = new InputRule(/'$/, "\u2019");
var smartQuotes = [openDoubleQuote, closeDoubleQuote, openSingleQuote, closeSingleQuote];
function wrappingInputRule(regexp, nodeType, getAttrs, joinPredicate) {
  return new InputRule(regexp, function(state, match, start, end) {
    var attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    var tr = state.tr.delete(start, end);
    var $start = tr.doc.resolve(start), range = $start.blockRange(), wrapping = range && findWrapping(range, nodeType, attrs);
    if (!wrapping) {
      return null;
    }
    tr.wrap(range, wrapping);
    var before = tr.doc.resolve(start - 1).nodeBefore;
    if (before && before.type == nodeType && canJoin(tr.doc, start - 1) && (!joinPredicate || joinPredicate(match, before))) {
      tr.join(start - 1);
    }
    return tr;
  });
}
function textblockTypeInputRule(regexp, nodeType, getAttrs) {
  return new InputRule(regexp, function(state, match, start, end) {
    var $start = state.doc.resolve(start);
    var attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)) {
      return null;
    }
    return state.tr.delete(start, end).setBlockType(start, start, nodeType, attrs);
  });
}
export {
  InputRule,
  closeDoubleQuote,
  closeSingleQuote,
  ellipsis,
  emDash,
  inputRules,
  openDoubleQuote,
  openSingleQuote,
  smartQuotes,
  textblockTypeInputRule,
  undoInputRule,
  wrappingInputRule
};
