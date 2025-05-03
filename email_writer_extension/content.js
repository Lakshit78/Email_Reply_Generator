console.log("Extension loaded successfully")

function createAIButton(){
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.display = 'inline-flex';
  container.style.alignItems = 'center';
  container.style.marginRight = '8px';
  
  // Main button
  const button = document.createElement('div');
  button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
  button.innerHTML = 'AI Reply';
  button.setAttribute('role', 'button');
  button.setAttribute('data-tooltip', 'Generate AI Reply');
  button.style.marginRight = '2px';
  button.style.cursor = 'pointer';

  // Subtle dropdown arrow
  const dropdownArrow = document.createElement('span');
  dropdownArrow.innerHTML = '▾';
  dropdownArrow.style.color = '#ffffff';
  dropdownArrow.style.fontSize = '12px';
  dropdownArrow.style.cursor = 'pointer';
  dropdownArrow.style.marginLeft = '2px';
  dropdownArrow.style.opacity = '0.7';
  dropdownArrow.style.transition = 'opacity 0.2s';
  
  dropdownArrow.addEventListener('mouseenter', () => {
    dropdownArrow.style.opacity = '1';
  });
  dropdownArrow.addEventListener('mouseleave', () => {
    dropdownArrow.style.opacity = '0.7';
  });
  
  container.appendChild(button);
  container.appendChild(dropdownArrow);
  
  return { container, button, dropdownArrow };
}

function createToneDropdown() {
  const dropdown = document.createElement('div');
  dropdown.className = 'ai-tone-dropdown';
  dropdown.style.position = 'absolute';
  dropdown.style.backgroundColor = '#ffffff';
  dropdown.style.padding = '12px';
  dropdown.style.border = '1px solid #dadce0';
  dropdown.style.borderRadius = '4px';
  dropdown.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  dropdown.style.zIndex = '1001';
  dropdown.style.display = 'none';
  dropdown.style.top = '100%';
  dropdown.style.left = '0';
  dropdown.style.width = '200px'; // Fixed width instead of min-width
  dropdown.style.boxSizing = 'border-box'; // Ensure padding is included in width

  const label = document.createElement('div');
  label.textContent = 'Custom Tone (optional):';
  label.style.fontSize = '12px';
  label.style.color = '#5f6368';
  label.style.marginBottom = '8px';
  label.style.width = '100%';
  label.style.overflow = 'hidden';
  label.style.textOverflow = 'ellipsis';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'e.g., friendly, formal';
  input.style.width = 'calc(100% - 16px)'; // Account for padding
  input.style.padding = '8px';
  input.style.border = '1px solid #dadce0';
  input.style.borderRadius = '4px';
  input.style.fontSize = '13px';
  input.style.boxSizing = 'border-box'; // Ensure padding is included in width
  
  dropdown.appendChild(label);
  dropdown.appendChild(input);
  
  return { dropdown, input };
}

function findComposeToolbar() {
  const selectors = ['.aDh, .aDj, .gU.Up'];
  for(const selector of selectors){
    const toolbar = document.querySelector(selector);
    if(toolbar) return toolbar;
  }
  return null;
}

function getEmailContent() {
  const selectors = ['.a3s.aiL, .h7'];
  for(const selector of selectors){
    const emailContent = document.querySelector(selector);
    if(emailContent) return emailContent.innerText.trim();
  }
  return '';
}

async function generateReply(tone, button) {
  try {
    const originalText = button.textContent;
    button.textContent = 'Generating...';
    button.disabled = true;

    const emailContent = getEmailContent();
    const response = await fetch('http://localhost:8080/api/email/request', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        content: emailContent,
        tone: tone
      })
    });

    if(!response.ok) throw new Error('API request failed');

    const generated_reply = await response.text();
    const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
    if(composeBox) {
      composeBox.focus();
      document.execCommand('insertText', false, generated_reply);
    }
  } catch(error) {
    console.error(error);
  } finally {
    button.textContent = 'AI Reply';
    button.disabled = false;
  }
}

function injectButton() {
  const existingContainer = document.querySelector('.ai-reply-container');
  if(existingContainer) existingContainer.remove();

  const toolbar = findComposeToolbar();
  if(!toolbar) {
    console.log("Toolbar not found");
    return;
  }

  console.log("Toolbar found, creating AI button");
  
  // Create UI elements
  const { container, button, dropdownArrow } = createAIButton();
  const { dropdown, input } = createToneDropdown();
  container.appendChild(dropdown);
  container.classList.add('ai-reply-container');

  // Track dropdown state
  let isDropdownOpen = false;
  let customTone = '';

  // Main button click - handles both cases
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (isDropdownOpen) {
      // If dropdown is open, use custom tone (or professional if empty)
      const tone = input.value.trim() || 'professional';
      generateReply(tone, button);
    } else {
      // If dropdown is closed, use professional tone
      generateReply('professional', button);
    }
  });

  // Dropdown arrow click - toggle dropdown
  dropdownArrow.addEventListener('click', (e) => {
    e.stopPropagation();
    isDropdownOpen = !isDropdownOpen;
    dropdown.style.display = isDropdownOpen ? 'block' : 'none';
    
    if (isDropdownOpen) {
      setTimeout(() => input.focus(), 10);
    } else {
      // Clear input when dropdown closes
      input.value = '';
    }
  });

  // Close dropdown when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      dropdown.style.display = 'none';
      isDropdownOpen = false;
      input.value = '';
    }
  });

  // Handle Enter key in input
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const tone = input.value.trim() || 'professional';
      generateReply(tone, button);
    }
  });

  // Insert into toolbar
  const sendButtonContainer = toolbar.querySelector('.T-I.J-J5-Ji.aoO');
  if (sendButtonContainer) {
    const buttonContainer = sendButtonContainer.parentElement;
    if (buttonContainer) {
      buttonContainer.insertBefore(container, buttonContainer.firstChild);
    } else {
      toolbar.insertBefore(container, sendButtonContainer);
    }
  } else {
    toolbar.insertBefore(container, toolbar.firstChild);
  }
}

// Mutation observer
const callback = (mutationList) => {
  for(const mutation of mutationList) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(node => 
      node.nodeType === Node.ELEMENT_NODE &&
      (node.matches('.I5, [role="dialog"]') || node.querySelector('.I5, [role="dialog"]'))
    );
    if(hasComposeElements) setTimeout(injectButton, 500);
  }
};
const observer = new MutationObserver(callback);
observer.observe(document.body, {childList: true, subtree: true });