import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
import { useState, useRef, useEffect } from "react";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../../config/firebase";

const DecoracionScreen = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputDressRef = useRef<HTMLInputElement>(null);
  const { editor, onReady } = useFabricJSEditor();
  // const [selectedColor, setSelectedColor] = useState<string>("#ff0000");
  const [brushWidth, setBrushWidth] = useState<number>(5);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  // const [text, setText] = useState<string>("Texto aquí");
  // const [fontSize, setFontSize] = useState<number>(24);
  // const [fontFamily, setFontFamily] = useState<string>("Arial");
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

  // const handleColorChange = (color: string) => {
  //   setSelectedColor(color);
  //   if (editor?.canvas) {
  //     editor.canvas.freeDrawingBrush.color = color;
  //   }
  // };

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
        oImg.scale(0.3); // Ajusta la escala según sea necesario
        editor?.canvas.add(oImg);
        saveCanvasState();
      },
      {
        crossOrigin: "anonymous",
      }
    );
  };

  const handleDressOverlay = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    fabric.Image.fromURL(
      url,
      (oImg) => {
        oImg.scale(0.3); // Ajusta la escala inicial de la prenda
        oImg.set({
          left: 100, // Posición inicial
          top: 100, // Posición inicial
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });
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

  // const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setText(event.target.value);
  // };

  // const addText = () => {
  //   const textObject = new fabric.Textbox(text, {
  //     left: 100,
  //     top: 100,
  //     fill: selectedColor,
  //     fontSize: fontSize,
  //     fontFamily: fontFamily,
  //     selectable: true,
  //   });
  //   editor?.canvas.add(textObject);
  //   saveCanvasState();
  // };

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
      <div className="flex w-full gap-2 p-2 overflow-x-scroll bg-gray-800 h-1/4">
        {imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Firebase Image ${index}`}
            className="object-cover w-32 h-32 cursor-pointer"
            onClick={() => handleImageClick(url)}
          />
        ))}
      </div>
      <div className="flex w-full gap-2 p-2 overflow-x-scroll bg-gray-800 h-1/4">
        {imageUrlsEstampado.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Firebase Image ${index}`}
            className="object-cover w-32 h-32 cursor-pointer"
            onClick={() => handleImageClick(url)}
          />
        ))}
      </div>

      {/* Canvas */}
      <div className="flex flex-grow p-2 bg-gray-800">
        <div className="w-full border-4 border-yellow-500 rounded-xl h-96">
          {" "}
          <FabricJSCanvas onReady={onReady} className="w-full h-full" />
        </div>
      </div>

      {/* Controles */}
      <div className="grid w-full grid-cols-2 gap-2 p-2 bg-gray-700">
        <button
          onClick={() => inputRef.current?.click()}
          className="p-1 text-white rounded-lg"
        >
          Subir Imagen Persona
        </button>
        <input
          ref={inputRef}
          onChange={handlePic}
          type="file"
          className="hidden"
        />

        <button
          onClick={() => inputDressRef.current?.click()}
          className="p-1 text-white rounded-lg"
        >
          Subir Prenda
        </button>
        <input
          ref={inputDressRef}
          onChange={handleDressOverlay}
          type="file"
          className="hidden"
        />

        {/* Más controles */}
        <button
          onClick={toggleDrawingMode}
          className="p-1 text-white rounded-lg"
        >
          {isDrawingMode ? "Desactivar Dibujo" : "Activar Dibujo"}
        </button>

        {/* <button onClick={addText} className="p-1 text-white rounded-lg">
          Agregar Texto
        </button> */}

        <button onClick={handleUndo} className="p-1 text-white rounded-lg">
          Deshacer
        </button>
        <button onClick={handleRedo} className="p-1 text-white rounded-lg">
          Rehacer
        </button>

        <button
          onClick={handleClearCanvas}
          className="p-1 text-white rounded-lg"
        >
          Limpiar
        </button>
        <button onClick={generateImage} className="p-1 text-white rounded-lg">
          Descargar Imagen
        </button>

        <button onClick={handleLayerUp} className="p-1 text-white rounded-lg">
          Subir Capa
        </button>
        <button onClick={handleLayerDown} className="p-1 text-white rounded-lg">
          Bajar Capa
        </button>

        <button onClick={handleDelete} className="p-1 text-white rounded-lg">
          Eliminar Objeto
        </button>

        <label className="text-white">Tamaño de Brocha</label>
        <input
          type="range"
          min={1}
          max={50}
          value={brushWidth}
          onChange={(e) => handleBrushWidthChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default DecoracionScreen;
