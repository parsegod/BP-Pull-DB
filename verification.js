// verification.js

// Define your backend API endpoint URLs
const API_GENERATE_ENDPOINT = 'https://your-vercel-app-name.vercel.app/api/generate-key'; // <--- REPLACE WITH YOUR ACTUAL VERCEL URL
const API_VALIDATE_ENDPOINT = 'https://your-vercel-app-name.vercel.app/api/validate-key'; // <--- REPLACE WITH YOUR ACTUAL VERCEL URL

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get references to DOM elements
const verificationModal = document.getElementById('verificationModal');
const verifyButton = document.getElementById('verifyButton');
const verificationTitle = document.getElementById('verificationTitle');
const verificationInstruction = document.getElementById('verificationInstruction');
const verificationNote = document.getElementById('verificationNote');
const verificationSuccessMessage = document.getElementById('verificationSuccessMessage');
const loadingContainerInModal = document.getElementById('loadingContainerInModal');
const loadingBar = document.getElementById('loadingBar');
const loadingText = document.getElementById('loadingText');
const apiKeyDisplay = document.getElementById('apiKeyDisplay');
const customMessageBox = document.getElementById('customMessageBox');
const clearMessagePopup = document.getElementById('clearMessagePopup');
const apiKeyDurationPopupOverlay = document.getElementById('apiKeyDurationPopupOverlay');
const apiKeyDurationPopupContent = document.getElementById('apiKeyDurationPopupContent');
const confirmDurationButton = document.getElementById('confirmDurationButton');
const customMonthsInput = document.getElementById('customMonthsInput');
const customDaysInput = document.getElementById('customDaysInput');
const customHoursInput = document.getElementById('customHoursInput');
const customMinutesInput = document.getElementById('customMinutesInput');
const customDurationContainer = document.getElementById('customDurationContainer');
const durationRadioButtons = document.querySelectorAll('input[name="apiKeyDuration"]');
const apiKeyPopupOverlay = document.getElementById('apiKeyPopupOverlay');
const popupUserIp = document.getElementById('popupUserIp');
const popupApiKey = document.getElementById('popupApiKey');
const popupApiKeyExpiry = document.getElementById('popupApiKeyExpiry');
const popupApiLoginStatus = document.getElementById('popupApiLoginStatus');
const popupBlacklistStatus = document.getElementById('popupBlacklistStatus');
const popupGenerationLog = document.getElementById('popupGenerationLog');
const apiKeyPopupButton = document.getElementById('apiKeyPopupButton');

let verificationWindow = null;
let generationLogMessages = [];
let capturedUserIP = "N/A";
let selectedApiKeyDurationHours = 2;

// Helper function to get user's public IP
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Error fetching IP address:", error);
        return 'unknown';
    }
}

function setCookie(name, value, ms) {
    const expires = new Date(Date.now() + ms).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

// Initialize the verification modal
async function initializeVerificationModal() {
    const userIP = await getUserIP();

    // Check for existing valid API key via backend
    const apiKey = localStorage.getItem('blubase_api_key');
    if (apiKey) {
        try {
            const response = await fetch(API_VALIDATE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: apiKey })
            });
            const data = await response.json();

            if (data.status === 'valid') {
                console.log("Already verified via backend API key validation. Proceeding to main content.");
                localStorage.setItem('blubase_api_key_expiry', new Date(data.expiry).getTime());
                localStorage.setItem('blubase_api_key_original', data.originalKey || apiKey);
                handleVerificationSuccess();
                return;
            } else if (data.status === 'ip_blocked') {
                console.warn("IP Blacklisted by backend on initial load:", userIP);
                document.body.classList.add('modal-open');
                verificationModal.classList.remove('hidden');
                verificationTitle.textContent = 'Access Denied';
                verificationInstruction.textContent = 'Your IP address is blacklisted. You cannot proceed to the site.';
                verificationNote.textContent = 'Please contact support if you believe this is an error.';
                verifyButton.style.display = 'none';
                verificationSuccessMessage.style.display = 'none';
                localStorage.removeItem('blubase_api_key');
                localStorage.removeItem('blubase_api_key_expiry');
                localStorage.removeItem('blubase_api_key_original');
                return;
            } else {
                console.log(`Existing API key is ${data.status}. Clearing and prompting re-verification.`);
                localStorage.removeItem('blubase_api_key');
                localStorage.removeItem('blubase_api_key_expiry');
                localStorage.removeItem('blubase_api_key_original');
            }
        } catch (error) {
            console.error("Error validating existing API key with backend:", error);
            localStorage.removeItem('blubase_api_key');
            localStorage.removeItem('blubase_api_key_expiry');
            localStorage.removeItem('blubase_api_key_original');
        }
    }

    // Show the modal for verification
    document.body.classList.add('modal-open');
    verificationModal.classList.remove('hidden');
    verificationTitle.textContent = 'Account Verification Required';
    verificationTitle.style.display = 'block';
    verificationInstruction.innerHTML = 'To maintain the integrity of our database and prevent spam entries, we require a quick verification.';
    verificationInstruction.style.display = 'block';
    verificationNote.textContent = 'A new tab will open for the verification. If the modal doesn\'t close automatically, please close the verification tab.';
    verificationNote.style.display = 'block';
    verifyButton.style.display = 'inline-block';
    verificationSuccessMessage.style.display = 'none';
    verifyButton.disabled = false;
    verifyButton.textContent = 'Verify Your IP';
}

// Handle successful verification
function handleVerificationSuccess() {
    console.log("Verification success handler called.");
    verifyButton.disabled = true;
    verificationTitle.style.display = 'none';
    verificationInstruction.style.display = 'none';
    verificationNote.style.display = 'none';
    verifyButton.style.display = 'none';
    verificationSuccessMessage.style.display = 'block';
    console.log("Success message shown.");
    verificationModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    console.log("Verification modal hidden.");

    // Redirect to home
    setTimeout(() => {
        window.location.href = '/home';
    }, 2000);
}

// Show API key duration selection popup
function showApiKeyDurationPopup() {
    if (window.checkWindowClosedInterval) {
        clearInterval(window.checkWindowClosedInterval);
        window.checkWindowClosedInterval = null;
        console.log("Cleared existing checkWindowClosedInterval in showApiKeyDurationPopup.");
    }

    verificationTitle.style.display = 'none';
    verificationInstruction.style.display = 'none';
    verificationNote.style.display = 'none';
    verifyButton.style.display = 'none';
    verificationSuccessMessage.style.display = 'block';
    loadingContainerInModal.style.display = 'none';

    apiKeyDurationPopupOverlay.classList.remove('hidden');
    apiKeyDurationPopupOverlay.classList.add('show');
    customDurationContainer.classList.remove('show');

    customMonthsInput.value = '';
    customDaysInput.value = '';
    customHoursInput.value = '';
    customMinutesInput.value = '';
    document.getElementById('duration2h').checked = true;
}

// API Key generation function
async function simulateApiKeyGeneration(durationHours) {
    generationLogMessages = [];

    loadingContainerInModal.style.display = 'flex';
    loadingContainerInModal.style.opacity = '1';

    let currentProgress = 0;
    const updateProgressBar = (percentage) => {
        currentProgress = percentage;
        loadingBar.style.width = `${percentage}%`;
        loadingText.textContent = `Generating API Key- ${Math.floor(percentage)}%`;
    };

    const addLogMessage = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        const fullMessage = `[${timestamp}] ${message}`;
        generationLogMessages.push(fullMessage);
    };

    let ipBlacklistStatus = "UNKNOWN";
    let apiLoginStatus = "NO PERMISSION";

    addLogMessage("Initiating security checks - ");
    updateProgressBar(5);
    await delay(300);

    const ipCheckStartTime = performance.now();
    addLogMessage("Fetching user IP address - ");
    const userIP = await getUserIP();
    const ipCheckDuration = (performance.now() - ipCheckStartTime).toFixed(2);

    if (userIP) {
        capturedUserIP = userIP;
        addLogMessage(`User IP: ${userIP} (fetched in ${ipCheckDuration}ms) - `);
        updateProgressBar(20);
        await delay(500);
    } else {
        addLogMessage("Failed to retrieve user IP. Proceeding with caution - ");
        capturedUserIP = "N/A - Failed to retrieve";
        updateProgressBar(40);
        await delay(500);
    }
    addLogMessage("Security checks complete - ");
    await delay(300);

    addLogMessage("Beginning API Key generation process - ");
    const generationStartTime = performance.now();
    updateProgressBar(45);
    await delay(300);

    try {
        const response = await fetch(API_GENERATE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ durationHours: durationHours }),
        });

        const data = await response.json();

        if (data.status === 'success') {
            addLogMessage("API Key generated successfully - ");
            updateProgressBar(95);
            await delay(700);

            const newApiKey = data.apiKey;
            const expiryTime = new Date(data.expiry).getTime();
            const expiryDate = new Date(data.expiry);

            localStorage.setItem('blubase_api_key', newApiKey);
            localStorage.setItem('blubase_api_key_expiry', expiryTime.toString());
            localStorage.setItem('blubase_api_key_original', newApiKey);

            addLogMessage(`Generated API Key: ${newApiKey} - `);
            addLogMessage("API key successfully stored in local storage - ");
            apiLoginStatus = "GRANTED";
            ipBlacklistStatus = data.ipBlacklistStatus || "CLEAN";

            updateProgressBar(100);
            loadingText.textContent = 'API Key Generated!';
            addLogMessage('Finalizing and Redirecting - ');
            await delay(500);

            verificationModal.style.display = 'none';

            popupUserIp.textContent = capturedUserIP;
            popupApiKey.textContent = newApiKey;

            const options = {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true,
                timeZoneName: 'short',
                timeZone: 'America/Denver'
            };
            popupApiKeyExpiry.textContent = expiryDate.toLocaleString('en-US', options);

            popupApiLoginStatus.textContent = apiLoginStatus;
            popupApiLoginStatus.className = `status-${apiLoginStatus.toLowerCase().replace(/\s/g, '-')}`;

            popupBlacklistStatus.textContent = ipBlacklistStatus;
            popupBlacklistStatus.className = `status-${ipBlacklistStatus.toLowerCase().replace(/\s/g, '-')}`;

            popupGenerationLog.innerHTML = generationLogMessages.join('<br>');

            apiKeyPopupOverlay.classList.remove('hidden');
            apiKeyPopupOverlay.classList.add('show');

            apiKeyPopupButton.onclick = () => {
                if (window.opener && !window.opener.closed) {
                    window.opener.handleVerificationSuccess();
                    window.close();
                } else {
                    window.location.href = '/home';
                }
            };

        } else if (data.status === 'ip_blocked') {
            addLogMessage(`IP Blacklist Status: BLOCKED! - ${data.message}`);
            ipBlacklistStatus = "BLOCKED";
            apiLoginStatus = "NO PERMISSION";
            updateProgressBar(100);
            loadingText.textContent = 'Access Denied!';
            await delay(500);

            verificationModal.style.display = 'none';

            popupUserIp.textContent = capturedUserIP;
            popupApiKey.textContent = "N/A";
            popupApiKeyExpiry.textContent = "N/A";
            popupApiLoginStatus.textContent = apiLoginStatus;
            popupApiLoginStatus.className = `status-${apiLoginStatus.toLowerCase().replace(/\s/g, '-')}`;
            popupBlacklistStatus.textContent = ipBlacklistStatus;
            popupBlacklistStatus.className = `status-${ipBlacklistStatus.toLowerCase().replace(/\s/g, '-')}`;
            popupGenerationLog.innerHTML = generationLogMessages.join('<br>');

            apiKeyPopupOverlay.classList.remove('hidden');
            apiKeyPopupOverlay.classList.add('show');
            apiKeyPopupButton.textContent = "Go to Blocked Page";
            apiKeyPopupButton.onclick = () => {
                window.location.replace('/blocked');
            };

        } else {
            addLogMessage(`API Key generation failed: ${data.message}`);
            apiLoginStatus = "NO PERMISSION";
            ipBlacklistStatus = data.ipBlacklistStatus || "UNKNOWN";
            updateProgressBar(100);
            loadingText.textContent = 'Generation Failed!';
            await delay(500);

            verificationModal.style.display = 'none';

            popupUserIp.textContent = capturedUserIP;
            popupApiKey.textContent = "N/A";
            popupApiKeyExpiry.textContent = "N/A";
            popupApiLoginStatus.textContent = apiLoginStatus;
            popupApiLoginStatus.className = `status-${apiLoginStatus.toLowerCase().replace(/\s/g, '-')}`;
            popupBlacklistStatus.textContent = ipBlacklistStatus;
            popupBlacklistStatus.className = `status-${ipBlacklistStatus.toLowerCase().replace(/\s/g, '-')}`;
            popupGenerationLog.innerHTML = generationLogMessages.join('<br>');

            apiKeyPopupOverlay.classList.remove('hidden');
            apiKeyPopupOverlay.classList.add('show');
            apiKeyPopupButton.textContent = "Try Again";
            apiKeyPopupButton.onclick = () => {
                window.location.reload();
            };
        }

    } catch (error) {
        console.error("Error calling API key generation endpoint:", error);
        addLogMessage(`Network Error: Could not connect to server. ${error.message}`);
        apiLoginStatus = "NO PERMISSION";
        ipBlacklistStatus = "UNKNOWN";
        updateProgressBar(100);
        loadingText.textContent = 'Network Error!';
        await delay(500);

        verificationModal.style.display = 'none';

        popupUserIp.textContent = capturedUserIP;
        popupApiKey.textContent = "N/A";
        popupApiKeyExpiry.textContent = "N/A";
        popupApiLoginStatus.textContent = apiLoginStatus;
        popupApiLoginStatus.className = `status-${apiLoginStatus.toLowerCase().replace(/\s/g, '-')}`;
        popupBlacklistStatus.textContent = ipBlacklistStatus;
        popupBlacklistStatus.className = `status-${ipBlacklistStatus.toLowerCase().replace(/\s/g, '-')}`;
        popupGenerationLog.innerHTML = generationLogMessages.join('<br>');

        apiKeyPopupOverlay.classList.remove('hidden');
        apiKeyPopupOverlay.classList.add('show');
        apiKeyPopupButton.textContent = "Try Again";
        apiKeyPopupButton.onclick = () => {
            window.location.reload();
        };
    }
}

// Event listeners
verifyButton.addEventListener('click', async () => {
    verifyButton.disabled = true;
    verifyButton.textContent = 'Checking...';

    const userIP = await getUserIP();
    console.log("User's IP Address:", userIP);

    if (window.checkWindowClosedInterval) {
        clearInterval(window.checkWindowClosedInterval);
    }

    try {
        verificationWindow = window.open('https://vdax.rf.gd/', '_blank');
        if (verificationWindow) {
            console.log("Verify button clicked. External verification initiated. Window opened successfully.");
            window.checkWindowClosedInterval = setInterval(() => {
                if (verificationWindow && verificationWindow.closed) {
                    clearInterval(window.checkWindowClosedInterval);
                    console.log("Verification window closed. Proceeding to API key generation.");
                    showApiKeyDurationPopup();
                }
            }, 1000);
        } else {
            console.warn("Pop-up blocker might be preventing the verification window from opening.");
            verificationTitle.textContent = 'Pop-up Blocker Detected!';
            verificationInstruction.innerHTML = 'Please disable your pop-up blocker and try again, or <a href="https://vdax.rf.gd/" target="_blank" rel="noopener noreferrer" style="color: #7CA0E0; text-decoration: underline;">click here to open the verification page manually</a>.';
            verificationNote.textContent = 'After verifying, please return to this tab and click "Try Again".';
            verifyButton.disabled = false;
            verifyButton.textContent = 'Try Again';
        }
    } catch (e) {
        console.error("Error opening verification window:", e);
        verificationTitle.textContent = 'Verification Error';
        verificationInstruction.textContent = 'An error occurred while trying to open the verification page. Please try again.';
        verificationNote.textContent = '';
        verifyButton.disabled = false;
        verifyButton.textContent = 'Try Again';
    }
});

// Duration radio button event listeners
durationRadioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === 'custom') {
            customDurationContainer.classList.add('show');
            customMonthsInput.focus();
        } else {
            customDurationContainer.classList.remove('show');
        }
    });
});

// Confirm duration button event listener
confirmDurationButton.addEventListener('click', () => {
    const selectedDurationRadio = document.querySelector('input[name="apiKeyDuration"]:checked');
    let totalDurationHours = 0;

    if (selectedDurationRadio) {
        if (selectedDurationRadio.value === 'custom') {
            const months = parseInt(customMonthsInput.value) || 0;
            const days = parseInt(customDaysInput.value) || 0;
            const hours = parseInt(customHoursInput.value) || 0;
            const minutes = parseInt(customMinutesInput.value) || 0;

            totalDurationHours = (months * 30 * 24) + (days * 24) + hours + (minutes / 60);

            if (totalDurationHours <= 0 || totalDurationHours > (365 * 5 * 24)) {
                customMessageBox.textContent = "Please enter a valid custom duration (max 5 years).";
                customMessageBox.style.display = 'block';
                setTimeout(() => {
                    customMessageBox.style.display = 'none';
                }, 4000);
                return;
            }
        } else {
            totalDurationHours = parseInt(selectedDurationRadio.value);
        }
    }

    selectedApiKeyDurationHours = totalDurationHours;
    apiKeyDurationPopupOverlay.classList.add('hidden');
    apiKeyDurationPopupOverlay.classList.remove('show');
    simulateApiKeyGeneration(selectedApiKeyDurationHours);
});

// Initialize the verification modal on page load
document.addEventListener('DOMContentLoaded', initializeVerificationModal);

// Make functions globally accessible
window.handleVerificationSuccess = handleVerificationSuccess;
window.showApiKeyDurationPopup = showApiKeyDurationPopup;
window.getUserIP = getUserIP;

// Auto-play video if available
const backgroundVideo = document.getElementById('backgroundVideo');
if (backgroundVideo) {
    const videoSource = backgroundVideo.querySelector('source');
    if (videoSource && videoSource.src.includes('assets/wallpaper.mp4')) {
        backgroundVideo.load();
        backgroundVideo.play().catch(error => {
            console.warn("Video autoplay failed:", error);
        });
    } else {
        console.warn("Video source not found or not 'assets/wallpaper.mp4'. Autoplay skipped.");
    }
}

// Handle window focus events to check if verification window was closed
window.addEventListener('focus', () => {
    if (verificationWindow && verificationWindow.closed && window.checkWindowClosedInterval) {
        clearInterval(window.checkWindowClosedInterval);
        console.log("Main window focused and verification window is closed. Proceeding to API key generation.");
        showApiKeyDurationPopup();
    }
});

// Handle beforeunload to clean up intervals
window.addEventListener('beforeunload', () => {
    if (window.checkWindowClosedInterval) {
        clearInterval(window.checkWindowClosedInterval);
    }
    if (verificationWindow && !verificationWindow.closed) {
        verificationWindow.close();
    }
});

// Handle escape key to close popups
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (!apiKeyDurationPopupOverlay.classList.contains('hidden')) {
            apiKeyDurationPopupOverlay.classList.add('hidden');
            apiKeyDurationPopupOverlay.classList.remove('show');
        }
        if (!apiKeyPopupOverlay.classList.contains('hidden')) {
            apiKeyPopupOverlay.classList.add('hidden');
            apiKeyPopupOverlay.classList.remove('show');
        }
        if (customMessageBox.style.display === 'block') {
            customMessageBox.style.display = 'none';
        }
        if (clearMessagePopup.style.display === 'block') {
            clearMessagePopup.style.display = 'none';
        }
    }
});

// Handle clicks outside popups to close them
apiKeyDurationPopupOverlay.addEventListener('click', (event) => {
    if (event.target === apiKeyDurationPopupOverlay) {
        apiKeyDurationPopupOverlay.classList.add('hidden');
        apiKeyDurationPopupOverlay.classList.remove('show');
    }
});

apiKeyPopupOverlay.addEventListener('click', (event) => {
    if (event.target === apiKeyPopupOverlay) {
        // Don't allow closing the final result popup by clicking outside
        // User must click the button to proceed
    }
});

// Utility function to validate custom duration inputs
function validateCustomDurationInputs() {
    const months = parseInt(customMonthsInput.value) || 0;
    const days = parseInt(customDaysInput.value) || 0;
    const hours = parseInt(customHoursInput.value) || 0;
    const minutes = parseInt(customMinutesInput.value) || 0;

    // Ensure values are within reasonable bounds
    if (months > 60) customMonthsInput.value = 60;
    if (days > 30) customDaysInput.value = 30;
    if (hours > 23) customHoursInput.value = 23;
    if (minutes > 59) customMinutesInput.value = 59;

    // Ensure no negative values
    if (months < 0) customMonthsInput.value = 0;
    if (days < 0) customDaysInput.value = 0;
    if (hours < 0) customHoursInput.value = 0;
    if (minutes < 0) customMinutesInput.value = 0;
}

// Add input validation to custom duration inputs
customMonthsInput.addEventListener('input', validateCustomDurationInputs);
customDaysInput.addEventListener('input', validateCustomDurationInputs);
customHoursInput.addEventListener('input', validateCustomDurationInputs);
customMinutesInput.addEventListener('input', validateCustomDurationInputs);

// Add enter key support for custom duration inputs
[customMonthsInput, customDaysInput, customHoursInput, customMinutesInput].forEach(input => {
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            confirmDurationButton.click();
        }
    });
});

// Debug logging for development
console.log('Verification system initialized');
console.log('API Generate Endpoint:', API_GENERATE_ENDPOINT);
console.log('API Validate Endpoint:', API_VALIDATE_ENDPOINT);

// Export functions for potential use by other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeVerificationModal,
        handleVerificationSuccess,
        showApiKeyDurationPopup,
        simulateApiKeyGeneration,
        getUserIP
    };
}

