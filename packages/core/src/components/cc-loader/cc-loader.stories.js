import notes from "./readme.md";
import { withKnobs, number } from "@storybook/addon-knobs/html";

export default { title: "Loader", decorators: [withKnobs] };

export const Loader = () => {
  return `
    <div class="p-xlg">
      <cc-loader size="${size}">< /cc-loader>
    </div>
  `;
};

Loader.story = {
  parameters: {
    notes
  }
};
