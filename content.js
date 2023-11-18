chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "check") {
        let resultDiv = document.createElement('div');
        Object.assign(resultDiv.style, {
            id: "img", width: "100%", height: "100%",
            top: "0px", left: "0px", backgroundImage: `url(${request.data})`,
            backgroundSize: "cover", position: "fixed", 
        });

        resultDiv.addEventListener("click", () => {
            document.getElementById('img').remove();
        });

        document.body.appendChild(resultDiv);
        console.log(request.data);
        sendResponse({ confirmation: "Div created successfully" });
    }
});