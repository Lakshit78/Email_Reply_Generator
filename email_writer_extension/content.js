console.log("Extension loaded successfully")

function injectButton() {

}

// Callback function to execute when mutations are observed
const callback = (mutationList) => {
  //Taking every mutation one by one through loop
  for(const mutation of mutationList) {

    //AddedNodes are the changes that are made compared to previous DOM
    const addedNodes = Array.from(mutation.addedNodes);

    //Selectors are used to find the if there are changes that we require
    const hasComposeElements = addedNodes.some(node => 
      node.nodeType === Node.ELEMENT_NODE &&
      (node.matches('.I5, [role="dialog"]') || node.querySelector('.I5, [role="dialog"]'))
    );

    if(hasComposeElements) {
      console.log("Compose Window is detected.")

      //Button will appear 500 milli seconds late.
      setTimeout(injectButton, 500);
    }
  }
};

// Options for the observer (which mutations to observe)
const config = {childList: true, subtree: true };

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(document.body, config);