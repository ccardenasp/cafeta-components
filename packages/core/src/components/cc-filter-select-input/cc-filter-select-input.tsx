import {
  h,
  Component,
  Host,
  Prop,
  State,
  Event,
  EventEmitter,
  Watch,
  Listen
} from "@stencil/core";

@Component({
  tag: "cc-filter-select-input",
  styleUrl: "cc-filter-select-input.scss",
  shadow: false
})
export class CcFilterSelectInput {
  private singleFileInput: HTMLElement;
  private dropdownItems: HTMLElement;
  private inputEl: HTMLInputElement;
  private observerItems: MutationObserver;

  @State() _choices: Array<any> = [];
  @State() isOpenDropdown: boolean = false;
  @State() thereIsLowerSpace: boolean = false;
  @State() positionOptionstop: boolean = false;
  @State() valueInput: string = "";
  @State() selectedChoices: Array<any> = [];
  @State() hoveredChoice: string = "";
  @Prop() label: string = "";
  @Prop() choices: Array<any>;
  @Prop() error?: boolean = false;
  @Prop() disabled?: boolean = false;
  @Prop() fieldReadonly?: boolean = false;
  @Prop() placeholder?: string = "";
  @Prop() name?: string = "";
  @Prop() currentValue?: string = "";
  @Prop() iconName?: string = "chevron-down";
  @Prop() color: "primary" | "secondary" = "primary";
  @Prop() helperText?: string;
  @Prop() border?: boolean = true;
  @Prop() bgField?: string = "";
  @Prop() loader?: boolean = false;
  @Prop() type?: "checkbox";

  @Event() changeChoice: EventEmitter;

  @Watch("choices")
  setChoices(newValue: any, oldValue: any) {
    const newValueStringify = JSON.stringify(newValue);
    const oldValueStringify = JSON.stringify(oldValue);

    if (newValueStringify !== oldValueStringify) {
      this._choices = newValue;
    }
  }

  @Listen("keydown", { target: "document" })
  handleKeyDown(ev: KeyboardEvent) {
    if (this.isOpenDropdown) {
      const indexHoveredChoice = this._choices.findIndex(
        choice => choice.value === this.hoveredChoice
      );
      const lastChoiceIndex = this._choices.length - 1;
      const firstChoiceIndex = 0;
      switch (ev.key) {
        case "ArrowDown":
          if (indexHoveredChoice < lastChoiceIndex) {
            const nextHoveredIndex = indexHoveredChoice + 1;
            this.hoveredChoice = this._choices[nextHoveredIndex].value;
            this.dropdownItems
              .querySelectorAll(".filter-file-input__option")
              [nextHoveredIndex].scrollIntoView(false);
          }
          break;
        case "ArrowUp":
          if (indexHoveredChoice > firstChoiceIndex) {
            const prevtHoveredIndex = indexHoveredChoice - 1;
            this.hoveredChoice = this._choices[prevtHoveredIndex].value;
            this.dropdownItems
              .querySelectorAll(".filter-file-input__option")
              [prevtHoveredIndex].scrollIntoView(true);
          }
          break;
        case "Enter":
          this.handleOptionClick(this.hoveredChoice);
          break;
        case "Backspace":
          if (!this.valueInput.length && this.selectedChoices.length) {
            const newChoices = [...this.selectedChoices];
            newChoices.pop();
            this.selectedChoices = newChoices;
          }
          break;
        default:
          break;
      }
    }
  }

  updateChoicesList = (value: string) => {
    this.selectedChoices = this.selectedChoices.includes(value)
      ? this.selectedChoices.filter(choice => choice !== value)
      : [...this.selectedChoices, value];
  };

  setInputText = e => {
    const value = e.target.value;
    this.valueInput = value;
    this.valueInput.length ? this.handleShowOptions() : false;
  };

  focusInput = () => {
    this.inputEl.focus();
  };

  removeFocus = () => {
    document.body.focus();
  };

  clearChoices() {
    const newChoices = [...this._choices];
    newChoices.map(choice => (choice.selected = false));
    this._choices = newChoices;
  }

  clearInputValue = () => {
    this.valueInput = "";
  };

  validateShowPlaceholder() {
    return this.isOpenDropdown || this.knowIfThereIsASelected();
  }

  knowIfThereIsASelected = () => {
    return this.selectedChoices.length > 0;
  };

  handleOptionClick = (value: string) => {
    this.updateChoicesList(value);
    this.clearInputValue();
  };

  filteredChoices = () => {
    const filterdList = this.valueInput.length
      ? this._choices.filter(choice => {
          // if (!choice.selected) {
          const loweredChoiceWithoutTilde = choice.label
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          const loweredInputWithoutTilde = this.valueInput
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          return loweredChoiceWithoutTilde.includes(loweredInputWithoutTilde);
          // }
        })
      : this._choices;
    return filterdList;
  };

  placeholderSelected = () => {
    this.clearChoices();
    this.handleHideOptions();
    this.changeChoice.emit(null);
  };

  handleToogleOptions() {
    this.isOpenDropdown = !this.isOpenDropdown;
    this.calculatePositionOfOptions();
  }

  handleShowOptions = () => {
    this.isOpenDropdown = true;
    this.hoveredChoice = this._choices[0].value;
  };

  handleHideOptions = () => {
    this.isOpenDropdown = false;
  };

  handleRemoveItemSelected = (value: string) => {
    const newChoices = [...this._choices];
    newChoices.filter(choice => choice.value === value)[0].selected = false;
    this._choices = newChoices;
  };

  closeDroprownIfClickOutDropdown = e => {
    const elementActiveDropdown = this.singleFileInput;
    let targetElement = e.target;

    if (!elementActiveDropdown.contains(targetElement)) {
      return (
        this.removeFocus(), this.handleHideOptions(), this.clearInputValue()
      );
    }
  };

  getHeigthWrapperOptions = () => {
    return this.dropdownItems.getBoundingClientRect().height;
  };

  observerListItems = () => {
    const config = { attributes: true, childList: false, characterData: false };

    this.observerItems = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes") {
          this.calculatePositionOfOptions();
          this.focusInput();
        }
      });
    });

    this.observerItems.observe(this.dropdownItems, config);
  };

  calculatePositionOfOptions = () => {
    if (this.isOpenDropdown) {
      const dropdown = this.singleFileInput;
      const elementItems = this.dropdownItems;
      const heightBody = document.body.getBoundingClientRect().height;
      const listHeight = elementItems.getBoundingClientRect().height;
      const dropdownField = dropdown.getBoundingClientRect().height;
      const positionDropdown = dropdown.getBoundingClientRect().top;
      const MARGIN_DROPDOWN_TO_ITEMS = 8;
      const elementPos =
        positionDropdown +
        dropdownField +
        MARGIN_DROPDOWN_TO_ITEMS +
        listHeight;
      return (this.positionOptionstop = heightBody < elementPos);
    }
    this.positionOptionstop = false;
  };

  validateDisabled = () => {
    if (!this.disabled) {
      this.focusInput();
      this.handleShowOptions();
    }
  };

  componentWillLoad() {
    this._choices = [...this.choices];
    document.addEventListener("click", this.closeDroprownIfClickOutDropdown);
  }

  componentDidLoad() {
    this.observerListItems();
  }

  componentDidUnload() {
    if (this.observerItems) this.observerItems.disconnect();
    document.removeEventListener("click", this.closeDroprownIfClickOutDropdown);
  }

  render() {
    const attrs = {
      disabled: this.disabled,
      loader: this.loader,
      fieldReadonly: this.fieldReadonly,
      color: this.color,
      error: this.error,
      border: this.border,
      bgField: this.bgField,
      isActive: this.isOpenDropdown
    };
    return (
      <Host data-testid="cc-filter-file-input" class="filter-file-input">
        {this.label && (
          <span class="filter-file-input__label">{this.label}</span>
        )}
        <cc-wrapper-field
          ref={el => (this.singleFileInput = el)}
          class={{
            "filter-file-input__wrapper": true,
            "filter-file-input--is-collapse": this.isOpenDropdown
          }}
          {...attrs}
        >
          <div class="filter-file-input__field" onClick={this.validateDisabled}>
            <div
              class={{
                "filter-file-input__dot-wrapper": true,
                "filter-file-input__dot-wrapper--is-hidden": !this.knowIfThereIsASelected()
              }}
            >
              <ul class="filter-file-input__dot-list">
                {this.selectedChoices
                  .map(selectedChoice =>
                    this._choices.find(
                      choice => choice.value === selectedChoice
                    )
                  )
                  .map(choice => (
                    <li class="filter-file-input__dot-item">
                      <div class="filter-file-input__dot-text">
                        {choice.label}
                      </div>
                      <div
                        onClick={() =>
                          this.handleRemoveItemSelected(choice.value)
                        }
                        class="filter-file-input__dot-delete"
                      >
                        x
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            <p
              class={{
                "filter-file-input__placeholder": true,
                "filter-file-input__placeholder--is-hidden": this.validateShowPlaceholder()
              }}
            >
              {this.placeholder}
            </p>
            <cc-input
              style={{
                width: `${this.valueInput.length + 1}ch`,
                maxWidth: "100%"
              }}
              bgField="bg-transparent"
              onInput={(e: Event) => this.setInputText(e)}
              border={false}
              value={this.valueInput}
              inputRef={el => (this.inputEl = el)}
              class={{
                "filter-file-input__input": true,
                "filter-file-input__input--is-hidden": !this.validateShowPlaceholder()
              }}
            />
            <div class="filter-file-input__wrapper-icon">
              {this.loader ? (
                <cc-loader></cc-loader>
              ) : (
                <cc-icon
                  class={{
                    dropdown__icon: true,
                    "dropdown__icon--inverted": this.isOpenDropdown
                  }}
                  name={this.error ? "x" : this.iconName}
                ></cc-icon>
              )}
            </div>
          </div>
          <ul
            ref={el => (this.dropdownItems = el)}
            class={{
              "filter-file-input__options": true,
              "filter-file-input__options--is-active": this.isOpenDropdown,
              "filter-file-input__options--top": this.positionOptionstop
            }}
          >
            {this.filteredChoices().length === 0 && (
              <li
                class={{
                  "filter-file-input__placeholder": true,
                  "filter-file-input__option": true
                }}
              >
                No se encontraron resultados
              </li>
            )}

            {this.filteredChoices()
              .map(choice => ({
                ...choice,
                selected: this.selectedChoices.includes(choice.value)
              }))
              .map(c => {
                return (
                  <li
                    onClick={() =>
                      c.disabled ? false : this.handleOptionClick(c.value)
                    }
                    class={{
                      "filter-file-input__option": true,
                      "filter-file-input__option--is-selected": c.selected,
                      "filter-file-input__option--is-disabled": c.disabled,
                      "filter-file-input__option--hover":
                        c.value === this.hoveredChoice
                    }}
                  >
                    {this.type === "checkbox" || (
                      <input
                        class="filter-file-input__option-checkbox"
                        type="checkbox"
                        name=""
                        id=""
                        checked={c.selected}
                      />
                    )}
                    <span>{c.label}</span>
                  </li>
                );
              })}
          </ul>
        </cc-wrapper-field>
      </Host>
    );
  }
}
