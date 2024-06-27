function getTweetBox() {
    let tweetBox = document.querySelector('[data-testid="tweetTextarea_0"]');
    if (!tweetBox) {
        tweetBox = document.querySelector('.public-DraftEditor-content');
    }
    if (!tweetBox) {
        tweetBox = document.querySelector('div[aria-label="Post text"][role="textbox"]');
    }
    console.log(tweetBox)
    return tweetBox;
}

// function injectConvertButton() {
//     const tablistDiv = document.querySelector('button[data-testid="geoButton"]');

  

    
//     if (tablistDiv) {
//         const div = document.createElement('div')
//         div.role = "presentation1";
//         tablistDiv.appendChild(div)

//       const convertButton = document.createElement('button');
//       convertButton.style.width = "20px";
//       convertButton.style.height = "20px";
//     //   convertButton.style.alignItems = "center";
//     //   convertButton.style.justifyContent = "center";
//     //   convertButton.style.flexDirection = "row";
//     //   convertButton.style.paddingTop = "10px"

      
//     //   const img = document.createElement("img");
//     //   img.src = chrome.runtime.getURL("./icon16.png");
//     //   img.style.width = "20px";
//     //   img.style.height = "20px";
//     //   img.style.alignItems = "center"
//     //   document.body.appendChild(img);
//     //   convertButton.appendChild(img);
     
//       convertButton.setAttribute('role', 'tab');
//       convertButton.setAttribute('aria-selected', 'false');
//       convertButton.setAttribute('data-testid', 'convertToImageButton');
//     //   convertButton.style.marginLeft = '2px';
//     //   convertButton.style.padding = '4px 8px';
//     //   convertButton.style.border = '1px solid #ccc';
//     //   convertButton.style.borderRadius = '25px';
//     //   convertButton.style.background = '#000000';
//       convertButton.style.cursor = 'pointer';

  
//       adiv.parentElement.parentElement.appendChild(convertButton);
  
//       // Add event listener to the new button
//       convertButton.addEventListener('click', handleTextConversion);
//     }
//   }
function injectConvertButton() {
    const tablist = document.querySelector('div[data-testid="toolBar"]');
    if (tablist) {
      const convertButton = document.createElement('button');
      convertButton.style.minWidth = "20px";
      convertButton.style.minHeight = "20px";
      convertButton.style.marginLeft = "8px"
      convertButton.style.backgroundColor = "#1d9bf0"
      convertButton.style.border = "None"
      convertButton.style.borderRadius = "20px"
      convertButton.setAttribute('role', 'tab');
      convertButton.setAttribute('aria-selected', 'false');
      convertButton.setAttribute('data-testid', 'convertToImageButton');
      convertButton.style.cursor = 'pointer';
      const text = document.createElement("div");
      text.innerText = "Send as Image";
      convertButton.appendChild(text)
      
      // Insert the new button after the geoButton
    //   tablist.parentElement.insertBefore(convertButton, geoButton.nextSibling);
    tablist.appendChild(convertButton);
      
      convertButton.addEventListener('click', handleTextConversion);
    }
   }
   
  function checkAndInjectButton() {
    if (!document.querySelector('[data-testid="convertToImageButton"]')) {
      injectConvertButton();
      console.log("checkandinjectbutton clicked")
    }
  }
  
  // Run the check periodically
  setInterval(checkAndInjectButton, 1000);

// function convertTextToImage(text, authorName) {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     const fontSize = 24;
//     const padding = 100;
//     const lineHeight = fontSize * 1.5;
//     const maxWidth = 900;
//     const authorFontSize = 18;

//     canvas.width = 1024;
//     canvas.height = 1024;

//     // Set background
//     context.fillStyle = '#ffffff';
//     context.fillRect(0, 0, canvas.width, canvas.height);


//     context.font = `${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
//     context.fillStyle = '#000000';

//     function getLines(text) {
//         const words = text.split(' ');
//         const lines = [];
//         let currentLine = words[0];

//         for (let i = 1; i < words.length; i++) {
//             const word = words[i];
//             const width = context.measureText(currentLine + " " + word).width;
//             if (width < maxWidth) {
//                 currentLine += " " + word;
//             } else {
//                 lines.push(currentLine);
//                 currentLine = word;
//             }
//         }
//         lines.push(currentLine);
//         return lines;
//     }

//     const lines = getLines(text);
//     // const lines = [];
//     // let currentLine = '';
//     // const words = text.split(' ');

//     // words.forEach(word => {
//     //   const testLine = `${currentLine}${word} `;
//     //   const { width } = context.measureText(testLine);
//     //   if (width > maxWidth && currentLine) {
//     //     lines.push(`\n`);
//     //     currentLine = `${word} `;
//     //   } else {
//     //     currentLine = testLine;
//     //   }
//     // });
//     // lines.push(currentLine);

//     // const canvasHeight = lineHeight * lines.length + padding * 2;
//     // const canvasHeight = 1024;
//     // canvas.width = 1024;
//     // canvas.height = canvasHeight;

//     // context.fillStyle = '#ffffff';
//     // context.fillRect(0, 0, canvas.width, canvas.height);
//     // context.fillStyle = '#000000';
//     // context.font = `${fontSize}px Arial`;
//     // context.textBaseline = 'top';


//     // Draw text
//     lines.forEach((line, index) => {
//         context.fillText(line, padding, padding + index * lineHeight);
//     });

//     // Add author name
//     context.font = `${authorFontSize}px 'Helvetica Neue', Arial, sans-serif`;
//     context.fillStyle = '#666666';
//     context.fillText(authorName, padding, canvas.height - padding);

//     return canvas.toDataURL('image/png');


//     // lines.forEach((line, index) => {
//     //     context.fillText(line, padding, padding + index * lineHeight);
//     // });

//     // return canvas.toDataURL('image/png');
// }
function convertTextToImage(text, authorName) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const fontSize = 24;
    const lineHeight = fontSize * 1.5;
    const padding = 40;
    const maxWidth = 900;
    const authorFontSize = 18;
  
    // Set font for measuring and drawing
    context.font = `${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  
    // Word wrap function
    function getLines(text) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];
  
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }
  
    const lines = getLines(text);
  
    // Calculate canvas height based on number of lines
    const canvasHeight = Math.max(1024, lines.length * lineHeight + padding * 3 + authorFontSize);
    canvas.width = 1024;
    canvas.height = canvasHeight;
  
    // Set background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw main text
    context.font = `${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
    context.fillStyle = '#000000';
    context.textBaseline = 'top';
  
    lines.forEach((line, index) => {
      context.fillText(line, padding, padding + index * lineHeight);
    });
  
    // Add author name
    context.font = `${authorFontSize}px 'Helvetica Neue', Arial, sans-serif`;
    context.fillStyle = '#666666';
    context.fillText(authorName, padding, canvasHeight - padding - authorFontSize);
  
    return canvas.toDataURL('image/png');
  }

function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function handleTextConversion() {
    console.log('Converting text to image...');

    const tweetBox = getTweetBox();

    if (!tweetBox) {
        console.error('Tweet box not found');
        return;
    }

    const textNodes = Array.from(tweetBox.querySelectorAll('*'))
        .filter(el => el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE)
        .map(el => el.textContent);

    const text = textNodes.join('');

    if (text.length <= 240) {
        console.log('Text is not longer than 240 characters. No conversion needed.');
        return;
    }

    const authorName = "Test"
  

    const imageDataUrl = convertTextToImage(text, authorName);

    // Create a new image element
    const img = document.createElement('img');
    img.src = imageDataUrl;
    img.style.position = 'fixed';
    img.style.top = '10px';
    img.style.right = '10px';
    img.style.zIndex = '9999';
    img.style.border = '2px solid black';
    img.style.borderRadius = '5px';

    // Create a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'fixed';
    closeButton.style.top = '15px';
    closeButton.style.right = '15px';
    closeButton.style.zIndex = '10000';
    closeButton.style.cursor = 'pointer';

    // Add elements to the page
    document.body.appendChild(img);
    document.body.appendChild(closeButton);

    // Show a message to the user
    alert('Right-click on the image that appeared in the top-right corner and select "Copy image" to copy it to your clipboard. Click the X button to close the image when done.');

    // Handle close button click
    closeButton.onclick = function () {
        document.body.removeChild(img);
        document.body.removeChild(closeButton);
    };
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'convertToImage') {
        try {
            handleTextConversion();
            sendResponse({ status: 'Conversion completed' });
        } catch (error) {
            console.error('Error during conversion:', error);
            sendResponse({ status: 'Conversion failed', error: error.message });
        }
    }
});

console.log('Twitter Text to Image Converter content script loaded');