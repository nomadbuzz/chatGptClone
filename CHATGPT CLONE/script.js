const chatInput=document.querySelector("#chat-input");
const sendButton=document.querySelector("#send-btn");
const chatContainer=document.querySelector(".chat-container");
const themeButton=document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText=null;
const API_KEY="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";
const initialHeight= chatInput.scrollHeight;

const loadDataFromLocalstorage = () => {
    const themeColor=localStorage.getItem("theme-color");
   
    document.body.classList.toggle("light-mode", themeColor ==="light_mode");
    themeButton.innerText= document.body.classList.contains("light-mode") ? "dark_mode": "light_mode";
    
    const defaultText=`<div class="default-text">
                            <img src=images/user.jpg alt="user-img">
                            <h1>ChatGPT Clone</h1>
                            <p>Start a conversation and explore the power of AI. <br> Your chat history will be displayed here. </p>
                            </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0,chatContainer.scrollHeight);
}

loadDataFromLocalstorage();

const createElement = (html, className) =>{
    //create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML=html;
    return chatDiv; //return the created chat div
}

const getChatResponse = async (incomingChatDiv) =>{
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const pElement = document.createElement("p");

    const requestOptions = {
        method: "POST", 
        headers:{
            "Content-type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
              {
                "role": "user",
                "content": userText
              },
              
            ]
          })
    }
    try{
        const response = await (await fetch(API_URL, requestOptions)).json();
        console.log(response);
        pElement.textContent= response.choices[0].message.content;
    }catch(error){
        pElement.classList.add("error");
        pElement.textContent="Oops! Something went wrong. Please try again.";
    }
    //remove the typing animation, append the paragraph element and save the chats to local storage.
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
}
const copyResponse = (copyBtn) => {
    
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout (()=>copyBtn.textContent= "content_copy", 1000);
}

const showTypingAnimation =() =>{

    const html=`<div class="chat-content">
    <div class="chat-details">
        <img src=images/chatbot.jpg alt="chatbot-img">
        <div class="typing-animation">
            <div class="typing-dot" style="--delay: 0.2s"></div>
            <div class="typing-dot" style="--delay: 0.3s"></div>
            <div class="typing-dot" style="--delay: 0.4s"></div>
        </div>
    </div>
    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
</div>`;
    //create an outgoing chat div with user's message and append it to chat container
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat=() =>{
    userText=chatInput.value.trim(); //get chatInput value and remove extra spaces;
    if(!userText) return;

    chatInput.value="";
    chatInput.style.height= `${initialHeight}px`;
    const html=`<div class="chat-content">
    <div class="chat-details">
        <img src=images/user.jpg alt="user-img">
        <p>${userText}</p>

    </div>
</div>`;
    //create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent=userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

themeButton.addEventListener("click", ()=>{
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText= document.body.classList.contains("light-mode") ? "dark_mode": "light_mode";
})

deleteButton.addEventListener("click", () => {
    if(confirm("Are you sure you want to delete all the chats?")){
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
})

chatInput.addEventListener("input" , ()=>{
    chatInput.style.height=`${initialHeight}px`
    chatInput.style.height=`${chatInput.scrollHeight}px`
    
});

chatInput.addEventListener("keydown" , (e)=>{
    if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 500){
        e.preventDefault();
        handleOutgoingChat();
    }   
})

sendButton.addEventListener("click",handleOutgoingChat);

