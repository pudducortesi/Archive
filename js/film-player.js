/* ============================================
   Film Player — Custom HTML5 Video Controls
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('filmPlayer');
    const video = document.getElementById('filmVideo');
    const placeholder = document.getElementById('playerPlaceholder');
    const overlay = document.getElementById('playerOverlay');
    const playBtnOverlay = document.getElementById('playBtnOverlay');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const progressFilled = document.getElementById('progressFilled');
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    if (!player || !video) return;

    const hasSource = video.src && video.src !== window.location.href && video.src !== '';
    const iconPlay = playPauseBtn.querySelector('.icon-play');
    const iconPause = playPauseBtn.querySelector('.icon-pause');
    const iconVol = muteBtn.querySelector('.icon-vol');
    const iconMute = muteBtn.querySelector('.icon-mute');

    // If no video source, show placeholder and hide overlay
    if (!hasSource) {
        placeholder.classList.remove('hidden');
        overlay.classList.add('hidden');
        return;
    }

    // Has source: hide placeholder, show overlay
    placeholder.classList.add('hidden');
    overlay.classList.remove('hidden');

    function formatTime(sec) {
        if (isNaN(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return m + ':' + String(s).padStart(2, '0');
    }

    function updatePlayIcons() {
        if (video.paused) {
            iconPlay.style.display = '';
            iconPause.style.display = 'none';
            overlay.classList.remove('hidden');
        } else {
            iconPlay.style.display = 'none';
            iconPause.style.display = '';
            overlay.classList.add('hidden');
        }
    }

    function togglePlay() {
        if (!hasSource) return;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    // Play/pause
    playBtnOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    playPauseBtn.addEventListener('click', togglePlay);

    video.addEventListener('click', togglePlay);

    video.addEventListener('play', updatePlayIcons);
    video.addEventListener('pause', updatePlayIcons);

    // Time & progress
    video.addEventListener('loadedmetadata', () => {
        durationTimeEl.textContent = formatTime(video.duration);
    });

    video.addEventListener('timeupdate', () => {
        if (video.duration) {
            const pct = (video.currentTime / video.duration) * 100;
            progressFilled.style.width = pct + '%';
            currentTimeEl.textContent = formatTime(video.currentTime);
        }
    });

    video.addEventListener('ended', () => {
        updatePlayIcons();
    });

    // Seek
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        video.currentTime = pct * video.duration;
    });

    // Volume
    volumeSlider.addEventListener('input', () => {
        video.volume = volumeSlider.value;
        video.muted = false;
        updateVolumeIcons();
    });

    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        if (video.muted) {
            volumeSlider.value = 0;
        } else {
            volumeSlider.value = video.volume || 1;
        }
        updateVolumeIcons();
    });

    function updateVolumeIcons() {
        if (video.muted || video.volume === 0) {
            iconVol.style.display = 'none';
            iconMute.style.display = '';
        } else {
            iconVol.style.display = '';
            iconMute.style.display = 'none';
        }
    }

    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (player.requestFullscreen) {
            player.requestFullscreen();
        } else if (player.webkitRequestFullscreen) {
            player.webkitRequestFullscreen();
        } else if (player.msRequestFullscreen) {
            player.msRequestFullscreen();
        }
    });

    // Show controls on touch devices
    let controlsTimeout;
    player.addEventListener('touchstart', () => {
        player.classList.add('controls-visible');
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            if (!video.paused) {
                player.classList.remove('controls-visible');
            }
        }, 3000);
    }, { passive: true });

    // Keyboard shortcuts
    player.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'k') {
            e.preventDefault();
            togglePlay();
        } else if (e.key === 'f') {
            fullscreenBtn.click();
        } else if (e.key === 'm') {
            muteBtn.click();
        } else if (e.key === 'ArrowRight') {
            video.currentTime = Math.min(video.currentTime + 10, video.duration);
        } else if (e.key === 'ArrowLeft') {
            video.currentTime = Math.max(video.currentTime - 10, 0);
        }
    });

    player.setAttribute('tabindex', '0');
});
