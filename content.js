chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.filter || request.volume !== undefined) {
      // Target the YouTube video player specifically
      const videoElement = document.querySelector('video');
  
      if (videoElement) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
        // Create necessary nodes
        const source = audioContext.createMediaElementSource(videoElement);
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
  
        // Apply preset filters
        if (request.filter) {
          switch (request.filter.type) {
            case 'bassBoost':
              filter.type = 'lowshelf';
              filter.frequency.value = 100;
              filter.gain.value = 10;
              break;
            case 'vocalClarity':
              filter.type = 'bandpass';
              filter.frequency.value = 1000;
              filter.Q.value = 2;
              break;
            case 'movieMode':
              filter.type = 'peaking';
              filter.frequency.value = 100;
              filter.gain.value = 5;
              const trebleBoost = audioContext.createBiquadFilter();
              trebleBoost.type = 'peaking';
              trebleBoost.frequency.value = 5000;
              trebleBoost.gain.value = 5;
  
              // Connect treble boost in the chain
              source.connect(filter);
              filter.connect(trebleBoost);
              trebleBoost.connect(gainNode);
              break;
            default:
              // Flat response, no filtering
              break;
          }
        } else {
          source.connect(gainNode); // If no filter, direct connection
        }
  
        // Set gain value (volume boost)
        if (request.volume !== undefined) {
          gainNode.gain.value = parseFloat(request.volume);
        }
  
        // Connect to destination
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
      }
    }
  });
  