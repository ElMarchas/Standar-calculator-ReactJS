import Button from "./PadButton";

export default function Pad(props) {
  function setHist(total, func) {
    props.setHistory((current) => [...current, [total, func, Math.random()]]);
  }

  function resolve(e) {
    let number1 = props.operation.number1;
    let result;
    let operator = props.operation.operator;
    let numberHandler = props.operation.numberHandler;
    let numberHolder = props.operation.number1;
    if (e === 1) number1 = number1 / 100;
    if (operator === undefined) operator = "+";
    if (props.operation.equal) {
      result = String(number1 + operator + numberHandler);
    } else {
      result = String(props.operation.number2 + operator + number1);
      numberHandler = number1;
      numberHolder = props.operation.number2;
    }
    let resultTotal = eval(result);

    if (resultTotal > 999999999999999) resultTotal = Infinity;
    if (resultTotal <= 0.0000001) resultTotal = 0;
    if (String(resultTotal).length > 15)
      resultTotal = String(resultTotal).slice(
        0,
        -(String(resultTotal).length - 16)
      );

    if (result.length > 20) result = "Overflow";
    setHist(resultTotal, result);
    return [result, resultTotal, numberHandler, numberHolder];
  }

  function result(keyPad) {
    let results = resolve();

    props.setOperation({
      ...props.operation,
      number1: results[1],
      numberHolder: results[3],
      numberHandler: results[2],
      equal: true,
      newKey: 1,
    });
  }

  function clear(keyPad) {
    if (keyPad === "⌫") {
      let newNumber = String(props.operation.number1);
      newNumber.length > 1
        ? (newNumber = newNumber.slice(0, -1))
        : (newNumber = "0");
      props.setOperation({
        ...props.operation,
        number1: newNumber,
      });
    }
    if (keyPad === "CE") {
      props.setOperation({
        ...props.operation,
        number1: "0",
      });
    }
    if (keyPad === "C") {
      props.setOperation({
        ...props.operation,
        number1: "0",
        number2: "0",
        operator: undefined,
      });
    }
  }

  function customOp(keyPad) {
    let result = keyPad.replace("x", props.operation.number1);
    return result;
  }

  function operationComplex(keyPad) {
    if (keyPad === "%") {
      if (props.operation.operator === "*") {
        let results = resolve(1);

        props.setOperation({
          ...props.operation,
          number1: results[1],
          number2: results[1],
          operator: keyPad,
          newKey: 1,
          complex: false,
        });

        return;
      }
      let result = (props.operation.number1 / 100) * props.operation.number1;

      props.setOperation({
        ...props.operation,
        number1: result,
        number2: result,
        newKey: 1,
        operator: "+",
      });
      setHist(result, result + "%");
    }

    if (keyPad === "⁺/-" && props.operation.number1 !== "0") {
      let newNumber = String(props.operation.number1);
      newNumber.charAt(0) === "-"
        ? (newNumber = newNumber.slice(1))
        : (newNumber = "-" + newNumber);

      props.setOperation({ ...props.operation, number1: newNumber });
    }
    if (keyPad === "√(x)") {
      let result = Math.sqrt(props.operation.number1);
      props.setOperation({
        ...props.operation,
        number2: props.operation.number1,
        operator: keyPad,
        complex: true,
        complexOperator: customOp(keyPad),
        number1: result,
        equal: true,
      });
      setHist(result, customOp(keyPad));
    }

    if (keyPad === "x²") {
      let result = Math.pow(props.operation.number1, 2);
      props.setOperation({
        ...props.operation,
        number2: props.operation.number1,
        operator: keyPad,
        complex: true,
        complexOperator: customOp(keyPad),
        number1: result,
        equal: true,
      });

      setHist(result, customOp(keyPad));
    }

    if (keyPad === "1/x") {
      let result = 1 / props.operation.number1;
      props.setOperation({
        ...props.operation,
        number2: props.operation.number1,
        operator: keyPad,
        complex: true,
        complexOperator: customOp(keyPad),
        number1: result,
        equal: true,
      });

      setHist(result, customOp(keyPad));
    }

    //eso nomas muestra el numero arriba por el if de mostrado
    //aca abajo resuelve la ecuacion y asigna los valores correctamente
  }

  function operation(keyPad) {
    if (props.operation.equal) {
      props.setOperation({
        ...props.operation,
        number2: props.operation.number1,
        equal: false,
        newKey: 1,
        operator: keyPad,
        complexOperator: undefined,
        complex: false,
      });
      return;
    }
    if (props.operation.newKey === 0) {
      props.setOperation({
        ...props.operation,
        number2: props.operation.number1,
        operator: keyPad,
        newKey: 1,
        complex: false,
        equal: false,
      });
    }
    if (props.operation.newKey === 3) {
      let results = resolve();

      props.setOperation({
        ...props.operation,
        number1: results[1],
        number2: results[1],
        operator: keyPad,
        newKey: 1,
        complex: false,
      });
    }
    if (props.operation.newKey === 1) {
      props.setOperation({
        ...props.operation,
        operator: keyPad,
        complexOperator: undefined,
        complex: false,
      });
    }
  }

  function add(keyPad) {
    //ya tiene punto
    if (keyPad === ".") {
      if (props.operation.number1.indexOf(".") >= 0) {
        return;
      }
    }
    //maximo 16
    if (props.operation.number1.length > 16 && props.operation.newKey !== 1)
      return;
    //aca abajo ya sabemos que es numero
    let number;
    let newKey = props.operation.newKey;
    props.operation.number1 === "0" ||
    props.operation.number1 === undefined ||
    newKey === 1
      ? (number = String(keyPad))
      : (number = props.operation.number1 + String(keyPad));

    if (newKey === 1) newKey = 3;
    //newKey 1 es para deshabilitar operador y cambiar operacion y cambiar el numero
    //newkey 3 usar operador como igual 1 vez

    if (number === ".") number = "0.";

    props.setOperation({
      ...props.operation,
      number1: number,
      newKey: newKey,
    });
  }
  return (
    <div id="pad" className="Pad">
      <div id="pad1">
        <Button title="%" add={operationComplex} className={"BtnTw"} />
        <Button title="CE" add={clear} className={"BtnTw"} />
        <Button title="C" add={clear} className={"BtnTw"} />
        <Button title="⌫" add={clear} className={"BtnTw"} />
      </div>
      <div id="pad2">
        <Button title="1/x" add={operationComplex} className={"BtnTw"} />
        <Button title="x²" add={operationComplex} className={"BtnTw"} />
        <Button title="√(x)" add={operationComplex} className={"BtnTw"} />
        <Button title="/" add={operation} className={"BtnTw"} />
      </div>
      <div id="pad3">
        <Button title="7" add={add} />
        <Button title="8" add={add} />
        <Button title="9" add={add} />
        <Button title="*" add={operation} className={"BtnTw"} />
      </div>
      <div id="pad4">
        <Button title="4" add={add} />
        <Button title="5" add={add} />
        <Button title="6" add={add} />
        <Button title="-" add={operation} className={"BtnTw"} />
      </div>
      <div id="pad5">
        <Button title="1" add={add} />
        <Button title="2" add={add} />
        <Button title="3" add={add} />
        <Button title="+" add={operation} className={"BtnTw"} />
      </div>
      <div id="pad6">
        <Button title="⁺/-" add={operationComplex} />
        <Button title="0" add={add} />
        <Button title="." add={add} />
        <Button title="=" add={result} className={"BtnEq"} />
      </div>
    </div>
  );
}
