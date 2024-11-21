chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.filter || request.volume) {
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(audio);
        const filter = audioContext.createBiquadFilter();
        let gainNode = audioContext.createGain(); // For volume control
  
        // Apply filter settings
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
            source.connect(filter);
            filter.connect(trebleBoost);
            trebleBoost.connect(gainNode);
            break;
          default:
            // Flat response
            break;
        }
  
        // Connect the nodes
        source.connect(filter);
        if (request.filter.type !== 'movieMode') { 
          filter.connect(gainNode);
        }
        gainNode.connect(audioContext.destination);
  
        // Apply volume boost
        gainNode.gain.value = request.volume || 1; 
      });
    }
  });