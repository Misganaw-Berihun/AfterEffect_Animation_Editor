(function() {
  const animationData = document.getElementById('animationData').innerText;

  const animationDataParsed = JSON.parse(animationData);
  
  const animationWidth = animationDataParsed.w;
  const animationHeight = animationDataParsed.h;

  fabric.AEAnimation = fabric.util.createClass(fabric.Image, {
    type: 'croppableimage',
    initialize: function (AECanvas, options) {
      options = options || {};
      this.callSuper('initialize', AECanvas, options);
      this._AECanvas = AECanvas;
    },
    drawCacheOnCanvas: function(ctx) {
      ctx.drawImage(this._AECanvas, -this.width / 2, -this.height / 2);
    },
    _createCacheCanvas: function() {
      console.log('override!!!');
      this._cacheProperties = {};
      this._cacheCanvas = this._AECanvas;
      console.log(this._cacheCanvas);
      this._cacheContext = this._cacheCanvas.getContext('2d');
      this.dirty = true;
    },
    render: function(ctx) {
      if (this.isNotVisible()) {
        return;
      }
      if (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen()) {
        return;
      }
      ctx.save();
      this._setupCompositeOperation(ctx);
      this.drawSelectionBackground(ctx);
      this.transform(ctx);
      this._setOpacity(ctx);
      this._setShadow(ctx, this);
      if (this.transformMatrix) {
        ctx.transform.apply(ctx, this.transformMatrix);
      }
      this.clipTo && fabric.util.clipContext(this, ctx);
      if (this.shouldCache()) {
        if (!this._cacheCanvas) {
          console.log('create cache');
          this._createCacheCanvas();
        }
        this.drawCacheOnCanvas(ctx);
      }
      else {
        console.log('remove cache and draw');
        this._removeCacheCanvas();
        this.dirty = false;
        this.drawObject(ctx);
        if (this.objectCaching && this.statefullCache) {
          this.saveState({ propertySet: 'cacheProperties' });
        }
      }
      this.clipTo && ctx.restore();
      ctx.restore();
    }
  });

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
    const fabricImage = new fabric.AEAnimation(canvas, {
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
