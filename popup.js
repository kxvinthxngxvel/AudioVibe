const presetSelect = document.getElementById('presetSelect');
const volumeSlider = document.getElementById('volumeSlider');
const bars = document.querySelectorAll('.bar');

function updateEqualizer(preset) {
  // Adjust bar heights based on the selected preset (example)
  switch (preset) {
    case 'bassBoost':
      bars[0].style.height = '80px';
      bars[1].style.height = '60px';
      // ... set heights for other bars
      break;
    // ... other presets
    default:
      bars.forEach(bar => bar.style.height = '40px'); // Reset to default
  }
}

presetSelect.addEventListener('change', () => {
  const selectedPreset = presetSelect.value;
  let filterSettings = {};

  switch (selectedPreset) {
    case 'bassBoost':
      filterSettings = { type: 'bassBoost' };
      break;
    case 'vocalClarity':
      filterSettings = { type: 'vocalClarity' };
      break;
    case 'movieMode':
      filterSettings = { type: 'movieMode' };
      break;
    default:
      filterSettings = { type: 'flat' };
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { 
      filter: filterSettings,
      volume: volumeSlider.value 
    });
  });
  updateEqualizer(selectedPreset);
});

volumeSlider.addEventListener('input', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { volume: volumeSlider.value });
  });
});

// Initialize equalizer to the default state
updateEqualizer('flat');