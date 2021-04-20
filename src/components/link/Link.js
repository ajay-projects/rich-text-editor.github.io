import React from "react";
import isUrl from "is-url";
import { useSlate } from "slate-react";
import { Transforms, Editor, Range, Element as SlateElement } from "slate";
import Styles from "../Styles/customEditor.module.css";

const Link = (props) => {
  return (
    <a {...props.attributes} href={props.element.url}>
      {props.children}
    </a>
  );
};
export const withLinks = (editor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

const isLinkActive = (editor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
  return !!link;
};

const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link",
  });
};

const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }
  // console.log("selection", editor);
  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

export const LinkButton = () => {
  const editor = useSlate();
  return (
    <div>
      <button
        className={Styles.button}
        onMouseDown={(event) => {
          event.preventDefault();
          const url = window.prompt("Enter the URL of the link:");
          // console.log(url);
          if (!url) return;
          insertLink(editor, url);
        }}
      >
        <i className="ri-link" style={{ color: "#696969" }}></i>
      </button>
    </div>
  );
};

export default Link;
