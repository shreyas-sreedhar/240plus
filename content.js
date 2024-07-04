// Function to get the tweet input box
function getTweetBox() {
  let tweetBox = document.querySelector('[data-testid="tweetTextarea_0"]');
  if (!tweetBox) {
      tweetBox = document.querySelector('.public-DraftEditor-content');
  }
  if (!tweetBox) {
      tweetBox = document.querySelector('div[aria-label="Post text"][role="textbox"]');
  }
  console.log(tweetBox);
  return tweetBox;
}

// Function to inject the "Send as Image" button
function injectConvertButton() {
  const tablist = document.querySelector('div[data-testid="toolBar"]');
  if (tablist) {
      const convertButton = document.createElement('button');
      convertButton.style.minWidth = "20px";
      convertButton.style.minHeight = "20px";
      convertButton.style.marginLeft = "8px";
      convertButton.style.backgroundColor = "#1d9bf0";
      convertButton.style.border = "None";
      convertButton.style.borderRadius = "20px";
      convertButton.setAttribute('role', 'tab');
      convertButton.setAttribute('aria-selected', 'false');
      convertButton.setAttribute('data-testid', 'convertToImageButton');
      convertButton.style.cursor = 'pointer';
      const text = document.createElement("div");
      text.innerText = "Send as Image";
      convertButton.appendChild(text);
      
      tablist.appendChild(convertButton);
      
      convertButton.addEventListener('click', handleTextConversion);
  }
}

// Function to check and inject the button periodically
function checkAndInjectButton() {
  if (!document.querySelector('[data-testid="convertToImageButton"]')) {
      injectConvertButton();
      console.log("checkandinjectbutton clicked");
  }
}

// Run the check periodically
setInterval(checkAndInjectButton, 1000);

// New function for image generation
function generateImage(text, authorName) {
  // Create canvas and set context
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Set dimensions and styles
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
  
  // Get lines of text
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
  
  // Return the image as a data URL
  return canvas.toDataURL('image/png');
}

// Function to handle text conversion
function handleTextConversion() {
  console.log('Converting text to image...');

  // Get the tweet box
  const tweetBox = getTweetBox();

  if (!tweetBox) {
      console.error('Tweet box not found');
      return;
  }

  // Extract text from the tweet box
  const textNodes = Array.from(tweetBox.querySelectorAll('*'))
      .filter(el => el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE)
      .map(el => el.textContent);

  const text = textNodes.join('');

  // Generate the image
  const authorName = "Test"; // You might want to dynamically get the author name
  const imageDataUrl = generateImage(text, authorName);

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

// Listen for messages from the background script
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