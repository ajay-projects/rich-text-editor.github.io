import { useEditor } from "slate-react";
import { Editor } from "slate";

const Capitalize = (props) => {
  let editor = useEditor();
  if (editor.selection) {
    const { selection } = editor;
    const text = Editor.string(editor, selection);
    console.log(text);
    let newText = "";
    const textArray = text.split(" ");
    textArray.forEach((text, i) => {
      if (i !== 0) newText = newText + " ";
      newText =
        newText + text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    });
    // Editor.deleteFragment(editor);
    Editor.insertText(editor, newText);
  }
  return <span {...props.attributes}>{props.children}</span>;
};
export default Capitalize;
