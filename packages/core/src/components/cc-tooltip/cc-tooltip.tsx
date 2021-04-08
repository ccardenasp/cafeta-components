import { Component, h, Host, Prop } from "@stencil/core";

@Component({
    tag: "cc-tooltip",
    styleUrl: "cc-tooltip.scss",
    scoped: true
  })

export class CcTooltip {
    @Prop() message: HTMLElement | string;
    @Prop() visible: boolean = false;
    @Prop() positionElement: HTMLElement;
    @Prop() hideCloseButton?: boolean = true;
    @Prop() imagePath?: string = "";
    @Prop() customWidth?: string = "";

    render(){
        return (
            <Host
                class={{
                    tooltip__host: true
                }}
                data-testid="cc-tooltip">
                

            </Host>
        );
    }

}