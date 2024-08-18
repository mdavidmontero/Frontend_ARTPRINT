import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
import { useState, useRef, useEffect } from "react";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../../config/firebase";

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
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUrlsEstampado, setImageUrlsEstampado] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const storageRef = ref(storage, "images/");
      const result = await listAll(storageRef);
      const urls = await Promise.all(
        result.items.map((item) => getDownloadURL(item))
      );
      setImageUrls(urls);
    };

    fetchImages();
  }, []);
  useEffect(() => {
    const fetchImagesEstampado = async () => {
      const storageRef = ref(storage, "estampados/");
      const result = await listAll(storageRef);
      const urls = await Promise.all(
        result.items.map((item) => getDownloadURL(item))
      );
      setImageUrlsEstampado(urls);
    };

    fetchImagesEstampado();
  }, []);

  console.log(imageUrls);

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
    fabric.Image.fromURL(
      url,
      (oImg) => {
        oImg.scale(0.3);
        editor?.canvas.add(oImg);
        saveCanvasState();
      },
      {
        crossOrigin: "anonymous",
      }
    );
  };

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
    if (!editor?.canvas) return;
    const dataURL = editor.canvas.toDataURL({
      format: "png",
      quality: 1.0,
    });
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "image.png";
    a.click();
  };

  const handleImageClick = (url: string) => {
    fabric.Image.fromURL(
      url,
      (oImg) => {
        oImg.scale(0.3);
        editor?.canvas.add(oImg);
        saveCanvasState();
      },
      {
        crossOrigin: "anonymous",
      }
    );
  };

  return (
    <div className="flex flex-col w-full min-h-max">
      <div className="w-full h-1/4 bg-gray-800 overflow-x-scroll flex gap-2 p-2">
        {imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Firebase Image ${index}`}
            className="w-32 h-32 object-cover cursor-pointer"
            onClick={() => handleImageClick(url)}
          />
        ))}
      </div>
      <div className="w-full h-1/4 bg-gray-800 overflow-x-scroll flex gap-2 p-2">
        {imageUrlsEstampado.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Firebase Image ${index}`}
            className="w-32 h-32 object-cover cursor-pointer"
            onClick={() => handleImageClick(url)}
          />
        ))}
      </div>

      {/* Canvas */}
      <div className="flex flex-grow bg-gray-800 p-2">
        <div className="rounded-xl border-4 border-yellow-500 w-full h-96">
          {" "}
          <FabricJSCanvas onReady={onReady} className="w-full h-full" />
        </div>
      </div>

      {/* Controles */}
      <div className="bg-gray-700 p-2 grid grid-cols-2 gap-2 w-full">
        {/* <div className="flex gap-2 items-center justify-center">
          <label className="text-white">Color:</label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="p-2 rounded-lg"
          />
        </div> */}

        {/* <div className="flex gap-2 items-center justify-center">
          <label className="text-white">Lápiz:</label>
          <input
            type="number"
            value={brushWidth}
            onChange={(e) => handleBrushWidthChange(Number(e.target.value))}
            className="p-2 rounded-lg w-14 text-center"
            min="1"
          />
        </div> */}

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

        <button
          onClick={generateImage}
          className="text-white p-1 rounded-lg bg-green-500"
        >
          Guardar Imagen
        </button>
      </div>
    </div>
  );
};

export default DecoracionScreen;
