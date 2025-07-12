// Get references to the form and input elements
// and the recents section in the HTML document
const form = document.querySelector("form");
const inputPrompt = form.querySelector("input");

// Get reference to the section that shows recent images
const recents = document.querySelector('section.recents');

// Create the <ul> for recent images if it doesn't exist
let recentsUL = recents.querySelector('ul');
if (!recentsUL) {
    recentsUL = document.createElement('ul');
    recents.appendChild(recentsUL);
}

// Get reference to the main display area and array to store recent images
// Initialize an empty array to store recent images
const main = document.querySelector('main');
const recentImages = [];

// Listens for form's submission into and generates an image from prompt

form.addEventListener("submit", e => {
    e.preventDefault();
    generateImage(inputPrompt.value);
});

// Function to call backend and generate an image from prompt
function generateImage(prompt){
   if (!prompt.trim()) {
      handleError("Prompt cannot be empty.");
      form.classList.remove('disabled');
      return;
   }

   form.classList.add('disabled');
   main.style.display = 'block';
   main.innerHTML = `<p>Generating Image for <span>${prompt}</span>...</p>`;
   
   // Calls the backend server to generate the image
   // Ensure your backend server is running and accessible at the specified URL
   fetch('http://localhost:3001/generate-image', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
    })
    .then(response => response.json())
    .then(data => { 
        console.log(data); // See how the backend/API responds to command
        if (data.error) {
            handleError(data.error.message || "Unknown error");
            return;
        }
        handleImage(data.data[0].url, prompt);
    })
    .catch(error => handleError(error));
}

// Function to display the generated image and update recents
function handleImage(img, prompt){
    main.style.display = 'block';
    main.innerHTML = 
    `
    <p>${prompt}</p>
    <img src="${img}" alt="Generated Image of ${prompt}">
    `
    inputPrompt.value = '';
    form.classList.remove('disabled');
    handleRecents(img, prompt);
}
// Function to update the recent images section
function handleRecents(image, prompt){
    recents.style.display = 'block';
    recentsUL.innerHTML = '';
    recentImages.reverse();
    recentImages.push({image: image, prompt: prompt});
    recentImages.reverse().forEach(recent => {
        recentsUL.innerHTML += 
        `
        <li>
            <a href="${recent.image}" target="_blank" title="${recent.prompt}">
                <img src="${recent.image}" alt="Generated image for ${recent.prompt}"> 
            </a>
        </li>
        `
    });
}

// Function to displat error messages to the user
function handleError(msg){
    main.style.display = 'block';
    main.innerHTML = `<p class="error">There was an error with your request. <br> <span>${msg}</span></p>`;
    form.classList.remove('disabled');
}