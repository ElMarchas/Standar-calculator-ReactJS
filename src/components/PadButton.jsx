export default function Button(props) {
  return (
    <button
      title={props.title}
      className={props.className}
      onClick={() => props.add(props.title)}
    >
      {props.title}
    </button>
  );
}
