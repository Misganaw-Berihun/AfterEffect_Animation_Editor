(function() {
  const animationData = document.getElementById('animationData').innerText;

  const animationDataParsed = JSON.parse(animationData);
  
  const animationWidth = animationDataParsed.w;
  const animationHeight = animationDataParsed.h;

  const canvas = document.createElement('canvas');
  canvas.width = animationWidth;
  canvas.height = animationHeight;
  const animItem = bodymovin.loadAnimation({
    renderer: 'canvas',
    loop: true,
    autoplay: true,
    animationData: animationDataParsed,
    rendererSettings: {
      context: canvas.getContext('2d'), 
      preserveAspectRatio: 'xMidYMid meet',
    }
  });

  const fabricCanvas = new fabric.Canvas('fabricCanvas');
  
   animItem.addEventListener('data_ready', () => {
      console.log('data_ready')
    })
    animItem.addEventListener('loaded_images', () => {
      console.log('loaded_images')
    })
    animItem.addEventListener('complete', () => {
      console.log('complete')
    })
    animItem.addEventListener('loopComplete', () => {
      console.log('loopComplete')
    })
    animItem.addEventListener('enterFrame', (e) => {
      console.log('current time', animItem.currentFrame / animItem.frameRate)
      fabricCanvas.requestRenderAll()
    })
    animItem.addEventListener('config_ready', () => {
      console.log('config_ready')
    })
  
  
  animItem.addEventListener('DOMLoaded', () => {
    window.tempEl = animItem;
    animItem.goToAndStop(1, true);
    const durationInSeconds = animItem.animationData.op / animItem.animationData.fr;
    console.log('total duration', durationInSeconds);
    
    console.log('DOMLoaded');
    const fabricImage = new fabric.Image(canvas, {
      scaleX: 0.25,
      scaleY: 0.25,
      objectCaching: true
    });
    window.fabricImage = fabricImage;
    fabricCanvas.add(fabricImage);
    fabricCanvas.requestRenderAll();
    window.fabricCanvas = fabricCanvas;

    const angleControl = document.querySelector("#angle-control");
    angleControl.oninput = (e) => {
      window.fabricImage.set('angle', parseInt(e.target.value, 10)).setCoords();
      window.fabricCanvas.requestRenderAll();
    }

    const scaleControl = document.querySelector("#scale-control");
    scaleControl.oninput = (e) => {
      window.fabricImage.scale(parseFloat(e.target.value, 10)).setCoords();
      window.fabricCanvas.requestRenderAll();
    };

    const topControl = document.querySelector("#top-control");
    topControl.oninput = (e) => {
      console.log("Top control:", e)
      window.fabricImage.set('top', parseInt(e.target.value, 10)).setCoords();
      window.fabricCanvas.requestRenderAll();
    };

    const leftControl = document.querySelector("#left-control");
    leftControl.oninput = (e) => {
      window.fabricImage.set('left', parseInt(e.target.value, 10)).setCoords();
      window.fabricCanvas.requestRenderAll();
    };

    const skewXControl = document.querySelector("#skewX-control");
    skewXControl.oninput = (e) => {
      window.fabricImage.set('skewX', parseInt(e.target.value, 10)).setCoords();
      window.fabricCanvas.requestRenderAll();
    };

    const skewYControl = document.querySelector("#skewY-control");
    skewYControl.oninput = (e) => {
      window.fabricImage.set('skewY', parseInt(e.target.value, 10)).setCoords();
      window.fabricCanvas.requestRenderAll();
    };
  });
  
    
  animItem.play();
  document.querySelector("#play").onclick = () => {
    animItem.play();
  };
  document.querySelector("#pause").onclick = () => {
    animItem.pause();
  };
  document.querySelector("#stop").onclick = () => {
    animItem.stop();
  };

})();
