// load.js
// This script is now designed to be dynamically loaded AFTER verification.
// It exposes a global function 'startAssetLoading' to initiate the loading process.

/**
 * Initiates the asset loading process and manages the loading screen.
 * This function should be called after the verification process is complete.
 *
 * @param {HTMLElement} mainContent - The main content container of the website.
 * @param {HTMLElement} videoBackground - The video background container.
 * @param {HTMLVideoElement} videoElement - The video element for the background.
 * @param {HTMLElement} loadingScreen - The loading screen element.
 * @param {HTMLImageElement} loadingLogo - The loading logo image element.
 */
function startAssetLoading(mainContent, videoBackground, videoElement, loadingScreen, loadingLogo) {
    console.log('startAssetLoading called. Asset loading process initiated.');
    console.log('Loading screen element:', loadingScreen);

    // Ensure loading screen is visible immediately when this function is called
    loadingScreen.style.display = 'flex';
    loadingScreen.style.visibility = 'visible'; // Explicitly set visibility to visible
    console.log('Loading screen display set to flex, visibility set to visible.');

    // Use a short timeout to allow the display property to apply before transitioning opacity
    setTimeout(() => {
        loadingScreen.style.opacity = '1';
        loadingLogo.style.opacity = '1'; // Fade in the loading logo
        console.log('Loading screen opacity set to 1 after short timeout.');
    }, 10);

    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    const loadingAssetText = document.getElementById('loadingAssetText');

    const loadingMessageDisplayDelay = 700; // milliseconds

    // Define all assets to be loaded and tracked
    const assetsToLoad = [
        { url: 'https://files.catbox.moe/pucbmh.png', type: 'image'}, // Logo and favicon
        { url: 'assets/wallpaper.mp4', type: 'video'}, // Background video
        { url: '.vscode/settings.json', type: 'file'},
        { url: 'assets/weapon.json', type: 'json'},
        { url: 'assets/blueprints/images/9MM PM/CRACKED.jpg', type: 'image'},
        { url: 'assets/blueprints/images/9MM PM/FIRECRACKER.jpg', type: 'image'},
        { url: 'assets/blueprints/images/9MM PM/MAJOR GIFT.jpg', type: 'image'},
        { url: 'assets/blueprints/images/9MM PM/SCRUB.jpg', type: 'image'},
        { url: 'assets/blueprints/images/9MM PM/THRONEBUSTER.jpg', type: 'image'},
        { url: 'assets/blueprints/images/AEK-973/APHELION.jpg', type: 'image'},
        { url: 'assets/blueprints/images/AEK-973/BLOODFANG.jpg', type: 'image'},
        { url: 'assets/blueprints/images/AEK-973/DEFILADE.jpg', type: 'image'},
        { url: 'assets/blueprints/images/AEK-973/GOOD VIBES.jpg', type: 'image'},
        { url: 'assets/blueprints/images/AEK-973/PEEL OUT.jpg', type: 'image'},
        { url: 'style.css', type: 'css'}
    ];

    const messageQueue = [];
    let isProcessingQueue = false;
    let explicitResourcesLoadedCount = 0;
    const totalExplicitResources = assetsToLoad.length;

    function getFileNameFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const path = urlObj.pathname;
            return path.substring(path.lastIndexOf('/') + 1);
        } catch (e) {
            // Fallback for relative paths or invalid URLs
            return url.substring(url.lastIndexOf('/') + 1);
        }
    }

    function enqueueMessage(message) {
        if (message) {
            messageQueue.push(message);
            if (!isProcessingQueue) {
                processMessageQueue();
            }
        }
    }

    function processMessageQueue() {
        if (messageQueue.length > 0) {
            isProcessingQueue = true;
            const message = messageQueue.shift();
            loadingAssetText.innerHTML = message;
            console.log(`Displayed asset loading text: ${message}`);
            setTimeout(() => {
                processMessageQueue();
            }, loadingMessageDisplayDelay);
        } else {
            isProcessingQueue = false;
        }
    }

    function updateProgressBar() {
      const progress = (explicitResourcesLoadedCount / totalExplicitResources) * 100;
      loadingBar.style.width = progress + '%';
      loadingText.textContent = `Fetching ${Math.round(progress)}%`;
      console.log(`Progress: ${Math.round(progress)}%, Current Loaded count: ${explicitResourcesLoadedCount}`);
    }

    function loadAsset(asset) {
        return new Promise(resolve => {
            const fileName = getFileNameFromUrl(asset.url);
            enqueueMessage(`<strong>.. Fetching</strong> - ${fileName}`);

            const markAsLoaded = (status) => {
                explicitResourcesLoadedCount++;
                updateProgressBar();
                enqueueMessage(`${fileName}: <strong>${status}</strong>`);
                resolve();
            };

            if (asset.type === 'image') {
                const img = new Image();
                img.onload = () => {
                    if (asset.url === loadingLogo.src) {
                        // loadingLogo.style.opacity = '1'; // Already handled by startAssetLoading
                    }
                    markAsLoaded('Loaded');
                };
                img.onerror = () => {
                    console.warn(`Failed to load image: ${fileName}`);
                    markAsLoaded('Failed');
                };
                img.src = asset.url;
            } else if (asset.type === 'video') {
                if (videoElement && asset.url.includes('wallpaper.mp4')) {
                    const videoLoadHandler = () => {
                        markAsLoaded('Loaded');
                        videoElement.removeEventListener('canplaythrough', videoLoadHandler);
                        videoElement.removeEventListener('loadeddata', videoLoadHandler);
                        videoElement.removeEventListener('error', videoErrorHandler);
                    };
                    const videoErrorHandler = () => {
                        console.warn(`Failed to load video: ${fileName}`);
                        markAsLoaded('Failed');
                        videoElement.removeEventListener('canplaythrough', videoLoadHandler);
                        videoElement.removeEventListener('loadeddata', videoLoadHandler);
                        videoElement.removeEventListener('error', videoErrorHandler);
                    };

                    videoElement.addEventListener('canplaythrough', videoLoadHandler, { once: true });
                    videoElement.addEventListener('loadeddata', videoLoadHandler, { once: true });
                    videoElement.addEventListener('error', videoErrorHandler, { once: true });

                    if (videoElement.readyState >= 4) { // HAVE_ENOUGH_DATA
                        markAsLoaded('Cached');
                    } else {
                        videoElement.load();
                    }
                } else {
                    // If it's a video but not the background video, or videoElement not found
                    console.warn(`Skipping video asset tracking for: ${fileName} (not background video or element not found)`);
                    markAsLoaded('Skipped'); // Mark as skipped if not the main video or element missing
                }
            } else if (asset.type === 'css' || asset.type === 'js') {
                // For CSS and JS, we assume they are loaded by the browser's parsing
                // or will be fetched. We can try to fetch them to confirm.
                fetch(asset.url)
                    .then(response => {
                        if (response.ok) {
                            markAsLoaded('Parsed/Fetched');
                        } else {
                            console.warn(`Failed to fetch ${asset.type}: ${fileName}`);
                            markAsLoaded('Failed to fetch');
                        }
                    })
                    .catch(error => {
                        console.warn(`Error fetching ${asset.type}: ${fileName}`, error);
                        markAsLoaded('Error');
                    });
            } else if (asset.type === 'font') {
                // For fonts, we can check if they are loaded via the FontFaceSet API
                // This is more robust than just fetching the CSS file.
                // Note: This is a simplified check and might not cover all font loading scenarios.
                document.fonts.ready.then(() => {
                    // This resolves when all fonts are loaded. We can't track individual fonts easily.
                    // So, we'll just mark it as loaded once the document fonts are ready.
                    // This means all font assets will resolve together.
                    markAsLoaded('Loaded');
                }).catch(() => {
                    console.warn(`Font loading issue for: ${fileName}`);
                    markAsLoaded('Failed');
                });
            } else {
                // For other types like JSON, etc., use fetch
                fetch(asset.url)
                    .then(response => {
                        if (response.ok) {
                            markAsLoaded('Loaded');
                        } else {
                            console.warn(`Failed to load asset: ${fileName}`);
                            markAsLoaded('Failed');
                        }
                    })
                    .catch(error => {
                        console.warn(`Error loading asset: ${fileName}`, error);
                        markAsLoaded('Error');
                    });
            }
        });
    }

    function loadAllAssetsSequentially() {
        console.log('loadAllAssetsSequentially function called.');
        let p = Promise.resolve();
        assetsToLoad.forEach(asset => {
            p = p.then(() => loadAsset(asset));
        });
        return p;
    }

    updateProgressBar(); // Initial update

    loadAllAssetsSequentially().then(() => {
        console.log('All assets loaded function completed.');
        enqueueMessage('All assets: <strong>Complete</strong>');
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                // Note: body.style.overflow is handled by index.html's inline script
                mainContent.style.display = 'block';
                mainContent.style.opacity = '1';
                videoBackground.style.visibility = 'visible';
                videoBackground.style.opacity = '1';
                if (videoElement) {
                    videoElement.play().catch(error => {
                        console.warn('Video autoplay prevented after load:', error);
                    });
                }
            }, 1000); // Delay for loading screen fade out
        }, loadingMessageDisplayDelay); // Delay for final message display
    }).catch(error => {
        console.error('An error occurred during asset loading:', error);
        enqueueMessage('Asset loading: <strong>Error occurred!</strong>');
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                // Note: body.style.overflow is handled by index.html's inline script
                mainContent.style.display = 'block';
                mainContent.style.opacity = '1';
                videoBackground.style.visibility = 'visible';
                videoBackground.style.opacity = '1';
                if (videoElement) {
                    videoElement.play().catch(error => {
                        console.warn('Video autoplay prevented after load (fallback):', error);
                    });
                }
            }, 1000); // Delay for loading screen fade out
        }, loadingMessageDisplayDelay); // Delay for final message display
    });
}
