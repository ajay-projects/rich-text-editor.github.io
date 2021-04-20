import { useState,useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Transforms } from "slate";
import { ReactEditor, useEditor } from "slate-react";
import { FaEllipsisV } from "react-icons/fa";
import Styles from "../Styles/customEditor.module.css";
const DNDBlock = (props) => {
  const editor = useEditor();
  const [displayValue, setDisplayValue] = useState("none");
  const style = {
    padding: "1rem 2rem",
    backgroundColor: "white",
    display: "flex",
  };
  
  const { element,path } = props;
  const dndBlockRef = useRef(null)
  const upwardRef = useRef(null)
  const downwardRef = useRef(null)
  const [{ opacity }, drag, preview] = useDrag(() => ({
    item: { type: "DNDBlock", element: element },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
    hover: (item, monitor) => {
      let itemPath = item?.path || null
      if (DNDBlock === item.type) {
        if (JSON.stringify(path) === JSON.stringify(itemPath)) {
          return {}
        }

        const clientOffset = monitor.getClientOffset();
        if (dndBlockRef.current && clientOffset) {
          const hoverBoundingRect = dndBlockRef.current.getBoundingClientRect()
          const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
          const hoverClientY = clientOffset.y - hoverBoundingRect.top;
          if (hoverClientY <= hoverMiddleY) {
            upwardRef.current.style['opacity'] = '1'
            downwardRef.current.style['opacity'] = '0'
          } else {
            upwardRef.current.style['opacity'] = '0'
            downwardRef.current.style['opacity'] = '1'
          }
        }
      }
    },
  }));

  const [, drop] = useDrop({
    accept: "DNDBlock",
    drop(item, monitor) {
      {
        const dragIndex = ReactEditor.findPath(editor, item.element);
        const hoverIndex = ReactEditor.findPath(editor, element);
        Transforms.moveNodes(editor, { at: dragIndex, to: hoverIndex});
      }
    },
  });

  return (
    <>
      {props.element.type === "link" ? (
        <> {props.children}</>
      ) : (
        <>
          <div
            ref={preview}
            style={{ ...style, opacity }}
            onMouseEnter={ () => setDisplayValue("inline")}
            onMouseLeave={() => setDisplayValue("none")}
          >
            <div
              ref={drop}
              {...props}
              style={{ display: "flex", width: "100%", outline: "none",...(props.styles || {}) }}
            >
              <div
                contentEditable={false}
                ref={drag}
                style={{ width: "1rem", height: "1rem" }}
              >
                <FaEllipsisV style={{ display: `${displayValue}` }} />
              </div>
              {props.children}
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default DNDBlock;
