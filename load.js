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

      const loadingMessageDisplayDelay = 500;

      const assetsToLoad = [
        { id: 'logo_png', url: 'https://files.catbox.moe/pucbmh.png', type: 'image', loaded: false },
        { id: 'wallpaper_mp4_1', url: 'assets/wallpaper.mp4', type: 'video', loaded: false },
        { id: 'wallpaper_mp4_2', url: 'assets/wallpaper.mp4', type: 'video', loaded: false }, 
        { id: 'weapon_json', url: 'assets/weapon.json', type: 'json', loaded: false },
        { id: 'package_json', url: 'package.json', type: 'json', loaded: false },
        { id: 'vercel_json', url: 'vercel.json', type: 'json', loaded: false },
        { id: 'index_html', url: 'index.html', type: 'file', loaded: false },
        { id: 'readme_md', url: 'README.md', type: 'md', loaded: false },
        { id: 'script_js', url: 'script.js', type: 'js', loaded: false },
        { id: 'style_css', url: 'style.css', type: 'css', loaded: false },
        { id: '9mm_cracked_jpg', url: 'assets/blueprints/images/9MM PM/CRACKED.jpg', type: 'image', loaded: false },
        { id: '9mm_firecracker_jpg', url: 'assets/blueprints/images/9MM PM/FIRECRACKER.jpg', type: 'image', loaded: false },
        { id: '9mm_major_gift_jpg', url: 'assets/blueprints/images/9MM PM/MAJOR GIFT.jpg', type: 'image', loaded: false },
        { id: '9mm_scrub_jpg', url: 'assets/blueprints/images/9MM PM/SCRUB.jpg', type: 'image', loaded: false },
        { id: '9mm_thronebuster_jpg', url: 'assets/blueprints/images/9MM PM/THRONEBUSTER.jpg', type: 'image', loaded: false },
        { id: 'aek_aphelion_jpg', url: 'assets/blueprints/images/AEK-973/APHELION.jpg', type: 'image', loaded: false },
        { id: 'aek_bloodfang_jpg', url: 'assets/blueprints/images/AEK-973/BLOODFANG.jpg', type: 'image', loaded: false },
        { id: 'aek_defilade_jpg', url: 'assets/blueprints/images/AEK-973/DEFILADE.jpg', type: 'image', loaded: false },
        { id: 'aek_good_vibes_jpg', url: 'assets/blueprints/images/AEK-973/GOOD VIBES.jpg', type: 'image', loaded: false },

      ];

      const messageQueue = [];
      let isProcessingQueue = false;

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
              loadingAssetText.style.fontFamily = "'Open Sans', sans-serif";
              console.log(`Displayed asset loading text: ${message}`);
              loadingAssetText.style.opacity = 0;
              setTimeout(() => {
                  loadingAssetText.style.opacity = 1;
                  setTimeout(() => {
                      processMessageQueue();
                  }, loadingMessageDisplayDelay);
              }, 50);
          } else {
              isProcessingQueue = false;
          }
      }

      function updateProgressBar() {

        const loadedCount = assetsToLoad.filter(asset => asset.loaded).length;
        const progress = Math.min(100, (loadedCount / totalExplicitResources) * 100);
        const roundedProgress = Math.round(progress);

        loadingText.innerHTML = `LOADING ASSETS: <span class="bold-green-percentage">${roundedProgress}%</span>`;
        loadingText.style.fontFamily = "'Oswald', sans-serif";
        loadingBar.style.width = progress + '%';
        console.log(`Progress: ${roundedProgress}%, Current Loaded count: ${loadedCount}`);
      }

      function loadAsset(asset) {
          return new Promise(resolve => {
              const fileName = getFileNameFromUrl(asset.url);
              enqueueMessage(`<strong>FETCHING:</strong> ${fileName}`);

              const markAsLoaded = (status) => {
                  if (!asset.loaded) { 
                      asset.loaded = true; 
                      updateProgressBar();
                      enqueueMessage(`${fileName}: <strong>${status}</strong>`);
                      resolve(); 
                  } else {

                      resolve();
                  }
              };

              if (asset.type === 'image') {
                  const img = new Image();
                  img.onload = () => markAsLoaded('LOADED');
                  img.onerror = () => {
                      console.warn(`Failed to load image: ${fileName}`);
                      markAsLoaded('FAILED');
                  };
                  img.src = asset.url;
              } else if (asset.type === 'video') {
                  if (videoElement && asset.url.includes('wallpaper.mp4')) {

                      const videoHandler = () => {
                          markAsLoaded('LOADED');

                          videoElement.removeEventListener('canplaythrough', videoHandler);
                          videoElement.removeEventListener('loadeddata', videoHandler);
                          videoElement.removeEventListener('error', videoErrorHandler);
                      };
                      const videoErrorHandler = () => {
                          console.warn(`Failed to load video: ${fileName}`);
                          markAsLoaded('FAILED');

                          videoElement.removeEventListener('canplaythrough', videoHandler);
                          videoElement.removeEventListener('loadeddata', videoHandler);
                          videoElement.removeEventListener('error', videoErrorHandler);
                      };

                      videoElement.addEventListener('canplaythrough', videoHandler, { once: true });
                      videoElement.addEventListener('loadeddata', videoHandler, { once: true });
                      videoElement.addEventListener('error', videoErrorHandler, { once: true });

                      if (videoElement.readyState >= 4) { 
                          markAsLoaded('CACHED');
                      } else {
                          videoElement.load();
                      }
                  } else {
                      console.warn(`Skipping video asset tracking for: ${fileName} (not background video or element not found)`);
                      markAsLoaded('SKIPPED'); 
                  }
              } else if (asset.type === 'css' || asset.type === 'js' || asset.type === 'json' || asset.type === 'file' || asset.type === 'md') {
                  fetch(asset.url)
                      .then(response => {
                          if (response.ok) {
                              markAsLoaded('PARSED/FETCHED');
                          } else {
                              console.warn(`Failed to fetch ${asset.type}: ${fileName}`);
                              markAsLoaded('FAILED TO FETCH');
                          }
                      })
                      .catch(error => {
                          console.warn(`Error fetching ${asset.type}: ${fileName}`, error);
                          markAsLoaded('ERROR');
                      });
              } else if (asset.type === 'font') {
                  document.fonts.ready.then(() => {
                      markAsLoaded('LOADED');
                  }).catch(() => {
                      console.warn(`Font loading issue for: ${fileName}`);
                      markAsLoaded('FAILED');
                  });
              } else {
                  fetch(asset.url)
                      .then(response => {
                          if (response.ok) {
                              markAsLoaded('LOADED');
                          } else {
                              console.warn(`Failed to load asset: ${fileName}`);
                              markAsLoaded('FAILED');
                          }
                      })
                      .catch(error => {
                          console.warn(`Error loading asset: ${fileName}`, error);
                          markAsLoaded('ERROR');
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
          enqueueMessage('ALL ASSETS: <strong>COMPLETE</strong>');

          loadingBar.style.width = '100%';
          loadingText.innerHTML = `LOADING ASSETS: <span class="bold-green-percentage">100%</span>`;

          setTimeout(() => {
              loadingScreen.style.opacity = '0';
              loadingScreen.style.visibility = 'hidden'; 
              setTimeout(() => {
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
          enqueueMessage('ASSET LOADING: <strong>ERROR OCCURRED!</strong>');

          loadingBar.style.width = '100%';
          loadingText.innerHTML = `LOADING ASSETS: <span class="bold-green-percentage">ERROR</span>`; 

          setTimeout(() => {
              loadingScreen.style.opacity = '0';
              loadingScreen.style.visibility = 'hidden'; 
              setTimeout(() => {
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