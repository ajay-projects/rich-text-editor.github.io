const Checkbox = (props) => {
  return (
    <div
      {...props.attributes}
      style={{
        userSelect: "none",
      }}
    >
      <input type="checkbox"></input>
      <span>{props.children}</span>
    </div>
  );
};
export default Checkbox;
