document.addEventListener('DOMContentLoaded', () => {
    const convertButton = document.getElementById('convertButton');
    convertButton.addEventListener('click', () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'convertToImage'}, (response) => {
          console.log(response.status);
        });
      });
    });
  });