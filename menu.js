import {
  joinUp,
  lift,
  selectParentNode,
  setBlockType,
  wrapIn
} from "./chunk-YCAZ6KEW.js";
import {
  redo,
  undo
} from "./chunk-RIP6YN2N.js";
import {
  Plugin
} from "./chunk-UIQZLVQX.js";
import "./chunk-HSTGJMAL.js";
import "./chunk-O5MLGE4X.js";

// node_modules/crelt/index.es.js
function crelt() {
  var elt = arguments[0];
  if (typeof elt == "string")
    elt = document.createElement(elt);
  var i = 1, next = arguments[1];
  if (next && typeof next == "object" && next.nodeType == null && !Array.isArray(next)) {
    for (var name in next)
      if (Object.prototype.hasOwnProperty.call(next, name)) {
        var value = next[name];
        if (typeof value == "string")
          elt.setAttribute(name, value);
        else if (value != null)
          elt[name] = value;
      }
    i++;
  }
  for (; i < arguments.length; i++)
    add(elt, arguments[i]);
  return elt;
}
function add(elt, child) {
  if (typeof child == "string") {
    elt.appendChild(document.createTextNode(child));
  } else if (child == null) {
  } else if (child.nodeType != null) {
    elt.appendChild(child);
  } else if (Array.isArray(child)) {
    for (var i = 0; i < child.length; i++)
      add(elt, child[i]);
  } else {
    throw new RangeError("Unsupported child node: " + child);
  }
}

// node_modules/prosemirror-menu/dist/index.es.js
var SVG = "http://www.w3.org/2000/svg";
var XLINK = "http://www.w3.org/1999/xlink";
var prefix = "ProseMirror-icon";
function hashPath(path) {
  var hash = 0;
  for (var i = 0; i < path.length; i++) {
    hash = (hash << 5) - hash + path.charCodeAt(i) | 0;
  }
  return hash;
}
function getIcon(icon) {
  var node = document.createElement("div");
  node.className = prefix;
  if (icon.path) {
    var name = "pm-icon-" + hashPath(icon.path).toString(16);
    if (!document.getElementById(name)) {
      buildSVG(name, icon);
    }
    var svg = node.appendChild(document.createElementNS(SVG, "svg"));
    svg.style.width = icon.width / icon.height + "em";
    var use = svg.appendChild(document.createElementNS(SVG, "use"));
    use.setAttributeNS(XLINK, "href", /([^#]*)/.exec(document.location)[1] + "#" + name);
  } else if (icon.dom) {
    node.appendChild(icon.dom.cloneNode(true));
  } else {
    node.appendChild(document.createElement("span")).textContent = icon.text || "";
    if (icon.css) {
      node.firstChild.style.cssText = icon.css;
    }
  }
  return node;
}
function buildSVG(name, data) {
  var collection = document.getElementById(prefix + "-collection");
  if (!collection) {
    collection = document.createElementNS(SVG, "svg");
    collection.id = prefix + "-collection";
    collection.style.display = "none";
    document.body.insertBefore(collection, document.body.firstChild);
  }
  var sym = document.createElementNS(SVG, "symbol");
  sym.id = name;
  sym.setAttribute("viewBox", "0 0 " + data.width + " " + data.height);
  var path = sym.appendChild(document.createElementNS(SVG, "path"));
  path.setAttribute("d", data.path);
  collection.appendChild(sym);
}
var prefix$1 = "ProseMirror-menu";
var MenuItem = function MenuItem2(spec) {
  this.spec = spec;
};
MenuItem.prototype.render = function render(view) {
  var spec = this.spec;
  var dom = spec.render ? spec.render(view) : spec.icon ? getIcon(spec.icon) : spec.label ? crelt("div", null, translate(view, spec.label)) : null;
  if (!dom) {
    throw new RangeError("MenuItem without icon or label property");
  }
  if (spec.title) {
    var title = typeof spec.title === "function" ? spec.title(view.state) : spec.title;
    dom.setAttribute("title", translate(view, title));
  }
  if (spec.class) {
    dom.classList.add(spec.class);
  }
  if (spec.css) {
    dom.style.cssText += spec.css;
  }
  dom.addEventListener("mousedown", function(e) {
    e.preventDefault();
    if (!dom.classList.contains(prefix$1 + "-disabled")) {
      spec.run(view.state, view.dispatch, view, e);
    }
  });
  function update2(state) {
    if (spec.select) {
      var selected = spec.select(state);
      dom.style.display = selected ? "" : "none";
      if (!selected) {
        return false;
      }
    }
    var enabled = true;
    if (spec.enable) {
      enabled = spec.enable(state) || false;
      setClass(dom, prefix$1 + "-disabled", !enabled);
    }
    if (spec.active) {
      var active = enabled && spec.active(state) || false;
      setClass(dom, prefix$1 + "-active", active);
    }
    return true;
  }
  return { dom, update: update2 };
};
function translate(view, text) {
  return view._props.translate ? view._props.translate(text) : text;
}
var lastMenuEvent = { time: 0, node: null };
function markMenuEvent(e) {
  lastMenuEvent.time = Date.now();
  lastMenuEvent.node = e.target;
}
function isMenuEvent(wrapper) {
  return Date.now() - 100 < lastMenuEvent.time && lastMenuEvent.node && wrapper.contains(lastMenuEvent.node);
}
var Dropdown = function Dropdown2(content, options) {
  this.options = options || {};
  this.content = Array.isArray(content) ? content : [content];
};
Dropdown.prototype.render = function render2(view) {
  var this$1 = this;
  var content = renderDropdownItems(this.content, view);
  var label = crelt("div", {
    class: prefix$1 + "-dropdown " + (this.options.class || ""),
    style: this.options.css
  }, translate(view, this.options.label));
  if (this.options.title) {
    label.setAttribute("title", translate(view, this.options.title));
  }
  var wrap = crelt("div", { class: prefix$1 + "-dropdown-wrap" }, label);
  var open = null, listeningOnClose = null;
  var close = function() {
    if (open && open.close()) {
      open = null;
      window.removeEventListener("mousedown", listeningOnClose);
    }
  };
  label.addEventListener("mousedown", function(e) {
    e.preventDefault();
    markMenuEvent(e);
    if (open) {
      close();
    } else {
      open = this$1.expand(wrap, content.dom);
      window.addEventListener("mousedown", listeningOnClose = function() {
        if (!isMenuEvent(wrap)) {
          close();
        }
      });
    }
  });
  function update2(state) {
    var inner = content.update(state);
    wrap.style.display = inner ? "" : "none";
    return inner;
  }
  return { dom: wrap, update: update2 };
};
Dropdown.prototype.expand = function expand(dom, items) {
  var menuDOM = crelt("div", { class: prefix$1 + "-dropdown-menu " + (this.options.class || "") }, items);
  var done = false;
  function close() {
    if (done) {
      return;
    }
    done = true;
    dom.removeChild(menuDOM);
    return true;
  }
  dom.appendChild(menuDOM);
  return { close, node: menuDOM };
};
function renderDropdownItems(items, view) {
  var rendered = [], updates = [];
  for (var i = 0; i < items.length; i++) {
    var ref = items[i].render(view);
    var dom = ref.dom;
    var update2 = ref.update;
    rendered.push(crelt("div", { class: prefix$1 + "-dropdown-item" }, dom));
    updates.push(update2);
  }
  return { dom: rendered, update: combineUpdates(updates, rendered) };
}
function combineUpdates(updates, nodes) {
  return function(state) {
    var something = false;
    for (var i = 0; i < updates.length; i++) {
      var up = updates[i](state);
      nodes[i].style.display = up ? "" : "none";
      if (up) {
        something = true;
      }
    }
    return something;
  };
}
var DropdownSubmenu = function DropdownSubmenu2(content, options) {
  this.options = options || {};
  this.content = Array.isArray(content) ? content : [content];
};
DropdownSubmenu.prototype.render = function render3(view) {
  var items = renderDropdownItems(this.content, view);
  var label = crelt("div", { class: prefix$1 + "-submenu-label" }, translate(view, this.options.label));
  var wrap = crelt("div", { class: prefix$1 + "-submenu-wrap" }, label, crelt("div", { class: prefix$1 + "-submenu" }, items.dom));
  var listeningOnClose = null;
  label.addEventListener("mousedown", function(e) {
    e.preventDefault();
    markMenuEvent(e);
    setClass(wrap, prefix$1 + "-submenu-wrap-active");
    if (!listeningOnClose) {
      window.addEventListener("mousedown", listeningOnClose = function() {
        if (!isMenuEvent(wrap)) {
          wrap.classList.remove(prefix$1 + "-submenu-wrap-active");
          window.removeEventListener("mousedown", listeningOnClose);
          listeningOnClose = null;
        }
      });
    }
  });
  function update2(state) {
    var inner = items.update(state);
    wrap.style.display = inner ? "" : "none";
    return inner;
  }
  return { dom: wrap, update: update2 };
};
function renderGrouped(view, content) {
  var result = document.createDocumentFragment();
  var updates = [], separators = [];
  for (var i = 0; i < content.length; i++) {
    var items = content[i], localUpdates = [], localNodes = [];
    for (var j = 0; j < items.length; j++) {
      var ref = items[j].render(view);
      var dom = ref.dom;
      var update$1 = ref.update;
      var span = crelt("span", { class: prefix$1 + "item" }, dom);
      result.appendChild(span);
      localNodes.push(span);
      localUpdates.push(update$1);
    }
    if (localUpdates.length) {
      updates.push(combineUpdates(localUpdates, localNodes));
      if (i < content.length - 1) {
        separators.push(result.appendChild(separator()));
      }
    }
  }
  function update2(state) {
    var something = false, needSep = false;
    for (var i2 = 0; i2 < updates.length; i2++) {
      var hasContent = updates[i2](state);
      if (i2) {
        separators[i2 - 1].style.display = needSep && hasContent ? "" : "none";
      }
      needSep = hasContent;
      if (hasContent) {
        something = true;
      }
    }
    return something;
  }
  return { dom: result, update: update2 };
}
function separator() {
  return crelt("span", { class: prefix$1 + "separator" });
}
var icons = {
  join: {
    width: 800,
    height: 900,
    path: "M0 75h800v125h-800z M0 825h800v-125h-800z M250 400h100v-100h100v100h100v100h-100v100h-100v-100h-100z"
  },
  lift: {
    width: 1024,
    height: 1024,
    path: "M219 310v329q0 7-5 12t-12 5q-8 0-13-5l-164-164q-5-5-5-13t5-13l164-164q5-5 13-5 7 0 12 5t5 12zM1024 749v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12zM1024 530v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 310v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 91v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12z"
  },
  selectParentNode: { text: "\u2B1A", css: "font-weight: bold" },
  undo: {
    width: 1024,
    height: 1024,
    path: "M761 1024c113-206 132-520-313-509v253l-384-384 384-384v248c534-13 594 472 313 775z"
  },
  redo: {
    width: 1024,
    height: 1024,
    path: "M576 248v-248l384 384-384 384v-253c-446-10-427 303-313 509-280-303-221-789 313-775z"
  },
  strong: {
    width: 805,
    height: 1024,
    path: "M317 869q42 18 80 18 214 0 214-191 0-65-23-102-15-25-35-42t-38-26-46-14-48-6-54-1q-41 0-57 5 0 30-0 90t-0 90q0 4-0 38t-0 55 2 47 6 38zM309 442q24 4 62 4 46 0 81-7t62-25 42-51 14-81q0-40-16-70t-45-46-61-24-70-8q-28 0-74 7 0 28 2 86t2 86q0 15-0 45t-0 45q0 26 0 39zM0 950l1-53q8-2 48-9t60-15q4-6 7-15t4-19 3-18 1-21 0-19v-37q0-561-12-585-2-4-12-8t-25-6-28-4-27-2-17-1l-2-47q56-1 194-6t213-5q13 0 39 0t38 0q40 0 78 7t73 24 61 40 42 59 16 78q0 29-9 54t-22 41-36 32-41 25-48 22q88 20 146 76t58 141q0 57-20 102t-53 74-78 48-93 27-100 8q-25 0-75-1t-75-1q-60 0-175 6t-132 6z"
  },
  em: {
    width: 585,
    height: 1024,
    path: "M0 949l9-48q3-1 46-12t63-21q16-20 23-57 0-4 35-165t65-310 29-169v-14q-13-7-31-10t-39-4-33-3l10-58q18 1 68 3t85 4 68 1q27 0 56-1t69-4 56-3q-2 22-10 50-17 5-58 16t-62 19q-4 10-8 24t-5 22-4 26-3 24q-15 84-50 239t-44 203q-1 5-7 33t-11 51-9 47-3 32l0 10q9 2 105 17-1 25-9 56-6 0-18 0t-18 0q-16 0-49-5t-49-5q-78-1-117-1-29 0-81 5t-69 6z"
  },
  code: {
    width: 896,
    height: 1024,
    path: "M608 192l-96 96 224 224-224 224 96 96 288-320-288-320zM288 192l-288 320 288 320 96-96-224-224 224-224-96-96z"
  },
  link: {
    width: 951,
    height: 1024,
    path: "M832 694q0-22-16-38l-118-118q-16-16-38-16-24 0-41 18 1 1 10 10t12 12 8 10 7 14 2 15q0 22-16 38t-38 16q-8 0-15-2t-14-7-10-8-12-12-10-10q-18 17-18 41 0 22 16 38l117 118q15 15 38 15 22 0 38-14l84-83q16-16 16-38zM430 292q0-22-16-38l-117-118q-16-16-38-16-22 0-38 15l-84 83q-16 16-16 38 0 22 16 38l118 118q15 15 38 15 24 0 41-17-1-1-10-10t-12-12-8-10-7-14-2-15q0-22 16-38t38-16q8 0 15 2t14 7 10 8 12 12 10 10q18-17 18-41zM941 694q0 68-48 116l-84 83q-47 47-116 47-69 0-116-48l-117-118q-47-47-47-116 0-70 50-119l-50-50q-49 50-118 50-68 0-116-48l-118-118q-48-48-48-116t48-116l84-83q47-47 116-47 69 0 116 48l117 118q47 47 47 116 0 70-50 119l50 50q49-50 118-50 68 0 116 48l118 118q48 48 48 116z"
  },
  bulletList: {
    width: 768,
    height: 896,
    path: "M0 512h128v-128h-128v128zM0 256h128v-128h-128v128zM0 768h128v-128h-128v128zM256 512h512v-128h-512v128zM256 256h512v-128h-512v128zM256 768h512v-128h-512v128z"
  },
  orderedList: {
    width: 768,
    height: 896,
    path: "M320 512h448v-128h-448v128zM320 768h448v-128h-448v128zM320 128v128h448v-128h-448zM79 384h78v-256h-36l-85 23v50l43-2v185zM189 590c0-36-12-78-96-78-33 0-64 6-83 16l1 66c21-10 42-15 67-15s32 11 32 28c0 26-30 58-110 112v50h192v-67l-91 2c49-30 87-66 87-113l1-1z"
  },
  blockquote: {
    width: 640,
    height: 896,
    path: "M0 448v256h256v-256h-128c0 0 0-128 128-128v-128c0 0-256 0-256 256zM640 320v-128c0 0-256 0-256 256v256h256v-256h-128c0 0 0-128 128-128z"
  }
};
var joinUpItem = new MenuItem({
  title: "Join with above block",
  run: joinUp,
  select: function(state) {
    return joinUp(state);
  },
  icon: icons.join
});
var liftItem = new MenuItem({
  title: "Lift out of enclosing block",
  run: lift,
  select: function(state) {
    return lift(state);
  },
  icon: icons.lift
});
var selectParentNodeItem = new MenuItem({
  title: "Select parent node",
  run: selectParentNode,
  select: function(state) {
    return selectParentNode(state);
  },
  icon: icons.selectParentNode
});
var undoItem = new MenuItem({
  title: "Undo last change",
  run: undo,
  enable: function(state) {
    return undo(state);
  },
  icon: icons.undo
});
var redoItem = new MenuItem({
  title: "Redo last undone change",
  run: redo,
  enable: function(state) {
    return redo(state);
  },
  icon: icons.redo
});
function wrapItem(nodeType, options) {
  var passedOptions = {
    run: function run(state, dispatch) {
      return wrapIn(nodeType, options.attrs)(state, dispatch);
    },
    select: function select(state) {
      return wrapIn(nodeType, options.attrs instanceof Function ? null : options.attrs)(state);
    }
  };
  for (var prop in options) {
    passedOptions[prop] = options[prop];
  }
  return new MenuItem(passedOptions);
}
function blockTypeItem(nodeType, options) {
  var command = setBlockType(nodeType, options.attrs);
  var passedOptions = {
    run: command,
    enable: function enable(state) {
      return command(state);
    },
    active: function active(state) {
      var ref = state.selection;
      var $from = ref.$from;
      var to = ref.to;
      var node = ref.node;
      if (node) {
        return node.hasMarkup(nodeType, options.attrs);
      }
      return to <= $from.end() && $from.parent.hasMarkup(nodeType, options.attrs);
    }
  };
  for (var prop in options) {
    passedOptions[prop] = options[prop];
  }
  return new MenuItem(passedOptions);
}
function setClass(dom, cls, on) {
  if (on) {
    dom.classList.add(cls);
  } else {
    dom.classList.remove(cls);
  }
}
var prefix$2 = "ProseMirror-menubar";
function isIOS() {
  if (typeof navigator == "undefined") {
    return false;
  }
  var agent = navigator.userAgent;
  return !/Edge\/\d/.test(agent) && /AppleWebKit/.test(agent) && /Mobile\/\w+/.test(agent);
}
function menuBar(options) {
  return new Plugin({
    view: function view(editorView) {
      return new MenuBarView(editorView, options);
    }
  });
}
var MenuBarView = function MenuBarView2(editorView, options) {
  var this$1 = this;
  this.editorView = editorView;
  this.options = options;
  this.wrapper = crelt("div", { class: prefix$2 + "-wrapper" });
  this.menu = this.wrapper.appendChild(crelt("div", { class: prefix$2 }));
  this.menu.className = prefix$2;
  this.spacer = null;
  editorView.dom.parentNode.replaceChild(this.wrapper, editorView.dom);
  this.wrapper.appendChild(editorView.dom);
  this.maxHeight = 0;
  this.widthForMaxHeight = 0;
  this.floating = false;
  var ref = renderGrouped(this.editorView, this.options.content);
  var dom = ref.dom;
  var update2 = ref.update;
  this.contentUpdate = update2;
  this.menu.appendChild(dom);
  this.update();
  if (options.floating && !isIOS()) {
    this.updateFloat();
    var potentialScrollers = getAllWrapping(this.wrapper);
    this.scrollFunc = function(e) {
      var root = this$1.editorView.root;
      if (!(root.body || root).contains(this$1.wrapper)) {
        potentialScrollers.forEach(function(el) {
          return el.removeEventListener("scroll", this$1.scrollFunc);
        });
      } else {
        this$1.updateFloat(e.target.getBoundingClientRect && e.target);
      }
    };
    potentialScrollers.forEach(function(el) {
      return el.addEventListener("scroll", this$1.scrollFunc);
    });
  }
};
MenuBarView.prototype.update = function update() {
  this.contentUpdate(this.editorView.state);
  if (this.floating) {
    this.updateScrollCursor();
  } else {
    if (this.menu.offsetWidth != this.widthForMaxHeight) {
      this.widthForMaxHeight = this.menu.offsetWidth;
      this.maxHeight = 0;
    }
    if (this.menu.offsetHeight > this.maxHeight) {
      this.maxHeight = this.menu.offsetHeight;
      this.menu.style.minHeight = this.maxHeight + "px";
    }
  }
};
MenuBarView.prototype.updateScrollCursor = function updateScrollCursor() {
  var selection = this.editorView.root.getSelection();
  if (!selection.focusNode) {
    return;
  }
  var rects = selection.getRangeAt(0).getClientRects();
  var selRect = rects[selectionIsInverted(selection) ? 0 : rects.length - 1];
  if (!selRect) {
    return;
  }
  var menuRect = this.menu.getBoundingClientRect();
  if (selRect.top < menuRect.bottom && selRect.bottom > menuRect.top) {
    var scrollable = findWrappingScrollable(this.wrapper);
    if (scrollable) {
      scrollable.scrollTop -= menuRect.bottom - selRect.top;
    }
  }
};
MenuBarView.prototype.updateFloat = function updateFloat(scrollAncestor) {
  var parent = this.wrapper, editorRect = parent.getBoundingClientRect(), top = scrollAncestor ? Math.max(0, scrollAncestor.getBoundingClientRect().top) : 0;
  if (this.floating) {
    if (editorRect.top >= top || editorRect.bottom < this.menu.offsetHeight + 10) {
      this.floating = false;
      this.menu.style.position = this.menu.style.left = this.menu.style.top = this.menu.style.width = "";
      this.menu.style.display = "";
      this.spacer.parentNode.removeChild(this.spacer);
      this.spacer = null;
    } else {
      var border = (parent.offsetWidth - parent.clientWidth) / 2;
      this.menu.style.left = editorRect.left + border + "px";
      this.menu.style.display = editorRect.top > window.innerHeight ? "none" : "";
      if (scrollAncestor) {
        this.menu.style.top = top + "px";
      }
    }
  } else {
    if (editorRect.top < top && editorRect.bottom >= this.menu.offsetHeight + 10) {
      this.floating = true;
      var menuRect = this.menu.getBoundingClientRect();
      this.menu.style.left = menuRect.left + "px";
      this.menu.style.width = menuRect.width + "px";
      if (scrollAncestor) {
        this.menu.style.top = top + "px";
      }
      this.menu.style.position = "fixed";
      this.spacer = crelt("div", { class: prefix$2 + "-spacer", style: "height: " + menuRect.height + "px" });
      parent.insertBefore(this.spacer, this.menu);
    }
  }
};
MenuBarView.prototype.destroy = function destroy() {
  if (this.wrapper.parentNode) {
    this.wrapper.parentNode.replaceChild(this.editorView.dom, this.wrapper);
  }
};
function selectionIsInverted(selection) {
  if (selection.anchorNode == selection.focusNode) {
    return selection.anchorOffset > selection.focusOffset;
  }
  return selection.anchorNode.compareDocumentPosition(selection.focusNode) == Node.DOCUMENT_POSITION_FOLLOWING;
}
function findWrappingScrollable(node) {
  for (var cur = node.parentNode; cur; cur = cur.parentNode) {
    if (cur.scrollHeight > cur.clientHeight) {
      return cur;
    }
  }
}
function getAllWrapping(node) {
  var res = [window];
  for (var cur = node.parentNode; cur; cur = cur.parentNode) {
    res.push(cur);
  }
  return res;
}
export {
  Dropdown,
  DropdownSubmenu,
  MenuItem,
  blockTypeItem,
  icons,
  joinUpItem,
  liftItem,
  menuBar,
  redoItem,
  renderGrouped,
  selectParentNodeItem,
  undoItem,
  wrapItem
};
