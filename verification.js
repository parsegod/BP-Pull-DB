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

// Helper function to get user's public IP
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
    // Perform IP blacklist check FIRST, regardless of localStorage
    const userIP = await getUserIP();
    console.log("Initial IP check:", userIP);

    // --- IMPORTANT: This blacklist is for demonstration ONLY. ---
    // A real blacklist should be managed securely on a server.
    const blacklistedIPs = [
        '174.212.224.117',      // Example: Google DNS, just for testing
        '1.2.3.4'               // Example: A hypothetical blacklisted IP
    ];

    if (blacklistedIPs.includes(userIP)) {
        console.warn("IP Blacklisted on initial load:", userIP);
        document.body.classList.add('modal-open'); // Ensure modal is visible
        verificationModal.classList.remove('hidden'); // Ensure modal is visible
        verificationTitle.textContent = 'Access Denied';
        verificationInstruction.textContent = 'Your IP address is blacklisted. You cannot proceed to the site.';
        verificationNote.textContent = 'Please contact support if you believe this is an error.';
        verifyButton.style.display = 'none'; // Hide the button
        verificationSuccessMessage.style.display = 'none'; // Hide success message
        return; // Stop further execution if blacklisted
    }

    // If IP is not blacklisted, then check localStorage
    const isVerified = localStorage.getItem('blubase_verified');
    if (isVerified === 'true') {
        console.log("Already verified via localStorage and not blacklisted. Proceeding to main content.");
        // Directly proceed to success flow if already verified and not blacklisted
        handleVerificationSuccess();
        return; // Exit function, no need to show modal
    }

    // If not verified and not blacklisted, show the modal
    document.body.classList.add('modal-open');
    verificationModal.classList.remove('hidden'); // Ensure modal is visible

    // Reset modal content to initial state
    verificationTitle.textContent = 'Account Verification Required'; // Reset title
    verificationTitle.style.display = 'block';
    verificationInstruction.innerHTML = 'To maintain the integrity of our database and prevent spam entries, we require a quick verification.'; // Reset instruction
    verificationInstruction.style.display = 'block';
    verificationNote.textContent = 'A new tab will open for the verification. If the modal doesn\'t close automatically, please close the verification tab.'; // Reset note
    verificationNote.style.display = 'block';
    verifyButton.style.display = 'inline-block';
    verificationSuccessMessage.style.display = 'none';

    // Re-enable buttons if they were disabled (only verifyButton should be enabled)
    verifyButton.disabled = false;
    verifyButton.textContent = 'Verify Your IP'; // Ensure button text is reset
}

// Function to handle successful verification (manual or auto-closed window)
function handleVerificationSuccess() {
    console.log("Verification success handler called.");

    // Set localStorage item to remember verification
    localStorage.setItem('blubase_verified', 'true');
    console.log("Verification status saved to localStorage.");

    // Visually disable buttons and hide instructions/title
    verifyButton.disabled = true;

    verificationTitle.style.display = 'none';
    verificationInstruction.style.display = 'none';
    verificationNote.style.display = 'none';
    verifyButton.style.display = 'none';

    // Show the success message
    verificationSuccessMessage.style.display = 'block';
    console.log("Success message shown.");

    // Immediately hide verification modal and start loading other scripts
    verificationModal.classList.add('hidden'); // This line should hide the modal
    document.body.classList.remove('modal-open'); // Allow scrolling again
    console.log("Verification modal hidden. Attempting to load load.js");

    // Dynamically load load.js
    const loadJsScript = document.createElement('script');
    loadJsScript.src = 'load.js';
    loadJsScript.onload = () => {
        // Once load.js is loaded, execute its main loading function
        // This assumes load.js has been modified to expose a global function like 'startAssetLoading'
        if (typeof startAssetLoading === 'function') {
            console.log("startAssetLoading function found, calling it.");
            startAssetLoading(mainContent, videoBackground, videoElement, loadingScreen, loadingLogo); // Pass necessary elements
        } else {
            console.error("Error: startAssetLoading function not found in load.js. Ensure load.js exposes its main logic globally.");
            // Fallback: Manually show loading screen if load.js isn't set up correctly
            loadingScreen.style.display = 'flex';
            setTimeout(() => { loadingScreen.style.opacity = '1'; }, 10);
        }

        // Dynamically load script.js after load.js has started its process
        const scriptJsScript = document.createElement('script');
        scriptJsScript.src = 'script.js';
        scriptJsScript.onload = () => {
            // Once script.js is loaded, execute its main data loading and UI setup functions
            if (typeof loadAppData === 'function') {
                loadAppData();
            } else {
                console.error("Error: loadAppData function not found in script.js.");
            }
            if (typeof showChangelogOnPageLoad === 'function') {
                showChangelogOnPageLoad(); // Call this now that script.js is loaded
            } else {
                console.error("Error: showChangelogOnPageLoad function not found in script.js.");
            }
        };
        document.body.appendChild(scriptJsScript);
    };
    document.body.appendChild(loadJsScript);
}

// Event listener for the verify button
verifyButton.addEventListener('click', async () => { // Made async to await getUserIP
    // Visually disable the button immediately
    verifyButton.disabled = true;
    verifyButton.textContent = 'Checking IP...'; // Provide feedback

    // Perform IP blacklist check
    const userIP = await getUserIP(); // Get the user's IP
    console.log("User's IP Address:", userIP);

    // --- IMPORTANT: This blacklist is for demonstration ONLY. ---
    // A real blacklist should be managed securely on a server.
    // Add your blacklisted IPs here
    const blacklistedIPs = [
        '174.212.224.117',      // Example: Google DNS, just for testing
        '1.2.3.4'               // Example: A hypothetical blacklisted IP
    ];

    if (blacklistedIPs.includes(userIP)) {
        console.warn("IP Blacklisted:", userIP);
        // Update modal content to show blacklist message
        verificationTitle.textContent = 'Access Denied';
        verificationInstruction.textContent = 'Your IP address is blacklisted. You cannot proceed to the site.';
        verificationNote.textContent = 'Please contact support if you believe this is an error.';
        verifyButton.style.display = 'none'; // Hide the button
        // Keep the modal open and prevent further action
        return; // Stop further execution
    } else {
        console.log("IP not blacklisted:", userIP);
        // If IP is not blacklisted, proceed with the original verification flow
        // Clear any existing interval if the button is clicked again
        if (window.checkWindowClosedInterval) {
            clearInterval(window.checkWindowClosedInterval);
        }

        try {
            verificationWindow = window.open('https://vdax.rf.gd/', '_blank');
            if (verificationWindow) {
                console.log("Verify button clicked. External verification initiated. Window opened successfully.");
                // If a window was successfully opened, start checking if it's closed
                window.checkWindowClosedInterval = setInterval(() => {
                    if (verificationWindow && verificationWindow.closed) {
                        clearInterval(window.checkWindowClosedInterval);
                        // If the verification window closes, automatically trigger the success flow
                        handleVerificationSuccess();
                    }
                }, 1000); // Check every second
            } else {
                console.warn("Pop-up blocker might be preventing the verification window from opening.");
                // Provide user feedback if pop-up blocker is detected
                verificationTitle.textContent = 'Pop-up Blocker Detected!';
                verificationInstruction.innerHTML = 'Please disable your pop-up blocker and try again, or <a href="https://vdax.rf.gd/" target="_blank" rel="noopener noreferrer" style="color: #7CA0E0; text-decoration: underline;">click here to open the verification page manually</a>.';
                verificationNote.textContent = 'After verifying, please return to this tab and click "Try Again".'; // Clear previous note and add new instruction
                verifyButton.disabled = false; // Re-enable button
                verifyButton.textContent = 'Try Again';
                // Do NOT return here, allow the function to complete so the button can be clicked again
            }
        } catch (e) {
            console.error("Error opening verification window:", e);
            verificationTitle.textContent = 'Verification Error';
            verificationInstruction.textContent = 'An error occurred while trying to open the verification page. Please try again.';
            verificationNote.textContent = '';
            verifyButton.disabled = false;
            verifyButton.textContent = 'Try Again';
            // Do NOT return here, allow the function to complete so the button can be clicked again
        }
    }
});

// Initialize the verification modal immediately on page load
document.addEventListener('DOMContentLoaded', initializeVerificationModal);
