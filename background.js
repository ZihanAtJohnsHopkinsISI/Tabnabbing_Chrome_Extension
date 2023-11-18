// This extension consider the content change in certain amount of time. 

const dict = {}; // The tab url dict, traverse to corresponding tab
const Threshold = 0.2; // Max threshold, if less than it, it does not trigger alert
let shouldCompare = true; // Check if the picture is changed
let screenshotThread = null;
let comparisonImage = null; 
let mismatchPercentage = 0.0; // How much different in between real and fake page

// Helper functions
const stopThread = () => {
    clearInterval(screenshotThread);
    screenshotThread = null;
};

const removeTabData = (tabId) => {
    delete dict[tabId];
};

// If the page is left more than 1 second and content has change, thus it should be considerd as tabnabbing
const captureTabScreenshot = (activeTab) => {
    screenshotThread = setInterval(() => {
        chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
            if (chrome.runtime.lastError) return;

            if (!dict[activeTab.id]) {
                dict[activeTab.id] = dataUrl;
                console.log(dataUrl);
            } else {
                if (shouldCompare) {
                    performImageComparison(dataUrl, activeTab.id);
                    shouldCompare = false;
                }
                dict[activeTab.id] = dataUrl;
            }
        });
    }, 1000); 
};

const performImageComparison = (dataUrl, id) => {
    resemble(dataUrl).compareTo(dict[id]).onComplete((data) => {
        mismatchPercentage = data.misMatchPercentage;
        comparisonImage = data.getImageDataUrl();
        let iconDetail;

        if (mismatchPercentage > Threshold) {
            chrome.tabs.query({ active: true, currentWindow: true }, () => {
                chrome.tabs.sendMessage(id, { message: "check", data: comparisonImage }, () => {
                    console.log('Threshold exceeded');
                    iconDetail = { tabId: id, path: "image/red_fault.png" };
                    chrome.pageAction.setIcon(iconDetail);
                });
            });
        } else {
            iconDetail = { tabId: id, path: "image/green_check.png" };
            chrome.pageAction.setIcon(iconDetail);
        }

        chrome.pageAction.show(id);
    });
};

// Event listeners
chrome.tabs.onActivated.addListener((activeInfo) => {
    stopThread();
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        shouldCompare = true;
        captureTabScreenshot(tab);
    });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (removeInfo.isWindowClosing) stopThread();
    removeTabData(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && changeInfo.status === "complete") {
        stopThread();
        shouldCompare = false;
        captureTabScreenshot(tab);
    }
});


                                     