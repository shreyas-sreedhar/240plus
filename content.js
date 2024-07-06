// Function - Find Tweet TextBox
function getTweetBox() {
  return (
    document.querySelector('[data-testid="tweetTextarea_0"]') ||
    document.querySelector(".public-DraftEditor-content") ||
    document.querySelector('div[aria-label="Post text"][role="textbox"]')
  );
}

// Function - Inserting "Send as Image" button next to Post
function injectConvertButton() {
  const tablist = document.querySelector('div[data-testid="toolBar"]');
  if (tablist && !document.querySelector('[data-testid="convertToImageButton"]')) {
    const convertButton = createConvertButton();
    tablist.appendChild(convertButton);
    convertButton.addEventListener("click", handleTextConversion);
    console.log("Button injected");
  }
}

// Function - Create the "Send as Image" button
function createConvertButton() {
  const convertButton = document.createElement("button");
  Object.assign(convertButton.style, {
    minWidth: "20px",
    minHeight: "20px",
    marginLeft: "8px",
    borderRadius: "20px",
    padding: "8px",
    backgroundColor: "#1f4bf0",
    border: "None",
    marginTop: "6px",
    cursor: "pointer"
  });

  convertButton.setAttribute("role", "tab");
  convertButton.setAttribute("aria-selected", "false");
  convertButton.setAttribute("data-testid", "convertToImageButton");

  const buttonText = document.createElement("div");
  buttonText.innerText = "Generate Image";
  buttonText.style.fontFamily = "Helvetica, sans-serif";
  convertButton.appendChild(buttonText);

  return convertButton;
}

// Function - Check to see if button exists and inject the button periodically
function checkAndInjectButton() {
  if (!document.querySelector('[data-testid="convertToImageButton"]')) {
    injectConvertButton();
    console.log("Checked and Added the Send as Image button");
  }
}

// Check periodically
setInterval(checkAndInjectButton, 1000);

// Function to generate images
function generateImages(text, authorUsername) {
  const canvasSize = 900;
  const padding = 60;
  // const picSize = 100;
  const maxWidth = canvasSize - padding * 2;

  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const context = canvas.getContext("2d");

  let fontSize = text.length < 100 ? 48 : text.length < 200 ? 36 : 24;
  const lineHeight = fontSize * 1.5;
  const maxLinesPerImage = Math.floor((canvasSize - padding * 3 - 100) / lineHeight);

  const imageDataUrls = [];

  // Split text into lines that fit within the canvas width
  function getLines(text, fontSize) {
    context.font = `${fontSize}px Arial, sans-serif`;
    const words = text.split(" ");
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

  let allLines = getLines(`${text}`, fontSize);

// Calculate total text height
  const totalTextHeight = allLines.length * lineHeight;
  const startY = (canvasSize - totalTextHeight) / 2;

  // Draw on canvas
  context.fillStyle = "#ffffff"; // White background
  context.fillRect(0, 0, canvasSize, canvasSize);

  context.font = `${fontSize}px Arial, sans-serif`;
  context.fillStyle = "#000000"; // Black text
  context.textBaseline = "top"; // Align text vertically to top

  allLines.forEach((line, index) => {
    let textWidth = context.measureText(line).width;
    let lineY = startY + index * lineHeight;
    let lineX = (canvasSize - textWidth) / 2;
    context.fillText(line, lineX, lineY);
  });

  // Draw author username in the middle
  const usernameFontSize = 20;
  context.font = `bold ${usernameFontSize}px Arial, sans-serif`;
  context.fillStyle = "#000000"; // Black text
  context.textAlign = "center";
  context.fillText(`~ @${authorUsername}`, canvasSize / 2, canvasSize - padding - 40);

  // Add image number if there are multiple images
  if (allLines.length > maxLinesPerImage) {
    const imageNumber = Math.floor(allLines.length / maxLinesPerImage) + 1;
    context.textAlign = "right";
    context.fillText(`${imageNumber}/${Math.ceil(allLines.length / maxLinesPerImage)}`, canvasSize - padding, canvasSize - padding);
    context.textAlign = "left";
  }

  // Add watermark with reduced opacity and smaller font
  const watermarkFontSize = 14;
  context.font = `${watermarkFontSize}px Arial, sans-serif`;
  context.fillStyle = "rgba(0, 0, 0, 0.1)"; // Very light opacity black
  context.textAlign = "right";
  context.fillText("Generated by @240Plus", canvasSize - padding, canvasSize - padding - 25);

  // Add image to array
  imageDataUrls.push(canvas.toDataURL("image/png"));

  return imageDataUrls;
}

function generateImages1(text, authorUsername) {
  const canvasSize = 900;
  const padding = 60;
  const maxWidth = canvasSize - padding * 2;

  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const context = canvas.getContext("2d");

  // White background
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvasSize, canvasSize);

  // Black rounded rectangle
  context.fillStyle = "#000000";
  roundRect(context, padding, padding, canvasSize - padding * 2, canvasSize - padding * 2, 20);

  // Colored circles
  drawCircle(context, padding + 30, padding + 30, 8, "#FF5F56");
  drawCircle(context, padding + 60, padding + 30, 8, "#FFBD2E");
  drawCircle(context, padding + 90, padding + 30, 8, "#27C93F");

  // Text
  let fontSize = text.length < 100 ? 36 : text.length < 200 ? 28 : 20;
  const lineHeight = fontSize * 1.5;
  context.font = `${fontSize}px monospace`;
  context.fillStyle = "#ffffff";
  context.textBaseline = "top";

  const lines = getLines(text, fontSize, maxWidth - padding * 2, context);
  let startY = (canvasSize - lines.length * lineHeight) / 2;

  lines.forEach((line, index) => {
    context.fillText(line, padding * 2, startY + index * lineHeight);
  });

  // Author username
  const usernameFontSize = 20;
  context.font = `bold ${usernameFontSize}px monospace`;
  context.textAlign = "center";
  context.fillText(`@${authorUsername}`, canvasSize / 2, canvasSize - padding * 2);

  // Watermark
  const watermarkFontSize = 14;
  context.font = `${watermarkFontSize}px monospace`;
  context.fillStyle = "rgba(255, 255, 255, 0.3)";
  context.textAlign = "right";
  context.fillText("Generated by @240Plus", canvasSize - padding, canvasSize - padding);

  return [canvas.toDataURL("image/png")];
}


// Function to handle text conversion
async function handleTextConversion() {
  console.log("Converting text to image...");

  const tweetBox = getTweetBox();
  if (!tweetBox) {
    console.error("Tweet box not found");
    return;
  }

  const textNodes = Array.from(tweetBox.querySelectorAll("*"))
    .filter(
      (el) =>
        el.childNodes.length === 1 &&
        el.childNodes[0].nodeType === Node.TEXT_NODE
    )
    .map((el) => el.textContent);

  const text = textNodes.join("");

  let authorUsername = "unknown";
  const usernameElement = document.querySelector(
    'a[data-testid="AppTabBar_Profile_Link"]'
  );
  if (usernameElement) {
    authorUsername = usernameElement.getAttribute("href").substring(1);
  }

  console.log(`Username: ${authorUsername}`);

  try {
    const imageDataUrls = generateImages(text, authorUsername);

    // Clear the text from the tweet box
    // clearTweetBox(tweetBox);

    // Insert the image into the tweet compose area
    await insertImageIntoTweet(imageDataUrls[0]);

    console.log("Text converted to image and inserted into tweet");
    clearTweetBox(tweetBox);
    console.log("Text Cleared")
  } catch (error) {
    console.error("Error during text conversion:", error);
  }
}
function clearTweetBox(tweetBox) {
  simulateBackspace(tweetBox);
}

// function clearTweetBox(tweetBox) {
//   tweetBox.textContent = '';
//   tweetBox.dispatchEvent(new Event('input', { bubbles: true }));
// }
function simulateBackspace(tweetBox) {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key: 'Backspace',
    code: 'Backspace',
    keyCode: 8,
    which: 8,
  });

  // Set focus on the tweet box
  tweetBox.focus();

  // Get the length of the text and simulate backspace for each character
  const textLength = tweetBox.textContent.length;
  for (let i = 0; i < textLength; i++) {
    tweetBox.dispatchEvent(event);
  }
}
async function insertImageIntoTweet(imageDataUrl) {
  try {
    // Find the file input element
    const fileInput = document.querySelector('input[type="file"][accept^="image/"]');
    if (!fileInput) {
      throw new Error("File input for image upload not found");
    }

    // Convert data URL to Blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();

    // Create a File object from the Blob
    const file = new File([blob], "tweet_image.png", { type: "image/png" });

    // Create a FileList object (which is what a file input normally produces)
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;

    // Dispatch a change event to notify the application that a file has been selected
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));

    console.log("Image inserted into tweet");
  } catch (error) {
    console.error("Error inserting image:", error);
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "convertToImage") {
    handleTextConversion()
      .then(() => { sendResponse({ status: "Conversion completed" })})
      .catch((error) => sendResponse({ status: "Conversion failed", error: error.message }));
    return true; // Indicates that the response is sent asynchronously
  }
});

console.log("Twitter Text to Image Converter content script loaded");
