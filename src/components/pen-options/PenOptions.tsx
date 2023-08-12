import { useContext, useEffect, useState } from "react";
import "./PenOptions.css";
import fetchItems from "../../functions/fetchItems";
import { IoMdTrash } from "react-icons/io";
import { AppContext } from "../../context/AppContext";

interface IProps {
  clearCanvas: () => void;
}

export default function PenOptions({ clearCanvas }: IProps) {
  const [colors, setColors] = useState<string[]>([]);
  const { setActiveColor, activeColor, setPenWidth } = useContext(AppContext);

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
        {/* <div className="undo-btn" onClick={() => setDoUndo(true)}>
          <IoArrowUndoSharp className="undo-icon" />
        </div> */}
        <div className="tool-btn" onClick={() => clearCanvas()}>
          <IoMdTrash className="tool-icon" />
        </div>
      </div>
    </div>
  );
}
