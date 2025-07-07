const apiKey = "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";
const apiUrl = "https://api.openai.com/v1/images/generations";

const form = document.querySelector("form");
const inputPrompt = form.querySelector("input");

const recents = document.querySelector('section.recents');

// Create the <ul> for recents if it doesn't exist
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
   
   fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            "model": "dall-e-3",
            "prompt": prompt,
            "n": 1,
            "size": "1024x1024",
            "response_format": "url"
        })
    })
    .then(response => response.json())
    .then(data =>{ 
        console.log(data); // This will show the error message from OpenAI in your console
        handleImage(data.data[0].url, prompt)
    })
    .catch(error => handleError(error));
}

function handleImage(img, prompt){
    main.style.display = 'block';
    main.innerHTML = 
    `
    <p>${prompt}</p/>
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
        <a href= "${recent.image}" target="_blank" title="recent.prompt">
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