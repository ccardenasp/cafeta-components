var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { g as getViewImgFromWidget, C as Command, i as isImageAllowed, t as toArray, a as insertImage, P as Plugin, I as ImageLoadObserver, b as toImageWidget, c as getCode, T as TYPE_AROUND_SELECTION_ATTRIBUTE, d as getTypeAroundFakeCaretPosition, e as isTypeAroundWidget, f as isArrowKeyCode, p as priorities, h as getClosestTypeAroundDomButton, j as getTypeAroundButtonPosition, k as getClosestWidgetViewElement, l as isForwardArrowKeyCode, m as keyCodes, n as Template, R as Rect, o as isWidget, W as WIDGET_SELECTED_CLASS_NAME, q as getLabel, M as MouseObserver, r as env, s as isImage, V as View, u as uid, F as FocusTracker, K as KeystrokeHandler, v as ViewCollection, w as FocusCycler, B as ButtonView, x as BalloonPanelView, y as CKEditorError, z as toUnit, A as getSelectedImageWidget, D as clickOutsideHandler } from './resizeobserver-9bbb2542.js';
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module utils/first
 */
/**
 * Returns first item of the given `iterable`.
 *
 * @param {Iterable.<*>} iterable
 * @returns {*}
 */
function first(iterable) {
    var iteratorItem = iterable.next();
    if (iteratorItem.done) {
        return null;
    }
    return iteratorItem.value;
}
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * Returns a function that converts the image view representation:
 *
 *		<figure class="image"><img src="..." alt="..."></img></figure>
 *
 * to the model representation:
 *
 *		<image src="..." alt="..."></image>
 *
 * The entire content of the `<figure>` element except the first `<img>` is being converted as children
 * of the `<image>` model element.
 *
 * @returns {Function}
 */
function viewFigureToModel() {
    return function (dispatcher) {
        dispatcher.on('element:figure', converter);
    };
    function converter(evt, data, conversionApi) {
        // Do not convert if this is not an "image figure".
        if (!conversionApi.consumable.test(data.viewItem, { name: true, classes: 'image' })) {
            return;
        }
        // Find an image element inside the figure element.
        var viewImage = getViewImgFromWidget(data.viewItem);
        // Do not convert if image element is absent, is missing src attribute or was already converted.
        if (!viewImage || !viewImage.hasAttribute('src') || !conversionApi.consumable.test(viewImage, { name: true })) {
            return;
        }
        // Convert view image to model image.
        var conversionResult = conversionApi.convertItem(viewImage, data.modelCursor);
        // Get image element from conversion result.
        var modelImage = first(conversionResult.modelRange.getItems());
        // When image wasn't successfully converted then finish conversion.
        if (!modelImage) {
            return;
        }
        // Convert rest of the figure element's children as an image children.
        conversionApi.convertChildren(data.viewItem, modelImage);
        conversionApi.updateConversionResult(modelImage, data);
    }
}
/**
 * Converter used to convert the `srcset` model image attribute to the `srcset`, `sizes` and `width` attributes in the view.
 *
 * @returns {Function}
 */
function srcsetAttributeConverter() {
    return function (dispatcher) {
        dispatcher.on('attribute:srcset:image', converter);
    };
    function converter(evt, data, conversionApi) {
        if (!conversionApi.consumable.consume(data.item, evt.name)) {
            return;
        }
        var writer = conversionApi.writer;
        var figure = conversionApi.mapper.toViewElement(data.item);
        var img = getViewImgFromWidget(figure);
        if (data.attributeNewValue === null) {
            var srcset = data.attributeOldValue;
            if (srcset.data) {
                writer.removeAttribute('srcset', img);
                writer.removeAttribute('sizes', img);
                if (srcset.width) {
                    writer.removeAttribute('width', img);
                }
            }
        }
        else {
            var srcset = data.attributeNewValue;
            if (srcset.data) {
                writer.setAttribute('srcset', srcset.data, img);
                // Always outputting `100vw`. See https://github.com/ckeditor/ckeditor5-image/issues/2.
                writer.setAttribute('sizes', '100vw', img);
                if (srcset.width) {
                    writer.setAttribute('width', srcset.width, img);
                }
            }
        }
    }
}
function modelToViewAttributeConverter(attributeKey) {
    return function (dispatcher) {
        dispatcher.on("attribute:" + attributeKey + ":image", converter);
    };
    function converter(evt, data, conversionApi) {
        if (!conversionApi.consumable.consume(data.item, evt.name)) {
            return;
        }
        var viewWriter = conversionApi.writer;
        var figure = conversionApi.mapper.toViewElement(data.item);
        var img = getViewImgFromWidget(figure);
        viewWriter.setAttribute(data.attributeKey, data.attributeNewValue || '', img);
    }
}
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module image/image/imageinsertcommand
 */
/**
 * Insert image command.
 *
 * The command is registered by the {@link module:image/image/imageediting~ImageEditing} plugin as `'imageInsert'`.
 *
 * In order to insert an image at the current selection position
 * (according to the {@link module:widget/utils~findOptimalInsertionPosition} algorithm),
 * execute the command and specify the image source:
 *
 *		editor.execute( 'imageInsert', { source: 'http://url.to.the/image' } );
 *
 * It is also possible to insert multiple images at once:
 *
 *		editor.execute( 'imageInsert', {
 *			source:  [
 *				'path/to/image.jpg',
 *				'path/to/other-image.jpg'
 *			]
 *		} );
 *
 * @extends module:core/command~Command
 */
var ImageInsertCommand = /** @class */ (function (_super) {
    __extends(ImageInsertCommand, _super);
    function ImageInsertCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritDoc
     */
    ImageInsertCommand.prototype.refresh = function () {
        this.isEnabled = isImageAllowed(this.editor.model);
    };
    /**
     * Executes the command.
     *
     * @fires execute
     * @param {Object} options Options for the executed command.
     * @param {String|Array.<String>} options.source The image source or an array of image sources to insert.
     */
    ImageInsertCommand.prototype.execute = function (options) {
        var model = this.editor.model;
        for (var _i = 0, _a = toArray(options.source); _i < _a.length; _i++) {
            var src = _a[_i];
            insertImage(model, { src: src });
        }
    };
    return ImageInsertCommand;
}(Command));
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * The image engine plugin.
 *
 * It registers:
 *
 * * `<image>` as a block element in the document schema, and allows `alt`, `src` and `srcset` attributes.
 * * converters for editing and data pipelines.
 * * `'imageInsert'` command.
 *
 * @extends module:core/plugin~Plugin
 */
var ImageEditing = /** @class */ (function (_super) {
    __extends(ImageEditing, _super);
    function ImageEditing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ImageEditing, "pluginName", {
        /**
         * @inheritDoc
         */
        get: function () {
            return 'ImageEditing';
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ImageEditing.prototype.init = function () {
        var editor = this.editor;
        var schema = editor.model.schema;
        var t = editor.t;
        var conversion = editor.conversion;
        // See https://github.com/ckeditor/ckeditor5-image/issues/142.
        editor.editing.view.addObserver(ImageLoadObserver);
        // Configure schema.
        schema.register('image', {
            isObject: true,
            isBlock: true,
            allowWhere: '$block',
            allowAttributes: ['alt', 'src', 'srcset']
        });
        conversion.for('dataDowncast').elementToElement({
            model: 'image',
            view: function (modelElement, _a) {
                var writer = _a.writer;
                return createImageViewElement(writer);
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'image',
            view: function (modelElement, _a) {
                var writer = _a.writer;
                return toImageWidget(createImageViewElement(writer), writer, t('image widget'));
            }
        });
        conversion.for('downcast')
            .add(modelToViewAttributeConverter('src'))
            .add(modelToViewAttributeConverter('alt'))
            .add(srcsetAttributeConverter());
        conversion.for('upcast')
            .elementToElement({
            view: {
                name: 'img',
                attributes: {
                    src: true
                }
            },
            model: function (viewImage, _a) {
                var writer = _a.writer;
                return writer.createElement('image', { src: viewImage.getAttribute('src') });
            }
        })
            .attributeToAttribute({
            view: {
                name: 'img',
                key: 'alt'
            },
            model: 'alt'
        })
            .attributeToAttribute({
            view: {
                name: 'img',
                key: 'srcset'
            },
            model: {
                key: 'srcset',
                value: function (viewImage) {
                    var value = {
                        data: viewImage.getAttribute('srcset')
                    };
                    if (viewImage.hasAttribute('width')) {
                        value.width = viewImage.getAttribute('width');
                    }
                    return value;
                }
            }
        })
            .add(viewFigureToModel());
        editor.commands.add('imageInsert', new ImageInsertCommand(editor));
    };
    return ImageEditing;
}(Plugin));
// Creates a view element representing the image.
//
//		<figure class="image"><img></img></figure>
//
// Note that `alt` and `src` attributes are converted separately, so they are not included.
//
// @private
// @param {module:engine/view/downcastwriter~DowncastWriter} writer
// @returns {module:engine/view/containerelement~ContainerElement}
function createImageViewElement(writer) {
    var emptyElement = writer.createEmptyElement('img');
    var figure = writer.createContainerElement('figure', { class: 'image' });
    writer.insert(writer.createPositionAt(figure, 0), emptyElement);
    return figure;
}
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
var safeKeycodes = [
    getCode('arrowUp'),
    getCode('arrowRight'),
    getCode('arrowDown'),
    getCode('arrowLeft'),
    9,
    16,
    17,
    18,
    19,
    20,
    27,
    33,
    34,
    35,
    36,
    45,
    91,
    93,
    144,
    145,
    173,
    174,
    175,
    176,
    177,
    178,
    179,
    255 // Display brightness (increase and decrease)
];
// Function keys.
for (var code = 112; code <= 135; code++) {
    safeKeycodes.push(code);
}
/**
 * Returns `true` if a keystroke will **not** result in "typing".
 *
 * For instance, keystrokes that result in typing are letters "a-zA-Z", numbers "0-9", delete, backspace, etc.
 *
 * Keystrokes that do not cause typing are, for instance, Fn keys (F5, F8, etc.), arrow keys (←, →, ↑, ↓),
 * Tab (↹), "Windows logo key" (⊞ Win), etc.
 *
 * Note: This implementation is very simple and will need to be refined with time.
 *
 * @param {module:engine/view/observer/keyobserver~KeyEventData} keyData
 * @returns {Boolean}
 */
function isNonTypingKeystroke(keyData) {
    // Keystrokes which contain Ctrl don't represent typing.
    if (keyData.ctrlKey) {
        return true;
    }
    return safeKeycodes.includes(keyData.keyCode);
}
var returnArrowSvg = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAgOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOS4wNTUuMjYzdjMuOTcyaC02Ljc3TTEgNC4yMTZsMi0yLjAzOG0tMiAybDIgMi4wMzgiLz48L3N2Zz4=';
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
var POSSIBLE_INSERTION_POSITIONS = ['before', 'after'];
// Do the SVG parsing once and then clone the result <svg> DOM element for each new button.
var RETURN_ARROW_ICON_ELEMENT = new DOMParser().parseFromString(returnArrowSvg, 'image/svg+xml').firstChild;
var PLUGIN_DISABLED_EDITING_ROOT_CLASS = 'ck-widget__type-around_disabled';
/**
 * A plugin that allows users to type around widgets where normally it is impossible to place the caret due
 * to limitations of web browsers. These "tight spots" occur, for instance, before (or after) a widget being
 * the first (or last) child of its parent or between two block widgets.
 *
 * This plugin extends the {@link module:widget/widget~Widget `Widget`} plugin and injects the user interface
 * with two buttons into each widget instance in the editor. Each of the buttons can be clicked by the
 * user if the widget is next to the "tight spot". Once clicked, a paragraph is created with the selection anchored
 * in it so that users can type (or insert content, paste, etc.) straight away.
 *
 * @extends module:core/plugin~Plugin
 */
var WidgetTypeAround = /** @class */ (function (_super) {
    __extends(WidgetTypeAround, _super);
    /**
     * @inheritDoc
     */
    function WidgetTypeAround(editor) {
        var _this = _super.call(this, editor) || this;
        /**
         * A reference to the model widget element that has the fake caret active
         * on either side of it. It is later used to remove CSS classes associated with the fake caret
         * when the widget no longer needs it.
         *
         * @private
         * @member {module:engine/model/element~Element|null}
         */
        _this._currentFakeCaretModelElement = null;
        return _this;
    }
    Object.defineProperty(WidgetTypeAround, "pluginName", {
        /**
         * @inheritDoc
         */
        get: function () {
            return 'WidgetTypeAround';
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    WidgetTypeAround.prototype.init = function () {
        var editor = this.editor;
        var editingView = editor.editing.view;
        // Set a CSS class on the view editing root when the plugin is disabled so all the buttons
        // and lines visually disappear. All the interactions are disabled in individual plugin methods.
        this.on('change:isEnabled', function (evt, data, isEnabled) {
            editingView.change(function (writer) {
                for (var _i = 0, _a = editingView.document.roots; _i < _a.length; _i++) {
                    var root = _a[_i];
                    if (isEnabled) {
                        writer.removeClass(PLUGIN_DISABLED_EDITING_ROOT_CLASS, root);
                    }
                    else {
                        writer.addClass(PLUGIN_DISABLED_EDITING_ROOT_CLASS, root);
                    }
                }
            });
            if (!isEnabled) {
                editor.model.change(function (writer) {
                    writer.removeSelectionAttribute(TYPE_AROUND_SELECTION_ATTRIBUTE);
                });
            }
        });
        this._enableTypeAroundUIInjection();
        this._enableInsertingParagraphsOnButtonClick();
        this._enableInsertingParagraphsOnEnterKeypress();
        this._enableInsertingParagraphsOnTypingKeystroke();
        this._enableTypeAroundFakeCaretActivationUsingKeyboardArrows();
        this._enableDeleteIntegration();
        this._enableInsertContentIntegration();
    };
    /**
     * @inheritDoc
     */
    WidgetTypeAround.prototype.destroy = function () {
        this._currentFakeCaretModelElement = null;
    };
    /**
     * Inserts a new paragraph next to a widget element with the selection anchored in it.
     *
     * **Note**: This method is heavily user-oriented and will both focus the editing view and scroll
     * the viewport to the selection in the inserted paragraph.
     *
     * @protected
     * @param {module:engine/model/element~Element} widgetModelElement The model widget element next to which a paragraph is inserted.
     * @param {'before'|'after'} position The position where the paragraph is inserted. Either `'before'` or `'after'` the widget.
     */
    WidgetTypeAround.prototype._insertParagraph = function (widgetModelElement, position) {
        var editor = this.editor;
        var editingView = editor.editing.view;
        editor.execute('insertParagraph', {
            position: editor.model.createPositionAt(widgetModelElement, position)
        });
        editingView.focus();
        editingView.scrollToTheSelection();
    };
    /**
     * A wrapper for the {@link module:utils/emittermixin~EmitterMixin#listenTo} method that executes the callbacks only
     * when the plugin {@link #isEnabled is enabled}.
     *
     * @private
     * @param {module:utils/emittermixin~Emitter} emitter The object that fires the event.
     * @param {String} event The name of the event.
     * @param {Function} callback The function to be called on event.
     * @param {Object} [options={}] Additional options.
     * @param {module:utils/priorities~PriorityString|Number} [options.priority='normal'] The priority of this event callback. The higher
     * the priority value the sooner the callback will be fired. Events having the same priority are called in the
     * order they were added.
     */
    WidgetTypeAround.prototype._listenToIfEnabled = function (emitter, event, callback, options) {
        var _this = this;
        this.listenTo(emitter, event, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // Do not respond if the plugin is disabled.
            if (_this.isEnabled) {
                callback.apply(void 0, args);
            }
        }, options);
    };
    /**
     * Similar to {@link #_insertParagraph}, this method inserts a paragraph except that it
     * does not expect a position. Instead, it performs the insertion next to a selected widget
     * according to the `widget-type-around` model selection attribute value (fake caret position).
     *
     * Because this method requires the `widget-type-around` attribute to be set,
     * the insertion can only happen when the widget's fake caret is active (e.g. activated
     * using the keyboard).
     *
     * @private
     * @returns {Boolean} Returns `true` when the paragraph was inserted (the attribute was present) and `false` otherwise.
     */
    WidgetTypeAround.prototype._insertParagraphAccordingToFakeCaretPosition = function () {
        var editor = this.editor;
        var model = editor.model;
        var modelSelection = model.document.selection;
        var typeAroundFakeCaretPosition = getTypeAroundFakeCaretPosition(modelSelection);
        if (!typeAroundFakeCaretPosition) {
            return false;
        }
        var selectedModelElement = modelSelection.getSelectedElement();
        this._insertParagraph(selectedModelElement, typeAroundFakeCaretPosition);
        return true;
    };
    /**
     * Creates a listener in the editing conversion pipeline that injects the widget type around
     * UI into every single widget instance created in the editor.
     *
     * The UI is delivered as a {@link module:engine/view/uielement~UIElement}
     * wrapper which renders DOM buttons that users can use to insert paragraphs.
     *
     * @private
     */
    WidgetTypeAround.prototype._enableTypeAroundUIInjection = function () {
        var editor = this.editor;
        var schema = editor.model.schema;
        var t = editor.locale.t;
        var buttonTitles = {
            before: t('Insert paragraph before block'),
            after: t('Insert paragraph after block')
        };
        editor.editing.downcastDispatcher.on('insert', function (evt, data, conversionApi) {
            var viewElement = conversionApi.mapper.toViewElement(data.item);
            // Filter out non-widgets and inline widgets.
            if (isTypeAroundWidget(viewElement, data.item, schema)) {
                injectUIIntoWidget(conversionApi.writer, buttonTitles, viewElement);
            }
        }, { priority: 'low' });
    };
    /**
     * Brings support for the fake caret that appears when either:
     *
     * * the selection moves to a widget from a position next to it using arrow keys,
     * * the arrow key is pressed when the widget is already selected.
     *
     * The fake caret lets the user know that they can start typing or just press
     * <kbd>Enter</kbd> to insert a paragraph at the position next to a widget as suggested by the fake caret.
     *
     * The fake caret disappears when the user changes the selection or the editor
     * gets blurred.
     *
     * The whole idea is as follows:
     *
     * 1. A user does one of the 2 scenarios described at the beginning.
     * 2. The "keydown" listener is executed and the decision is made whether to show or hide the fake caret.
     * 3. If it should show up, the `widget-type-around` model selection attribute is set indicating
     *    on which side of the widget it should appear.
     * 4. The selection dispatcher reacts to the selection attribute and sets CSS classes responsible for the
     *    fake caret on the view widget.
     * 5. If the fake caret should disappear, the selection attribute is removed and the dispatcher
     *    does the CSS class clean-up in the view.
     * 6. Additionally, `change:range` and `FocusTracker#isFocused` listeners also remove the selection
     *    attribute (the former also removes widget CSS classes).
     *
     * @private
     */
    WidgetTypeAround.prototype._enableTypeAroundFakeCaretActivationUsingKeyboardArrows = function () {
        var _this = this;
        var editor = this.editor;
        var model = editor.model;
        var modelSelection = model.document.selection;
        var schema = model.schema;
        var editingView = editor.editing.view;
        // This is the main listener responsible for the fake caret.
        // Note: The priority must precede the default Widget class keydown handler ("high") and the
        // TableKeyboard keydown handler ("high-10").
        this._listenToIfEnabled(editingView.document, 'keydown', function (evt, domEventData) {
            if (isArrowKeyCode(domEventData.keyCode)) {
                _this._handleArrowKeyPress(evt, domEventData);
            }
        }, { priority: priorities.get('high') + 10 });
        // This listener makes sure the widget type around selection attribute will be gone from the model
        // selection as soon as the model range changes. This attribute only makes sense when a widget is selected
        // (and the "fake horizontal caret" is visible) so whenever the range changes (e.g. selection moved somewhere else),
        // let's get rid of the attribute so that the selection downcast dispatcher isn't even bothered.
        this._listenToIfEnabled(modelSelection, 'change:range', function (evt, data) {
            // Do not reset the selection attribute when the change was indirect.
            if (!data.directChange) {
                return;
            }
            // Get rid of the widget type around attribute of the selection on every change:range.
            // If the range changes, it means for sure, the user is no longer in the active ("fake horizontal caret") mode.
            editor.model.change(function (writer) {
                writer.removeSelectionAttribute(TYPE_AROUND_SELECTION_ATTRIBUTE);
            });
        });
        // Get rid of the widget type around attribute of the selection on every document change
        // that makes widget not selected any more (i.e. widget was removed).
        this._listenToIfEnabled(model.document, 'change:data', function () {
            var selectedModelElement = modelSelection.getSelectedElement();
            if (selectedModelElement) {
                var selectedViewElement = editor.editing.mapper.toViewElement(selectedModelElement);
                if (isTypeAroundWidget(selectedViewElement, selectedModelElement, schema)) {
                    return;
                }
            }
            editor.model.change(function (writer) {
                writer.removeSelectionAttribute(TYPE_AROUND_SELECTION_ATTRIBUTE);
            });
        });
        // React to changes of the model selection attribute made by the arrow keys listener.
        // If the block widget is selected and the attribute changes, downcast the attribute to special
        // CSS classes associated with the active ("fake horizontal caret") mode of the widget.
        this._listenToIfEnabled(editor.editing.downcastDispatcher, 'selection', function (evt, data, conversionApi) {
            var writer = conversionApi.writer;
            if (_this._currentFakeCaretModelElement) {
                var selectedViewElement_1 = conversionApi.mapper.toViewElement(_this._currentFakeCaretModelElement);
                if (selectedViewElement_1) {
                    // Get rid of CSS classes associated with the active ("fake horizontal caret") mode from the view widget.
                    writer.removeClass(POSSIBLE_INSERTION_POSITIONS.map(positionToWidgetCssClass), selectedViewElement_1);
                    _this._currentFakeCaretModelElement = null;
                }
            }
            var selectedModelElement = data.selection.getSelectedElement();
            if (!selectedModelElement) {
                return;
            }
            var selectedViewElement = conversionApi.mapper.toViewElement(selectedModelElement);
            if (!isTypeAroundWidget(selectedViewElement, selectedModelElement, schema)) {
                return;
            }
            var typeAroundFakeCaretPosition = getTypeAroundFakeCaretPosition(data.selection);
            if (!typeAroundFakeCaretPosition) {
                return;
            }
            writer.addClass(positionToWidgetCssClass(typeAroundFakeCaretPosition), selectedViewElement);
            // Remember the view widget that got the "fake-caret" CSS class. This class should be removed ASAP when the
            // selection changes
            _this._currentFakeCaretModelElement = selectedModelElement;
        });
        this._listenToIfEnabled(editor.ui.focusTracker, 'change:isFocused', function (evt, name, isFocused) {
            if (!isFocused) {
                editor.model.change(function (writer) {
                    writer.removeSelectionAttribute(TYPE_AROUND_SELECTION_ATTRIBUTE);
                });
            }
        });
        function positionToWidgetCssClass(position) {
            return "ck-widget_type-around_show-fake-caret_" + position;
        }
    };
    /**
     * A listener executed on each "keydown" in the view document, a part of
     * {@link #_enableTypeAroundFakeCaretActivationUsingKeyboardArrows}.
     *
     * It decides whether the arrow keypress should activate the fake caret or not (also whether it should
     * be deactivated).
     *
     * The fake caret activation is done by setting the `widget-type-around` model selection attribute
     * in this listener, and stopping and preventing the event that would normally be handled by the widget
     * plugin that is responsible for the regular keyboard navigation near/across all widgets (that
     * includes inline widgets, which are ignored by the widget type around plugin).
     *
     * @private
     */
    WidgetTypeAround.prototype._handleArrowKeyPress = function (evt, domEventData) {
        var editor = this.editor;
        var model = editor.model;
        var modelSelection = model.document.selection;
        var schema = model.schema;
        var editingView = editor.editing.view;
        var keyCode = domEventData.keyCode;
        var isForward = isForwardArrowKeyCode(keyCode, editor.locale.contentLanguageDirection);
        var selectedViewElement = editingView.document.selection.getSelectedElement();
        var selectedModelElement = editor.editing.mapper.toModelElement(selectedViewElement);
        var shouldStopAndPreventDefault;
        // Handle keyboard navigation when a type-around-compatible widget is currently selected.
        if (isTypeAroundWidget(selectedViewElement, selectedModelElement, schema)) {
            shouldStopAndPreventDefault = this._handleArrowKeyPressOnSelectedWidget(isForward);
        }
        // Handle keyboard arrow navigation when the selection is next to a type-around-compatible widget
        // and the widget is about to be selected.
        else if (modelSelection.isCollapsed) {
            shouldStopAndPreventDefault = this._handleArrowKeyPressWhenSelectionNextToAWidget(isForward);
        }
        if (shouldStopAndPreventDefault) {
            domEventData.preventDefault();
            evt.stop();
        }
    };
    /**
     * Handles the keyboard navigation on "keydown" when a widget is currently selected and activates or deactivates
     * the fake caret for that widget, depending on the current value of the `widget-type-around` model
     * selection attribute and the direction of the pressed arrow key.
     *
     * @private
     * @param {Boolean} isForward `true` when the pressed arrow key was responsible for the forward model selection movement
     * as in {@link module:utils/keyboard~isForwardArrowKeyCode}.
     * @returns {Boolean} Returns `true` when the keypress was handled and no other keydown listener of the editor should
     * process the event any further. Returns `false` otherwise.
     */
    WidgetTypeAround.prototype._handleArrowKeyPressOnSelectedWidget = function (isForward) {
        var editor = this.editor;
        var model = editor.model;
        var modelSelection = model.document.selection;
        var typeAroundFakeCaretPosition = getTypeAroundFakeCaretPosition(modelSelection);
        return model.change(function (writer) {
            // If the fake caret is displayed...
            if (typeAroundFakeCaretPosition) {
                var isLeavingWidget = typeAroundFakeCaretPosition === (isForward ? 'after' : 'before');
                // If the keyboard arrow works against the value of the selection attribute...
                // then remove the selection attribute but prevent default DOM actions
                // and do not let the Widget plugin listener move the selection. This brings
                // the widget back to the state, for instance, like if was selected using the mouse.
                //
                // **Note**: If leaving the widget when the fake caret is active, then the default
                // Widget handler will change the selection and, in turn, this will automatically discard
                // the selection attribute.
                if (!isLeavingWidget) {
                    writer.removeSelectionAttribute(TYPE_AROUND_SELECTION_ATTRIBUTE);
                    return true;
                }
            }
            // If the fake caret wasn't displayed, let's set it now according to the direction of the arrow
            // key press. This also means we cannot let the Widget plugin listener move the selection.
            else {
                writer.setSelectionAttribute(TYPE_AROUND_SELECTION_ATTRIBUTE, isForward ? 'after' : 'before');
                return true;
            }
            return false;
        });
    };
    /**
     * Handles the keyboard navigation on "keydown" when **no** widget is selected but the selection is **directly** next
     * to one and upon the fake caret should become active for this widget upon arrow keypress
     * (AKA entering/selecting the widget).
     *
     * **Note**: This code mirrors the implementation from the widget plugin but also adds the selection attribute.
     * Unfortunately, there is no safe way to let the widget plugin do the selection part first and then just set the
     * selection attribute here in the widget type around plugin. This is why this code must duplicate some from the widget plugin.
     *
     * @private
     * @param {Boolean} isForward `true` when the pressed arrow key was responsible for the forward model selection movement
     * as in {@link module:utils/keyboard~isForwardArrowKeyCode}.
     * @returns {Boolean} Returns `true` when the keypress was handled and no other keydown listener of the editor should
     * process the event any further. Returns `false` otherwise.
     */
    WidgetTypeAround.prototype._handleArrowKeyPressWhenSelectionNextToAWidget = function (isForward) {
        var editor = this.editor;
        var model = editor.model;
        var schema = model.schema;
        var widgetPlugin = editor.plugins.get('Widget');
        // This is the widget the selection is about to be set on.
        var modelElementNextToSelection = widgetPlugin._getObjectElementNextToSelection(isForward);
        var viewElementNextToSelection = editor.editing.mapper.toViewElement(modelElementNextToSelection);
        if (isTypeAroundWidget(viewElementNextToSelection, modelElementNextToSelection, schema)) {
            model.change(function (writer) {
                widgetPlugin._setSelectionOverElement(modelElementNextToSelection);
                writer.setSelectionAttribute(TYPE_AROUND_SELECTION_ATTRIBUTE, isForward ? 'before' : 'after');
            });
            // The change() block above does the same job as the Widget plugin. The event can
            // be safely canceled.
            return true;
        }
        return false;
    };
    /**
     * Registers a `mousedown` listener for the view document which intercepts events
     * coming from the widget type around UI, which happens when a user clicks one of the buttons
     * that insert a paragraph next to a widget.
     *
     * @private
     */
    WidgetTypeAround.prototype._enableInsertingParagraphsOnButtonClick = function () {
        var _this = this;
        var editor = this.editor;
        var editingView = editor.editing.view;
        this._listenToIfEnabled(editingView.document, 'mousedown', function (evt, domEventData) {
            var button = getClosestTypeAroundDomButton(domEventData.domTarget);
            if (!button) {
                return;
            }
            var buttonPosition = getTypeAroundButtonPosition(button);
            var widgetViewElement = getClosestWidgetViewElement(button, editingView.domConverter);
            var widgetModelElement = editor.editing.mapper.toModelElement(widgetViewElement);
            _this._insertParagraph(widgetModelElement, buttonPosition);
            domEventData.preventDefault();
            evt.stop();
        });
    };
    /**
     * Creates the <kbd>Enter</kbd> key listener on the view document that allows the user to insert a paragraph
     * near the widget when either:
     *
     * * The fake caret was first activated using the arrow keys,
     * * The entire widget is selected in the model.
     *
     * In the first case, the new paragraph is inserted according to the `widget-type-around` selection
     * attribute (see {@link #_handleArrowKeyPress}).
     *
     * In the second case, the new paragraph is inserted based on whether a soft (<kbd>Shift</kbd>+<kbd>Enter</kbd>) keystroke
     * was pressed or not.
     *
     * @private
     */
    WidgetTypeAround.prototype._enableInsertingParagraphsOnEnterKeypress = function () {
        var _this = this;
        var editor = this.editor;
        var editingView = editor.editing.view;
        this._listenToIfEnabled(editingView.document, 'enter', function (evt, domEventData) {
            var selectedViewElement = editingView.document.selection.getSelectedElement();
            var selectedModelElement = editor.editing.mapper.toModelElement(selectedViewElement);
            var schema = editor.model.schema;
            var wasHandled;
            // First check if the widget is selected and there's a type around selection attribute associated
            // with the fake caret that would tell where to insert a new paragraph.
            if (_this._insertParagraphAccordingToFakeCaretPosition()) {
                wasHandled = true;
            }
            // Then, if there is no selection attribute associated with the fake caret, check if the widget
            // simply is selected and create a new paragraph according to the keystroke (Shift+)Enter.
            else if (isTypeAroundWidget(selectedViewElement, selectedModelElement, schema)) {
                _this._insertParagraph(selectedModelElement, domEventData.isSoft ? 'before' : 'after');
                wasHandled = true;
            }
            if (wasHandled) {
                domEventData.preventDefault();
                evt.stop();
            }
        });
    };
    /**
     * Similar to the {@link #_enableInsertingParagraphsOnEnterKeypress}, it allows the user
     * to insert a paragraph next to a widget when the fake caret was activated using arrow
     * keys but it responds to typing keystrokes instead of <kbd>Enter</kbd>.
     *
     * "Typing keystrokes" are keystrokes that insert new content into the document,
     * for instance, letters ("a") or numbers ("4"). The "keydown" listener enabled by this method
     * will insert a new paragraph according to the `widget-type-around` model selection attribute
     * as the user simply starts typing, which creates the impression that the fake caret
     * behaves like a real one rendered by the browser (AKA your text appears where the caret was).
     *
     * **Note**: At the moment this listener creates 2 undo steps: one for the `insertParagraph` command
     * and another one for actual typing. It is not a disaster but this may need to be fixed
     * sooner or later.
     *
     * Learn more in {@link module:typing/utils/injectunsafekeystrokeshandling}.
     *
     * @private
     */
    WidgetTypeAround.prototype._enableInsertingParagraphsOnTypingKeystroke = function () {
        var _this = this;
        var editor = this.editor;
        var editingView = editor.editing.view;
        var keyCodesHandledSomewhereElse = [
            keyCodes.enter,
            keyCodes.delete,
            keyCodes.backspace
        ];
        // Note: The priority must precede the default Widget class keydown handler ("high") and the
        // TableKeyboard keydown handler ("high + 1").
        this._listenToIfEnabled(editingView.document, 'keydown', function (evt, domEventData) {
            // Don't handle enter/backspace/delete here. They are handled in dedicated listeners.
            if (!keyCodesHandledSomewhereElse.includes(domEventData.keyCode) && !isNonTypingKeystroke(domEventData)) {
                _this._insertParagraphAccordingToFakeCaretPosition();
            }
        }, { priority: priorities.get('high') + 1 });
    };
    /**
     * It creates a "delete" event listener on the view document to handle cases when the <kbd>Delete</kbd> or <kbd>Backspace</kbd>
     * is pressed and the fake caret is currently active.
     *
     * The fake caret should create an illusion of a real browser caret so that when it appears before or after
     * a widget, pressing <kbd>Delete</kbd> or <kbd>Backspace</kbd> should remove a widget or delete the content
     * before or after a widget (depending on the content surrounding the widget).
     *
     * @private
     */
    WidgetTypeAround.prototype._enableDeleteIntegration = function () {
        var editor = this.editor;
        var editingView = editor.editing.view;
        var model = editor.model;
        var schema = model.schema;
        // Note: The priority must precede the default Widget class delete handler.
        this._listenToIfEnabled(editingView.document, 'delete', function (evt, domEventData) {
            var typeAroundFakeCaretPosition = getTypeAroundFakeCaretPosition(model.document.selection);
            // This listener handles only these cases when the fake caret is active.
            if (!typeAroundFakeCaretPosition) {
                return;
            }
            var direction = domEventData.direction;
            var selectedModelWidget = model.document.selection.getSelectedElement();
            var isFakeCaretBefore = typeAroundFakeCaretPosition === 'before';
            var isForwardDelete = direction == 'forward';
            var shouldDeleteEntireWidget = isFakeCaretBefore === isForwardDelete;
            if (shouldDeleteEntireWidget) {
                editor.execute('delete', {
                    selection: model.createSelection(selectedModelWidget, 'on')
                });
            }
            else {
                var range_1 = schema.getNearestSelectionRange(model.createPositionAt(selectedModelWidget, typeAroundFakeCaretPosition), direction);
                // If there is somewhere to move selection to, then there will be something to delete.
                if (range_1) {
                    // If the range is NOT collapsed, then we know that the range contains an object (see getNearestSelectionRange() docs).
                    if (!range_1.isCollapsed) {
                        model.change(function (writer) {
                            writer.setSelection(range_1);
                            editor.execute(isForwardDelete ? 'forwardDelete' : 'delete');
                        });
                    }
                    else {
                        var probe = model.createSelection(range_1.start);
                        model.modifySelection(probe, { direction: direction });
                        // If the range is collapsed, let's see if a non-collapsed range exists that can could be deleted.
                        // If such range exists, use the editor command because it it safe for collaboration (it merges where it can).
                        if (!probe.focus.isEqual(range_1.start)) {
                            model.change(function (writer) {
                                writer.setSelection(range_1);
                                editor.execute(isForwardDelete ? 'forwardDelete' : 'delete');
                            });
                        }
                        // If there is no non-collapsed range to be deleted then we are sure that there is an empty element
                        // next to a widget that should be removed. "delete" and "forwardDelete" commands cannot get rid of it
                        // so calling Model#deleteContent here manually.
                        else {
                            var deepestEmptyRangeAncestor = getDeepestEmptyElementAncestor(schema, range_1.start.parent);
                            model.deleteContent(model.createSelection(deepestEmptyRangeAncestor, 'on'), {
                                doNotAutoparagraph: true
                            });
                        }
                    }
                }
            }
            // If some content was deleted, don't let the handler from the Widget plugin kick in.
            // If nothing was deleted, then the default handler will have nothing to do anyway.
            domEventData.preventDefault();
            evt.stop();
        }, { priority: priorities.get('high') + 1 });
    };
    /**
     * Attaches the {@link module:engine/model/model~Model#event:insertContent} event listener that, for instance, allows the user to paste
     * content near a widget when the fake caret is first activated using the arrow keys.
     *
     * The content is inserted according to the `widget-type-around` selection attribute (see {@link #_handleArrowKeyPress}).
     *
     * @private
     */
    WidgetTypeAround.prototype._enableInsertContentIntegration = function () {
        var editor = this.editor;
        var model = this.editor.model;
        var documentSelection = model.document.selection;
        this._listenToIfEnabled(editor.model, 'insertContent', function (evt, _a) {
            var content = _a[0], selectable = _a[1];
            if (selectable && !selectable.is('documentSelection')) {
                return;
            }
            var typeAroundFakeCaretPosition = getTypeAroundFakeCaretPosition(documentSelection);
            if (!typeAroundFakeCaretPosition) {
                return;
            }
            evt.stop();
            return model.change(function (writer) {
                var selectedElement = documentSelection.getSelectedElement();
                var position = model.createPositionAt(selectedElement, typeAroundFakeCaretPosition);
                var selection = writer.createSelection(position);
                var result = model.insertContent(content, selection);
                writer.setSelection(selection);
                return result;
            });
        }, { priority: 'high' });
    };
    return WidgetTypeAround;
}(Plugin));
// Injects the type around UI into a view widget instance.
//
// @param {module:engine/view/downcastwriter~DowncastWriter} viewWriter
// @param {Object.<String,String>} buttonTitles
// @param {module:engine/view/element~Element} widgetViewElement
function injectUIIntoWidget(viewWriter, buttonTitles, widgetViewElement) {
    var typeAroundWrapper = viewWriter.createUIElement('div', {
        class: 'ck ck-reset_all ck-widget__type-around'
    }, function (domDocument) {
        var wrapperDomElement = this.toDomElement(domDocument);
        injectButtons(wrapperDomElement, buttonTitles);
        injectFakeCaret(wrapperDomElement);
        return wrapperDomElement;
    });
    // Inject the type around wrapper into the widget's wrapper.
    viewWriter.insert(viewWriter.createPositionAt(widgetViewElement, 'end'), typeAroundWrapper);
}
// FYI: Not using the IconView class because each instance would need to be destroyed to avoid memory leaks
// and it's pretty hard to figure out when a view (widget) is gone for good so it's cheaper to use raw
// <svg> here.
//
// @param {HTMLElement} wrapperDomElement
// @param {Object.<String,String>} buttonTitles
function injectButtons(wrapperDomElement, buttonTitles) {
    for (var _i = 0, POSSIBLE_INSERTION_POSITIONS_1 = POSSIBLE_INSERTION_POSITIONS; _i < POSSIBLE_INSERTION_POSITIONS_1.length; _i++) {
        var position = POSSIBLE_INSERTION_POSITIONS_1[_i];
        var buttonTemplate = new Template({
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-widget__type-around__button',
                    "ck-widget__type-around__button_" + position
                ],
                title: buttonTitles[position]
            },
            children: [
                wrapperDomElement.ownerDocument.importNode(RETURN_ARROW_ICON_ELEMENT, true)
            ]
        });
        wrapperDomElement.appendChild(buttonTemplate.render());
    }
}
// @param {HTMLElement} wrapperDomElement
function injectFakeCaret(wrapperDomElement) {
    var caretTemplate = new Template({
        tag: 'div',
        attributes: {
            class: [
                'ck',
                'ck-widget__type-around__fake-caret'
            ]
        }
    });
    wrapperDomElement.appendChild(caretTemplate.render());
}
// Returns the ancestor of an element closest to the root which is empty. For instance,
// for `<baz>`:
//
//		<foo>abc<bar><baz></baz></bar></foo>
//
// it returns `<bar>`.
//
// @param {module:engine/model/schema~Schema} schema
// @param {module:engine/model/element~Element} element
// @returns {module:engine/model/element~Element|null}
function getDeepestEmptyElementAncestor(schema, element) {
    var deepestEmptyAncestor = element;
    for (var _i = 0, _a = element.getAncestors({ parentFirst: true }); _i < _a.length; _i++) {
        var ancestor = _a[_i];
        if (ancestor.childCount > 1 || schema.isLimit(ancestor)) {
            break;
        }
        deepestEmptyAncestor = ancestor;
    }
    return deepestEmptyAncestor;
}
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module widget/verticalnavigationhandler
 */
/**
 * Returns 'keydown' handler for up/down arrow keys that modifies the caret movement if it's in a text line next to an object.
 *
 * @param {module:engine/controller/editingcontroller~EditingController} editing The editing controller.
 * @returns {Function}
 */
function verticalNavigationHandler(editing) {
    var model = editing.model;
    return function (evt, data) {
        var arrowUpPressed = data.keyCode == keyCodes.arrowup;
        var arrowDownPressed = data.keyCode == keyCodes.arrowdown;
        var expandSelection = data.shiftKey;
        var selection = model.document.selection;
        if (!arrowUpPressed && !arrowDownPressed) {
            return;
        }
        var isForward = arrowDownPressed;
        // Navigation is in the opposite direction than the selection direction so this is shrinking of the selection.
        // Selection for sure will not approach any object.
        if (expandSelection && selectionWillShrink(selection, isForward)) {
            return;
        }
        // Find a range between selection and closest limit element.
        var range = findTextRangeFromSelection(editing, selection, isForward);
        if (!range || range.isCollapsed) {
            return;
        }
        // If the range is a single line (there is no word wrapping) then move the selection to the position closest to the limit element.
        //
        // We can't move the selection directly to the isObject element (eg. table cell) because of dual position at the end/beginning
        // of wrapped line (it's at the same time at the end of one line and at the start of the next line).
        if (isSingleLineRange(editing, range, isForward)) {
            model.change(function (writer) {
                var newPosition = isForward ? range.end : range.start;
                if (expandSelection) {
                    var newSelection = model.createSelection(selection.anchor);
                    newSelection.setFocus(newPosition);
                    writer.setSelection(newSelection);
                }
                else {
                    writer.setSelection(newPosition);
                }
            });
            evt.stop();
            data.preventDefault();
            data.stopPropagation();
        }
    };
}
// Finds the range between selection and closest limit element (in the direction of navigation).
// The position next to limit element is adjusted to the closest allowed `$text` position.
//
// Returns `null` if, according to the schema, the resulting range cannot contain a `$text` element.
//
// @param {module:engine/controller/editingcontroller~EditingController} editing The editing controller.
// @param {module:engine/model/selection~Selection} selection The current selection.
// @param {Boolean} isForward The expected navigation direction.
// @returns {module:engine/model/range~Range|null}
//
function findTextRangeFromSelection(editing, selection, isForward) {
    var model = editing.model;
    if (isForward) {
        var startPosition = selection.isCollapsed ? selection.focus : selection.getLastPosition();
        var endPosition = getNearestNonInlineLimit(model, startPosition, 'forward');
        // There is no limit element, browser should handle this.
        if (!endPosition) {
            return null;
        }
        var range = model.createRange(startPosition, endPosition);
        var lastRangePosition = getNearestTextPosition(model.schema, range, 'backward');
        if (lastRangePosition && startPosition.isBefore(lastRangePosition)) {
            return model.createRange(startPosition, lastRangePosition);
        }
        return null;
    }
    else {
        var endPosition = selection.isCollapsed ? selection.focus : selection.getFirstPosition();
        var startPosition = getNearestNonInlineLimit(model, endPosition, 'backward');
        // There is no limit element, browser should handle this.
        if (!startPosition) {
            return null;
        }
        var range = model.createRange(startPosition, endPosition);
        var firstRangePosition = getNearestTextPosition(model.schema, range, 'forward');
        if (firstRangePosition && endPosition.isAfter(firstRangePosition)) {
            return model.createRange(firstRangePosition, endPosition);
        }
        return null;
    }
}
// Finds the limit element position that is closest to startPosition.
//
// @param {module:engine/model/model~Model} model
// @param {<module:engine/model/position~Position>} startPosition
// @param {'forward'|'backward'} direction Search direction.
// @returns {<module:engine/model/position~Position>|null}
//
function getNearestNonInlineLimit(model, startPosition, direction) {
    var schema = model.schema;
    var range = model.createRangeIn(startPosition.root);
    var walkerValueType = direction == 'forward' ? 'elementStart' : 'elementEnd';
    for (var _i = 0, _a = range.getWalker({ startPosition: startPosition, direction: direction }); _i < _a.length; _i++) {
        var _b = _a[_i], previousPosition = _b.previousPosition, item = _b.item, type = _b.type;
        if (schema.isLimit(item) && !schema.isInline(item)) {
            return previousPosition;
        }
        // Stop looking for isLimit element if the next element is a block element (it is for sure not single line).
        if (type == walkerValueType && schema.isBlock(item)) {
            return null;
        }
    }
    return null;
}
// Basing on the provided range, finds the first or last (depending on `direction`) position inside the range
// that can contain `$text` (according to schema).
//
// @param {module:engine/model/schema~Schema} schema The schema.
// @param {module:engine/model/range~Range} range The range to find the position in.
// @param {'forward'|'backward'} direction Search direction.
// @returns {module:engine/model/position~Position} The nearest selection range.
//
function getNearestTextPosition(schema, range, direction) {
    var position = direction == 'backward' ? range.end : range.start;
    if (schema.checkChild(position, '$text')) {
        return position;
    }
    for (var _i = 0, _a = range.getWalker({ direction: direction }); _i < _a.length; _i++) {
        var nextPosition = _a[_i].nextPosition;
        if (schema.checkChild(nextPosition, '$text')) {
            return nextPosition;
        }
    }
}
// Checks if the DOM range corresponding to the provided model range renders as a single line by analyzing DOMRects
// (verifying if they visually wrap content to the next line).
//
// @param {module:engine/controller/editingcontroller~EditingController} editing The editing controller.
// @param {module:engine/model/range~Range} modelRange The current table cell content range.
// @param {Boolean} isForward The expected navigation direction.
// @returns {Boolean}
//
function isSingleLineRange(editing, modelRange, isForward) {
    var model = editing.model;
    var domConverter = editing.view.domConverter;
    // Wrapped lines contain exactly the same position at the end of current line
    // and at the beginning of next line. That position's client rect is at the end
    // of current line. In case of caret at first position of the last line that 'dual'
    // position would be detected as it's not the last line.
    if (isForward) {
        var probe = model.createSelection(modelRange.start);
        model.modifySelection(probe);
        // If the new position is at the end of the container then we can't use this position
        // because it would provide incorrect result for eg caption of image and selection
        // just before end of it. Also in this case there is no "dual" position.
        if (!probe.focus.isAtEnd && !modelRange.start.isEqual(probe.focus)) {
            modelRange = model.createRange(probe.focus, modelRange.end);
        }
    }
    var viewRange = editing.mapper.toViewRange(modelRange);
    var domRange = domConverter.viewRangeToDom(viewRange);
    var rects = Rect.getDomRangeRects(domRange);
    var boundaryVerticalPosition;
    for (var _i = 0, rects_1 = rects; _i < rects_1.length; _i++) {
        var rect = rects_1[_i];
        if (boundaryVerticalPosition === undefined) {
            boundaryVerticalPosition = Math.round(rect.bottom);
            continue;
        }
        // Let's check if this rect is in new line.
        if (Math.round(rect.top) >= boundaryVerticalPosition) {
            return false;
        }
        boundaryVerticalPosition = Math.max(boundaryVerticalPosition, Math.round(rect.bottom));
    }
    return true;
}
function selectionWillShrink(selection, isForward) {
    return !selection.isCollapsed && selection.isBackward == isForward;
}
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * The widget plugin. It enables base support for widgets.
 *
 * See {@glink api/widget package page} for more details and documentation.
 *
 * This plugin enables multiple behaviors required by widgets:
 *
 * * The model to view selection converter for the editing pipeline (it handles widget custom selection rendering).
 * If a converted selection wraps around a widget element, that selection is marked as
 * {@link module:engine/view/selection~Selection#isFake fake}. Additionally, the `ck-widget_selected` CSS class
 * is added to indicate that widget has been selected.
 * * The mouse and keyboard events handling on and around widget elements.
 *
 * @extends module:core/plugin~Plugin
 */
var Widget = /** @class */ (function (_super) {
    __extends(Widget, _super);
    function Widget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Widget, "pluginName", {
        /**
         * @inheritDoc
         */
        get: function () {
            return 'Widget';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Widget, "requires", {
        /**
         * @inheritDoc
         */
        get: function () {
            return [WidgetTypeAround];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    Widget.prototype.init = function () {
        var _this = this;
        var view = this.editor.editing.view;
        var viewDocument = view.document;
        /**
         * Holds previously selected widgets.
         *
         * @private
         * @type {Set.<module:engine/view/element~Element>}
         */
        this._previouslySelected = new Set();
        // Model to view selection converter.
        // Converts selection placed over widget element to fake selection
        this.editor.editing.downcastDispatcher.on('selection', function (evt, data, conversionApi) {
            // Remove selected class from previously selected widgets.
            _this._clearPreviouslySelectedWidgets(conversionApi.writer);
            var viewWriter = conversionApi.writer;
            var viewSelection = viewWriter.document.selection;
            var selectedElement = viewSelection.getSelectedElement();
            var lastMarked = null;
            for (var _i = 0, _a = viewSelection.getRanges(); _i < _a.length; _i++) {
                var range = _a[_i];
                for (var _b = 0, range_2 = range; _b < range_2.length; _b++) {
                    var value = range_2[_b];
                    var node = value.item;
                    // Do not mark nested widgets in selected one. See: #57.
                    if (isWidget(node) && !isChild(node, lastMarked)) {
                        viewWriter.addClass(WIDGET_SELECTED_CLASS_NAME, node);
                        _this._previouslySelected.add(node);
                        lastMarked = node;
                        // Check if widget is a single element selected.
                        if (node == selectedElement) {
                            viewWriter.setSelection(viewSelection.getRanges(), { fake: true, label: getLabel(selectedElement) });
                        }
                    }
                }
            }
        }, { priority: 'low' });
        // If mouse down is pressed on widget - create selection over whole widget.
        view.addObserver(MouseObserver);
        this.listenTo(viewDocument, 'mousedown', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this._onMousedown.apply(_this, args);
        });
        // There are two keydown listeners working on different priorities. This allows other
        // features such as WidgetTypeAround or TableKeyboard to attach their listeners in between
        // and customize the behavior even further in different content/selection scenarios.
        //
        // * The first listener handles changing the selection on arrow key press
        // if the widget is selected or if the selection is next to a widget and the widget
        // should become selected upon the arrow key press.
        //
        // * The second (late) listener makes sure the default browser action on arrow key press is
        // prevented when a widget is selected. This prevents the selection from being moved
        // from a fake selection container.
        this.listenTo(viewDocument, 'keydown', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this._handleSelectionChangeOnArrowKeyPress.apply(_this, args);
        }, { priority: 'high' });
        this.listenTo(viewDocument, 'keydown', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this._preventDefaultOnArrowKeyPress.apply(_this, args);
        }, { priority: priorities.get('high') - 20 });
        this.listenTo(viewDocument, 'keydown', verticalNavigationHandler(this.editor.editing));
        // Handle custom delete behaviour.
        this.listenTo(viewDocument, 'delete', function (evt, data) {
            if (_this._handleDelete(data.direction == 'forward')) {
                data.preventDefault();
                evt.stop();
            }
        }, { priority: 'high' });
    };
    /**
     * Handles {@link module:engine/view/document~Document#event:mousedown mousedown} events on widget elements.
     *
     * @private
     * @param {module:utils/eventinfo~EventInfo} eventInfo
     * @param {module:engine/view/observer/domeventdata~DomEventData} domEventData
     */
    Widget.prototype._onMousedown = function (eventInfo, domEventData) {
        var editor = this.editor;
        var view = editor.editing.view;
        var viewDocument = view.document;
        var element = domEventData.target;
        // Do nothing for single or double click inside nested editable.
        if (isInsideNestedEditable(element)) {
            // But at least triple click inside nested editable causes broken selection in Safari.
            // For such event, we select the entire nested editable element.
            // See: https://github.com/ckeditor/ckeditor5/issues/1463.
            if ((env.isSafari || env.isGecko) && domEventData.domEvent.detail >= 3) {
                var mapper = editor.editing.mapper;
                var viewElement = element.is('attributeElement') ?
                    element.findAncestor(function (element) { return !element.is('attributeElement'); }) : element;
                var modelElement_1 = mapper.toModelElement(viewElement);
                domEventData.preventDefault();
                this.editor.model.change(function (writer) {
                    writer.setSelection(modelElement_1, 'in');
                });
            }
            return;
        }
        // If target is not a widget element - check if one of the ancestors is.
        if (!isWidget(element)) {
            element = element.findAncestor(isWidget);
            if (!element) {
                return;
            }
        }
        domEventData.preventDefault();
        // Focus editor if is not focused already.
        if (!viewDocument.isFocused) {
            view.focus();
        }
        // Create model selection over widget.
        var modelElement = editor.editing.mapper.toModelElement(element);
        this._setSelectionOverElement(modelElement);
    };
    /**
     * Handles {@link module:engine/view/document~Document#event:keydown keydown} events and changes
     * the model selection when:
     *
     * * arrow key is pressed when the widget is selected,
     * * the selection is next to a widget and the widget should become selected upon the arrow key press.
     *
     * See {@link #_preventDefaultOnArrowKeyPress}.
     *
     * @private
     * @param {module:utils/eventinfo~EventInfo} eventInfo
     * @param {module:engine/view/observer/domeventdata~DomEventData} domEventData
     */
    Widget.prototype._handleSelectionChangeOnArrowKeyPress = function (eventInfo, domEventData) {
        var keyCode = domEventData.keyCode;
        // Checks if the keys were handled and then prevents the default event behaviour and stops
        // the propagation.
        if (!isArrowKeyCode(keyCode)) {
            return;
        }
        var model = this.editor.model;
        var schema = model.schema;
        var modelSelection = model.document.selection;
        var objectElement = modelSelection.getSelectedElement();
        var isForward = isForwardArrowKeyCode(keyCode, this.editor.locale.contentLanguageDirection);
        // If object element is selected.
        if (objectElement && schema.isObject(objectElement)) {
            var position = isForward ? modelSelection.getLastPosition() : modelSelection.getFirstPosition();
            var newRange_1 = schema.getNearestSelectionRange(position, isForward ? 'forward' : 'backward');
            if (newRange_1) {
                model.change(function (writer) {
                    writer.setSelection(newRange_1);
                });
                domEventData.preventDefault();
                eventInfo.stop();
            }
            return;
        }
        // If selection is next to object element.
        // Return if not collapsed.
        if (!modelSelection.isCollapsed) {
            return;
        }
        var objectElementNextToSelection = this._getObjectElementNextToSelection(isForward);
        if (objectElementNextToSelection && schema.isObject(objectElementNextToSelection)) {
            this._setSelectionOverElement(objectElementNextToSelection);
            domEventData.preventDefault();
            eventInfo.stop();
        }
    };
    /**
     * Handles {@link module:engine/view/document~Document#event:keydown keydown} events and prevents
     * the default browser behavior to make sure the fake selection is not being moved from a fake selection
     * container.
     *
     * See {@link #_handleSelectionChangeOnArrowKeyPress}.
     *
     * @private
     * @param {module:utils/eventinfo~EventInfo} eventInfo
     * @param {module:engine/view/observer/domeventdata~DomEventData} domEventData
     */
    Widget.prototype._preventDefaultOnArrowKeyPress = function (eventInfo, domEventData) {
        var keyCode = domEventData.keyCode;
        // Checks if the keys were handled and then prevents the default event behaviour and stops
        // the propagation.
        if (!isArrowKeyCode(keyCode)) {
            return;
        }
        var model = this.editor.model;
        var schema = model.schema;
        var objectElement = model.document.selection.getSelectedElement();
        // If object element is selected.
        if (objectElement && schema.isObject(objectElement)) {
            domEventData.preventDefault();
            eventInfo.stop();
        }
    };
    /**
     * Handles delete keys: backspace and delete.
     *
     * @private
     * @param {Boolean} isForward Set to true if delete was performed in forward direction.
     * @returns {Boolean|undefined} Returns `true` if keys were handled correctly.
     */
    Widget.prototype._handleDelete = function (isForward) {
        var _this = this;
        // Do nothing when the read only mode is enabled.
        if (this.editor.isReadOnly) {
            return;
        }
        var modelDocument = this.editor.model.document;
        var modelSelection = modelDocument.selection;
        // Do nothing on non-collapsed selection.
        if (!modelSelection.isCollapsed) {
            return;
        }
        var objectElement = this._getObjectElementNextToSelection(isForward);
        if (objectElement) {
            this.editor.model.change(function (writer) {
                var previousNode = modelSelection.anchor.parent;
                // Remove previous element if empty.
                while (previousNode.isEmpty) {
                    var nodeToRemove = previousNode;
                    previousNode = nodeToRemove.parent;
                    writer.remove(nodeToRemove);
                }
                _this._setSelectionOverElement(objectElement);
            });
            return true;
        }
    };
    /**
     * Sets {@link module:engine/model/selection~Selection document's selection} over given element.
     *
     * @protected
     * @param {module:engine/model/element~Element} element
     */
    Widget.prototype._setSelectionOverElement = function (element) {
        this.editor.model.change(function (writer) {
            writer.setSelection(writer.createRangeOn(element));
        });
    };
    /**
     * Checks if {@link module:engine/model/element~Element element} placed next to the current
     * {@link module:engine/model/selection~Selection model selection} exists and is marked in
     * {@link module:engine/model/schema~Schema schema} as `object`.
     *
     * @protected
     * @param {Boolean} forward Direction of checking.
     * @returns {module:engine/model/element~Element|null}
     */
    Widget.prototype._getObjectElementNextToSelection = function (forward) {
        var model = this.editor.model;
        var schema = model.schema;
        var modelSelection = model.document.selection;
        // Clone current selection to use it as a probe. We must leave default selection as it is so it can return
        // to its current state after undo.
        var probe = model.createSelection(modelSelection);
        model.modifySelection(probe, { direction: forward ? 'forward' : 'backward' });
        var objectElement = forward ? probe.focus.nodeBefore : probe.focus.nodeAfter;
        if (!!objectElement && schema.isObject(objectElement)) {
            return objectElement;
        }
        return null;
    };
    /**
     * Removes CSS class from previously selected widgets.
     *
     * @private
     * @param {module:engine/view/downcastwriter~DowncastWriter} writer
     */
    Widget.prototype._clearPreviouslySelectedWidgets = function (writer) {
        for (var _i = 0, _a = this._previouslySelected; _i < _a.length; _i++) {
            var widget = _a[_i];
            writer.removeClass(WIDGET_SELECTED_CLASS_NAME, widget);
        }
        this._previouslySelected.clear();
    };
    return Widget;
}(Plugin));
// Returns `true` when element is a nested editable or is placed inside one.
//
// @param {module:engine/view/element~Element}
// @returns {Boolean}
function isInsideNestedEditable(element) {
    while (element) {
        if (element.is('editableElement') && !element.is('rootElement')) {
            return true;
        }
        // Click on nested widget should select it.
        if (isWidget(element)) {
            return false;
        }
        element = element.parent;
    }
    return false;
}
// Checks whether the specified `element` is a child of the `parent` element.
//
// @param {module:engine/view/element~Element} element An element to check.
// @param {module:engine/view/element~Element|null} parent A parent for the element.
// @returns {Boolean}
function isChild(element, parent) {
    if (!parent) {
        return false;
    }
    return Array.from(element.getAncestors()).includes(parent);
}
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * The image text alternative command. It is used to change the `alt` attribute of `<image>` elements.
 *
 * @extends module:core/command~Command
 */
var ImageTextAlternativeCommand = /** @class */ (function (_super) {
    __extends(ImageTextAlternativeCommand, _super);
    function ImageTextAlternativeCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * The command value: `false` if there is no `alt` attribute, otherwise the value of the `alt` attribute.
     *
     * @readonly
     * @observable
     * @member {String|Boolean} #value
     */
    /**
     * @inheritDoc
     */
    ImageTextAlternativeCommand.prototype.refresh = function () {
        var element = this.editor.model.document.selection.getSelectedElement();
        this.isEnabled = isImage(element);
        if (isImage(element) && element.hasAttribute('alt')) {
            this.value = element.getAttribute('alt');
        }
        else {
            this.value = false;
        }
    };
    /**
     * Executes the command.
     *
     * @fires execute
     * @param {Object} options
     * @param {String} options.newValue The new value of the `alt` attribute to set.
     */
    ImageTextAlternativeCommand.prototype.execute = function (options) {
        var model = this.editor.model;
        var imageElement = model.document.selection.getSelectedElement();
        model.change(function (writer) {
            writer.setAttribute('alt', options.newValue, imageElement);
        });
    };
    return ImageTextAlternativeCommand;
}(Command));
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * The image text alternative editing plugin.
 *
 * Registers the `'imageTextAlternative'` command.
 *
 * @extends module:core/plugin~Plugin
 */
var ImageTextAlternativeEditing = /** @class */ (function (_super) {
    __extends(ImageTextAlternativeEditing, _super);
    function ImageTextAlternativeEditing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ImageTextAlternativeEditing, "pluginName", {
        /**
         * @inheritDoc
         */
        get: function () {
            return 'ImageTextAlternativeEditing';
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ImageTextAlternativeEditing.prototype.init = function () {
        this.editor.commands.add('imageTextAlternative', new ImageTextAlternativeCommand(this.editor));
    };
    return ImageTextAlternativeEditing;
}(Plugin));
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * The label view class.
 *
 * @extends module:ui/view~View
 */
var LabelView = /** @class */ (function (_super) {
    __extends(LabelView, _super);
    /**
     * @inheritDoc
     */
    function LabelView(locale) {
        var _this = _super.call(this, locale) || this;
        /**
         * The text of the label.
         *
         * @observable
         * @member {String} #text
         */
        _this.set('text');
        /**
         * The `for` attribute of the label (i.e. to pair with an `<input>` element).
         *
         * @observable
         * @member {String} #for
         */
        _this.set('for');
        /**
         * An unique id of the label. It can be used by other UI components to reference
         * the label, for instance, using the `aria-describedby` DOM attribute.
         *
         * @member {String} #id
         */
        _this.id = "ck-editor__label_" + uid();
        var bind = _this.bindTemplate;
        _this.setTemplate({
            tag: 'label',
            attributes: {
                class: [
                    'ck',
                    'ck-label'
                ],
                id: _this.id,
                for: bind.to('for')
            },
            children: [
                {
                    text: bind.to('text')
                }
            ]
        });
        return _this;
    }
    return LabelView;
}(View));
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * The labeled field view class. It can be used to enhance any view with the following features:
 *
 * * a label,
 * * (optional) an error message,
 * * (optional) an info (status) text,
 *
 * all bound logically by proper DOM attributes for UX and accessibility.  It also provides an interface
 * (e.g. observable properties) that allows controlling those additional features.
 *
 * The constructor of this class requires a callback that returns a view to be labeled. The callback
 * is called with unique ids that allow binding of DOM properties:
 *
 *		const labeledInputView = new LabeledFieldView( locale, ( labeledFieldView, viewUid, statusUid ) => {
 *			const inputView = new InputTextView( labeledFieldView.locale );
 *
 *			inputView.set( {
 *				id: viewUid,
 *				ariaDescribedById: statusUid
 *			} );
 *
 *			inputView.bind( 'isReadOnly' ).to( labeledFieldView, 'isEnabled', value => !value );
 *			inputView.bind( 'hasError' ).to( labeledFieldView, 'errorText', value => !!value );
 *
 *			return inputView;
 *		} );
 *
 *		labeledInputView.label = 'User name';
 *		labeledInputView.infoText = 'Full name like for instance, John Doe.';
 *		labeledInputView.render();
 *
 *		document.body.append( labeledInputView.element );
 *
 * See {@link module:ui/labeledfield/utils} to discover ready–to–use labeled input helpers for common
 * UI components.
 *
 * @extends module:ui/view~View
 */
var LabeledFieldView = /** @class */ (function (_super) {
    __extends(LabeledFieldView, _super);
    /**
     * Creates an instance of the labeled field view class using a provided creator function
     * that provides the view to be labeled.
     *
     * @param {module:utils/locale~Locale} locale The locale instance.
     * @param {Function} viewCreator A function that returns a {@link module:ui/view~View}
     * that will be labeled. The following arguments are passed to the creator function:
     *
     * * an instance of the `LabeledFieldView` to allow binding observable properties,
     * * an UID string that connects the {@link #labelView label} and the labeled field view in DOM,
     * * an UID string that connects the {@link #statusView status} and the labeled field view in DOM.
     */
    function LabeledFieldView(locale, viewCreator) {
        var _this = _super.call(this, locale) || this;
        var viewUid = "ck-labeled-field-view-" + uid();
        var statusUid = "ck-labeled-field-view-status-" + uid();
        /**
         * The field view that gets labeled.
         *
         * @member {module:ui/view~View} #fieldView
         */
        _this.fieldView = viewCreator(_this, viewUid, statusUid);
        /**
         * The text of the label.
         *
         * @observable
         * @member {String} #label
         */
        _this.set('label');
        /**
         * Controls whether the component is in read-only mode.
         *
         * @observable
         * @member {Boolean} #isEnabled
         */
        _this.set('isEnabled', true);
        /**
         * An observable flag set to `true` when {@link #fieldView} is empty (`false` otherwise).
         *
         * @readonly
         * @observable
         * @member {Boolean} #isEmpty
         * @default true
         */
        _this.set('isEmpty', true);
        /**
         * An observable flag set to `true` when {@link #fieldView} is currently focused by
         * the user (`false` otherwise).
         *
         * @readonly
         * @observable
         * @member {Boolean} #isFocused
         * @default false
         */
        _this.set('isFocused', false);
        /**
         * The validation error text. When set, it will be displayed
         * next to the {@link #fieldView} as a typical validation error message.
         * Set it to `null` to hide the message.
         *
         * **Note:** Setting this property to anything but `null` will automatically
         * make the `hasError` of the {@link #fieldView} `true`.
         *
         * @observable
         * @member {String|null} #errorText
         */
        _this.set('errorText', null);
        /**
         * The additional information text displayed next to the {@link #fieldView} which can
         * be used to inform the user about its purpose, provide help or hints.
         *
         * Set it to `null` to hide the message.
         *
         * **Note:** This text will be displayed in the same place as {@link #errorText} but the
         * latter always takes precedence: if the {@link #errorText} is set, it replaces
         * {@link #infoText}.
         *
         * @observable
         * @member {String|null} #infoText
         * @default null
         */
        _this.set('infoText', null);
        /**
         * (Optional) The additional CSS class set on the dropdown {@link #element}.
         *
         * @observable
         * @member {String} #class
         */
        _this.set('class');
        /**
         * The content of the `placeholder` attribute of the {@link #fieldView}.
         *
         * @observable
         * @member {String} #placeholder
         */
        _this.set('placeholder');
        /**
         * The label view instance that describes the entire view.
         *
         * @member {module:ui/label/labelview~LabelView} #labelView
         */
        _this.labelView = _this._createLabelView(viewUid);
        /**
         * The status view for the {@link #fieldView}. It displays {@link #errorText} and
         * {@link #infoText}.
         *
         * @member {module:ui/view~View} #statusView
         */
        _this.statusView = _this._createStatusView(statusUid);
        /**
         * The combined status text made of {@link #errorText} and {@link #infoText}.
         * Note that when present, {@link #errorText} always takes precedence in the
         * status.
         *
         * @see #errorText
         * @see #infoText
         * @see #statusView
         * @private
         * @observable
         * @member {String|null} #_statusText
         */
        _this.bind('_statusText').to(_this, 'errorText', _this, 'infoText', function (errorText, infoText) { return errorText || infoText; });
        var bind = _this.bindTemplate;
        _this.setTemplate({
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-labeled-field-view',
                    bind.to('class'),
                    bind.if('isEnabled', 'ck-disabled', function (value) { return !value; }),
                    bind.if('isEmpty', 'ck-labeled-field-view_empty'),
                    bind.if('isFocused', 'ck-labeled-field-view_focused'),
                    bind.if('placeholder', 'ck-labeled-field-view_placeholder'),
                    bind.if('errorText', 'ck-error')
                ]
            },
            children: [
                {
                    tag: 'div',
                    attributes: {
                        class: [
                            'ck',
                            'ck-labeled-field-view__input-wrapper'
                        ]
                    },
                    children: [
                        _this.fieldView,
                        _this.labelView
                    ]
                },
                _this.statusView
            ]
        });
        return _this;
    }
    /**
     * Creates label view class instance and bind with view.
     *
     * @private
     * @param {String} id Unique id to set as labelView#for attribute.
     * @returns {module:ui/label/labelview~LabelView}
     */
    LabeledFieldView.prototype._createLabelView = function (id) {
        var labelView = new LabelView(this.locale);
        labelView.for = id;
        labelView.bind('text').to(this, 'label');
        return labelView;
    };
    /**
     * Creates the status view instance. It displays {@link #errorText} and {@link #infoText}
     * next to the {@link #fieldView}. See {@link #_statusText}.
     *
     * @private
     * @param {String} statusUid Unique id of the status, shared with the {@link #fieldView view's}
     * `aria-describedby` attribute.
     * @returns {module:ui/view~View}
     */
    LabeledFieldView.prototype._createStatusView = function (statusUid) {
        var statusView = new View(this.locale);
        var bind = this.bindTemplate;
        statusView.setTemplate({
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-labeled-field-view__status',
                    bind.if('errorText', 'ck-labeled-field-view__status_error'),
                    bind.if('_statusText', 'ck-hidden', function (value) { return !value; })
                ],
                id: statusUid,
                role: bind.if('errorText', 'alert')
            },
            children: [
                {
                    text: bind.to('_statusText')
                }
            ]
        });
        return statusView;
    };
    /**
     * Focuses the {@link #fieldView}.
     */
    LabeledFieldView.prototype.focus = function () {
        this.fieldView.focus();
    };
    return LabeledFieldView;
}(View));
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * The text input view class.
 *
 * @extends module:ui/view~View
 */
var InputTextView = /** @class */ (function (_super) {
    __extends(InputTextView, _super);
    /**
     * @inheritDoc
     */
    function InputTextView(locale) {
        var _this = _super.call(this, locale) || this;
        /**
         * The value of the input.
         *
         * @observable
         * @member {String} #value
         */
        _this.set('value');
        /**
         * The `id` attribute of the input (i.e. to pair with a `<label>` element).
         *
         * @observable
         * @member {String} #id
         */
        _this.set('id');
        /**
         * The `placeholder` attribute of the input.
         *
         * @observable
         * @member {String} #placeholder
         */
        _this.set('placeholder');
        /**
         * Controls whether the input view is in read-only mode.
         *
         * @observable
         * @member {Boolean} #isReadOnly
         */
        _this.set('isReadOnly', false);
        /**
         * Set to `true` when the field has some error. Usually controlled via
         * {@link module:ui/labeledinput/labeledinputview~LabeledInputView#errorText}.
         *
         * @observable
         * @member {Boolean} #hasError
         */
        _this.set('hasError', false);
        /**
         * The `id` of the element describing this field, e.g. when it has
         * some error, it helps screen readers read the error text.
         *
         * @observable
         * @member {Boolean} #ariaDescribedById
         */
        _this.set('ariaDescribedById');
        /**
         * Stores information about the editor UI focus and propagates it so various plugins and components
         * are unified as a focus group.
         *
         * @readonly
         * @member {module:utils/focustracker~FocusTracker} #focusTracker
         */
        _this.focusTracker = new FocusTracker();
        /**
         * An observable flag set to `true` when the input is currently focused by the user.
         * Set to `false` otherwise.
         *
         * @readonly
         * @observable
         * @member {Boolean} #isFocused
         * @default false
         */
        _this.bind('isFocused').to(_this.focusTracker);
        /**
         * An observable flag set to `true` when the input contains no text, i.e.
         * when {@link #value} is `''`, `null`, or `false`.
         *
         * @readonly
         * @observable
         * @member {Boolean} #isEmpty
         * @default true
         */
        _this.set('isEmpty', true);
        var bind = _this.bindTemplate;
        _this.setTemplate({
            tag: 'input',
            attributes: {
                type: 'text',
                class: [
                    'ck',
                    'ck-input',
                    'ck-input-text',
                    bind.if('isFocused', 'ck-input_focused'),
                    bind.if('isEmpty', 'ck-input-text_empty'),
                    bind.if('hasError', 'ck-error')
                ],
                id: bind.to('id'),
                placeholder: bind.to('placeholder'),
                readonly: bind.to('isReadOnly'),
                'aria-invalid': bind.if('hasError', true),
                'aria-describedby': bind.to('ariaDescribedById')
            },
            on: {
                input: bind.to('input'),
                change: bind.to(_this._updateIsEmpty.bind(_this))
            }
        });
        return _this;
        /**
         * Fired when the user types in the input. Corresponds to the native
         * DOM `input` event.
         *
         * @event input
         */
    }
    /**
     * @inheritDoc
     */
    InputTextView.prototype.render = function () {
        var _this = this;
        _super.prototype.render.call(this);
        this.focusTracker.add(this.element);
        this._setDomElementValue(this.value);
        this._updateIsEmpty();
        // Bind `this.value` to the DOM element's value.
        // We cannot use `value` DOM attribute because removing it on Edge does not clear the DOM element's value property.
        this.on('change:value', function (evt, name, value) {
            _this._setDomElementValue(value);
            _this._updateIsEmpty();
        });
    };
    /**
     * Moves the focus to the input and selects the value.
     */
    InputTextView.prototype.select = function () {
        this.element.select();
    };
    /**
     * Focuses the input.
     */
    InputTextView.prototype.focus = function () {
        this.element.focus();
    };
    /**
     * Updates the {@link #isEmpty} property value on demand.
     *
     * @private
     */
    InputTextView.prototype._updateIsEmpty = function () {
        this.isEmpty = isInputElementEmpty(this.element);
    };
    /**
     * Sets the `value` property of the {@link #element DOM element} on demand.
     *
     * @private
     */
    InputTextView.prototype._setDomElementValue = function (value) {
        this.element.value = (!value && value !== 0) ? '' : value;
    };
    return InputTextView;
}(View));
function isInputElementEmpty(domElement) {
    return !domElement.value;
}
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * A helper for creating labeled inputs.
 *
 * It creates an instance of a {@link module:ui/inputtext/inputtextview~InputTextView input text} that is
 * logically related to a {@link module:ui/labeledfield/labeledfieldview~LabeledFieldView labeled view} in DOM.
 *
 * The helper does the following:
 *
 * * It sets input's `id` and `ariaDescribedById` attributes.
 * * It binds input's `isReadOnly` to the labeled view.
 * * It binds input's `hasError` to the labeled view.
 * * It enables a logic that cleans up the error when user starts typing in the input..
 *
 * Usage:
 *
 *		const labeledInputView = new LabeledFieldView( locale, createLabeledDropdown );
 *		console.log( labeledInputView.view ); // An input instance.
 *
 * @param {module:ui/labeledfield/labeledfieldview~LabeledFieldView} labeledFieldView The instance of the labeled field view.
 * @param {String} viewUid An UID string that allows DOM logical connection between the
 * {@link module:ui/labeledfield/labeledfieldview~LabeledFieldView#labelView labeled view's label} and the input.
 * @param {String} statusUid An UID string that allows DOM logical connection between the
 * {@link module:ui/labeledfield/labeledfieldview~LabeledFieldView#statusView labeled view's status} and the input.
 * @returns {module:ui/inputtext/inputtextview~InputTextView} The input text view instance.
 */
function createLabeledInputText(labeledFieldView, viewUid, statusUid) {
    var inputView = new InputTextView(labeledFieldView.locale);
    inputView.set({
        id: viewUid,
        ariaDescribedById: statusUid
    });
    inputView.bind('isReadOnly').to(labeledFieldView, 'isEnabled', function (value) { return !value; });
    inputView.bind('hasError').to(labeledFieldView, 'errorText', function (value) { return !!value; });
    inputView.on('input', function () {
        // UX: Make the error text disappear and disable the error indicator as the user
        // starts fixing the errors.
        labeledFieldView.errorText = null;
    });
    labeledFieldView.bind('isEmpty', 'isFocused', 'placeholder').to(inputView);
    return inputView;
}
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module ui/bindings/injectcsstransitiondisabler
 */
/**
 * A decorator that brings the possibility to temporarily disable CSS transitions using
 * {@link module:ui/view~View} methods. It is helpful when, for instance, the transitions should not happen
 * when the view is first displayed but they should work normal in other cases.
 *
 * The methods to control the CSS transitions are:
 * * `disableCssTransitions()` – Adds the `.ck-transitions-disabled` class to the
 * {@link module:ui/view~View#element view element}.
 * * `enableCssTransitions()` – Removes the `.ck-transitions-disabled` class from the
 * {@link module:ui/view~View#element view element}.
 *
 * **Note**: This helper extends the {@link module:ui/view~View#template template} and must be used **after**
 * {@link module:ui/view~View#setTemplate} is called:
 *
 *		import injectCssTransitionDisabler from '@ckeditor/ckeditor5-ui/src/bindings/injectcsstransitiondisabler';
 *
 *		class MyView extends View {
 *			constructor() {
 *				super();
 *
 *				// ...
 *
 *				this.setTemplate( { ... } );
 *
 *				// ...
 *
 *				injectCssTransitionDisabler( this );
 *
 *				// ...
 *			}
 *		}
 *
 * The usage comes down to:
 *
 *		const view = new MyView();
 *
 *		// ...
 *
 *		view.disableCssTransitions();
 *		view.show();
 *		view.enableCssTransitions();
 *
 * @param {module:ui/view~View} view View instance that should get this functionality.
 */
function injectCssTransitionDisabler(view) {
    view.set('_isCssTransitionsDisabled', false);
    view.disableCssTransitions = function () {
        view._isCssTransitionsDisabled = true;
    };
    view.enableCssTransitions = function () {
        view._isCssTransitionsDisabled = false;
    };
    view.extendTemplate({
        attributes: {
            class: [
                view.bindTemplate.if('_isCssTransitionsDisabled', 'ck-transitions-disabled')
            ]
        }
    });
}
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * @module ui/bindings/submithandler
 */
/**
 * A handler useful for {@link module:ui/view~View views} working as HTML forms. It intercepts a native DOM
 * `submit` event, prevents the default web browser behavior (navigation and page reload) and
 * fires the `submit` event on a view instead. Such a custom event can be then used by any
 * {@link module:utils/dom/emittermixin~Emitter emitter}, e.g. to serialize the form data.
 *
 *		import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler';
 *
 *		// ...
 *
 *		class AnyFormView extends View {
 *			constructor() {
 *				super();
 *
 *				// ...
 *
 *				submitHandler( {
 *					view: this
 *				} );
 *			}
 *		}
 *
 *		// ...
 *
 *		const view = new AnyFormView();
 *
 *		// A sample listener attached by an emitter working with the view.
 *		this.listenTo( view, 'submit', () => {
 *			saveTheFormData();
 *			hideTheForm();
 *		} );
 *
 * @param {Object} [options] Configuration options.
 * @param {module:ui/view~View} options.view The view which DOM `submit` events should be handled.
 */
function submitHandler(_a) {
    var view = _a.view;
    view.listenTo(view.element, 'submit', function (evt, domEvt) {
        domEvt.preventDefault();
        view.fire('submit');
    }, { useCapture: true });
}
var checkSvg = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAgMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuOTcyIDE2LjYxNWEuOTk3Ljk5NyAwIDAgMS0uNzQ0LS4yOTJsLTQuNTk2LTQuNTk2YTEgMSAwIDEgMSAxLjQxNC0xLjQxNGwzLjkyNiAzLjkyNiA5LjkzNy05LjkzN2ExIDEgMCAwIDEgMS40MTQgMS40MTVMNy43MTcgMTYuMzIzYS45OTcuOTk3IDAgMCAxLS43NDUuMjkyeiIvPjwvc3ZnPg==';
var cancelSvg = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAgMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTExLjU5MSAxMC4xNzdsNC4yNDMgNC4yNDJhMSAxIDAgMCAxLTEuNDE1IDEuNDE1bC00LjI0Mi00LjI0My00LjI0MyA0LjI0M2ExIDEgMCAwIDEtMS40MTQtMS40MTVsNC4yNDMtNC4yNDJMNC41MiA1LjkzNEExIDEgMCAwIDEgNS45MzQgNC41Mmw0LjI0MyA0LjI0MyA0LjI0Mi00LjI0M2ExIDEgMCAxIDEgMS40MTUgMS40MTRsLTQuMjQzIDQuMjQzeiIvPjwvc3ZnPg==';
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * The TextAlternativeFormView class.
 *
 * @extends module:ui/view~View
 */
var TextAlternativeFormView = /** @class */ (function (_super) {
    __extends(TextAlternativeFormView, _super);
    /**
     * @inheritDoc
     */
    function TextAlternativeFormView(locale) {
        var _this = _super.call(this, locale) || this;
        var t = _this.locale.t;
        /**
         * Tracks information about the DOM focus in the form.
         *
         * @readonly
         * @member {module:utils/focustracker~FocusTracker}
         */
        _this.focusTracker = new FocusTracker();
        /**
         * An instance of the {@link module:utils/keystrokehandler~KeystrokeHandler}.
         *
         * @readonly
         * @member {module:utils/keystrokehandler~KeystrokeHandler}
         */
        _this.keystrokes = new KeystrokeHandler();
        /**
         * An input with a label.
         *
         * @member {module:ui/labeledfield/labeledfieldview~LabeledFieldView} #labeledInput
         */
        _this.labeledInput = _this._createLabeledInputView();
        /**
         * A button used to submit the form.
         *
         * @member {module:ui/button/buttonview~ButtonView} #saveButtonView
         */
        _this.saveButtonView = _this._createButton(t('Save'), checkSvg, 'ck-button-save');
        _this.saveButtonView.type = 'submit';
        /**
         * A button used to cancel the form.
         *
         * @member {module:ui/button/buttonview~ButtonView} #cancelButtonView
         */
        _this.cancelButtonView = _this._createButton(t('Cancel'), cancelSvg, 'ck-button-cancel', 'cancel');
        /**
         * A collection of views which can be focused in the form.
         *
         * @readonly
         * @protected
         * @member {module:ui/viewcollection~ViewCollection}
         */
        _this._focusables = new ViewCollection();
        /**
         * Helps cycling over {@link #_focusables} in the form.
         *
         * @readonly
         * @protected
         * @member {module:ui/focuscycler~FocusCycler}
         */
        _this._focusCycler = new FocusCycler({
            focusables: _this._focusables,
            focusTracker: _this.focusTracker,
            keystrokeHandler: _this.keystrokes,
            actions: {
                // Navigate form fields backwards using the Shift + Tab keystroke.
                focusPrevious: 'shift + tab',
                // Navigate form fields forwards using the Tab key.
                focusNext: 'tab'
            }
        });
        _this.setTemplate({
            tag: 'form',
            attributes: {
                class: [
                    'ck',
                    'ck-text-alternative-form',
                    'ck-responsive-form'
                ],
                // https://github.com/ckeditor/ckeditor5-image/issues/40
                tabindex: '-1'
            },
            children: [
                _this.labeledInput,
                _this.saveButtonView,
                _this.cancelButtonView
            ]
        });
        injectCssTransitionDisabler(_this);
        return _this;
    }
    /**
     * @inheritDoc
     */
    TextAlternativeFormView.prototype.render = function () {
        var _this = this;
        _super.prototype.render.call(this);
        this.keystrokes.listenTo(this.element);
        submitHandler({ view: this });
        [this.labeledInput, this.saveButtonView, this.cancelButtonView]
            .forEach(function (v) {
            // Register the view as focusable.
            _this._focusables.add(v);
            // Register the view in the focus tracker.
            _this.focusTracker.add(v.element);
        });
    };
    /**
     * Creates the button view.
     *
     * @private
     * @param {String} label The button label
     * @param {String} icon The button's icon.
     * @param {String} className The additional button CSS class name.
     * @param {String} [eventName] The event name that the ButtonView#execute event will be delegated to.
     * @returns {module:ui/button/buttonview~ButtonView} The button view instance.
     */
    TextAlternativeFormView.prototype._createButton = function (label, icon, className, eventName) {
        var button = new ButtonView(this.locale);
        button.set({
            label: label,
            icon: icon,
            tooltip: true
        });
        button.extendTemplate({
            attributes: {
                class: className
            }
        });
        if (eventName) {
            button.delegate('execute').to(this, eventName);
        }
        return button;
    };
    /**
     * Creates an input with a label.
     *
     * @private
     * @returns {module:ui/labeledfield/labeledfieldview~LabeledFieldView} Labeled field view instance.
     */
    TextAlternativeFormView.prototype._createLabeledInputView = function () {
        var t = this.locale.t;
        var labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);
        labeledInput.label = t('Text alternative');
        return labeledInput;
    };
    return TextAlternativeFormView;
}(View));
var previousArrowSvg = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAgMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTExLjQ2MyA1LjE4N2EuODg4Ljg4OCAwIDEgMSAxLjI1NCAxLjI1NUw5LjE2IDEwbDMuNTU3IDMuNTU3YS44ODguODg4IDAgMSAxLTEuMjU0IDEuMjU1TDcuMjYgMTAuNjFhLjg4OC44ODggMCAwIDEgLjE2LTEuMzgybDQuMDQzLTQuMDQyeiIvPjwvc3ZnPg==';
var nextArrowSvg = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAgMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTguNTM3IDE0LjgxM2EuODg4Ljg4OCAwIDEgMS0xLjI1NC0xLjI1NUwxMC44NCAxMCA3LjI4MyA2LjQ0MmEuODg4Ljg4OCAwIDEgMSAxLjI1NC0xLjI1NUwxMi43NCA5LjM5YS44ODguODg4IDAgMCAxLS4xNiAxLjM4MmwtNC4wNDMgNC4wNDJ6Ii8+PC9zdmc+';
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
var toPx = toUnit('px');
/**
 * Provides the common contextual balloon for the editor.
 *
 * The role of this plugin is to unify the contextual balloons logic, simplify views management and help
 * avoid the unnecessary complexity of handling multiple {@link module:ui/panel/balloon/balloonpanelview~BalloonPanelView}
 * instances in the editor.
 *
 * This plugin allows for creating single or multiple panel stacks.
 *
 * Each stack may have multiple views, with the one on the top being visible. When the visible view is removed from the stack,
 * the previous view becomes visible.
 *
 * It might be useful to implement nested navigation in a balloon. For instance, a toolbar view may contain a link button.
 * When you click it, a link view (which lets you set the URL) is created and put on top of the toolbar view, so the link panel
 * is displayed. When you finish editing the link and close (remove) the link view, the toolbar view is visible again.
 *
 * However, there are cases when there are multiple independent balloons to be displayed, for instance, if the selection
 * is inside two inline comments at the same time. For such cases, you can create two independent panel stacks.
 * The contextual balloon plugin will create a navigation bar to let the users switch between these panel stacks using the "Next"
 * and "Previous" buttons.
 *
 * If there are no views in the current stack, the balloon panel will try to switch to the next stack. If there are no
 * panels in any stack, the balloon panel will be hidden.
 *
 * **Note**: To force the balloon panel to show only one view, even if there are other stacks, use the `singleViewMode=true` option
 * when {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon#add adding} a view to a panel.
 *
 * From the implementation point of view, the contextual ballon plugin is reusing a single
 * {@link module:ui/panel/balloon/balloonpanelview~BalloonPanelView} instance to display multiple contextual balloon
 * panels in the editor. It also creates a special {@link module:ui/panel/balloon/contextualballoon~RotatorView rotator view},
 * used to manage multiple panel stacks. Rotator view is a child of the balloon panel view and the parent of the specific
 * view you want to display. If there is more than one panel stack to be displayed, the rotator view will add a
 * navigation bar. If there is only one stack, the rotator view is transparent (it does not add any UI elements).
 *
 * @extends module:core/plugin~Plugin
 */
var ContextualBalloon = /** @class */ (function (_super) {
    __extends(ContextualBalloon, _super);
    /**
     * @inheritDoc
     */
    function ContextualBalloon(editor) {
        var _this = _super.call(this, editor) || this;
        /**
         * The {@link module:utils/dom/position~Options#limiter position limiter}
         * for the {@link #view balloon}, used when no `limiter` has been passed into {@link #add}
         * or {@link #updatePosition}.
         *
         * By default, a function that obtains the farthest DOM
         * {@link module:engine/view/rooteditableelement~RootEditableElement}
         * of the {@link module:engine/view/document~Document#selection}.
         *
         * @member {module:utils/dom/position~Options#limiter} #positionLimiter
         */
        _this.positionLimiter = function () {
            var view = _this.editor.editing.view;
            var viewDocument = view.document;
            var editableElement = viewDocument.selection.editableElement;
            if (editableElement) {
                return view.domConverter.mapViewToDom(editableElement.root);
            }
            return null;
        };
        /**
         * The currently visible view or `null` when there are no views in any stack.
         *
         * @readonly
         * @observable
         * @member {module:ui/view~View|null} #visibleView
         */
        _this.set('visibleView', null);
        /**
         * The common balloon panel view.
         *
         * @readonly
         * @member {module:ui/panel/balloon/balloonpanelview~BalloonPanelView} #view
         */
        _this.view = new BalloonPanelView(editor.locale);
        editor.ui.view.body.add(_this.view);
        editor.ui.focusTracker.add(_this.view.element);
        /**
         * The map of views and their stacks.
         *
         * @private
         * @type {Map.<module:ui/view~View,Set>}
         */
        _this._viewToStack = new Map();
        /**
         * The map of IDs and stacks.
         *
         * @private
         * @type {Map.<String,Set>}
         */
        _this._idToStack = new Map();
        /**
         * A total number of all stacks in the balloon.
         *
         * @private
         * @readonly
         * @observable
         * @member {Number} #_numberOfStacks
         */
        _this.set('_numberOfStacks', 0);
        /**
         * A flag that controls the single view mode.
         *
         * @private
         * @readonly
         * @observable
         * @member {Boolean} #_singleViewMode
         */
        _this.set('_singleViewMode', false);
        /**
         * Rotator view embedded in the contextual balloon.
         * Displays the currently visible view in the balloon and provides navigation for switching stacks.
         *
         * @private
         * @type {module:ui/panel/balloon/contextualballoon~RotatorView}
         */
        _this._rotatorView = _this._createRotatorView();
        /**
         * Displays fake panels under the balloon panel view when multiple stacks are added to the balloon.
         *
         * @private
         * @type {module:ui/view~View}
         */
        _this._fakePanelsView = _this._createFakePanelsView();
        return _this;
    }
    Object.defineProperty(ContextualBalloon, "pluginName", {
        /**
         * @inheritDoc
         */
        get: function () {
            return 'ContextualBalloon';
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns `true` when the given view is in one of the stacks. Otherwise returns `false`.
     *
     * @param {module:ui/view~View} view
     * @returns {Boolean}
     */
    ContextualBalloon.prototype.hasView = function (view) {
        return Array.from(this._viewToStack.keys()).includes(view);
    };
    /**
     * Adds a new view to the stack and makes it visible if the current stack is visible
     * or it is the first view in the balloon.
     *
     * @param {Object} data The configuration of the view.
     * @param {String} [data.stackId='main'] The ID of the stack that the view is added to.
     * @param {module:ui/view~View} [data.view] The content of the balloon.
     * @param {module:utils/dom/position~Options} [data.position] Positioning options.
     * @param {String} [data.balloonClassName] An additional CSS class added to the {@link #view balloon} when visible.
     * @param {Boolean} [data.withArrow=true] Whether the {@link #view balloon} should be rendered with an arrow.
     * @param {Boolean} [data.singleViewMode=false] Whether the view should be the only visible view even if other stacks were added.
     */
    ContextualBalloon.prototype.add = function (data) {
        if (this.hasView(data.view)) {
            /**
             * Trying to add configuration of the same view more than once.
             *
             * @error contextualballoon-add-view-exist
             */
            throw new CKEditorError('contextualballoon-add-view-exist', [this, data]);
        }
        var stackId = data.stackId || 'main';
        // If new stack is added, creates it and show view from this stack.
        if (!this._idToStack.has(stackId)) {
            this._idToStack.set(stackId, new Map([[data.view, data]]));
            this._viewToStack.set(data.view, this._idToStack.get(stackId));
            this._numberOfStacks = this._idToStack.size;
            if (!this._visibleStack || data.singleViewMode) {
                this.showStack(stackId);
            }
            return;
        }
        var stack = this._idToStack.get(stackId);
        if (data.singleViewMode) {
            this.showStack(stackId);
        }
        // Add new view to the stack.
        stack.set(data.view, data);
        this._viewToStack.set(data.view, stack);
        // And display it if is added to the currently visible stack.
        if (stack === this._visibleStack) {
            this._showView(data);
        }
    };
    /**
     * Removes the given view from the stack. If the removed view was visible,
     * the view preceding it in the stack will become visible instead.
     * When there is no view in the stack, the next stack will be displayed.
     * When there are no more stacks, the balloon will hide.
     *
     * @param {module:ui/view~View} view A view to be removed from the balloon.
     */
    ContextualBalloon.prototype.remove = function (view) {
        if (!this.hasView(view)) {
            /**
             * Trying to remove the configuration of the view not defined in the stack.
             *
             * @error contextualballoon-remove-view-not-exist
             */
            throw new CKEditorError('contextualballoon-remove-view-not-exist', [this, view]);
        }
        var stack = this._viewToStack.get(view);
        if (this._singleViewMode && this.visibleView === view) {
            this._singleViewMode = false;
        }
        // When visible view will be removed we need to show a preceding view or next stack
        // if a view is the only view in the stack.
        if (this.visibleView === view) {
            if (stack.size === 1) {
                if (this._idToStack.size > 1) {
                    this._showNextStack();
                }
                else {
                    this.view.hide();
                    this.visibleView = null;
                    this._rotatorView.hideView();
                }
            }
            else {
                this._showView(Array.from(stack.values())[stack.size - 2]);
            }
        }
        if (stack.size === 1) {
            this._idToStack.delete(this._getStackId(stack));
            this._numberOfStacks = this._idToStack.size;
        }
        else {
            stack.delete(view);
        }
        this._viewToStack.delete(view);
    };
    /**
     * Updates the position of the balloon using the position data of the first visible view in the stack.
     * When new position data is given, the position data of the currently visible view will be updated.
     *
     * @param {module:utils/dom/position~Options} [position] position options.
     */
    ContextualBalloon.prototype.updatePosition = function (position) {
        if (position) {
            this._visibleStack.get(this.visibleView).position = position;
        }
        this.view.pin(this._getBalloonPosition());
        this._fakePanelsView.updatePosition();
    };
    /**
     * Shows the last view from the stack of a given ID.
     *
     * @param {String} id
     */
    ContextualBalloon.prototype.showStack = function (id) {
        this.visibleStack = id;
        var stack = this._idToStack.get(id);
        if (!stack) {
            /**
             * Trying to show a stack that does not exist.
             *
             * @error contextualballoon-showstack-stack-not-exist
             */
            throw new CKEditorError('contextualballoon-showstack-stack-not-exist', this);
        }
        if (this._visibleStack === stack) {
            return;
        }
        this._showView(Array.from(stack.values()).pop());
    };
    Object.defineProperty(ContextualBalloon.prototype, "_visibleStack", {
        /**
         * Returns the stack of the currently visible view.
         *
         * @private
         * @type {Set}
         */
        get: function () {
            return this._viewToStack.get(this.visibleView);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the ID of the given stack.
     *
     * @private
     * @param {Set} stack
     * @returns {String}
     */
    ContextualBalloon.prototype._getStackId = function (stack) {
        var entry = Array.from(this._idToStack.entries()).find(function (entry) { return entry[1] === stack; });
        return entry[0];
    };
    /**
     * Shows the last view from the next stack.
     *
     * @private
     */
    ContextualBalloon.prototype._showNextStack = function () {
        var stacks = Array.from(this._idToStack.values());
        var nextIndex = stacks.indexOf(this._visibleStack) + 1;
        if (!stacks[nextIndex]) {
            nextIndex = 0;
        }
        this.showStack(this._getStackId(stacks[nextIndex]));
    };
    /**
     * Shows the last view from the previous stack.
     *
     * @private
     */
    ContextualBalloon.prototype._showPrevStack = function () {
        var stacks = Array.from(this._idToStack.values());
        var nextIndex = stacks.indexOf(this._visibleStack) - 1;
        if (!stacks[nextIndex]) {
            nextIndex = stacks.length - 1;
        }
        this.showStack(this._getStackId(stacks[nextIndex]));
    };
    /**
     * Creates a rotator view.
     *
     * @private
     * @returns {module:ui/panel/balloon/contextualballoon~RotatorView}
     */
    ContextualBalloon.prototype._createRotatorView = function () {
        var _this = this;
        var view = new RotatorView(this.editor.locale);
        var t = this.editor.locale.t;
        this.view.content.add(view);
        // Hide navigation when there is only a one stack & not in single view mode.
        view.bind('isNavigationVisible').to(this, '_numberOfStacks', this, '_singleViewMode', function (value, isSingleViewMode) {
            return !isSingleViewMode && value > 1;
        });
        // Update balloon position after toggling navigation.
        view.on('change:isNavigationVisible', function () { return (_this.updatePosition()); }, { priority: 'low' });
        // Update stacks counter value.
        view.bind('counter').to(this, 'visibleView', this, '_numberOfStacks', function (visibleView, numberOfStacks) {
            if (numberOfStacks < 2) {
                return '';
            }
            var current = Array.from(_this._idToStack.values()).indexOf(_this._visibleStack) + 1;
            return t('%0 of %1', [current, numberOfStacks]);
        });
        view.buttonNextView.on('execute', function () {
            // When current view has a focus then move focus to the editable before removing it,
            // otherwise editor will lost focus.
            if (view.focusTracker.isFocused) {
                _this.editor.editing.view.focus();
            }
            _this._showNextStack();
        });
        view.buttonPrevView.on('execute', function () {
            // When current view has a focus then move focus to the editable before removing it,
            // otherwise editor will lost focus.
            if (view.focusTracker.isFocused) {
                _this.editor.editing.view.focus();
            }
            _this._showPrevStack();
        });
        return view;
    };
    /**
     * @private
     * @returns {module:ui/view~View}
     */
    ContextualBalloon.prototype._createFakePanelsView = function () {
        var view = new FakePanelsView(this.editor.locale, this.view);
        view.bind('numberOfPanels').to(this, '_numberOfStacks', this, '_singleViewMode', function (number, isSingleViewMode) {
            var showPanels = !isSingleViewMode && number >= 2;
            return showPanels ? Math.min(number - 1, 2) : 0;
        });
        view.listenTo(this.view, 'change:top', function () { return view.updatePosition(); });
        view.listenTo(this.view, 'change:left', function () { return view.updatePosition(); });
        this.editor.ui.view.body.add(view);
        return view;
    };
    /**
     * Sets the view as the content of the balloon and attaches the balloon using position
     * options of the first view.
     *
     * @private
     * @param {Object} data Configuration.
     * @param {module:ui/view~View} [data.view] The view to show in the balloon.
     * @param {String} [data.balloonClassName=''] Additional class name which will be added to the {@link #view balloon}.
     * @param {Boolean} [data.withArrow=true] Whether the {@link #view balloon} should be rendered with an arrow.
     */
    ContextualBalloon.prototype._showView = function (_a) {
        var view = _a.view, _b = _a.balloonClassName, balloonClassName = _b === void 0 ? '' : _b, _c = _a.withArrow, withArrow = _c === void 0 ? true : _c, _d = _a.singleViewMode, singleViewMode = _d === void 0 ? false : _d;
        this.view.class = balloonClassName;
        this.view.withArrow = withArrow;
        this._rotatorView.showView(view);
        this.visibleView = view;
        this.view.pin(this._getBalloonPosition());
        this._fakePanelsView.updatePosition();
        if (singleViewMode) {
            this._singleViewMode = true;
        }
    };
    /**
     * Returns position options of the last view in the stack.
     * This keeps the balloon in the same position when the view is changed.
     *
     * @private
     * @returns {module:utils/dom/position~Options}
     */
    ContextualBalloon.prototype._getBalloonPosition = function () {
        var position = Array.from(this._visibleStack.values()).pop().position;
        // Use the default limiter if none has been specified.
        if (position && !position.limiter) {
            // Don't modify the original options object.
            position = Object.assign({}, position, {
                limiter: this.positionLimiter
            });
        }
        return position;
    };
    return ContextualBalloon;
}(Plugin));
/**
 * Rotator view is a helper class for the {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon ContextualBalloon}.
 * It is used for displaying the last view from the current stack and providing navigation buttons for switching stacks.
 * See the {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon ContextualBalloon} documentation to learn more.
 *
 * @extends module:ui/view~View
 */
var RotatorView = /** @class */ (function (_super) {
    __extends(RotatorView, _super);
    /**
     * @inheritDoc
     */
    function RotatorView(locale) {
        var _this = _super.call(this, locale) || this;
        var t = locale.t;
        var bind = _this.bindTemplate;
        /**
         * Defines whether navigation is visible or not.
         *
         * @member {Boolean} #isNavigationVisible
         */
        _this.set('isNavigationVisible', true);
        /**
         * Used for checking if a view is focused or not.
         *
         * @type {module:utils/focustracker~FocusTracker}
         */
        _this.focusTracker = new FocusTracker();
        /**
         * Navigation button for switching the stack to the previous one.
         *
         * @type {module:ui/button/buttonview~ButtonView}
         */
        _this.buttonPrevView = _this._createButtonView(t('Previous'), previousArrowSvg);
        /**
         * Navigation button for switching the stack to the next one.
         *
         * @type {module:ui/button/buttonview~ButtonView}
         */
        _this.buttonNextView = _this._createButtonView(t('Next'), nextArrowSvg);
        /**
         * A collection of the child views that creates the rotator content.
         *
         * @readonly
         * @type {module:ui/viewcollection~ViewCollection}
         */
        _this.content = _this.createCollection();
        _this.setTemplate({
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-balloon-rotator'
                ],
                'z-index': '-1'
            },
            children: [
                {
                    tag: 'div',
                    attributes: {
                        class: [
                            'ck-balloon-rotator__navigation',
                            bind.to('isNavigationVisible', function (value) { return value ? '' : 'ck-hidden'; })
                        ]
                    },
                    children: [
                        _this.buttonPrevView,
                        {
                            tag: 'span',
                            attributes: {
                                class: [
                                    'ck-balloon-rotator__counter'
                                ]
                            },
                            children: [
                                {
                                    text: bind.to('counter')
                                }
                            ]
                        },
                        _this.buttonNextView
                    ]
                },
                {
                    tag: 'div',
                    attributes: {
                        class: 'ck-balloon-rotator__content'
                    },
                    children: _this.content
                }
            ]
        });
        return _this;
    }
    /**
     * @inheritDoc
     */
    RotatorView.prototype.render = function () {
        _super.prototype.render.call(this);
        this.focusTracker.add(this.element);
    };
    /**
     * Shows a given view.
     *
     * @param {module:ui/view~View} view The view to show.
     */
    RotatorView.prototype.showView = function (view) {
        this.hideView();
        this.content.add(view);
    };
    /**
     * Hides the currently displayed view.
     */
    RotatorView.prototype.hideView = function () {
        this.content.clear();
    };
    /**
     * Creates a navigation button view.
     *
     * @private
     * @param {String} label The button label.
     * @param {String} icon The button icon.
     * @returns {module:ui/button/buttonview~ButtonView}
     */
    RotatorView.prototype._createButtonView = function (label, icon) {
        var view = new ButtonView(this.locale);
        view.set({
            label: label,
            icon: icon,
            tooltip: true
        });
        return view;
    };
    return RotatorView;
}(View));
// Displays additional layers under the balloon when multiple stacks are added to the balloon.
//
// @private
// @extends module:ui/view~View
var FakePanelsView = /** @class */ (function (_super) {
    __extends(FakePanelsView, _super);
    // @inheritDoc
    function FakePanelsView(locale, balloonPanelView) {
        var _this = _super.call(this, locale) || this;
        var bind = _this.bindTemplate;
        // Fake panels top offset.
        //
        // @observable
        // @member {Number} #top
        _this.set('top', 0);
        // Fake panels left offset.
        //
        // @observable
        // @member {Number} #left
        _this.set('left', 0);
        // Fake panels height.
        //
        // @observable
        // @member {Number} #height
        _this.set('height', 0);
        // Fake panels width.
        //
        // @observable
        // @member {Number} #width
        _this.set('width', 0);
        // Number of rendered fake panels.
        //
        // @observable
        // @member {Number} #numberOfPanels
        _this.set('numberOfPanels', 0);
        // Collection of the child views which creates fake panel content.
        //
        // @readonly
        // @type {module:ui/viewcollection~ViewCollection}
        _this.content = _this.createCollection();
        // Context.
        //
        // @private
        // @type {module:ui/panel/balloon/balloonpanelview~BalloonPanelView}
        _this._balloonPanelView = balloonPanelView;
        _this.setTemplate({
            tag: 'div',
            attributes: {
                class: [
                    'ck-fake-panel',
                    bind.to('numberOfPanels', function (number) { return number ? '' : 'ck-hidden'; })
                ],
                style: {
                    top: bind.to('top', toPx),
                    left: bind.to('left', toPx),
                    width: bind.to('width', toPx),
                    height: bind.to('height', toPx)
                }
            },
            children: _this.content
        });
        _this.on('change:numberOfPanels', function (evt, name, next, prev) {
            if (next > prev) {
                _this._addPanels(next - prev);
            }
            else {
                _this._removePanels(prev - next);
            }
            _this.updatePosition();
        });
        return _this;
    }
    // @private
    // @param {Number} number
    FakePanelsView.prototype._addPanels = function (number) {
        while (number--) {
            var view = new View();
            view.setTemplate({ tag: 'div' });
            this.content.add(view);
            this.registerChild(view);
        }
    };
    // @private
    // @param {Number} number
    FakePanelsView.prototype._removePanels = function (number) {
        while (number--) {
            var view = this.content.last;
            this.content.remove(view);
            this.deregisterChild(view);
            view.destroy();
        }
    };
    // Updates coordinates of fake panels.
    FakePanelsView.prototype.updatePosition = function () {
        if (this.numberOfPanels) {
            var _a = this._balloonPanelView, top = _a.top, left = _a.left;
            var _b = new Rect(this._balloonPanelView.element), width = _b.width, height = _b.height;
            Object.assign(this, { top: top, left: left, width: width, height: height });
        }
    };
    return FakePanelsView;
}(View));
var lowVisionSvg = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAgMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUuMDg1IDYuMjJMMi45NDMgNC4wNzhhLjc1Ljc1IDAgMSAxIDEuMDYtMS4wNmwyLjU5MiAyLjU5QTExLjA5NCAxMS4wOTQgMCAwIDEgMTAgNS4wNjhjNC43MzggMCA4LjU3OCAzLjEwMSA4LjU3OCA1LjA4MyAwIDEuMTk3LTEuNDAxIDIuODAzLTMuNTU1IDMuODg3bDEuNzE0IDEuNzEzYS43NS43NSAwIDAgMS0uMDkgMS4xMzguNDg4LjQ4OCAwIDAgMS0uMTUuMDg0Ljc1Ljc1IDAgMCAxLS44MjEtLjE2TDYuMTcgNy4zMDRjLS4yNTguMTEtLjUxLjIzMy0uNzU3LjM2NWw2LjIzOSA2LjI0LS4wMDYuMDA1Ljc4Ljc4Yy0uMzg4LjA5NC0uNzguMTY2LTEuMTc0LjIxNWwtMS4xMS0xLjExaC4wMTFMNC41NSA4LjE5N2E3LjIgNy4yIDAgMCAwLS42NjUuNTE0bC0uMTEyLjA5OCA0Ljg5NyA0Ljg5Ny0uMDA1LjAwNiAxLjI3NiAxLjI3NmExMC4xNjQgMTAuMTY0IDAgMCAxLTEuNDc3LS4xMTdsLS40NzktLjQ3OS0uMDA5LjAwOS00Ljg2My00Ljg2My0uMDIyLjAzMWEyLjU2MyAyLjU2MyAwIDAgMC0uMTI0LjJjLS4wNDMuMDc3LS4wOC4xNTgtLjEwOC4yNDFhLjUzNC41MzQgMCAwIDAtLjAyOC4xMzMuMjkuMjkgMCAwIDAgLjAwOC4wNzIuOTI3LjkyNyAwIDAgMCAuMDgyLjIyNmMuMDY3LjEzMy4xNDUuMjYuMjM0LjM3OWwzLjI0MiAzLjM2NS4wMjUuMDEuNTkuNjIzYy0zLjI2NS0uOTE4LTUuNTktMy4xNTUtNS41OS00LjY2OCAwLTEuMTk0IDEuNDQ4LTIuODM4IDMuNjYzLTMuOTN6bTcuMDcuNTMxYTQuNjMyIDQuNjMyIDAgMCAxIDEuMTA4IDUuOTkybC4zNDUuMzQ0LjA0Ni0uMDE4YTkuMzEzIDkuMzEzIDAgMCAwIDItMS4xMTJjLjI1Ni0uMTg3LjUtLjM5Mi43MjctLjYxMy4xMzctLjEzNC4yNy0uMjc3LjM5Mi0uNDMxLjA3Mi0uMDkxLjE0MS0uMTg1LjIwMy0uMjg2LjA1Ny0uMDkzLjEwNy0uMTkuMTQ4LS4yOTJhLjcyLjcyIDAgMCAwIC4wMzYtLjEyLjI5LjI5IDAgMCAwIC4wMDgtLjA3Mi40OTIuNDkyIDAgMCAwLS4wMjgtLjEzMy45OTkuOTk5IDAgMCAwLS4wMzYtLjA5NiAyLjE2NSAyLjE2NSAwIDAgMC0uMDcxLS4xNDUgMi45MTcgMi45MTcgMCAwIDAtLjEyNS0uMiAzLjU5MiAzLjU5MiAwIDAgMC0uMjYzLS4zMzUgNS40NDQgNS40NDQgMCAwIDAtLjUzLS41MjMgNy45NTUgNy45NTUgMCAwIDAtMS4wNTQtLjc2OCA5Ljc2NiA5Ljc2NiAwIDAgMC0xLjg3OS0uODkxYy0uMzM3LS4xMTgtLjY4LS4yMTktMS4wMjctLjMwMXptLTIuODUuMjFsLS4wNjkuMDAyYS41MDguNTA4IDAgMCAwLS4yNTQuMDk3LjQ5Ni40OTYgMCAwIDAtLjEwNC42NzkuNDk4LjQ5OCAwIDAgMCAuMzI2LjE5OWwuMDQ1LjAwNWMuMDkxLjAwMy4xODEuMDAzLjI3Mi4wMTJhMi40NSAyLjQ1IDAgMCAxIDIuMDE3IDEuNTEzYy4wMjQuMDYxLjA0My4xMjUuMDY5LjE4NWEuNDk0LjQ5NCAwIDAgMCAuNDUuMjg3aC4wMDhhLjQ5Ni40OTYgMCAwIDAgLjM1LS4xNTguNDgyLjQ4MiAwIDAgMCAuMTMtLjMzNS42MzguNjM4IDAgMCAwLS4wNDgtLjIxOSAzLjM3OSAzLjM3OSAwIDAgMC0uMzYtLjcyMyAzLjQzOCAzLjQzOCAwIDAgMC0yLjc5MS0xLjU0M2wtLjAyOC0uMDAxaC0uMDEzeiIvPjwvc3ZnPg==';
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * A helper utility that positions the
 * {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon contextual balloon} instance
 * with respect to the image in the editor content, if one is selected.
 *
 * @param {module:core/editor/editor~Editor} editor The editor instance.
 */
function repositionContextualBalloon(editor) {
    var balloon = editor.plugins.get('ContextualBalloon');
    if (getSelectedImageWidget(editor.editing.view.document.selection)) {
        var position = getBalloonPositionData(editor);
        balloon.updatePosition(position);
    }
}
/**
 * Returns the positioning options that control the geometry of the
 * {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon contextual balloon} with respect
 * to the selected element in the editor content.
 *
 * @param {module:core/editor/editor~Editor} editor The editor instance.
 * @returns {module:utils/dom/position~Options}
 */
function getBalloonPositionData(editor) {
    var editingView = editor.editing.view;
    var defaultPositions = BalloonPanelView.defaultPositions;
    return {
        target: editingView.domConverter.viewToDom(editingView.document.selection.getSelectedElement()),
        positions: [
            defaultPositions.northArrowSouth,
            defaultPositions.northArrowSouthWest,
            defaultPositions.northArrowSouthEast,
            defaultPositions.southArrowNorth,
            defaultPositions.southArrowNorthWest,
            defaultPositions.southArrowNorthEast
        ]
    };
}
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * The image text alternative UI plugin.
 *
 * The plugin uses the {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon}.
 *
 * @extends module:core/plugin~Plugin
 */
var ImageTextAlternativeUI = /** @class */ (function (_super) {
    __extends(ImageTextAlternativeUI, _super);
    function ImageTextAlternativeUI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ImageTextAlternativeUI, "requires", {
        /**
         * @inheritDoc
         */
        get: function () {
            return [ContextualBalloon];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageTextAlternativeUI, "pluginName", {
        /**
         * @inheritDoc
         */
        get: function () {
            return 'ImageTextAlternativeUI';
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ImageTextAlternativeUI.prototype.init = function () {
        this._createButton();
        this._createForm();
    };
    /**
     * @inheritDoc
     */
    ImageTextAlternativeUI.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        // Destroy created UI components as they are not automatically destroyed (see ckeditor5#1341).
        this._form.destroy();
    };
    /**
     * Creates a button showing the balloon panel for changing the image text alternative and
     * registers it in the editor {@link module:ui/componentfactory~ComponentFactory ComponentFactory}.
     *
     * @private
     */
    ImageTextAlternativeUI.prototype._createButton = function () {
        var _this = this;
        var editor = this.editor;
        var t = editor.t;
        editor.ui.componentFactory.add('imageTextAlternative', function (locale) {
            var command = editor.commands.get('imageTextAlternative');
            var view = new ButtonView(locale);
            view.set({
                label: t('Change image text alternative'),
                icon: lowVisionSvg,
                tooltip: true
            });
            view.bind('isEnabled').to(command, 'isEnabled');
            _this.listenTo(view, 'execute', function () {
                _this._showForm();
            });
            return view;
        });
    };
    /**
     * Creates the {@link module:image/imagetextalternative/ui/textalternativeformview~TextAlternativeFormView}
     * form.
     *
     * @private
     */
    ImageTextAlternativeUI.prototype._createForm = function () {
        var _this = this;
        var editor = this.editor;
        var view = editor.editing.view;
        var viewDocument = view.document;
        /**
         * The contextual balloon plugin instance.
         *
         * @private
         * @member {module:ui/panel/balloon/contextualballoon~ContextualBalloon}
         */
        this._balloon = this.editor.plugins.get('ContextualBalloon');
        /**
         * A form containing a textarea and buttons, used to change the `alt` text value.
         *
         * @member {module:image/imagetextalternative/ui/textalternativeformview~TextAlternativeFormView}
         */
        this._form = new TextAlternativeFormView(editor.locale);
        // Render the form so its #element is available for clickOutsideHandler.
        this._form.render();
        this.listenTo(this._form, 'submit', function () {
            editor.execute('imageTextAlternative', {
                newValue: _this._form.labeledInput.fieldView.element.value
            });
            _this._hideForm(true);
        });
        this.listenTo(this._form, 'cancel', function () {
            _this._hideForm(true);
        });
        // Close the form on Esc key press.
        this._form.keystrokes.set('Esc', function (data, cancel) {
            _this._hideForm(true);
            cancel();
        });
        // Reposition the balloon or hide the form if an image widget is no longer selected.
        this.listenTo(editor.ui, 'update', function () {
            if (!getSelectedImageWidget(viewDocument.selection)) {
                _this._hideForm(true);
            }
            else if (_this._isVisible) {
                repositionContextualBalloon(editor);
            }
        });
        // Close on click outside of balloon panel element.
        clickOutsideHandler({
            emitter: this._form,
            activator: function () { return _this._isVisible; },
            contextElements: [this._balloon.view.element],
            callback: function () { return _this._hideForm(); }
        });
    };
    /**
     * Shows the {@link #_form} in the {@link #_balloon}.
     *
     * @private
     */
    ImageTextAlternativeUI.prototype._showForm = function () {
        if (this._isVisible) {
            return;
        }
        var editor = this.editor;
        var command = editor.commands.get('imageTextAlternative');
        var labeledInput = this._form.labeledInput;
        this._form.disableCssTransitions();
        if (!this._isInBalloon) {
            this._balloon.add({
                view: this._form,
                position: getBalloonPositionData(editor)
            });
        }
        // Make sure that each time the panel shows up, the field remains in sync with the value of
        // the command. If the user typed in the input, then canceled the balloon (`labeledInput#value`
        // stays unaltered) and re-opened it without changing the value of the command, they would see the
        // old value instead of the actual value of the command.
        // https://github.com/ckeditor/ckeditor5-image/issues/114
        labeledInput.fieldView.value = labeledInput.fieldView.element.value = command.value || '';
        this._form.labeledInput.fieldView.select();
        this._form.enableCssTransitions();
    };
    /**
     * Removes the {@link #_form} from the {@link #_balloon}.
     *
     * @param {Boolean} [focusEditable=false] Controls whether the editing view is focused afterwards.
     * @private
     */
    ImageTextAlternativeUI.prototype._hideForm = function (focusEditable) {
        if (!this._isInBalloon) {
            return;
        }
        // Blur the input element before removing it from DOM to prevent issues in some browsers.
        // See https://github.com/ckeditor/ckeditor5/issues/1501.
        if (this._form.focusTracker.isFocused) {
            this._form.saveButtonView.focus();
        }
        this._balloon.remove(this._form);
        if (focusEditable) {
            this.editor.editing.view.focus();
        }
    };
    Object.defineProperty(ImageTextAlternativeUI.prototype, "_isVisible", {
        /**
         * Returns `true` when the {@link #_form} is the visible view in the {@link #_balloon}.
         *
         * @private
         * @type {Boolean}
         */
        get: function () {
            return this._balloon.visibleView === this._form;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageTextAlternativeUI.prototype, "_isInBalloon", {
        /**
         * Returns `true` when the {@link #_form} is in the {@link #_balloon}.
         *
         * @private
         * @type {Boolean}
         */
        get: function () {
            return this._balloon.hasView(this._form);
        },
        enumerable: false,
        configurable: true
    });
    return ImageTextAlternativeUI;
}(Plugin));
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * The image text alternative plugin.
 *
 * For a detailed overview, check the {@glink features/image#image-styles image styles} documentation.
 *
 * This is a "glue" plugin which loads the
 *  {@link module:image/imagetextalternative/imagetextalternativeediting~ImageTextAlternativeEditing}
 * and {@link module:image/imagetextalternative/imagetextalternativeui~ImageTextAlternativeUI} plugins.
 *
 * @extends module:core/plugin~Plugin
 */
var ImageTextAlternative = /** @class */ (function (_super) {
    __extends(ImageTextAlternative, _super);
    function ImageTextAlternative() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ImageTextAlternative, "requires", {
        /**
         * @inheritDoc
         */
        get: function () {
            return [ImageTextAlternativeEditing, ImageTextAlternativeUI];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ImageTextAlternative, "pluginName", {
        /**
         * @inheritDoc
         */
        get: function () {
            return 'ImageTextAlternative';
        },
        enumerable: false,
        configurable: true
    });
    return ImageTextAlternative;
}(Plugin));
/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/**
 * The image plugin.
 *
 * For a detailed overview, check the {@glink features/image image feature} documentation.
 *
 * This is a "glue" plugin which loads the following plugins:
 *
 * * {@link module:image/image/imageediting~ImageEditing},
 * * {@link module:image/imagetextalternative~ImageTextAlternative}.
 *
 * Usually, it is used in conjuction with other plugins from this package. See the {@glink api/image package page}
 * for more information.
 *
 * @extends module:core/plugin~Plugin
 */
var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Image, "requires", {
        /**
         * @inheritDoc
         */
        get: function () {
            return [ImageEditing, Widget, ImageTextAlternative];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Image, "pluginName", {
        /**
         * @inheritDoc
         */
        get: function () {
            return 'Image';
        },
        enumerable: false,
        configurable: true
    });
    return Image;
}(Plugin));
/**
 * The configuration of the image features. Used by the image features in the `@ckeditor/ckeditor5-image` package.
 *
 * Read more in {@link module:image/image~ImageConfig}.
 *
 * @member {module:image/image~ImageConfig} module:core/editor/editorconfig~EditorConfig#image
 */
/**
 * The configuration of the image features. Used by the image features in the `@ckeditor/ckeditor5-image` package.
 *
 *		ClassicEditor
 *			.create( editorElement, {
 * 				image: ... // Image feature options.
 *			} )
 *			.then( ... )
 *			.catch( ... );
 *
 * See {@link module:core/editor/editorconfig~EditorConfig all editor options}.
 *
 * @interface ImageConfig
 */
export default Image;
