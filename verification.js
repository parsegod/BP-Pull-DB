// verification.js

// Get references to the verification modal and button
const verificationModal = document.getElementById('verificationModal');
const verifyButton = document.getElementById('verifyButton');
const loadingScreen = document.getElementById('loadingScreen');
const mainContent = document.getElementById('mainContent');
const videoBackground = document.querySelector('.video-background');
const videoElement = document.getElementById('backgroundVideo'); // Defined here for load.js access
const loadingLogo = document.getElementById('loadingLogo'); // Reference to the loading logo

// References to verification modal content elements
const verificationTitle = document.getElementById('verificationTitle');
const verificationInstruction = document.getElementById('verificationInstruction');
const verificationNote = document.getElementById('verificationNote');
const verificationSuccessMessage = document.getElementById('verificationSuccessMessage');

let verificationWindow = null; // To store the reference to the opened window

// Define your backend API endpoint URLs
const API_GENERATE_ENDPOINT = 'https://api.blunet.wtf/api/generate-key'; // <--- REPLACE WITH YOUR ACTUAL VERCEL URL
const API_VALIDATE_ENDPOINT = 'https://api.blunet.wtf/api/validate-key'; // <--- REPLACE WITH YOUR ACTUAL VERCEL URL

// UUID validation regex (for client-side format check)
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Helper function to get user's public IP (still useful for logging/display, but not for blacklist logic here)
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Error fetching IP address:", error);
        return 'unknown'; // Return a default or error value
    }
}

// This function initializes the verification modal state.
async function initializeVerificationModal() {
    const userIP = await getUserIP(); // Get IP for potential display/logging

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
                // Update local storage with fresh expiry from backend
                localStorage.setItem('blubase_api_key_expiry', new Date(data.expiry).getTime());
                localStorage.setItem('blubase_api_key_original', data.originalKey || apiKey);
                handleVerificationSuccess(); // Directly proceed to success flow
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
                // Clear potentially invalid key
                localStorage.removeItem('blubase_api_key');
                localStorage.removeItem('blubase_api_key_expiry');
                localStorage.removeItem('blubase_api_key_original');
                return;
            } else {
                console.log(`Existing API key is ${data.status}. Clearing and prompting re-verification.`);
                // Clear invalid key
                localStorage.removeItem('blubase_api_key');
                localStorage.removeItem('blubase_api_key_expiry');
                localStorage.removeItem('blubase_api_key_original');
            }
        } catch (error) {
            console.error("Error validating existing API key with backend:", error);
            // If backend is unreachable, assume key is invalid for now and prompt re-verification
            localStorage.removeItem('blubase_api_key');
            localStorage.removeItem('blubase_api_key_expiry');
            localStorage.removeItem('blubase_api_key_original');
        }
    }

    // If not verified or key is invalid, show the modal
    document.body.classList.add('modal-open');
    verificationModal.classList.remove('hidden');

    // Reset modal content to initial state
    verificationTitle.textContent = 'Account Verification Required';
    verificationTitle.style.display = 'block';
    verificationInstruction.innerHTML = 'To maintain the integrity of our database and prevent spam entries, we require a quick verification.';
    verificationInstruction.style.display = 'block';
    verificationNote.textContent = 'A new tab will open for the verification. If the modal doesn\'t close automatically, please close the verification tab.';
    verificationNote.style.display = 'block';
    verifyButton.style.display = 'inline-block';
    verificationSuccessMessage.style.display = 'none';

    // Re-enable buttons if they were disabled
    verifyButton.disabled = false;
    verifyButton.textContent = 'Verify Your IP';
}

// Function to handle successful verification (manual or auto-closed window)
function handleVerificationSuccess() {
    console.log("Verification success handler called.");

    // Visually disable buttons and hide instructions/title
    verifyButton.disabled = true;

    verificationTitle.style.display = 'none';
    verificationInstruction.style.display = 'none';
    verificationNote.style.display = 'none';
    verifyButton.style.display = 'none';

    // Show the success message
    verificationSuccessMessage.style.display = 'block';
    console.log("Success message shown.");

    // Immediately hide verification modal
    verificationModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    console.log("Verification modal hidden.");

    // Immediately show the loading screen
    loadingScreen.style.display = 'flex';
    loadingScreen.style.visibility = 'visible';
    loadingScreen.style.opacity = '1';
    loadingLogo.style.opacity = '1';
    console.log("Loading screen displayed.");

    // Dynamically load load.js
    const loadJsScript = document.createElement('script');
    loadJsScript.src = 'load.js';
    loadJsScript.onload = () => {
        if (typeof startAssetLoading === 'function') {
            console.log("startAssetLoading function found, calling it.");
            startAssetLoading(mainContent, videoBackground, videoElement, loadingScreen, loadingLogo);
        } else {
            console.error("Error: startAssetLoading function not found in load.js. Ensure load.js exposes its main logic globally.");
            loadingScreen.style.display = 'flex';
            setTimeout(() => { loadingScreen.style.opacity = '1'; }, 10);
        }

        // Dynamically load script.js after load.js has started its process
        const scriptJsScript = document.createElement('script');
        scriptJsScript.src = 'script.js';
        scriptJsScript.onload = () => {
            if (typeof loadAppData === 'function') {
                loadAppData();
            } else {
                console.error("Error: loadAppData function not found in script.js.");
            }
            if (typeof showChangelogOnPageLoad === 'function') {
                showChangelogOnPageLoad();
            } else {
                console.error("Error: showChangelogOnPageLoad function not found in script.js.");
            }
        };
        document.body.appendChild(scriptJsScript);
    };
    document.body.appendChild(loadJsScript);
}

// Event listener for the verify button
verifyButton.addEventListener('click', async () => {
    // Visually disable the button immediately
    verifyButton.disabled = true;
    verifyButton.textContent = 'Checking...';

    // Get user IP for logging/display, but actual blacklist check is server-side
    const userIP = await getUserIP();
    console.log("User's IP Address:", userIP);

    // Clear any existing interval if the button is clicked again
    if (window.checkWindowClosedInterval) {
        clearInterval(window.checkWindowClosedInterval);
    }

    try {
        // Open the external verification page
        verificationWindow = window.open('https://vdax.rf.gd/', '_blank');
        if (verificationWindow) {
            console.log("Verify button clicked. External verification initiated. Window opened successfully.");
            // If a window was successfully opened, start checking if it's closed
            window.checkWindowClosedInterval = setInterval(() => {
                if (verificationWindow && verificationWindow.closed) {
                    clearInterval(window.checkWindowClosedInterval);
                    // If the verification window closes, automatically trigger the API key generation flow
                    console.log("Verification window closed. Proceeding to API key generation.");
                    showApiKeyDurationPopup(); // Show duration selection popup
                }
            }, 1000); // Check every second
        } else {
            console.warn("Pop-up blocker might be preventing the verification window from opening.");
            // Provide user feedback if pop-up blocker is detected
            verificationTitle.textContent = 'Pop-up Blocker Detected!';
            verificationInstruction.innerHTML = 'Please disable your pop-up blocker and try again, or <a href="https://vdax.rf.gd/" target="_blank" rel="noopener noreferrer" style="color: #7CA0E0; text-decoration: underline;">click here to open the verification page manually</a>.';
            verificationNote.textContent = 'After verifying, please return to this tab and click "Try Again".';
            verifyButton.disabled = false; // Re-enable button
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

// Initialize the verification modal immediately on page load
document.addEventListener('DOMContentLoaded', initializeVerificationModal);
