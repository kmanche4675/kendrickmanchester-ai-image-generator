const form = document.querySelector("form");
const inputPrompt = form.querySelector("input");

const recents = document.querySelector('section.recents');

let recentsUL = recents.querySelector('ul');
if (!recentsUL) {
    recentsUL = document.createElement('ul');
    recents.appendChild(recentsUL);
}

const main = document.querySelector('main');
const recentImages = [];

form.addEventListener("submit", e => {
    e.preventDefault();
    generateImage(inputPrompt.value);
});

function generateImage(prompt){
   if (!prompt.trim()) {
      handleError("Prompt cannot be empty.");
      form.classList.remove('disabled');
      return;
   }

   form.classList.add('disabled');
   main.style.display = 'block';
   main.innerHTML = `<p>Generating Image for <span>${prompt}</span>...</p>`;
   
   // Calling the backend API to generate the image
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

function handleError(msg){
    main.style.display = 'block';
    main.innerHTML = `<p class="error">There was an error with your request. <br> <span>${msg}</span></p>`;
    form.classList.remove('disabled');
}