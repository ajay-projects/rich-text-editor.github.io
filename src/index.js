import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import CustomEditor from "./components/customEditor/CustomEditor";
import { useEditor } from "slate-react";
// import ColorPicker from "./components/colorPicker/colorPicker";

const editorObject = {
  editor: useEditor,
};

export const EditorContext = React.createContext(editorObject);

ReactDOM.render(
  <React.StrictMode>
    <EditorContext.Provider value={editorObject}>
      <CustomEditor />
      {/* <ColorPicker /> */}
    </EditorContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
