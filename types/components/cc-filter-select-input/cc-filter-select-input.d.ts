import { EventEmitter } from "../../stencil-public-runtime";
export declare class CcFilterSelectInput {
    private singleFileInput;
    private dropdownItems;
    private inputEl;
    private observerItems;
    _choices: Array<any>;
    isOpenDropdown: boolean;
    thereIsLowerSpace: boolean;
    positionOptionstop: boolean;
    valueInput: string;
    selectedChoices: Array<any>;
    hoveredChoice: string;
    label: string;
    choices: Array<any>;
    error?: boolean;
    disabled?: boolean;
    fieldReadonly?: boolean;
    placeholder?: string;
    name?: string;
    currentValue?: string;
    iconName?: string;
    color: "primary" | "secondary";
    helperText?: string;
    border?: boolean;
    bgField?: string;
    loader?: boolean;
    type?: "checkbox";
    IconRotate?: boolean;
    changeChoice: EventEmitter;
    setChoices(newValue: any, oldValue: any): void;
    handleKeyDown(ev: KeyboardEvent): void;
    updateChoicesList: (value: string) => void;
    setInputText: (e: any) => void;
    focusInput: () => void;
    removeFocus: () => void;
    clearChoices(): void;
    clearInputValue: () => void;
    validateShowPlaceholder(): boolean;
    knowIfThereIsASelected: () => boolean;
    handleOptionClick: (value: string) => void;
    filteredChoices: () => any[];
    placeholderSelected: () => void;
    handleToogleOptions(): void;
    handleShowOptions: () => void;
    handleHideOptions: () => void;
    handleRemoveItemSelected: (value: string) => void;
    closeDroprownIfClickOutDropdown: (e: any) => void;
    getHeigthWrapperOptions: () => number;
    observerListItems: () => void;
    calculatePositionOfOptions: () => boolean;
    validateDisabled: () => void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    render(): any;
}