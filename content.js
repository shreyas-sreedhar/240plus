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
function generateImages(text, authorName, authorUsername, authorProfilePic) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Set dimensions and styles
  const canvasSize = 900;
  const padding = 60;
  const maxWidth = canvasSize - (padding * 2);
  
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  
  function getLines(text, fontSize) {
      context.font = `${fontSize}px 'Arial', sans-serif`;
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
  
  // Determine font size based on text length
  let fontSize = text.length < 100 ? 48 : text.length < 200 ? 36 : 24;
  let allLines = getLines(`"${text}"`, fontSize);
  const lineHeight = fontSize * 1.5;
  const maxLinesPerImage = Math.floor((canvasSize - (padding * 3) - 100) / lineHeight);
  
  const imageDataUrls = [];
  for (let i = 0; i < allLines.length; i += maxLinesPerImage) {
      const imageLines = allLines.slice(i, i + maxLinesPerImage);
      
      // Set background
      context.fillStyle = '#000000';
      context.fillRect(0, 0, canvasSize, canvasSize);
      
      // Draw main text
      context.font = `${fontSize}px 'Arial', sans-serif`;
      context.fillStyle = '#ffffff';
      context.textBaseline = 'top';
      
      imageLines.forEach((line, index) => {
          context.fillText(line, padding, padding + index * lineHeight);
      });
      
      // Add profile picture
      const picSize = 60;
      const img = new Image();
      img.src = authorProfilePic;
      context.save();
      context.beginPath();
      context.arc(padding + picSize/2, canvasSize - padding - picSize/2, picSize/2, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();
      context.drawImage(img, padding, canvasSize - padding - picSize, picSize, picSize);
      context.restore();
      
      // Add author name and username
      context.font = `bold 18px 'Arial', sans-serif`;
      context.fillStyle = '#ffffff';
      context.fillText(authorName, padding + picSize + 15, canvasSize - padding - picSize + 5);
      
      context.font = `16px 'Arial', sans-serif`;
      context.fillStyle = '#cccccc';
      context.fillText(`@${authorUsername}`, padding + picSize + 15, canvasSize - padding - picSize + 30);
      
      // Add image number if there are multiple images
      if (allLines.length > maxLinesPerImage) {
          const imageNumber = Math.floor(i / maxLinesPerImage) + 1;
          const totalImages = Math.ceil(allLines.length / maxLinesPerImage);
          context.textAlign = 'right';
          context.fillStyle = '#ffffff';
          context.fillText(`${imageNumber}/${totalImages}`, canvasSize - padding, canvasSize - padding);
          context.textAlign = 'left';
      }
      
      // Add watermark
      context.font = '16px Arial, sans-serif';
      context.fillStyle = 'rgba(255, 255, 255, 0.5)';
      context.textAlign = 'right';
      context.fillText('Generated by 240Plus', canvasSize - padding, canvasSize - padding - 25);
      
      // Add image to array
      imageDataUrls.push(canvas.toDataURL('image/png'));
  }
  
  return imageDataUrls;
}
// Function to handle text conversion
function handleTextConversion() {
  console.log('Converting text to image(s)...');

  const tweetBox = getTweetBox();

  if (!tweetBox) {
      console.error('Tweet box not found');
      return;
  }

  const textNodes = Array.from(tweetBox.querySelectorAll('*'))
      .filter(el => el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE)
      .map(el => el.textContent);

  const text = textNodes.join('');

  // Extract user information using more reliable selectors
  let authorName = 'Unknown';
  let authorUsername = 'unknown';
  let authorProfilePicUrl = '';

  // Find the account switcher button
  const accountSwitcherButton = document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]');

  if (accountSwitcherButton) {
      // Find the name element
      const nameElement = accountSwitcherButton.querySelector('[data-testid="UserName"]');
      if (nameElement) {
          authorName = nameElement.textContent.trim();
      }

      // Find the username element
      const usernameElement = accountSwitcherButton.querySelector('[data-testid="UserName"] + div');
      if (usernameElement) {
          authorUsername = usernameElement.textContent.trim();
          if (authorUsername.startsWith('@')) {
              authorUsername = authorUsername.substring(1); // Remove the @ symbol
          }
      }

      // Find the profile picture
      const avatarContainer = accountSwitcherButton.querySelector('[data-testid="UserAvatar-Container"]');
      if (avatarContainer) {
          const imgElement = avatarContainer.querySelector('img');
          if (imgElement) {
              authorProfilePicUrl = imgElement.src;
          }
      }
  }

  console.log(`User Info - Name: ${authorName}, Username: ${authorUsername}, Profile Pic: ${authorProfilePicUrl}`);

  const imageDataUrls = generateImages(text, authorName, authorUsername, authorProfilePicUrl);


  const imageContainer = document.createElement('div');
  imageContainer.style.position = 'fixed';
  imageContainer.style.top = '10px';
  imageContainer.style.right = '10px';
  imageContainer.style.zIndex = '9999';

  imageDataUrls.forEach((dataUrl, index) => {
      const imgWrapper = document.createElement('div');
      imgWrapper.style.marginBottom = '10px';
      imgWrapper.style.position = 'relative';

      const img = document.createElement('img');
      img.src = dataUrl;
      img.style.border = '2px solid black';
      img.style.borderRadius = '5px';
      img.style.width = '300px'; // Smaller preview size

      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copy to Clipboard';
      copyButton.style.position = 'absolute';
      copyButton.style.bottom = '10px';
      copyButton.style.left = '10px';
      copyButton.style.zIndex = '10000';
      copyButton.style.cursor = 'pointer';

      copyButton.onclick = function() {
          // Create a temporary canvas to get the full-size image data
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = 900;
          tempCanvas.height = 900;
          const tempCtx = tempCanvas.getContext('2d');
          const tempImg = new Image();
          tempImg.onload = function() {
              tempCtx.drawImage(tempImg, 0, 0);
              tempCanvas.toBlob(function(blob) {
                  navigator.clipboard.write([
                      new ClipboardItem({ 'image/png': blob })
                  ]).then(function() {
                      alert('Image copied to clipboard!');
                      imgWrapper.remove();
                      if (imageContainer.children.length === 0) {
                          imageContainer.remove();
                      }
                  }).catch(function(error) {
                      console.error('Error copying image to clipboard:', error);
                  });
              }, 'image/png');
          };
          tempImg.src = dataUrl;
      };

      imgWrapper.appendChild(img);
      imgWrapper.appendChild(copyButton);
      imageContainer.appendChild(imgWrapper);
  });

  document.body.appendChild(imageContainer);

  // Show a message to the user
  alert(`${imageDataUrls.length} image(s) generated. Click "Copy to Clipboard" button under each image to copy it. The image will disappear once copied.`);
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