import type { Collection } from "tinacms";

const Tag: Collection = {
  label: "Tags",
  name: "tag",
  path: "content/tags",
  format: "mdx",
  ui: {
    router: ({ document }) => {
      return `/tags/${document._sys.breadcrumbs.join('/')}`;
    },
  },
  fields: [
    {
      type: "string",
      label: "Name",
      name: "name",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      label: "Description",
      name: "description",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      description: "Badge color for this tag",
      options: [
        { label: "Default", value: "default" },
        { label: "Blue", value: "blue" },
        { label: "Green", value: "green" },
        { label: "Red", value: "red" },
        { label: "Yellow", value: "yellow" },
        { label: "Purple", value: "purple" },
        { label: "Pink", value: "pink" },
        { label: "Indigo", value: "indigo" },
      ],
    },
  ],
};

export default Tag;
