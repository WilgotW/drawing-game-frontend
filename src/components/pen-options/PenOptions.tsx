import React, { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import "./PenOptions.css";
import fetchItems from "../../functions/fetchItems";
import { IoArrowUndoSharp } from "react-icons/io5";

interface IProps {
  setActiveColor: React.Dispatch<React.SetStateAction<string>>;
  activeColor: string;
  setPenWidth: React.Dispatch<React.SetStateAction<number>>;
  penWidth: number;
  setDoUndo: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function PenOptions({
  setActiveColor,
  activeColor,
  setPenWidth,
  penWidth,
  setDoUndo,
}: IProps) {
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
        <div className="pen-widths-container">
          <div onClick={() => setPenWidth(2)} className="pen-width-button">
            <div
              style={{
                background: "black",
                borderRadius: "100px",
                width: "7px",
                height: "7px",
              }}
            ></div>
          </div>
          <div onClick={() => setPenWidth(5)} className="pen-width-button">
            <div
              style={{
                background: "black",
                borderRadius: "100px",
                width: "10px",
                height: "10px",
              }}
            ></div>
          </div>
          <div onClick={() => setPenWidth(10)} className="pen-width-button">
            <div
              style={{
                background: "black",
                borderRadius: "100px",
                width: "15px",
                height: "15px",
              }}
            ></div>
          </div>
          <div onClick={() => setPenWidth(20)} className="pen-width-button">
            <div
              style={{
                background: "black",
                borderRadius: "100px",
                width: "20px",
                height: "20px",
              }}
            ></div>
          </div>
          <div onClick={() => setPenWidth(30)} className="pen-width-button">
            <div
              style={{
                background: "black",
                borderRadius: "100px",
                width: "30px",
                height: "30px",
              }}
            ></div>
          </div>
          <div onClick={() => setPenWidth(50)} className="pen-width-button">
            <div
              style={{
                background: "black",
                borderRadius: "100px",
                width: "45px",
                height: "45px",
              }}
            ></div>
          </div>
        </div>
        <div className="undo-btn" onClick={() => setDoUndo(true)}>
          <IoArrowUndoSharp className="undo-icon" />
        </div>
      </div>
    </div>
  );
}
