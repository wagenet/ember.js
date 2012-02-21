/*jshint newcap:false*/

require("metamorph");
require("ember-views/views/view");

Ember.Metamorph = Ember.Mixin.create({
  isVirtual: true,
  tagName: '',

  init: function() {
    this._super();
    this.morph = Metamorph();
  },

  beforeRender: function(buffer) {
    var morph = this.morph;
    buffer.push(morph.startTag());
  },

  afterRender: function(buffer) {
    var morph = this.morph;
    buffer.push(morph.endTag());
  },

  createElement: function() {
    var buffer = this.renderToBuffer();
    this.outerHTML = buffer.string();
    this.clearBuffer();
  },

  domManagerClass: Ember.Object.extend({
    remove: function(view) {
      var morph = this.view.morph;
      if (morph.isRemoved()) { return; }
      morph.remove();
    },

    prepend: function(childView) {
      var view = this.view;

      childView._insertElementLater(function() {
        var morph = view.morph;
        morph.prepend(childView.outerHTML);
        childView.outerHTML = null;
      });
    },

    after: function(nextView) {
      var view = this.view;

      nextView._insertElementLater(function() {
        var morph = view.morph;
        morph.after(nextView.outerHTML);
        nextView.outerHTML = null;
      });
    },

    replace: function() {
      var view = this.view;
      var morph = view.morph;

      view.transitionTo('preRender');
      view.clearRenderedChildren();
      var buffer = view.renderToBuffer();

      Ember.run.schedule('render', this, function() {
        if (view.isDestroyed) { return; }
        view.invalidateRecursively('element');
        view._notifyWillInsertElement();
        morph.replaceWith(buffer.string());
        view.transitionTo('inDOM');
        view._notifyDidInsertElement();
      });
    }
  })
});

