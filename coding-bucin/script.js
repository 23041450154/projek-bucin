// Happy Birthday site for Shara — by Naufal
// Vanilla JS; accessibility and gentle animations

(function () {
	'use strict';

	// ---------- Helpers ----------
	const $ = (sel, root = document) => root.querySelector(sel);
	const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

	const pad2 = (n) => String(n).padStart(2, '0');

	// Fallback SVG placeholder for missing images
	const placeholderDataURI = (text = 'Shara') => {
		const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>
			<defs>
				<linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
					<stop offset='0%' stop-color='#ffe0ef'/>
					<stop offset='100%' stop-color='#e6f4ff'/>
				</linearGradient>
			</defs>
			<rect width='100%' height='100%' fill='url(#g)'/>
			<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='56' font-family='Poppins, Arial' fill='#c0568b'>${text}</text>
		</svg>`;
		return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
	};

	// LocalStorage util
	const store = {
		get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
		set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
	};

	// ---------- Elements ----------
	const loginSection = $('#loginSection');
	const loginForm = $('#loginForm');
	const loginError = $('#loginError');
	const usernameEl = $('#username');
	const passwordEl = $('#password');
	const dashboard = $('#dashboard');

	const themeToggle = $('#themeToggle');
	const htmlEl = document.documentElement;

	const bgm = $('#bgm');
	const playPauseBtn = $('#playPauseBtn');
	const volumeSlider = $('#volume');
	const audioTime = $('#audioTime');

	const dd = $('#dd'), hh = $('#hh'), mm = $('#mm'), ss = $('#ss');
	const birthdayNote = $('#birthdayNote');

	const photoGrid = $('#photoGrid');
	const lightbox = $('#lightbox');
	const lightboxImg = $('#lightboxImg');
	const modalClose = $('#modalClose');
	const prevImgBtn = $('#prevImg');
	const nextImgBtn = $('#nextImg');
	const slideshowBtn = $('#slideshowBtn');
	const currentPhotoEl = $('#currentPhoto');
	const totalPhotosEl = $('#totalPhotos');
	const photoCaptionModal = $('#photoCaptionModal');
	const heartAnimation = $('#heartAnimation');
	const scratchCanvas = $('#scratchCanvas');

	const typewriterEl = $('#typewriter');
	const restartLetterBtn = $('#restartLetter');
	const replyWhatsAppBtn = $('#replyWhatsApp');

	const celebrateBtn = $('#celebrateBtn');
	const confettiCanvas = $('#confettiCanvas');

	// ---------- Theme Toggle ----------
	(function initTheme() {
		const pref = store.get('theme', 'light');
		htmlEl.setAttribute('data-theme', pref);
		themeToggle?.addEventListener('click', () => {
			const next = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
			htmlEl.setAttribute('data-theme', next);
			store.set('theme', next);
		});
	})();

	// ---------- Login Logic ----------
	const VALID_USER = 'shara';
	const VALID_PASS = '28-10-2004'; // Date format DD-MM-YYYY

	// Page elements
	const page1 = $('#page1');
	const page2 = $('#page2');
	const page3 = $('#page3');
	const goToGalleryBtn = $('#goToGallery');
	const backToMainBtn = $('#backToMain');
	const backFromLetterBtn = $('#backFromLetter');

  function showDashboard() {
    loginSection.classList.add('hidden');
    dashboard.classList.remove('hidden');
    // Fire confetti once on login
    startConfetti(2200);
    // Auto-play music after successful login
    if (bgm && bgm.paused) {
      bgm.play().then(() => {
        setPlayingUI(true);
        cancelAnimationFrame(rafId);
        updateAudioTime();
      }).catch(err => {
        console.warn('Autoplay blocked by browser:', err);
        // Browser might block autoplay, user can click play button manually
      });
    }
    // Focus main hero button for accessibility
    playPauseBtn?.focus({ preventScroll: false });
  }

  function showLogin() {
    dashboard.classList.add('hidden');
    loginSection.classList.remove('hidden');
    usernameEl.focus();
  }

  // Always start with login (no persistent session)
  showLogin();

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = usernameEl.value.trim().toLowerCase();
    const p = passwordEl.value.trim();
    if (u === VALID_USER && p === VALID_PASS) {
      loginError.hidden = true;
      showDashboard();
    } else {
      loginError.hidden = false;
    }
  });

	// ---------- Page Navigation ----------
	function showPage(pageNumber) {
		// Remove active from all pages
		page1?.classList.remove('active');
		page2?.classList.remove('active');
		page3?.classList.remove('active');
		
		// Add active to target page
		if (pageNumber === 1) {
			page1?.classList.add('active');
		} else if (pageNumber === 2) {
			page2?.classList.add('active');
		} else if (pageNumber === 3) {
			page3?.classList.add('active');
		}
		
		// Scroll to top smoothly
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	goToGalleryBtn?.addEventListener('click', () => showPage(2));
	backToMainBtn?.addEventListener('click', () => showPage(1));
	backFromLetterBtn?.addEventListener('click', () => showPage(2));

	// ---------- Audio Controls ----------
	let audioReady = false;
	let rafId;

	function formatTime(t) {
		const m = Math.floor(t / 60);
		const s = Math.floor(t % 60);
		return `${pad2(m)}:${pad2(s)}`;
	}

	function updateAudioTime() {
		if (!bgm?.duration) return;
		audioTime.textContent = `${formatTime(bgm.currentTime)} / ${formatTime(bgm.duration)}`;
		rafId = requestAnimationFrame(updateAudioTime);
	}

	function setPlayingUI(playing) {
		playPauseBtn.setAttribute('aria-pressed', String(playing));
		playPauseBtn.textContent = playing ? '⏸️ Jeda Musik' : '▶️ Putar Musik';
	}

	playPauseBtn?.addEventListener('click', async () => {
		try {
			if (bgm.paused) {
				await bgm.play();
				setPlayingUI(true);
				cancelAnimationFrame(rafId);
				updateAudioTime();
			} else {
				bgm.pause();
				setPlayingUI(false);
				cancelAnimationFrame(rafId);
				updateAudioTime();
			}
		} catch (err) {
			console.warn('Audio play failed:', err);
			audioTime.textContent = 'Klik izinkan untuk memutar audio 🎵';
		}
	});

	volumeSlider?.addEventListener('input', () => {
		bgm.volume = Number(volumeSlider.value);
	});

	bgm?.addEventListener('loadedmetadata', () => {
		audioReady = true;
		audioTime.textContent = `00:00 / ${formatTime(bgm.duration)}`;
	});

	bgm?.addEventListener('ended', () => {
		setPlayingUI(false);
		cancelAnimationFrame(rafId);
	});

	// ---------- Countup (since 28 Oct 00:00 WIB) ----------
	// WIB = UTC+7, Jakarta no DST
	function nowWIBms() {
		const now = new Date();
		const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
		return utcMs + 7 * 3600000; // WIB
	}

	function getThisBirthdayWIBms() {
		const nowWIB = new Date(nowWIBms());
		const year = nowWIB.getFullYear();
		// 28 Oct 00:00 WIB is 27 Oct 17:00 UTC
		const birthdayThisYearUTC = Date.UTC(year, 9, 27, 17, 0, 0, 0);
		return birthdayThisYearUTC; // UTC ms of birthday this year
	}

	function isTodayBirthdayWIB() {
		const ms = nowWIBms();
		const d = new Date(ms);
		return d.getMonth() === 9 && d.getDate() === 28; // October=9
	}

	function updateCountdown() {
		if (isTodayBirthdayWIB()) {
			birthdayNote.textContent = 'Hari ini harimu! Selamat ulang tahun ke-21, cintaku 💝';
		} else {
			birthdayNote.textContent = '';
		}

		const nowMs = Date.now(); // compare in UTC epoch
		const birthdayUTC = getThisBirthdayWIBms();
		// Hitung berapa lama SEJAK ulang tahun (countup, bukan countdown)
		let diff = Math.max(0, nowMs - birthdayUTC);
		const d = Math.floor(diff / 86400000); diff -= d * 86400000;
		const h = Math.floor(diff / 3600000); diff -= h * 3600000;
		const m = Math.floor(diff / 60000); diff -= m * 60000;
		const s = Math.floor(diff / 1000);
		dd.textContent = pad2(d);
		hh.textContent = pad2(h);
		mm.textContent = pad2(m);
		ss.textContent = pad2(s);
	}
	setInterval(updateCountdown, 1000);
	updateCountdown();

	// ---------- Gallery, Modal, Slideshow with Swipe ----------
	// Foto dari folder assets/photos
	const photos = [
		// { src: 'assets/photos/foto-1.jpg', caption: 'Momen Spesial #1 💕' },
		{ src: 'assets/photos/foto-2.jpg', caption: 'Kenangan Manis 💖' },
		{ src: 'assets/photos/foto-3.jpg', caption: 'Senyum Indahmu ✨' },
		{ src: 'assets/photos/foto-4.jpg', caption: 'Bersama Selamanya 💞' },
		{ src: 'assets/photos/foto-5.jpg', caption: 'Hari yang Indah 🌸' },
		{ src: 'assets/photos/foto-6.jpg', caption: 'Cinta Kita 💗' },
		{ src: 'assets/photos/foto-7.jpg', caption: 'Tawa Bahagia 😊' },
		{ src: 'assets/photos/foto-8.jpg', caption: 'Moment Berharga 💫' },
		{ src: 'assets/photos/foto-9.jpg', caption: 'Kebersamaan Kita 🥰' },
		{ src: 'assets/photos/foto-10.jpg', caption: 'Pelukan Hangat 🤗' },
		{ src: 'assets/photos/foto-11.jpg', caption: 'Cerita Kita 📖' },
		{ src: 'assets/photos/foto-12.jpg', caption: 'Bahagia Bersamamu 💕' },
		{ src: 'assets/photos/foto-13.jpg', caption: 'Saat Terindah 🌟' },
		{ src: 'assets/photos/foto-14.jpg', caption: 'Canda Tawa 😄' },
		{ src: 'assets/photos/foto-15.jpg', caption: 'Romansa Kita 💝' },
		{ src: 'assets/photos/foto-16.jpg', caption: 'Petualangan Bersama 🌈' },
		{ src: 'assets/photos/foto-17.jpg', caption: 'Sore yang Hangat 🌅' },
		{ src: 'assets/photos/foto-18.jpg', caption: 'Kenangan Abadi 💓' },
		{ src: 'assets/photos/foto-19.jpg', caption: 'Cinta Sejati 💖' }
	];
	let currentIndex = 0;
	let slideshowTimer = null;
	let lastFocusedBeforeModal = null;

	// Track revealed photos for love letter unlock
	let revealedPhotosCount = 0;
	
	// Performance optimization: track loaded images
	let loadedImagesCount = 0;

	// Swipe functionality
	let touchStartX = 0;
	let touchEndX = 0;
	let isDragging = false;

	function renderGallery() {
		const frag = document.createDocumentFragment();
		photos.forEach((p, idx) => {
			const fig = document.createElement('figure');
			fig.setAttribute('role', 'listitem');
			fig.classList.add('photo-card');
			fig.dataset.revealed = 'false';
			
			// Create wrapper for scratch effect
			const wrapper = document.createElement('div');
			wrapper.classList.add('photo-wrapper');
			
			// Image - HIDDEN by default, akan dimuat saat dibuka
			const img = document.createElement('img');
			img.dataset.src = p.src; // Simpan URL di data attribute
			img.alt = `Foto ${idx + 1} dari Shara`;
			img.loading = 'lazy';
			img.style.opacity = '0'; // Hidden sampai revealed
			img.style.transition = 'opacity 0.5s ease';
			
			img.onerror = () => { img.src = placeholderDataURI('Foto'); };
			
			// Scratch canvas overlay - ini yang terlihat
			const canvas = document.createElement('canvas');
			canvas.classList.add('scratch-card-overlay');
			canvas.dataset.index = idx;
			
			// Optimized click handler with debounce
			let isRevealing = false;
			const revealHandler = () => {
				if (!isRevealing) {
					isRevealing = true;
					revealPhoto(fig, canvas, idx);
				}
			};
			
			fig.addEventListener('click', revealHandler, { passive: true });
			fig.tabIndex = 0;
			fig.addEventListener('keydown', (e) => { 
				if (e.key === 'Enter' || e.key === ' ') { 
					e.preventDefault(); 
					revealHandler();
				} 
			});
			
			wrapper.appendChild(img);
			wrapper.appendChild(canvas);
			
			fig.appendChild(wrapper);
			frag.appendChild(fig);
			
			// Initialize canvas overlay IMMEDIATELY (tanpa load gambar dulu)
			// Canvas size menggunakan aspect ratio 1:1
			const initCanvas = () => {
				const rect = wrapper.getBoundingClientRect();
				if (rect.width > 0) {
					initCardScratchNoImage(canvas, rect.width, rect.width);
				} else {
					// Retry if dimensions not ready
					setTimeout(initCanvas, 50);
				}
			};
			
			// Initialize canvas saat card masuk viewport
			if ('IntersectionObserver' in window) {
				const observer = new IntersectionObserver((entries) => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							initCanvas();
							observer.unobserve(entry.target);
						}
					});
				}, { rootMargin: '50px' });
				observer.observe(fig);
			} else {
				// Fallback for older browsers
				initCanvas();
			}
		});
		photoGrid.appendChild(frag);
		if (totalPhotosEl) totalPhotosEl.textContent = photos.length;
	}

	// ---------- Scratch Card Overlay (Tanpa Load Gambar) - SUPER FAST ----------
	function initCardScratchNoImage(canvas, width, height) {
		// Use lower resolution for better performance
		const scale = window.devicePixelRatio > 1 ? 1.5 : 1;
		canvas.width = width * scale;
		canvas.height = height * scale;
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		
		const ctx = canvas.getContext('2d', { 
			alpha: true,
			desynchronized: true
		});
		
		// Scale context
		ctx.scale(scale, scale);
		
		// Create gradient overlay
		const gradient = ctx.createLinearGradient(0, 0, width, height);
		gradient.addColorStop(0, '#ff9ecd');
		gradient.addColorStop(0.3, '#ffc1e0');
		gradient.addColorStop(0.6, '#e6b3ff');
		gradient.addColorStop(1, '#d4a5ff');
		
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);
		
		// Add decorative elements
		const baseFontSize = Math.min(width / 8, 32);
		const smallFontSize = Math.min(width / 12, 16);
		
		// Add sparkles
		if (width > 120) {
			ctx.fillStyle = '#fff';
			ctx.font = `${smallFontSize}px Arial`;
			const sparkles = ['✨', '⭐', '💫', '✨'];
			sparkles.forEach((spark, i) => {
				const x = (width / 5) * (i + 0.5);
				const y = smallFontSize + 5;
				ctx.fillText(spark, x, y);
				ctx.fillText(spark, x, height - 8);
			});
		}
		
		// Add text
		ctx.fillStyle = '#ff1493';
		ctx.font = `bold ${baseFontSize}px Poppins, Arial`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
		ctx.shadowBlur = 8;
		ctx.fillText('🎁 Foto 🎁', width / 2, height / 2 - baseFontSize / 4);
		
		if (width > 140) {
			ctx.shadowBlur = 0;
			ctx.font = `${smallFontSize}px Poppins, Arial`;
			ctx.fillStyle = '#c0568b';
			ctx.fillText('Klik buka!', width / 2, height / 2 + baseFontSize / 2);
			
			const emojiSize = Math.min(width / 10, 20);
			ctx.font = `${emojiSize}px Arial`;
			ctx.fillText('✨💕✨', width / 2, height / 2 + baseFontSize);
		}
	}

	// ---------- OLD function kept for compatibility ----------
	function initCardScratch(canvas, img) {
		const rect = img.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) {
			setTimeout(() => initCardScratch(canvas, img), 100);
			return;
		}
		initCardScratchNoImage(canvas, rect.width, rect.height);
	}

	// ---------- Reveal Photo (Load image saat dibuka) ----------
	function revealPhoto(figElement, canvas, photoIndex) {
		// Prevent multiple clicks
		if (figElement.dataset.revealed === 'true') return;
		figElement.dataset.revealed = 'true';
		
		const wrapper = figElement.querySelector('.photo-wrapper');
		const img = wrapper.querySelector('img');
		
		// Load image NOW (saat dibuka) - fade in effect
		if (!img.src || img.src === '') {
			img.src = img.dataset.src;
		}
		
		// Ensure image is visible after load
		img.onload = () => {
			img.style.opacity = '1';
		};
		
		// If already loaded/cached
		if (img.complete && img.naturalWidth > 0) {
			img.style.opacity = '1';
		}
		
		// Add shake animation
		figElement.classList.add('shake-reveal');
		
		const ctx = canvas.getContext('2d', { alpha: true });
		const scale = window.devicePixelRatio > 1 ? 1.5 : 1;
		const width = canvas.width / scale;
		const height = canvas.height / scale;
		
		// Reduce particle count on mobile for better performance
		const isMobile = window.innerWidth < 640;
		
		// Create particle explosion (optimized)
		if (!isMobile) {
			createParticleExplosion(wrapper, width / 2, height / 2);
		}
		
		// Set composite operation for erasing
		ctx.globalCompositeOperation = 'destination-out';
		
		// Animate scratch reveal with optimized patterns
		let progress = 0;
		const duration = isMobile ? 800 : 1200; // Faster on mobile
		const startTime = performance.now();
		const scratchCount = isMobile ? 8 : 12; // Less particles on mobile
		
		function animateScratch(currentTime) {
			const elapsed = currentTime - startTime;
			progress = Math.min(elapsed / duration, 1);
			
			// Create circular scratch pattern (like unwrapping)
			const angle = progress * Math.PI * 4; // Multiple rotations
			
			for (let i = 0; i < scratchCount; i++) {
				const spreadAngle = (i / scratchCount) * Math.PI * 2;
				const spiralRadius = progress * Math.max(width, height) * 0.7;
				const x = (width / 2) + Math.cos(spreadAngle + angle) * spiralRadius;
				const y = (height / 2) + Math.sin(spreadAngle + angle) * spiralRadius;
				const radius = isMobile ? 20 : 25 + Math.random() * 20;
				
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2);
				ctx.fill();
			}
			
			// Continue animation
			if (progress < 1) {
				requestAnimationFrame(animateScratch);
			} else {
				// Completely clear canvas
				ctx.clearRect(0, 0, width * scale, height * scale);
				canvas.style.opacity = '0';
				
				setTimeout(() => {
					canvas.style.display = 'none';
					figElement.classList.remove('shake-reveal');
					figElement.classList.add('bounce-in');
					
					// Show celebration effects
					showCardCelebration(figElement);
					
					// Track revealed photos
					revealedPhotosCount++;
					checkAllPhotosRevealed();
					
					setTimeout(() => {
						figElement.classList.remove('bounce-in');
					}, 600);
				}, 200);
			}
		}
		
		requestAnimationFrame(animateScratch);
	}

	function createParticleExplosion(container, centerX, centerY) {
		const particles = ['✨', '⭐', '💫', '🌟', '💕', '💖', '🎉'];
		const isMobile = window.innerWidth < 640;
		const particleCount = isMobile ? 8 : 15; // Reduce on mobile
		
		// Use DocumentFragment for better performance
		const frag = document.createDocumentFragment();
		
		for (let i = 0; i < particleCount; i++) {
			const particle = document.createElement('div');
			particle.className = 'particle-burst';
			particle.textContent = particles[Math.floor(Math.random() * particles.length)];
			
			const angle = (i / particleCount) * Math.PI * 2;
			const distance = isMobile ? 60 : 80 + Math.random() * 40;
			const endX = Math.cos(angle) * distance;
			const endY = Math.sin(angle) * distance;
			
			particle.style.setProperty('--tx', `${endX}px`);
			particle.style.setProperty('--ty', `${endY}px`);
			particle.style.left = '50%';
			particle.style.top = '50%';
			particle.style.animationDelay = `${Math.random() * 0.1}s`;
			
			frag.appendChild(particle);
		}
		
		container.appendChild(frag);
		
		// Clean up all particles at once
		setTimeout(() => {
			container.querySelectorAll('.particle-burst').forEach(p => p.remove());
		}, 800);
	}

	// Check if all photos revealed and unlock love letter
	function checkAllPhotosRevealed() {
		if (revealedPhotosCount >= photos.length) {
			// Small delay for last animation to complete
			setTimeout(() => {
				// Big celebration
				startConfetti(3000);
				
				// Show notification
				const notification = document.createElement('div');
				notification.className = 'unlock-notification';
				notification.innerHTML = '🎉 Kamu sudah buka semua foto! Sekarang baca love letter-ku ya 💕';
				document.body.appendChild(notification);
				
				setTimeout(() => {
					notification.style.opacity = '0';
					setTimeout(() => notification.remove(), 500);
				}, 3000);
				
				// Navigate to page 3 (love letter page)
				setTimeout(() => {
					showPage(3);
					// Trigger typewriter animation
					if (!typewriterTriggered) {
						typewriterTriggered = true;
						typeWriter(true);
					}
				}, 3500);
			}, 800);
		}
	}

	function showCardCelebration(figElement) {
		const wrapper = figElement.querySelector('.photo-wrapper');
		
		// Big heart pop
		const heart = document.createElement('div');
		heart.className = 'card-heart-pop';
		heart.innerHTML = '💕';
		wrapper.appendChild(heart);
		setTimeout(() => heart.remove(), 1200);
		
		// Confetti burst
		const confettiColors = ['💗', '💝', '💖', '💓', '💞'];
		for (let i = 0; i < 8; i++) {
			setTimeout(() => {
				const confetti = document.createElement('div');
				confetti.className = 'confetti-piece';
				confetti.textContent = confettiColors[Math.floor(Math.random() * confettiColors.length)];
				confetti.style.left = `${Math.random() * 100}%`;
				confetti.style.animationDelay = `${Math.random() * 0.2}s`;
				wrapper.appendChild(confetti);
				setTimeout(() => confetti.remove(), 1500);
			}, i * 50);
		}
	}

	renderGallery();

	// ---------- Love Letter (typewriter) ----------
	const letter = `Happy birthday, sayangku Shara 🌸
Hari ini dunia kayak ikut senyum karena orang seindah kamu lahir 21 tahun yang lalu. Aku cuma mau bilang makasih, karena sejak kamu datang, semuanya jadi lebih hangat, lebih tenang, dan lebih berarti.

Semoga di umur yang baru ini, kamu makin bahagia, makin kuat, makin cantik luar dalam kayak biasanya. Aku nggak minta banyak, cuma pengin terus jadi orang yang bisa lihat kamu tumbuh, ketawa, dan bahagia setiap hari.

Selamat ulang tahun ya, cintaku.
Semoga semua hal baik nempel di hidup kamu, seerat aku yang gak mau lepas dari kamu 💖

— Naufal`;

	let twIdx = 0; let twTimer;
	let typewriterTriggered = false;
	
	function typeWriter(start = true) {
		if (start) { 
			twIdx = 0; 
			typewriterEl.textContent = ''; 
			clearInterval(twTimer);
			// Hide WhatsApp button saat restart
			replyWhatsAppBtn?.classList.add('hidden');
		}
		twTimer = setInterval(() => {
			typewriterEl.textContent += letter.charAt(twIdx);
			twIdx++;
			if (twIdx >= letter.length) {
				clearInterval(twTimer);
				// Show WhatsApp button setelah selesai
				setTimeout(() => {
					replyWhatsAppBtn?.classList.remove('hidden');
				}, 500);
			}
		}, 22);
	}
	
	// Auto-trigger typewriter is now handled by checkAllPhotosRevealed()
	// (when all photos are revealed, page3 opens and typewriter starts)
	
	restartLetterBtn?.addEventListener('click', () => typeWriter(true));
	
	// WhatsApp reply button
	replyWhatsAppBtn?.addEventListener('click', () => {
		const phoneNumber = '6285789439067'; // Format internasional Indonesia
		const message = encodeURIComponent('love youu sayangg muahhh 🩷');
		const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
		window.open(whatsappURL, '_blank');
	});

	// ---------- Confetti ----------
	const ctx = confettiCanvas.getContext('2d');
	let confettiPieces = [];
	let confettiAnimId = null;
	let confettiUntil = 0;

	function resizeCanvas() {
		confettiCanvas.width = window.innerWidth;
		confettiCanvas.height = window.innerHeight;
	}
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);

	function startConfetti(duration = 2000) {
		const W = confettiCanvas.width, H = confettiCanvas.height;
		confettiPieces = Array.from({ length: Math.min(220, Math.floor(W / 6)) }, () => ({
			x: Math.random() * W,
			y: -20 - Math.random() * H * 0.5,
			w: 6 + Math.random() * 6,
			h: 8 + Math.random() * 10,
			r: Math.random() * Math.PI,
			v: 1.2 + Math.random() * 2,
			vr: -0.1 + Math.random() * 0.2,
			color: Math.random() < 0.5 ? '#e66ab1' : (Math.random() < 0.5 ? '#8ecae6' : '#ffd6e7'),
		}));
		confettiUntil = performance.now() + duration;
		if (!confettiAnimId) confettiAnimId = requestAnimationFrame(tickConfetti);
	}

	function tickConfetti(t) {
		const W = confettiCanvas.width, H = confettiCanvas.height;
		ctx.clearRect(0, 0, W, H);
		
		if (t < confettiUntil) {
			confettiPieces.forEach(p => {
				p.y += p.v; p.r += p.vr; p.x += Math.sin(p.r) * 0.6;
				if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate(p.r);
				ctx.fillStyle = p.color;
				ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
				ctx.restore();
			});
			confettiAnimId = requestAnimationFrame(tickConfetti);
		} else {
			// Stop animation and clear canvas completely
			confettiAnimId = null;
			confettiPieces = [];
			ctx.clearRect(0, 0, W, H);
		}
	}

	celebrateBtn?.addEventListener('click', () => startConfetti(2000));

	// ---------- Progressive enhancements ----------
	// Prevent scrolling when modal open (simple)
	const obsModal = new MutationObserver(() => {
		if (!lightbox.classList.contains('hidden')) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});
	obsModal.observe(lightbox, { attributes: true, attributeFilter: ['class'] });
})();

