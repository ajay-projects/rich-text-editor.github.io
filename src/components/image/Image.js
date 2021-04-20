import React from "react";
import imageExtensions from "image-extensions";
import isUrl from "is-url";
import { Transforms } from "slate";
import { useEditor } from "slate-react";
import Styles from "../Styles/customEditor.module.css";

const Image = (props) => {
  console.log(props);
  return (
    <div {...props.attributes}>
      <div contentEditable={false}>
        <img
          src={props.element.url}
          alt="logo"
          style={{ height: "300px", width: "300px", margin: "auto" }}
        />
        {props.children}
      </div>
    </div>
  );
};

export const withImages = (editor) => {
  const { insertData, isVoid } = editor;
  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertImage = (editor, url) => {
  // const text = { text: "" };
  const image = { type: "image", url, children: [{ text: "" }] };
  Transforms.insertNodes(editor, image);
};
export const InsertImageButton = () => {
  const editor = useEditor();
  return (
    <button
      className={Styles.button}
      onMouseDown={(event) => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the image:");
        console.log(url);
        if (!url) return;
        insertImage(editor, url);
      }}
    >
      <i className="ri-image-add-line" style={{ color: "#696969" }}></i>
    </button>
  );
};

const isImageUrl = (url) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return imageExtensions.includes(ext);
};

export default Image;
