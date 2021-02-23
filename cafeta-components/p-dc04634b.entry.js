import{r as e,c as t,h as r,H as a}from"./p-b447a3c4.js";class i{constructor({loader:e,serviceUpload:t}){this.loader=e,this.serviceUpload=t}async upload(){const e=await this.loader.file;this.loader.uploadTotal=100,this.loader.uploaded=0;try{const t=await this.serviceUpload(e);return this.loader.uploaded=100,{default:t}}catch(t){throw t}}}const o=class{constructor(r){e(this,r),this.changeText=t(this,"changeText",7),this.lengthCharacter=0,this.color="primary",this.error=!1,this.success=!1,this.disabled=!1,this.rich=!1,this.outlined=!1,this.autoGrow=!1,this.withoutRadius=!1,this.counter=!1,this.bgField="white",this.enableMediaEmbed=!1,this.focusEditor=()=>{this.rich?(this.editorInstance.editing.view.focus(),this.putCursorAtTheEnd()):this.textAreaEl.focus()}}async focusTextEditor(){this.focusEditor()}async setDataRichEditor(e){this.editorInstance.data.set(e)}validateName(e){this.editorInstance&&(this.editorInstance.isReadOnly=e)}toggleRichText(e,t){e!==t&&(e&&!e?this.enableRichTextEditor():this.disableRichTextEditor())}getAmountOfCharacters(){if(this.textAreaEl)return this.textAreaEl.value.length}setValue(e){this.rich?this.editorInstance&&this.editorInstance.data.set(e):this.textAreaEl.value=e}changeTextHandler(e){this.autoGrow&&(this.textAreaEl.style.height="5px",this.textAreaEl.style.height=this.textAreaEl.scrollHeight+"px"),this.counter&&(this.lengthCharacter=e.length),this.changeText.emit(e)}setRichTextEditorDefaults(){this.editorInstance.isReadOnly=this.disabled,this.value&&this.editorInstance.data.set(this.value),this.editorInstance.model.document.on("change:data",()=>{this.changeTextHandler(this.editorInstance.getData())})}async enableRichTextEditor(){let e=this.toolbar||["Undo","Redo","Heading","Bold","Italic","numberedList","bulletedList","Link","blockQuote"];if(!this.rich)return null;const{default:t}=await __sc_import_cafeta_components("./p-77a041b7.js").then((function(e){return e.c})),r={toolbar:e,placeholder:this.placeholder};return this.enableMediaEmbed||(r.mediaEmbed={providers:[]}),this.enableImage&&this.imageService&&e.push("imageUpload"),this.editorInstance=await t.create(this.richTextEl,r),this.setRichTextEditorDefaults(),this.setAdapterUpload(this.editorInstance),this.editorInstance}setAdapterUpload(e){(this.enableImage||this.imageService)&&(e.plugins.get("FileRepository").createUploadAdapter=e=>new i({loader:e,serviceUpload:this.imageService}))}disableRichTextEditor(){this.rich&&this.editorInstance&&this.editorInstance.destroy()}putCursorAtTheEnd(){this.editorInstance.model.change(e=>{e.setSelection(e.createPositionAt(this.editorInstance.model.document.getRoot(),"end"))})}componentDidLoad(){this.enableRichTextEditor()}componentWillLoad(){this.value&&(this.lengthCharacter=this.value.length)}componentDidUnload(){this.disableRichTextEditor()}render(){return r(a,{class:{textarea:!0,relative:!0,"textarea--primary":"primary"===this.color,"textarea--secondary":"secondary"===this.color,"textarea--success":this.success&&!this.error&&!this.disabled,"textarea--error":this.error&&!this.success&&!this.disabled,"textarea--disabled":this.disabled,"textarea--bg-transparent":"transparent"===this.bgField,"textarea--bg-white":"white"===this.bgField},"data-testid":"cc-textarea"},this.label&&r("label",{class:"textarea__label",onClick:this.focusEditor},this.label),this.rich?r("div",{class:"textarea__richTextSkeleton",ref:e=>this.richTextEl=e},this.value?this.value:""):r("textarea",{rows:1,ref:e=>this.textAreaEl=e,disabled:this.disabled,placeholder:this.placeholder,class:{textarea__field:!0,"textarea__field--outlined":this.outlined,"textarea__field--icon":!!this.iconName&&!this.rich,"textarea__field--auto-grow":this.autoGrow,"textarea__field--without-radius":this.withoutRadius,"textarea__field--bg-white":"white"===this.bgField,"textarea__field--bg-transparent":"transparent"===this.bgField},maxLength:this.maxLength,name:this.name,value:this.value,onInput:e=>this.changeTextHandler(e.target.value)}),!!this.iconName&&!this.rich&&r("cc-icon",{class:{textarea__icon:!0,"textarea__icon--primary":"primary"===this.color,"textarea__icon--secondary":"secondary"===this.color},name:this.iconName}),r("div",{class:"textarea__wrapper-helper"},r("div",null,this.helperText&&this.error&&!this.success&&!this.disabled&&r("span",{class:"textarea__helperText",onClick:this.focusEditor},this.helperText)),r("div",null,this.counter&&r("span",{class:"textarea__counter"},r("span",null,this.lengthCharacter),r("span",null,"/"),r("span",null,this.maxLength?this.maxLength:"maxlength is missing")))))}static get watchers(){return{disabled:["validateName"],rich:["toggleRichText"],value:["setValue"]}}};o.style=".textarea{display:block}.textarea h2,.textarea h3,.textarea h4{font-weight:900}.textarea h2{font-size:2rem}.textarea h3{font-size:1.8rem}.textarea h4{font-size:1.6rem}.textarea li{margin-left:1.6rem}.textarea ol{list-style:decimal}.textarea ul{list-style:disc}.textarea b,.textarea strong{font-weight:900}.textarea a{text-decoration:underline}.textarea.textarea--primary a{color:var(--primary)}.textarea.textarea--secondary a{color:var(--secondary)}.textarea__icon{position:absolute;bottom:0;right:0;margin-right:0.8rem;margin-bottom:0.8rem;display:-ms-flexbox;display:flex}.textarea__icon--primary{color:var(--primary)}.textarea__icon--secondary{color:var(--secondary)}.textarea__field{width:100%;border-radius:0.4rem;border-width:1px;border-color:var(--neutral-02);padding-left:1.6rem;padding-right:1.6rem;padding-top:0.8rem;padding-bottom:0.8rem;font-size:1.4rem;display:block;line-height:1.625;resize:none;min-height:13.6rem}.textarea__field--icon{padding-right:3.6rem}.textarea__field--outlined{border-top-width:0;border-left-width:0;border-right-width:0;border-bottom-width:1px}.textarea__field--auto-grow{min-height:4.2rem}.textarea__field--without-radius{border-radius:0}.textarea__field--bg-white{background-color:var(--neutral-04)}.textarea__field--bg-transparent{background-color:transparent}.textarea__field:disabled{border-color:var(--disabled-background)}.textarea--success .textarea__field{border-color:var(--success)}.textarea--error .textarea__field{border-color:var(--error)}.textarea__field:focus{outline:0}.textarea--primary .textarea__field:focus{border-color:var(--primary)}.textarea--secondary .textarea__field:focus{border-color:var(--secondary)}.textarea--success .textarea__field:focus{border-color:var(--success)}.textarea--error .textarea__field:focus{border-color:var(--error)}.textarea__field::-moz-placeholder{color:var(--neutral-02)}.textarea__field:-ms-input-placeholder{color:var(--neutral-02)}.textarea__field::-webkit-input-placeholder{color:var(--neutral-02)}.textarea__field::-ms-input-placeholder{color:var(--neutral-02)}.textarea__field::placeholder{color:var(--neutral-02)}.textarea__label{display:block;padding-top:0.4rem;padding-bottom:0.4rem;font-size:1.1rem;font-weight:900;color:var(--neutral-03)}.textarea--disabled .textarea__label{color:var(--disabled-text)}.textarea__helperText{display:block;font-size:1.1rem;margin-top:0.4rem;color:var(--error)}.textarea__richTextSkeleton{width:100%;border-radius:0.4rem;border-width:1px;border-color:var(--neutral-02);padding-left:1.6rem;padding-right:1.6rem;padding-top:0.8rem;padding-bottom:0.8rem;background-color:var(--neutral-04);font-size:1.4rem;display:block;line-height:1.625;min-height:13.6rem}.textarea__richTextSkeleton+.textarea__helperText{display:none}.textarea__counter{font-size:1.2rem;color:var(--neutral-02)}.textarea__wrapper-helper{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between}.textarea--bg-transparent .ck.ck-editor__main>.ck-editor__editable{background-color:transparent}.textarea--bg-white .ck.ck-editor__main>.ck-editor__editable{background-color:var(--neutral-04)}.textarea .ck.ck-toolbar{border-color:var(--neutral-02)}.textarea.textarea--disabled .ck.ck-toolbar{border-color:var(--disabled-background)}.textarea .ck-rounded-corners .ck.ck-editor__top .ck-sticky-panel .ck-toolbar,.textarea .ck.ck-editor__top .ck-sticky-panel .ck-toolbar.ck-rounded-corners{border-top-left-radius:0.4rem;border-top-right-radius:0.4rem}.textarea .ck-rounded-corners .ck.ck-editor__main>.ck-editor__editable,.textarea .ck.ck-editor__main>.ck-editor__editable.ck-rounded-corners{border-bottom-right-radius:0.4rem;border-bottom-left-radius:0.4rem}.textarea .ck.ck-editor__main>.ck-editor__editable.ck-focused{-webkit-box-shadow:none;box-shadow:none}.textarea .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused){border-color:var(--neutral-02)}.textarea .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused).ck-read-only{border-color:var(--disabled-background)}.textarea .ck.ck-toolbar.ck-toolbar_grouping>.ck-toolbar__items{-ms-flex-pack:end;justify-content:flex-end}.textarea.textarea--primary .ck.ck-editor__main>.ck-editor__editable.ck-focused{border-color:var(--primary)}.textarea.textarea--secondary .ck.ck-editor__main>.ck-editor__editable.ck-focused{border-color:var(--secondary)}.textarea--error .textarea{border-color:var(--error)}.textarea.textarea--success .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused),.textarea.textarea--success .ck.ck-editor__main>.ck-editor__editable.ck-focused{border-color:var(--success)}.textarea.textarea--error .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused),.textarea.textarea--error .ck.ck-editor__main>.ck-editor__editable.ck-focused{border-color:var(--error)}.textarea .ck.ck-editor__editable_inline>:first-child{margin-top:0.8rem}.textarea .ck.ck-editor__editable_inline>:last-child{margin-bottom:0.8rem}.textarea .ck.ck-editor__editable_inline{padding-left:1.6rem;padding-right:1.6rem;min-height:13.6rem}";export{o as cc_textarea}