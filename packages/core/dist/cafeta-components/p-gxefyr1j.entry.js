import{r as t,h as s,H as i}from"./p-c6084a5c.js";const n=class{constructor(s){t(this,s),this.iconName="",this.iconReverse=!1,this.iconOnly=!1,this.disabled=!1,this.fill="solid",this.expand=!1,this.color="primary",this.size="lg"}render(){return s(i,{class:{"button--block":this.expand,"button--secondary":"secondary"===this.color}},s(this.href?"a":"button",Object.assign({class:{button:!0,"button--reverse":this.iconReverse,"button--disabled":!this.href&&this.disabled,"button--outline":"outline"===this.fill,"button--clear":"clear"===this.fill,"button--md":"md"===this.size,"button--sm":"sm"===this.size,"button--iconOnly":this.iconOnly}},{disabled:!this.href&&this.disabled,href:this.href,target:this.target}),this.iconName&&s("cc-icon",{class:{button__icon:!0},name:this.iconName,size:"sm"===this.size?20:24}),!this.iconOnly&&s("span",{class:"button__text"},s("slot",null))))}static get style(){return".button{border-width:0;padding:1.2rem;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;font-size:1.4rem;font-weight:700;border-radius:.4rem;outline:0;width:100%;border:1px solid transparent;line-height:2.4rem;-webkit-box-sizing:border-box;box-sizing:border-box;font-family:inherit;height:4.8rem;background-color:var(--cc-button-color-base);color:var(--cc-button-color-contrast);cursor:pointer;text-decoration:none}.button__text{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}.button__icon{margin-right:.8rem}.button--reverse .button__icon{margin-right:0;margin-left:.8rem}.button--iconOnly .button__icon{margin:0}.button--iconOnly{width:4.8rem}.button--md{padding:.8rem;height:4rem}.button--md.button--iconOnly{width:4rem}.button--sm{font-size:1.2rem;padding:.6rem;line-height:2rem;height:3.2rem}.button--sm.button--iconOnly{width:3.2rem}.button--reverse{-webkit-box-orient:horizontal;-webkit-box-direction:reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse}.button--outline{border-color:var(--cc-button-color-base);background:var(--cc-button-color-contrast)}.button--clear,.button--outline{color:var(--cc-button-color-base)}.button--clear{background:transparent}.button--disabled,.button:disabled{background-color:var(--disabled-background);color:var(--disabled-text);cursor:not-allowed}.button--disabled.button--clear,.button:disabled.button--clear{background:transparent}.button--disabled.button--outline,.button:disabled.button--outline{background-color:var(--background-06);border-color:var(--disabled-background)}"}};export{n as cc_button};