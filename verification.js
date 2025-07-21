const verificationModal = document.getElementById('verificationModal');
const verifyButton = document.getElementById('verifyButton');
const loadingScreen = document.getElementById('loadingScreen');
const mainContent = document.getElementById('mainContent');
const videoBackground = document.querySelector('.video-background');
const videoElement = document.getElementById('backgroundVideo'); 
const loadingLogo = document.getElementById('loadingLogo'); 

const verificationTitle = document.getElementById('verificationTitle');
const verificationInstruction = document.getElementById('verificationInstruction');
const verificationNote = document.getElementById('verificationNote');
const verificationSuccessMessage = document.getElementById('verificationSuccessMessage');

let verificationWindow = null; 

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

async function initializeVerificationModal() {

    const userIP = await getUserIP();
    console.log("Initial IP check:", userIP);

    const blacklistedIPs = [
        '174.212.224.117',      
        '1.2.3.4'               
    ];

    if (blacklistedIPs.includes(userIP)) {
        console.warn("IP Blacklisted on initial load:", userIP);
        document.body.classList.add('modal-open'); 
        verificationModal.classList.remove('hidden'); 
        verificationTitle.textContent = 'Access Denied';
        verificationInstruction.textContent = 'Your IP address is blacklisted. You cannot proceed to the site.';
        verificationNote.textContent = 'Please contact support if you believe this is an error.';
        verifyButton.style.display = 'none'; 
        verificationSuccessMessage.style.display = 'none'; 
        return; 
    }

    const isVerified = localStorage.getItem('blubase_verified');
    if (isVerified === 'true') {
        console.log("Already verified via localStorage and not blacklisted. Proceeding to main content.");

        handleVerificationSuccess();
        return; 
    }

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

function handleVerificationSuccess() {
    console.log("Verification success handler called.");

    localStorage.setItem('blubase_verified', 'true');
    console.log("Verification status saved to localStorage.");

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

    loadingScreen.style.display = 'flex'; 
    loadingScreen.style.visibility = 'visible'; 
    loadingScreen.style.opacity = '1'; 
    loadingLogo.style.opacity = '1'; 
    console.log("Loading screen displayed.");

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

verifyButton.addEventListener('click', async () => { 

    verifyButton.disabled = true;
    verifyButton.textContent = 'Checking IP...'; 

    const userIP = await getUserIP(); 
    console.log("User's IP Address:", userIP);

    const blacklistedIPs = [
        '174.212.224.117',      
        '1.2.3.4'               
    ];

    if (blacklistedIPs.includes(userIP)) {
        console.warn("IP Blacklisted:", userIP);

        verificationTitle.textContent = 'Access Denied';
        verificationInstruction.textContent = 'Your IP address is blacklisted. You cannot proceed to the site.';
        verificationNote.textContent = 'Please contact support if you believe this is an error.';
        verifyButton.style.display = 'none'; 

        return; 
    } else {
        console.log("IP not blacklisted:", userIP);

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

                        handleVerificationSuccess();
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
    }
});

document.addEventListener('DOMContentLoaded', initializeVerificationModal);