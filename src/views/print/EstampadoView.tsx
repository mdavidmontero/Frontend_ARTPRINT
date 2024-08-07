import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
import { useState, useRef } from "react";
const DecoracionScreen = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { editor, onReady } = useFabricJSEditor();
  const [selectedColor, setSelectedColor] = useState<string>("#ff0000");
  const [brushWidth, setBrushWidth] = useState<number>(5);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);

  const [text, setText] = useState<string>("Texto aquí");
  const [fontSize, setFontSize] = useState<number>(24);
  const [fontFamily, setFontFamily] = useState<string>("Arial");

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (editor?.canvas) {
      editor.canvas.freeDrawingBrush.color = color;
    }
  };

  const handleBrushWidthChange = (width: number) => {
    setBrushWidth(width);
    if (editor?.canvas) {
      editor.canvas.freeDrawingBrush.width = width;
    }
  };

  const toggleDrawingMode = () => {
    if (editor?.canvas) {
      editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
      setIsDrawingMode(editor.canvas.isDrawingMode);
      if (!editor.canvas.isDrawingMode) {
        editor.canvas.discardActiveObject();
      }
    }
  };

  const handlePic = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    fabric.Image.fromURL(url, (oImg) => {
      oImg.scale(0.3);
      editor?.canvas.add(oImg);
      saveCanvasState();
    });
  };

  // const addRectangle = () => {
  //   const rect = new fabric.Rect({
  //     left: 100,
  //     top: 100,
  //     fill: selectedColor,
  //     width: 150,
  //     height: 100,
  //     selectable: true,
  //   });
  //   editor?.canvas.add(rect);
  //   saveCanvasState();
  // };

  // const addCircle = () => {
  //   const circle = new fabric.Circle({
  //     left: 200,
  //     top: 200,
  //     radius: 50,
  //     fill: selectedColor,
  //     selectable: true,
  //   });
  //   editor?.canvas.add(circle);
  //   saveCanvasState();
  // };

  const handleLayerUp = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      editor?.canvas.bringForward(activeObject);
      saveCanvasState();
    }
  };

  const handleLayerDown = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      editor?.canvas.sendBackwards(activeObject);
      saveCanvasState();
    }
  };

  const handleDelete = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      editor?.canvas.remove(activeObject);
      saveCanvasState();
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newHistoryIndex = historyIndex - 1;
      setHistoryIndex(newHistoryIndex);
      const canvasState = history[newHistoryIndex];
      // @ts-ignore
      editor?.canvas.loadFromJSON(canvasState);
      editor?.canvas.renderAll();
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newHistoryIndex = historyIndex + 1;
      setHistoryIndex(newHistoryIndex);
      const canvasState = history[newHistoryIndex];
      // @ts-ignore

      editor?.canvas.loadFromJSON(canvasState);
      editor?.canvas.renderAll();
    }
  };

  const handleClearCanvas = () => {
    editor?.canvas.clear();
    setHistory([]);
    setHistoryIndex(-1);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const addText = () => {
    const textObject = new fabric.Textbox(text, {
      left: 100,
      top: 100,
      fill: selectedColor,
      fontSize: fontSize,
      fontFamily: fontFamily,
      selectable: true,
    });
    editor?.canvas.add(textObject);
    saveCanvasState();
  };

  const saveCanvasState = () => {
    const canvasState = editor?.canvas.toJSON();
    const newHistory = [...history.slice(0, historyIndex + 1), canvasState];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const generateImage = () => {
    const dataURL = editor?.canvas.toDataURL();
    const a = document.createElement("a");
    a.download = "image.png";
    // @ts-ignore

    a.href = dataURL;
    a.click();
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex w-full h-1/2 md:h-1/2 bg-gray-800 p-2">
        <div className="rounded-xl border-4 border-yellow-500 w-full h-full">
          <FabricJSCanvas onReady={onReady} className="w-full h-full" />
        </div>
      </div>
      <div className="bg-gray-700 p-4 grid grid-cols-2 gap-2 w-full h-1/2 md:h-1/2">
        <div className="flex gap-2 items-center justify-center">
          <label className="text-white">Color:</label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="p-2 rounded-lg"
          />
        </div>

        <div className="flex gap-2 items-center justify-center">
          <label className="text-white">Lápiz:</label>
          <input
            type="number"
            value={brushWidth}
            onChange={(e) => handleBrushWidthChange(Number(e.target.value))}
            className="p-2 rounded-lg w-14 text-center"
            min="1"
          />
        </div>

        <button
          onClick={toggleDrawingMode}
          className={`text-white p-1 rounded-lg ${
            isDrawingMode ? "bg-blue-500" : ""
          }`}
        >
          {isDrawingMode ? (
            <>
              <span className="mr-2">Dibujo ON</span>
            </>
          ) : (
            <>
              <span className="mr-2">Dibujo OFF</span>
            </>
          )}
        </button>

        <button
          onClick={() => inputRef.current?.click()}
          className="text-white p-1 rounded-lg"
        >
          Subir Imagen
        </button>
        <input
          ref={inputRef}
          onChange={handlePic}
          type="file"
          className="hidden"
        />

        <button onClick={handleLayerUp} className="text-white p-1 rounded-lg">
          Subir
        </button>

        <button onClick={handleLayerDown} className="text-white p-1 rounded-lg">
          Abajo
        </button>

        <button onClick={handleDelete} className="text-white p-1 rounded-lg">
          Eliminar
        </button>

        <button onClick={handleUndo} className="text-white p-1 rounded-lg">
          Deshacer
        </button>

        <button onClick={handleRedo} className="text-white p-1 rounded-lg">
          Rehacer
        </button>

        <button
          onClick={handleClearCanvas}
          className="text-white p-1 rounded-lg bg-red-500"
        >
          Limpiar
        </button>

        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Texto"
            className="p-1 rounded-lg text-black w-32"
          />
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            placeholder="Tamaño"
            className="p-1 rounded-lg text-black w-16"
            min="1"
          />
        </div>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="p-1 rounded-lg text-black ml-3 w-28"
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
        </select>
        <button onClick={addText} className="text-white p-1 rounded-lg">
          Agregar Texto
        </button>
        <button
          onClick={generateImage}
          className="px-2 py-2 bg-indigo-500 text-white rounded-xl"
        >
          Generar archivo
        </button>
      </div>
    </div>
  );
};

export default DecoracionScreen;
