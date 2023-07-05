import React, { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import "./PenOptions.css";
import fetchItems from "../../functions/fetchItems";
interface IProps {
  setActiveColor: React.Dispatch<React.SetStateAction<string>>;
  activeColor: string;
  setPenWidth: React.Dispatch<React.SetStateAction<number>>;
  penWidth: number;
}
export default function PenOptions({
  setActiveColor,
  activeColor,
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

  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchItems("colors.txt");
        setColors(result);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="pen-options-main-container">
      {/* <div
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
      </div> */}
      <div
        style={{
          width: "fit-content",
          height: "fit-content",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            background: activeColor,
          }}
        ></div>
        <div className="color-options-container">
          {colors.map((color) => (
            <div
              className="color-option"
              onClick={() => setActiveColor(color)}
              style={{ background: color }}
            ></div>
          ))}
        </div>
        <div className="pen-widths">
          <div className="pen-width-button">
            <div
              style={{
                background: "black",
                borderRadius: "100px",
                width: "10px",
                height: "10px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
