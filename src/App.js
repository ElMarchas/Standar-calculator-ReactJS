import { useState } from "react";
import "./App.css";
import Pad from "./components/Pad";

// const currencyOptions = {
//   minimumFractionDigits: 2,
//   maximumFractionDigits: 2,
// };

// function getTotal(total) {
//   return total.toLocaleString(undefined, currencyOptions);
// }

function App() {
  const [operation, setOperation] = useState({
    number1: "0",
    number2: "0",
    numberHandler: "0",
    numberHolder: "0",
    operator: undefined,
    newKey: 0,
    complex: false,
    complexOperator: undefined,
    equal: false,
  });

  const [history, setHistory] = useState([]);

  const exist = operation.number2 && operation.operator ? true : false;

  const sizeNumber1 = () => {
    let length = String(operation.number1).length;
    return "1." + (-length + 15) + "em";
  };

  return (
    <div className="App">
      <h3>Standar Calculator</h3>
      <div className="Frame">
        <div className="Calc">
          <div id="screen" className="Screen">
            {
              //Aqui hay doble condicional(true) true ? iftrue : iffalse( true && iftrue)
              operation.complex ? (
                <div className="ScreenResult">{operation.complexOperator}</div>
              ) : (
                exist === true &&
                (operation.equal ? (
                  <div className="ScreenResult">
                    {operation.numberHolder}
                    {operation.operator}
                    {operation.numberHandler}=
                  </div>
                ) : (
                  <div className="ScreenResult">
                    {operation.number2}
                    {operation.operator}
                  </div>
                ))
              )
            }
            <div
              className="ScreenInput"
              style={
                String(operation.number1).length > 10
                  ? { fontSize: sizeNumber1() }
                  : null
              }
              onClick={(e) => {
                let range = document.createRange();
                range.selectNode(e.target);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
              }}
            >
              {operation.number1}
            </div>
          </div>
          <Pad
            operation={operation}
            setOperation={setOperation}
            history={history}
            setHistory={setHistory}
          />
        </div>
        <div className="Log">
          {history.length >= 1 ? (
            <div className="LogData">
              <div className="LogTable">
                {history
                  .slice(0)
                  .reverse()
                  .map((item) => (
                    <div key={Math.random()} className="LogTableCol">
                      <div
                        className="LogTableCopy"
                        onClick={(e) => {
                          let range = document.createRange();
                          range.selectNode(document.getElementById(item[2]));
                          window.getSelection().removeAllRanges();
                          window.getSelection().addRange(range);
                        }}
                      >
                        Copy
                      </div>
                      <div className="LogTableOp">{item[1]} =</div>
                      <div id={item[2]} className="LogTableRes">
                        {item[0]}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <span style={{ fontSize: "0.8em", paddingTop: "6px" }}>
              There is not history yet
            </span>
          )}
          {history.length >= 1 && (
            <button
              onClick={() => {
                setHistory([]);
              }}
            >
              🗑
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
