import { r as registerInstance, h, H as Host, g as getElement } from './index-f424fde7.js';
var ccInputCss = ".input{display:block}.input__wrapper{position:relative}.input__icon{position:absolute;right:0;margin-right:0.8rem;display:-ms-flexbox;display:flex;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.input__icon--primary{color:var(--primary)}.input__icon--secondary{color:var(--secondary)}.input__field{width:100%;border-radius:0.4rem;border-width:1px;border-color:var(--neutral-02);padding-left:1.6rem;padding-right:1.6rem;padding-top:0.8rem;padding-bottom:0.8rem;font-size:1.4rem;display:block;line-height:2.4rem}.input__field:disabled{border-color:var(--disabled-background)}.input--success .input__field{border-color:var(--success)}.input--error .input__field{border-color:var(--error)}.input--without-border .input__field{border-width:0}.input--without-border .input__field:focus-within,.input--without-border .input__field:hover{border-width:0}.input__field:focus{outline:0}.input--primary .input__field:focus{border-color:var(--primary)}.input--secondary .input__field:focus{border-color:var(--secondary)}.input--success .input__field:focus{border-color:var(--success)}.input--error .input__field:focus{border-color:var(--error)}.input__field::-moz-placeholder{color:var(--neutral-02)}.input__field:-ms-input-placeholder{color:var(--neutral-02)}.input__field::-webkit-input-placeholder{color:var(--neutral-02)}.input__field::-ms-input-placeholder{color:var(--neutral-02)}.input__field::placeholder{color:var(--neutral-02)}.input__field--default-bg{background-color:var(--neutral-04)}.input__field--icon{padding-right:3.8rem}.input__helperText{display:block;font-size:1.1rem;margin-top:0.4rem;color:var(--error)}.input__label{display:block;padding-top:0.4rem;padding-bottom:0.4rem;font-size:1.1rem;font-weight:900;color:var(--neutral-03)}.textarea--disabled .input__label{color:var(--disabled-text)}";
var CcInput = /** @class */ (function () {
    function CcInput(hostRef) {
        var _this = this;
        registerInstance(this, hostRef);
        this.color = "primary";
        this.type = "text";
        this.disabled = false;
        this.error = false;
        this.success = false;
        this.bgField = "";
        this.autocomplete = "";
        this.border = true;
        this.defaultValue = "";
        this.focusInput = function () {
            _this.inputEl.focus();
        };
        this.setInputRef = function (el) {
            _this.inputEl = el;
            if (_this.inputRef) {
                _this.inputRef(_this.inputEl);
            }
        };
    }
    CcInput.prototype.render = function () {
        var _a;
        var hasAdornment = this.el.querySelector("[slot='adornment']");
        return (h(Host, { class: {
                input: true,
                "input--primary": this.color === "primary",
                "input--secondary": this.color === "secondary",
                "input--success": this.success && !this.error && !this.disabled,
                "input--error": this.error && !this.success && !this.disabled,
                "input--disabled": this.disabled,
                "input--without-border": !this.border
            }, "data-testid": "cc-input" }, this.label && (h("label", { class: "input__label", onClick: this.focusInput }, this.label)), h("div", { class: "input__wrapper" }, h("input", { class: (_a = {
                    input__field: true,
                    "input__field--icon": !!this.iconName || !!hasAdornment,
                    "input__field--default-bg": !this.bgField
                },
                _a[this.bgField] = !!this.bgField,
                _a), type: this.type, placeholder: this.placeholder, disabled: this.disabled, name: this.name, value: this.value, ref: this.setInputRef, autocomplete: this.autocomplete, maxLength: this.maxLength, defaultValue: this.defaultValue }), this.iconName && (h("cc-icon", { class: {
                input__icon: true,
                "input__icon--primary": this.color === "primary",
                "input__icon--secondary": this.color === "secondary"
            }, name: this.iconName })), hasAdornment && (h("div", { class: "input__icon" }, h("slot", { name: "adornment" })))), this.helperText && this.error && !this.success && !this.disabled && (h("span", { class: "input__helperText", onClick: this.focusInput }, this.helperText))));
    };
    Object.defineProperty(CcInput.prototype, "el", {
        get: function () { return getElement(this); },
        enumerable: false,
        configurable: true
    });
    return CcInput;
}());
CcInput.style = ccInputCss;
var ccWrapperFieldCss = ".wrapper-field{position:relative;width:100%;background-color:var(--neutral-04);border-radius:0.4rem;border-width:1px;border-style:solid;border-color:var(--neutral-02);font-size:1.4rem;display:block;cursor:pointer;min-height:42px}.wrapper-field:hover{border-color:var(--primary)}.wrapper-field .wrapper-field__icon{color:var(--primary)}.wrapper-field cc-loader{color:var(--primary)}.wrapper-field--readonly:after{position:absolute;width:100%;height:100%;top:0;left:0;content:\"\";background:transparent}.wrapper-field--no-border{border-width:0}.wrapper-field--no-border:focus-within,.wrapper-field--no-border:hover{border-width:0}.wrapper-field--no-background{background:transparent}.wrapper-field--secondary .wrapper-field__icon{color:var(--secondary)}.wrapper-field--secondary cc-loader{color:var(--secondary)}.wrapper-field--secondary:focus-within,.wrapper-field--secondary:hover{border-color:var(--secondary)}.wrapper-field--secondary:focus-within .wrapper-field__icon,.wrapper-field--secondary:hover .wrapper-field__icon{color:var(--secondary)}.wrapper-field--disabled{border-color:var(--disabled-background);cursor:not-allowed}.wrapper-field--disabled .wrapper-field__icon{color:var(--disabled-text)}.wrapper-field--disabled:focus-within,.wrapper-field--disabled:hover{border-color:var(--disabled-background);color:var(--disabled-text)}.wrapper-field--error{border-color:var(--error)}.wrapper-field--error:focus-within,.wrapper-field--error:hover{border-color:var(--error)}.wrapper-field--error .wrapper-field__icon{color:var(--error)}.wrapper-field--helperText{margin-bottom:1.6rem}.wrapper-field--is-focus{border-color:var(--primary)}.wrapper-field--is-focus:hover{border-color:var(--primary)}.wrapper-field--is-focus.wrapper-field--secondary{border-color:var(--secondary)}.wrapper-field--is-focus.wrapper-field--secondary:hover{border-color:var(--secondary)}.wrapper-field--is-focus.wrapper-field--error{border-color:var(--error)}.wrapper-field--is-focus.wrapper-field--error:focus-within,.wrapper-field--is-focus.wrapper-field--error:hover{border-color:var(--error)}.wrapper-field--is-focus.wrapper-field--error .wrapper-field__icon{color:var(--error)}.wrapper-field__wrapper-icon{pointer-events:none;position:absolute;right:8px;bottom:8px;max-height:2.4rem}.wrapper-field__icon--inverted{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.wrapper-field__helperText{position:absolute;font-size:1.1rem;margin-top:0.4rem;color:var(--error);left:0}";
var CcWrapperField = /** @class */ (function () {
    function CcWrapperField(hostRef) {
        registerInstance(this, hostRef);
        this.fieldReadonly = false;
        this.iconOnly = false;
        this.loader = false;
        this.disabled = false;
        this.color = "primary";
        this.error = false;
        this.border = true;
        this.bgField = "";
        this.isFocus = false;
        this.isActive = false;
        this.IconRotate = true;
    }
    CcWrapperField.prototype.render = function () {
        return (h(Host, { class: {
                "wrapper-field": true,
                "wrapper-field--is-focus": this.isActive,
                "wrapper-field--readonly": this.fieldReadonly || this.loader || this.iconOnly,
                "wrapper-field--disabled": this.disabled,
                "wrapper-field--secondary": this.color === "secondary" && !this.disabled && !this.error,
                "wrapper-field--error": this.error && !this.disabled,
                "wrapper-field--no-border": !this.border,
                "wrapper-field--no-background": !this.bgField,
                "wrapper-field--icon-only": this.iconOnly,
                "wrapper-field--helperText": this.helperText && this.error && !this.disabled
            } }, h("slot", null), h("div", { class: "wrapper-field__wrapper-icon" }, this.loader ? (h("cc-loader", null)) : (h("cc-icon", { class: {
                "wrapper-field__icon": true,
                "wrapper-field__icon--inverted": this.isActive && this.IconRotate
            }, name: this.iconName }))), this.helperText && this.error && !this.disabled && (h("span", { class: "wrapper-field__helperText" }, this.helperText))));
    };
    return CcWrapperField;
}());
CcWrapperField.style = ccWrapperFieldCss;
export { CcInput as cc_input, CcWrapperField as cc_wrapper_field };