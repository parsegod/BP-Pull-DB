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

      const loadingMessageDisplayDelay = 700; 

      const assetsToLoad = [
    { url: 'https://files.catbox.moe/pucbmh.png', type: 'image'}, 
    { url: 'assets/wallpaper.mp4', type: 'video'}, 
    { url: 'assets/weapon.json', type: 'json'},
    { url: 'package.json', type: 'json'},
    { url: 'vercel.json', type: 'json'},
    { url: 'index.html', type: 'file'},
    { url: 'README.md', type: 'md'},
    { url: 'script.js', type: 'js'},
    { url: 'style.css', type: 'css'},
    { url: 'assets/blueprints/images/9MM PM/CRACKED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/9MM PM/FIRECRACKER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/9MM PM/MAJOR GIFT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/9MM PM/SCRUB.jpg', type: 'image'},
    { url: 'assets/blueprints/images/9MM PM/THRONEBUSTER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AEK-973/APHELION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AEK-973/BLOODFANG.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AEK-973/DEFILADE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AEK-973/GOOD VIBES.jpg', type: 'image'},
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
              enqueueMessage(`<strong>Placing</strong> - ${fileName}..`);

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
                          loadingLogo.style.opacity = '1'; 
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

                      if (videoElement.readyState >= 4) { 
                          markAsLoaded('Cached');
                      } else {
                          videoElement.load();
                      }
                  } else {

                      console.warn(`Skipping video asset tracking for: ${fileName} (not background video or element not found)`);
                      markAsLoaded('Skipped'); 
                  }
              } else if (asset.type === 'css' || asset.type === 'js') {

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

                  document.fonts.ready.then(() => {

                      markAsLoaded('Loaded');
                  }).catch(() => {
                      console.warn(`Font loading issue for: ${fileName}`);
                      markAsLoaded('Failed');
                  });
              } else {

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

      updateProgressBar(); 

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