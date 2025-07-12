    document.addEventListener('DOMContentLoaded', function() {
      console.log('DOMContentLoaded fired. Script execution started.');

      const loadingScreen = document.getElementById('loadingScreen');
      const loadingBar = document.getElementById('loadingBar');
      const loadingText = document.getElementById('loadingText');
      const loadingAssetText = document.getElementById('loadingAssetText');
      const mainContent = document.getElementById('mainContent');
      const videoBackground = document.querySelector('.video-background');
      const videoElement = document.getElementById('backgroundVideo');
      const loadingLogo = document.getElementById('loadingLogo');

      const loadingMessageDisplayDelay = 700; // milliseconds

      // Define all assets to be loaded and tracked
      const assetsToLoad = [
    { url: 'https://files.catbox.moe/pucbmh.png', type: 'image'}, // Logo and favicon
    { url: 'assets/wallpaper.mp4', type: 'video'}, // Background video
    { url: 'style.css', type: 'css'},
    { url: 'load.js', type: 'js'},
    { url: 'helpers.html', type: 'file'},
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
                          loadingLogo.style.opacity = '1'; // Fade in the actual logo if it's the one being tracked
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
                  document.body.style.overflow = 'auto';
                  mainContent.style.display = 'block';
                  mainContent.style.opacity = '1';
                  videoBackground.style.visibility = 'visible';
                  videoBackground.style.opacity = '1';
                  if (videoElement) {
                      videoElement.play().catch(error => {
                          console.warn('Video autoplay prevented after load:', error);
                      });
                  }
              }, 1000);
          }, loadingMessageDisplayDelay);
      }).catch(error => {
          console.error('An error occurred during asset loading:', error);
          enqueueMessage('Asset loading: <strong>Error occurred!</strong>');
          setTimeout(() => {
              loadingScreen.style.opacity = '0';
              setTimeout(() => {
                  loadingScreen.style.display = 'none';
                  document.body.style.overflow = 'auto';
                  mainContent.style.display = 'block';
                  mainContent.style.opacity = '1';
                  videoBackground.style.visibility = 'visible';
                  videoBackground.style.opacity = '1';
                  if (videoElement) {
                      videoElement.play().catch(error => {
                          console.warn('Video autoplay prevented after load (fallback):', error);
                      });
                  }
              }, 1000);
          }, loadingMessageDisplayDelay);
      });
    });