// Initialize EmailJS
(function() {
    emailjs.init("PV9V_fBqnTW_zHvzW");
})();

// YouTube Video Player Manager
const VideoPlayer = {
    players: {},
    
    init: function() {
        // Load YouTube API Script if not already loaded
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    },

    createPlayer: function(videoId, options = {}) {
        return new YT.Player(videoId, {
            events: {
                'onReady': (event) => this.onPlayerReady(event, options),
                'onStateChange': (event) => this.onPlayerStateChange(event, options)
            }
        });
    },

    onPlayerReady: function(event, options) {
        event.target.mute();
        if (options.autoplay) {
            event.target.playVideo();
        }
    },

    onPlayerStateChange: function(event, options) {
        if (event.data === YT.PlayerState.ENDED && options.nextVideoId) {
            const nextPlayer = this.players[options.nextVideoId];
            if (nextPlayer) {
                nextPlayer.unMute();
                nextPlayer.playVideo();
            }
        }
    },

    setupVideoSequence: function() {
        this.players = {
            video1: this.createPlayer('video1', { autoplay: true, nextVideoId: 'video2' }),
            video2: this.createPlayer('video2', { nextVideoId: 'video3' }),
            video3: this.createPlayer('video3', { nextVideoId: 'video1' })
        };
    }
};

// Navigation Handler
const Navigation = {
    init: function() {
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });

        // Add smooth scrolling to all links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    Navigation.init();
    // Video Player
    VideoPlayer.init();

    // Contact Form Handler
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Deaktiviere den Submit-Button während des Sendens
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Wird gesendet...';
        
        // Sammle die Formulardaten
        const formData = {
            from_name: form.name.value,
            from_email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        // Sende die E-Mail mit EmailJS
        emailjs.send('service_gmail', 'template_1dod4q7', formData)
            .then(function() {
                // Erfolgsmeldung
                formStatus.innerHTML = '<div class="alert alert-success">Ihre Nachricht wurde erfolgreich gesendet!</div>';
                form.reset();
            })
            .catch(function(error) {
                // Fehlermeldung
                formStatus.innerHTML = '<div class="alert alert-danger">Es gab einen Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.</div>';
                console.error('EmailJS Error:', error);
            })
            .finally(function() {
                // Aktiviere den Submit-Button wieder
                submitButton.disabled = false;
                submitButton.innerHTML = 'Nachricht senden';
            });
    });
});

// YouTube API callback
function onYouTubeIframeAPIReady() {
    VideoPlayer.setupVideoSequence();
} 