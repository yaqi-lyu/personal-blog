"use client";
import Image from "next/image";
import * as React from "react";
import type { Template } from "tinacms";
import { tinaField } from "tinacms/dist/react";
import type { PageBlocksImage } from "../../tina/__generated__/types";
import { Section, sectionBlockSchemaField } from "../layout/section";

export const ImageBlock = ({ data }: { data: PageBlocksImage }) => {
  const alignment = data.alignment || "center";
  const width = data.width || "full";

  const widthClasses = {
    small: "max-w-sm",
    medium: "max-w-md",
    large: "max-w-2xl",
    full: "max-w-full",
  };

  const alignmentClasses = {
    left: "mx-0",
    center: "mx-auto",
    right: "ml-auto",
  };

  return (
    <Section background={data.background!}>
      <div className="w-full px-6 py-12 mx-auto max-w-7xl">
        <div
          className={`${widthClasses[width as keyof typeof widthClasses] || widthClasses.full} ${alignmentClasses[alignment as keyof typeof alignmentClasses] || alignmentClasses.center}`}
          data-tina-field={tinaField(data, "image")}
        >
          {data.image?.src && (
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                className="w-full h-auto"
                alt={data.image?.alt || "Image"}
                src={data.image.src}
                height={1080}
                width={1920}
              />
            </div>
          )}
          {data.caption && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {data.caption}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
};

export const imageBlockSchema: Template = {
  name: "image",
  label: "Image",
  ui: {
    previewSrc: "/blocks/image.png",
    defaultItem: {
      alignment: "center",
      width: "large",
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "object",
      label: "Image",
      name: "image",
      fields: [
        {
          name: "src",
          label: "Image Source",
          type: "image",
        },
        {
          name: "alt",
          label: "Alt Text",
          type: "string",
        },
      ],
    },
    {
      type: "string",
      label: "Alignment",
      name: "alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    {
      type: "string",
      label: "Width",
      name: "width",
      options: [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
        { label: "Full", value: "full" },
      ],
    },
    {
      type: "string",
      label: "Caption",
      name: "caption",
      description: "Optional caption to display below the image",
    },
  ],
};
