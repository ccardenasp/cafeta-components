import{r,c,h as e,H as t}from"./p-b447a3c4.js";const a=class{constructor(e){r(this,e),this.changeTracker=c(this,"changeTracker",7),this.readonly=!1,this.withoutLabel=!1,this.showProgress=!0,this.progress=0,this.handleClickTrack=(r,c)=>{if(r.isDisabled||this.readonly)return;const e=[...this.trackersList];e.map((r,e)=>(r.isActive=c===e&&!r.isDisabled,r.isCompleted=e<c&&!r.isDisabled,r.isIncompleted=e>c&&!r.isDisabled)),this.trackersList=[...e],this.progress=this.getProgress(c),this.changeTracker.emit(r.order)},this.getProgress=r=>0===r?0:100/(this.trackersList.length-1)*r}render(){var r;return e(t,{class:"tracker","data-testid":"cc-tracker"},e("ul",{class:{tracker__list:!0}},this.showProgress&&e("div",{class:"tracker__progress-base"}),this.showProgress&&e("div",{class:"tracker__progress",style:{width:this.progress+"%"}}," "),null===(r=this.trackersList)||void 0===r?void 0:r.map((r,c)=>e("li",{class:{tracker__item:!0},onClick:()=>this.handleClickTrack(r,c)},e("div",{class:{tracker__circle:!0,"tracker__circle--readonly":this.readonly,"tracker__circle--is-active":r.isActive,"tracker__circle--is-completed":r.isCompleted,"tracker__circle--is-incompleted":r.isIncompleted,"tracker__circle--is-disabled":r.isDisabled}},r.iconName&&e("cc-icon",{name:r.iconName}),!r.iconName&&e("span",null,r.order)),!this.withoutLabel&&e("p",{class:{tracker__label:!0,"tracker__label--is-disabled":r.isDisabled,"tracker__label--is-incompleted":r.isIncompleted}},r.label)))))}};a.style=".tracker__list.sc-cc-tracker{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;position:relative;margin-bottom:0.8rem;z-index:4}.tracker__progress.sc-cc-tracker{position:absolute;left:0;background-color:var(--primary);background-color:var(--primary);height:3px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);z-index:3}.tracker__progress-base.sc-cc-tracker{width:100%;position:absolute;left:0;background-color:var(--disabled-background);height:3px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);z-index:2}.tracker__item.sc-cc-tracker{display:-ms-flexbox;display:flex;position:relative;z-index:5}.tracker__circle.sc-cc-tracker{display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;font-weight:700;position:relative;font-size:1.4rem;border-radius:9999px;min-width:4.8rem;min-height:4.8rem;max-height:4.8rem;max-width:4.8rem}.tracker__circle--readonly.sc-cc-tracker{cursor:default !important}.tracker__circle--is-active.sc-cc-tracker{color:var(--primary);background-color:var(--neutral-04);border-color:var(--primary);cursor:pointer;border:3px solid}.tracker__circle--is-disabled.sc-cc-tracker{cursor:not-allowed}.tracker__circle--is-completed.sc-cc-tracker{color:var(--neutral-04);background-color:var(--primary);cursor:pointer}.tracker__circle--is-disabled.sc-cc-tracker,.tracker__circle--is-incompleted.sc-cc-tracker{color:var(--disabled-text);background-color:var(--disabled-background)}.tracker__circle--is-incompleted.sc-cc-tracker{cursor:pointer}.tracker__circle.sc-cc-tracker cc-icon--is-active.sc-cc-tracker{color:var(--primary)}.tracker__circle.sc-cc-tracker cc-icon--is-completed.sc-cc-tracker{color:var(--neutral-04)}.tracker__circle.sc-cc-tracker cc-icon--is-disabled.sc-cc-tracker,.tracker__circle.sc-cc-tracker cc-icon--is-incompleted.sc-cc-tracker{color:var(--disabled-text)}.tracker__label.sc-cc-tracker{position:absolute;font-size:1.4rem;font-weight:700;color:var(--primary);width:-webkit-max-content;width:-moz-max-content;width:max-content;left:50%;bottom:-28px;-webkit-transform:translateX(-50%);transform:translateX(-50%);line-height:2rem}.tracker__label--is-disabled.sc-cc-tracker,.tracker__label--is-incompleted.sc-cc-tracker{color:var(--disabled-text)}";export{a as cc_tracker}