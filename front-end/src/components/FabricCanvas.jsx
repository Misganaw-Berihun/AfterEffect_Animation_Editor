import { useEffect, useState } from "react";

const AnimationLoader = () => {
  const [animationData, setAnimationData] = useState(null);
  const [angle, setAngle] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const [scale, setScale] = useState(0);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const fabricScript = document.createElement('script');
    fabricScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.5.0/fabric.min.js';
    fabricScript.async = true;
    document.head.appendChild(fabricScript);

    const bodymovinScript = document.createElement('script');
    bodymovinScript.src = 'bodymovin.js';
    bodymovinScript.async = true;
    document.head.appendChild(bodymovinScript);

    return () => {
      document.head.removeChild(bodymovinScript);
      document.head.removeChild(fabricScript);
    };
  }, []);

  const loadExternalScript = () => {
    const script = document.createElement("script");
    script.src = "animation_loader.js";
    script.async = true;
    document.body.appendChild(script);
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setAnimationData(content);
      loadExternalScript();
    }
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-200">
      <div className="flex-grow flex justify-start items-start">
        <div className="relative w-64 h-48 border border-gray-300 mb-8">
          <canvas id="fabricCanvas" width="1000" height="400"></canvas>
          <script id="animationData">{animationData}</script>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 flex justify-between items-center border-t border-gray-300">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="angle-control">Angle:</label>
            <input id="angle-control" type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(e.target.value)} className="slider" />
          </div>
          <div>
            <label htmlFor="scale-control">Scale:</label>
            <input id="scale-control" type="range" min="0" max="2" step="0.01" value={scale} onChange={(e) => setScale(e.target.value)} className="slider" />
          </div>
          <div>
            <label htmlFor="skewX-control">Skew X:</label>
            <input id="skewX-control" type="range" min="-20" max="20" value={skewX} onChange={(e) => setSkewX(e.target.value)} className="slider" />
          </div>
          <div>
            <label htmlFor="skewY-control">Skew Y:</label>
            <input id="skewY-control" type="range" min="-20" max="20" value={skewY} onChange={(e) => setSkewY(e.target.value)} className="slider" />
          </div>
          <div>
            <label htmlFor="top-control">Top:</label>
            <input id="top-control" type="range" min="0" max="400" value={top} onChange={(e) => setTop(e.target.value)} className="slider" />
          </div>
          <div>
            <label htmlFor="left-control">Left:</label>
            <input id="left-control" type="range" min="0" max="400" value={left} onChange={(e) => setLeft(e.target.value)} className="slider" />
          </div>
        </div>
        <div>
          <input type="file" accept=".json" onChange={handleFileChange} />
        </div>
        <div>
          <button id="play" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Play</button>
          <button id="pause" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Pause</button>
          <button id="stop" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Stop</button>
        </div>
      </div>
    </div>
  );
};

export default AnimationLoader;
