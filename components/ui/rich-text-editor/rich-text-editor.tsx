"use client";

import React, { useCallback, useMemo, useState, useRef } from "react";
import type { KeyboardEvent } from "react";
import isHotkey from "is-hotkey";
import {
  Editable,
  withReact,
  Slate,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { Editor, Transforms, createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Element, Leaf, toggleMark, Toolbar } from "./atoms";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
} as const;

interface RichTextEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const [, setFocused] = useState(false);
  const savedSelection = useRef(editor.selection);

  const onFocus = useCallback(() => {
    setFocused(true);
    if (!editor.selection && value?.length) {
      Transforms.select(
        editor,
        savedSelection.current ?? Editor.end(editor, [])
      );
    }
  }, [editor, value]);

  const onBlur = useCallback(() => {
    setFocused(false);
    savedSelection.current = editor.selection;
  }, [editor]);

  const divRef = useRef<HTMLDivElement>(null);

  const focusEditor = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === divRef.current) {
        ReactEditor.focus(editor);
        e.preventDefault();
      }
    },
    [editor]
  );

  const onKeyDown = (event: KeyboardEvent) => {
    for (const hotkey of Object.keys(HOTKEYS)) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
        toggleMark(editor, mark);
      }
    }
  };

  return (
    <div ref={divRef} onMouseDown={focusEditor} className="border rounded-md">
      <Slate editor={editor} initialValue={value} onChange={onChange}>
        <Toolbar />
        <div className="p-4">
          <Editable
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Enter some rich text…"
            spellCheck
            className="min-h-[150px] resize-y overflow-auto"
          />
        </div>
      </Slate>
    </div>
  );
};
