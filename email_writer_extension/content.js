console.log("Extension loaded successfully")

function createAIButton(){
  const button = document.createElement('div');
  button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
  button.style.marginRight = '8px';
  button.innerHTML = 'AI Reply';
  button.setAttribute('role', 'button');
  button.setAttribute('data-tooltip', 'Generate AI Reply');
  return button;
}

function findComposeToolbar() {
  const selectors = ['.aDh, .aDj, .gU.Up'];

  for(const selector of selectors){
    const toolbar = document.querySelector(selector);
    if(toolbar){
      return toolbar;
    }
    return null;
  }
}

function getEmailContent() {
  const selectors = ['.a3s.aiL, .h7'];

  for(const selector of selectors){
    const emailContent = document.querySelector(selector);
    if(toolbar){
      return emailContent.innerText.trim();
    }
    return '';
  }
}

function injectButton() {
  // console.log("Button is injected");

  const existingButton = document.querySelector('.ai-reply-button');
  if(existingButton) existingButton.remove();

  const toolbar = findComposeToolbar();
  if(!toolbar) {
    console.log("Toolbar not found");
    return;
  }

  console.log("Toolbar found, creating AI button");
  
  const button = createAIButton();
  button.classList.add('ai-reply-button');
  button.addEventListener('click', async() => {
    try{
      button.innerHTML = 'Generating...';
      button.disabled = true;

      const emailContent = getEmailContent();
      const response = await fetch('http://localhost:8080/api/email/request',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          content: emailContent,
          tone: "professional"
        })
      });

      if(!response.ok){
        throw new Error('API request failed');
      }

      const generated_reply = await response.text();
      const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

      if(composeBox){
        composeBox.focus();
        document.execCommand('insertText', false, generated_reply);
      }
    } catch(error){
      console.error(error);
    } finally {
      button.innerHTML = 'AI Reply';
      button.disabled = false;
    }
  });

  toolbar.insertBefore(button, toolbar.firstChild);
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