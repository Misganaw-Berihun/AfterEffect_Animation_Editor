import lottie from "lottie-web";

export const generateHTML = (animationData) => {
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
