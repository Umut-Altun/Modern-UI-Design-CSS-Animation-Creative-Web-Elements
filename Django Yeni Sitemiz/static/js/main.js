// Sayfa yüklendiğinde çalışacak kodlar
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll için
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobil menü için gerekli kodlar eklenecek
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.classList.add('mobile-menu-button');
    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    const nav = document.querySelector('.nav');
    nav.appendChild(mobileMenuButton);

    mobileMenuButton.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });

    // Scroll animasyonları için
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Animate edilecek elementleri seç
    document.querySelectorAll('.feature-item').forEach(item => {
        observer.observe(item);
    });

    // SSS Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');
            
            // Diğer tüm açık soruları kapat
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Tıklanan soru açık değilse aç
            if (!isActive) {
                question.classList.add('active');
                answer.classList.add('active');
            }
        });
    });

    // Video Player Elements
    const video = document.querySelector('#mainVideo');
    const videoContainer = document.querySelector('.custom-video-player');
    const playPauseBtn = document.querySelector('.play-pause');
    const volumeBtn = document.querySelector('.volume');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeFilled = document.querySelector('.volume-filled');
    const progressBar = document.querySelector('.video-progress');
    const progress = document.querySelector('.progress-filled');
    const currentTime = document.querySelector('.current');
    const duration = document.querySelector('.duration');
    const fullscreenBtn = document.querySelector('.fullscreen');

    // Play/Pause
    function togglePlay() {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // Update Progress Bar
    function updateProgress() {
        const percent = (video.currentTime / video.duration) * 100;
        progress.style.width = `${percent}%`;
        currentTime.textContent = formatTime(video.currentTime);
    }

    // Set Progress Bar
    function setProgress(e) {
        const newTime = e.offsetX / progressBar.offsetWidth;
        progress.style.width = `${newTime * 100}%`;
        video.currentTime = newTime * video.duration;
    }

    // Format time
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Volume
    function handleVolume(e) {
        const volume = e.offsetX / volumeSlider.offsetWidth;
        video.volume = volume;
        volumeFilled.style.width = `${volume * 100}%`;
        
        // Update volume icon
        if (volume === 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume < 0.5) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    // Toggle Mute
    function toggleMute() {
        if (video.volume > 0) {
            video.dataset.volume = video.volume;
            video.volume = 0;
            volumeFilled.style.width = '0';
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            video.volume = video.dataset.volume || 1;
            volumeFilled.style.width = `${video.volume * 100}%`;
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    // Toggle Fullscreen
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    // Event Listeners
    playPauseBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', () => {
        duration.textContent = formatTime(video.duration);
    });
    progressBar.addEventListener('click', setProgress);
    volumeBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('click', handleVolume);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Keyboard Controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        }
    });

    // Back to Top Button Functionality
    const backToTopButton = document.querySelector('.back-to-top');
    
    // Show button when page is scrolled
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Smooth scroll to top when button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
