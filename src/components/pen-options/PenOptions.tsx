import React from "react";
import Slider from "@mui/material/Slider";
import "./PenOptions.css";
interface IProps {
  setActiveColor: React.Dispatch<React.SetStateAction<string>>;
  setPenWidth: React.Dispatch<React.SetStateAction<number>>;
  penWidth: number;
}
export default function PenOptions({
  setActiveColor,
  setPenWidth,
  penWidth,
}: IProps) {
  function handlePenWidthChange(
    ev: React.ChangeEvent<{}>,
    value: number | number[]
  ) {
    if (typeof value === "number") {
      setPenWidth(value);
    }
  }

  function changeColor(color: string) {
    setActiveColor(color);
  }
  return (
    <div className="pen-options-main-container">
      <div
        style={{
          width: "400px",
          height: "200px",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <div
          style={{
            width: "150px",
            height: "150px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <label>Pen Width</label>
            </div>
            <Slider
              min={5}
              onChange={handlePenWidthChange}
              value={penWidth}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
          </div>
        </div>
      </div>
      <div
        style={{
          width: "400px",
          height: "500px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="color-options-container">
          <div
            className="color-option"
            onClick={() => changeColor("#FF0000 ")}
            style={{ background: "#FF0000 " }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#FF3300 ")}
            style={{ background: "#FF3300 " }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#FF6600 ")}
            style={{ background: "#FF6600 " }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#FF9900 ")}
            style={{ background: "#FF9900 " }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#FFCC00 ")}
            style={{ background: "#FFCC00 " }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#FFFF00 ")}
            style={{ background: "#FFFF00 " }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#CCFF00 ")}
            style={{ background: "#CCFF00 " }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#99FF00")}
            style={{ background: "#99FF00" }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#66FF00 ")}
            style={{ background: "#66FF00 " }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#33FF00 ")}
            style={{ background: "#33FF00 " }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#00FF33")}
            style={{ background: "#00FF33" }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#00FF66")}
            style={{ background: "#00FF66" }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#00FF99")}
            style={{ background: "#00FF99" }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#00FFCC")}
            style={{ background: "#00FFCC" }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#00FFFF")}
            style={{ background: "#00FFFF" }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#0099FF")}
            style={{ background: "#0099FF" }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#0033FF")}
            style={{ background: "#0033FF" }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#0033FF ")}
            style={{ background: "#0033FF" }}
          ></div>

          <div
            className="color-option"
            onClick={() => changeColor("#0000FF")}
            style={{ background: "#0000FF" }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#3300CC")}
            style={{ background: "#3300CC" }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#660099")}
            style={{ background: "#660099" }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#663300")}
            style={{ background: "#663300" }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("#E9DCC9")}
            style={{ background: "#E9DCC9" }}
          ></div>

          <div
            className="color-option"
            onClick={() => changeColor("white")}
            style={{ background: "white" }}
          ></div>
          <div
            className="color-option"
            onClick={() => changeColor("black")}
            style={{ background: "black" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
