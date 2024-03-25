import React, { useState, useEffect, createRef } from "react";
import lottie from "lottie-web";
import JsonFileUploader from "./JsonFileUploader";

const generateHTML = (animationData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Edited Animation</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.9/lottie.min.js"></script>
    </head>
    <body>
      <div id="animation-container"></div>
      <script>
        const animationData = ${JSON.stringify(animationData)};
        const container = document.getElementById('animation-container');
        lottie.loadAnimation({
          container: container,
          renderer: 'canvas',
          loop: true,
          autoplay: true,
          animationData: animationData
        });
      </script>
    </body>
    </html>
  `;
};

const EditableCanvas = () => {
  const [animationData, setAnimationData] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [frameSpeed, setFrameSpeed] = useState(0);
  const [color, setColor] = useState("#ffffff"); 
  const [opacity, setOpacity] = useState(0); 
  let animationContainer = createRef();

  useEffect(() => {
    if (animationData) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "canvas",
        loop: true,
        autoplay: true,
        animationData: animationData
      });
      return () => anim.destroy();
    }
  }, [animationData]);

  const handleWidthChange = (event) => {
    const newWidth = parseInt(event.target.value);
    setWidth(newWidth);
    if (animationData) {
      setAnimationData((prevAnimationData) => ({
        ...prevAnimationData,
        w: newWidth
      }));
    }
  };

  const handleHeightChange = (event) => {
    const newHeight = parseInt(event.target.value);
    setHeight(newHeight);
    if (animationData) {
      setAnimationData((prevAnimationData) => ({
        ...prevAnimationData,
        h: newHeight
      }));
    }
  };

  const handleFrameSpeedChange = (event) => {
    const newFrameSpeed = parseInt(event.target.value);
    setFrameSpeed(newFrameSpeed);
    if (animationData) {
      setAnimationData((prevAnimationData) => ({
        ...prevAnimationData,
        fr: newFrameSpeed
      }));
    }
  };

  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    
    return [ r, g, b ];
  }

  const handleColorChange = (event) => {
    const colorValue = event.target.value
    const colorArray = hexToRgb(colorValue).map(v => v / 255)
    
    setColor(colorValue)

    if (animationData) {
      const updatedAnimationData = {
        ...animationData,
        layers: animationData.layers.map(layer => ({
          ...layer,
          shapes: layer.shapes.map(shape => ({
            ...shape,
            it: shape.it.map(i => {
              if (i.ty === 'fl' || i.nm === 'Fill') {
                return {
                  ...i,
                  c: {
                    a: 0,
                    k: colorArray
                  }
                };
              } else {
                return i;
              }
            })
            
        }))
        }))};
      setAnimationData(updatedAnimationData);
    }
  };

  const handleOpacityChange = (event) => {
    const newOpacity = parseInt(event.target.value);
    setOpacity(newOpacity)
    if (animationData) {
      const updatedAnimationData = {
        ...animationData,
        layers: animationData.layers.map(layer => ({
          ...layer,
          ks: {
            ...layer.ks,
            o: {
              ...layer.ks.o,
              k: newOpacity
            }
          }
        }))
      };
      setAnimationData(updatedAnimationData);
    }
  };
  
  const handleFinish = async () => {
    const fileName = window.prompt("Enter the file name:");
  
    if (!fileName) {
      console.log("File saving canceled.");
      return;
    }
  
    const htmlContent = generateHTML(animationData);
    const blob = new Blob([htmlContent], { type: 'text/html' });

    const url = URL.createObjectURL(blob);
  
    window.open(url);
  
    if (htmlContent) {
      try {
        const response = await fetch("http://localhost:8000/save_html/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ html: htmlContent, fileName: fileName })
        });
  
        if (response.ok) {
          console.log("HTML content saved successfully");
        } else {
          console.error("Failed to save HTML content");
        }
      } catch (error) {
        console.error("Error saving HTML content:", error);
      }
    }
  };

  return (
    <div>
        <div className="mt-12 text-center">
            <h1 className="text-3xl font-bold">After Effects File Editor</h1>
            <p className="text-gray-600">Customize your animation</p>
        </div>
        <div className="flex justify-center items-center h-screen">
          <div className="container mx-auto p-8 flex">
            <div className="flex-1 mr-8">
              <div className="animation-container" ref={animationContainer} />
            </div>
            <div className="flex-1">
              <JsonFileUploader setAnimationData={setAnimationData} />
              <div className="my-4">
                <label className="mr-4">Width: </label>
                <input type="range" min="0" max="1000" value={width} onChange={handleWidthChange} className="mr-4" />
                <span>{width}</span>
              </div>
              <div className="my-4">
                <label className="mr-4">Height: </label>
                <input type="range" min="0" max="1000" value={height} onChange={handleHeightChange} className="mr-4" />
                <span>{height}</span>
              </div>
              <div className="my-4">
                <label className="mr-4">Frame Speed: </label>
                <input type="range" min="0" max="100" value={frameSpeed} onChange={handleFrameSpeedChange} className="mr-4" />
                <span>{frameSpeed}</span>
              </div>
              <div className="my-4">
                <label className="mr-4">Color: </label>
                <input type="color" value={color} onChange={handleColorChange} className="mr-4" />
              </div>
              <div className="my-4">
                <label className="mr-4">Opacity: </label>
                <input type="range" min="0" max="100" value
    ={opacity} onChange={handleOpacityChange} className="mr-4" />
                <span>{opacity}</span>
              </div>
              <div className="my-4">
                <button onClick={handleFinish} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                  Finish
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default EditableCanvas;
