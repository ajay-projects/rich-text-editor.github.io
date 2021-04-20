import React from "react";
import videoExtensions from "video-extensions";
import isUrl from "is-url";
import { Transforms } from "slate";
import { useEditor } from "slate-react";
import Styles from "../Styles/customEditor.module.css";
const Video = (props) => {
  console.log(props);
  return (
    <div {...props.attributes}>
      <div contentEditable={false}>
        <iframe
          title="1"
          src={props.element.url}
          frameBorder="0"
          style={{
            width: "50vh",
            height: "50vh",
          }}
        />
        {props.children}
      </div>
    </div>
  );
};

export const withEmbades = (editor) => {
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

        if (mime === "video") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertVideo(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isVideoUrl(text)) {
      insertVideo(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertVideo = (editor, url) => {
  // const text = { text: "" };
  const video = { type: "video", url, children: [{ text: "" }] };
  Transforms.insertNodes(editor, video);
};
export const InsertVideoButton = () => {
  const editor = useEditor();
  return (
    <button
      className={Styles.button}
      onMouseDown={(event) => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the video:");
        console.log(url);
        if (!url) return;
        insertVideo(editor, url);
      }}
    >
      <i className="ri-video-line" style={{ color: "#696969" }}></i>
    </button>
  );
};

const isVideoUrl = (url) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return videoExtensions.includes(ext);
};

export default Video;
