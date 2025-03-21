"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  Code2Icon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
} from "lucide-react";
import {
  useSlate,
  RenderElementProps,
  RenderLeafProps,
  ReactEditor,
} from "slate-react";
import {
  Editor,
  Transforms,
  Element as SlateElement,
  BaseEditor,
  Descendant,
} from "slate";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: {
      type: ElementType | Alignment;
      align?: Alignment;
      children: Descendant[];
    };
    Text: {
      text: string;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      code?: boolean;
    };
  }
}

const LIST_TYPES = ["numbered-list", "bulleted-list"] as const;
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"] as const;

type ElementType =
  | "paragraph"
  | "block-quote"
  | "list-item"
  | "heading-one"
  | "heading-two"
  | (typeof LIST_TYPES)[number];
type Alignment = (typeof TEXT_ALIGN_TYPES)[number];

type MarkFormat = "bold" | "italic" | "underline" | "code";

const isBlockActive = (
  editor: Editor,
  format: ElementType | Alignment,
  blockType: "type" | "align" = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: (n) => SlateElement.isElement(n) && n[blockType] === format,
  });

  return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
};

const isAlignmentType = (
  format: ElementType | Alignment
): format is Alignment => {
  return TEXT_ALIGN_TYPES.includes(format as Alignment);
};

const isListType = (
  format: ElementType | Alignment
): format is (typeof LIST_TYPES)[number] => {
  return LIST_TYPES.includes(format as (typeof LIST_TYPES)[number]);
};

export const toggleBlock = (
  editor: Editor,
  format: ElementType | Alignment
) => {
  const isActive = isBlockActive(
    editor,
    format,
    isAlignmentType(format) ? "align" : "type"
  );
  const isList = isListType(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      SlateElement.isElement(n) &&
      isListType(n.type) &&
      !isAlignmentType(format),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
    align: isAlignmentType(format)
      ? isActive
        ? undefined
        : format
      : undefined,
  });

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, {
      type: format,
      children: [],
    });
  }
};

export const toggleMark = (editor: Editor, format: MarkFormat) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const BlockButton = ({
  format,
  icon,
}: {
  format: ElementType | Alignment;
  icon: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <Button
      variant={
        isBlockActive(
          editor,
          format,
          isAlignmentType(format) ? "align" : "type"
        )
          ? "secondary"
          : "ghost"
      }
      size="sm"
      onClick={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

const MarkButton = ({
  format,
  icon,
}: {
  format: string;
  icon: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <Button
      variant={isMarkActive(editor, format) ? "secondary" : "ghost"}
      size="sm"
      onClick={(event) => {
        event.preventDefault();
        toggleMark(editor, format as MarkFormat);
      }}
    >
      {icon}
    </Button>
  );
};

export const Toolbar = () => {
  return (
    <ButtonGroup className="p-1 border-b">
      <MarkButton format="bold" icon={<BoldIcon className="h-4 w-4" />} />
      <MarkButton format="italic" icon={<ItalicIcon className="h-4 w-4" />} />
      <MarkButton
        format="underline"
        icon={<UnderlineIcon className="h-4 w-4" />}
      />
      <MarkButton format="code" icon={<Code2Icon className="h-4 w-4" />} />
      <BlockButton
        format="heading-one"
        icon={<Heading1 className="h-4 w-4" />}
      />
      <BlockButton
        format="heading-two"
        icon={<Heading2 className="h-4 w-4" />}
      />
      <BlockButton format="block-quote" icon={<Quote className="h-4 w-4" />} />
      <BlockButton
        format="numbered-list"
        icon={<ListOrdered className="h-4 w-4" />}
      />
      <BlockButton format="bulleted-list" icon={<List className="h-4 w-4" />} />
      <BlockButton format="left" icon={<AlignLeftIcon className="h-4 w-4" />} />
      <BlockButton
        format="center"
        icon={<AlignCenterIcon className="h-4 w-4" />}
      />
      <BlockButton
        format="right"
        icon={<AlignRightIcon className="h-4 w-4" />}
      />
      <BlockButton
        format="justify"
        icon={<AlignJustifyIcon className="h-4 w-4" />}
      />
    </ButtonGroup>
  );
};

export const Element = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          style={style}
          className="border-l-2 pl-4 border-gray-300"
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} className="list-disc list-inside" {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} className="text-2xl font-bold" {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} className="text-xl font-bold" {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} className="list-decimal list-inside" {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code className="bg-gray-100 rounded px-1">{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};
