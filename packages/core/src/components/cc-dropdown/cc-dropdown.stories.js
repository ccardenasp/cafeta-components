import notes from "./readme.md";
import { withKnobs, boolean } from "@storybook/addon-knobs/html";

export default { title: "Dropdown", decorators: [withKnobs] };

export const Dropdown = () => {
  const label3 = "Expand";
  const defaultValue3 = false;
  const groupId3 = "GROUP-ID1";
  const value3 = boolean(label3, defaultValue3, groupId3);

  const props = [
    value3 ? "expand" : ""
  ].join(" ");

  return `
    <div class="p-lg">
      <h1 class="heading-01">Dropdown primary</h1>
      <section class="py-xlg color-primary font-black">
        <h2 class="text-subheading-02 mb-lg font-regular">Dropdown Inline</h1>
        <div ${value3 ? "" : 'class="flex align-middle"'}>
          <div class="mr-lg mt-lg flex flex-col align-middle">
            <h2 class="text-center font-regular">size: <strong class="font-bold">default</strong></h1>
            <cc-dropdown ${props} choices=['AAS', 'ASDASDA'] />
          </div>
        </div>
      </section>
      <section class="py-xlg color-primary font-black">
        <h2 class="text-subheading-02 mb-lg font-regular">Dropdown with Label</h1>
        <div ${value3 ? "" : 'class="flex align-middle"'}>
          <div class="mr-lg mt-lg flex flex-col align-middle">
            <h2 class="text-center font-regular">size: <strong class="font-bold">default</strong></h1>
            <cc-dropdown ${props} label="Label"/>
          </div>
        </div>
      </section>
    </div>
  `
};


Dropdown.story = {
  parameters: {
    notes
  }
};