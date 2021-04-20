import { useEditor } from "slate-react";
import { Editor } from "slate";

const Uppercase = (props) => {
  let editor = useEditor();
  if (editor.selection) {
    const { selection } = editor;
    const text = Editor.string(editor, selection);
    let newText = text.toUpperCase();
    // Editor.deleteFragment(editor);
    Editor.insertText(editor, newText);
  }
  return <span {...props.attributes}>{props.children}</span>;
};
export default Uppercase;
