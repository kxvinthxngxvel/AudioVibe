const presetSelect = document.getElementById('presetSelect');
const volumeSlider = document.getElementById('volumeSlider');
const bars = document.querySelectorAll('.bar');

function updateEqualizer(preset) {
  const barHeights = {
    flat: [50, 50, 50, 50, 50],
    bassBoost: [80, 70, 60, 50, 40],
    vocalClarity: [40, 50, 70, 50, 40],
    movieMode: [60, 70, 80, 70, 60]
  };

  barHeights[preset].forEach((height, index) => {
    bars[index].style.height = `${height}px`;
  });
}

presetSelect.addEventListener('change', () => {
  const selectedPreset = presetSelect.value;
  updateEqualizer(selectedPreset);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      filter: { type: selectedPreset },
      volume: volumeSlider.value
    });
  });
});

volumeSlider.addEventListener('input', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { volume: volumeSlider.value });
  });
});

// Initialize on load
updateEqualizer('flat');