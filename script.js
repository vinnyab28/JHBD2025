// Initialize the page
document.documentElement.classList.remove("dark");

// Card interaction variables
const card = document.querySelector(".card");
const cardPages = document.querySelectorAll(".card-page");
const nextBtn = document.querySelector(".next-page");
const prevBtn = document.querySelector(".prev-page");
const resetBtn = document.querySelector(".reset-btn");
const dotsContainer = document.querySelector(".dots");
let currentPage = 1;
let isCardOpened = false;
const totalPages = cardPages.length;

// Dots
function updateDots() {
	dotsContainer.innerHTML = "";
	for (let i = 1; i <= totalPages; i++) {
		const dot = document.createElement("div");
		dot.className = "dot" + (i === currentPage ? " active" : "");
		dot.addEventListener("click", (e) => {
			e.stopPropagation();
			goToPage(i);
		});
		dotsContainer.appendChild(dot);
	}
}

function goToPage(page) {
	if (page < 1 || page > totalPages) return;
	cardPages.forEach((p, idx) => {
		p.classList.remove("active");
		p.classList.remove("show-layer");
		p.classList.remove("show-layer-2");
		p.classList.remove("show-layer-3");
		p.classList.remove("show-candle");
	});
	const current = cardPages[page - 1];
	current.classList.add("active");
	// Add .show-layer for entry animation
	setTimeout(() => {
		current.classList.add("show-layer");
		if (page === 3) current.classList.add("show-layer-2");
		if (page === 4) current.classList.add("show-layer-3");
		if (page === 5) current.classList.add("show-candle");
	}, 10);
	currentPage = page;
	updateDots();
	// Only trigger confetti if arriving on the last page and it wasn't already the last page
	if (currentPage === totalPages && !goToPage._confettiFired) {
		createConfetti();
		goToPage._confettiFired = true;
	} else if (currentPage !== totalPages) {
		goToPage._confettiFired = false;
	}
}

// Handle card opening and page turning
card.addEventListener("click", (e) => {
	// Prevent click on nav buttons/dots/reset from flipping
	if (e.target.closest(".page-btn") || e.target.closest(".dot") || e.target.closest(".reset-btn")) return;
	if (!isCardOpened) {
		card.classList.add("opened");
		isCardOpened = true;
		goToPage(1);
		return;
	}
	// Only advance if not on last page
	if (currentPage < totalPages) goToPage(currentPage + 1);
});

// Next/Prev
nextBtn.addEventListener("click", (e) => {
	e.stopPropagation();
	if (currentPage < totalPages) goToPage(currentPage + 1);
});
prevBtn.addEventListener("click", (e) => {
	e.stopPropagation();
	if (currentPage > 1) goToPage(currentPage - 1);
});

// Reset
resetBtn.addEventListener("click", (e) => {
	e.stopPropagation();
	card.classList.remove("opened");
	isCardOpened = false;
	goToPage(1);
});

// Mobile: flip from top to bottom
function handleMobileFlip() {
	if (window.innerWidth <= 768) {
		card.classList.remove("opened");
		card.classList.remove("opened-y");
		card.classList.add("opened-x");
	} else {
		card.classList.remove("opened-x");
	}
}
window.addEventListener("resize", handleMobileFlip);
handleMobileFlip();

// Initialize polaroid animations
const polaroids = document.querySelectorAll(".polaroid-photo");
polaroids.forEach((photo, index) => {
	const delay = Math.random() * 2;
	const angle = index % 2 === 0 ? -3 : 3;
	photo.style.setProperty("--photo-delay", delay);
	photo.style.setProperty("--string-angle", angle);

	// Add subtle random rotation
	const baseRotation = angle + (Math.random() * 2 - 1);
	photo.style.transform = `rotate(${baseRotation}deg)`;
});

// Create floating balloons
function createBalloons() {
	const colors = ["#FF69B4", "#FF1493", "#FFB6C1", "#FFC0CB"];
	const balloonContainer = document.createElement("div");
	document.body.appendChild(balloonContainer);

	for (let i = 0; i < 10; i++) {
		const balloon = document.createElement("div");
		balloon.className = "balloon";
		balloon.innerHTML = "🎈";
		balloon.style.left = `${Math.random() * 100}vw`;
		balloon.style.animationDelay = `${Math.random() * 15}s`;
		balloon.style.fontSize = `${Math.random() * 20 + 20}px`;
		balloonContainer.appendChild(balloon);
	}
}

// Initialize balloons
createBalloons();

// Navigation dots
const navDots = document.querySelectorAll(".nav-dot");

function updateNavDots() {
	navDots.forEach((dot, index) => {
		dot.classList.toggle("active", index === activeSection);
	});
}

// Confetti effect
function createConfetti() {
	const duration = 15 * 1000;
	const animationEnd = Date.now() + duration;
	const defaults = {
		startVelocity: 30,
		spread: 360,
		ticks: 60,
		zIndex: 0,
		shapes: ["star", "circle"],
		colors: ["#9F7AEA", "#805AD5", "#6B46C1", "#E9D8FD", "#553C9A"],
	};

	function randomInRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	// Initial burst
	confetti({
		...defaults,
		particleCount: 100,
		scalar: 1.2,
		spread: 100,
		origin: { y: 0.6 },
	});

	// Continuous confetti
	const interval = setInterval(function () {
		const timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		const particleCount = 50 * (timeLeft / duration);

		// Confetti from left
		confetti(
			Object.assign({}, defaults, {
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
				gravity: randomInRange(0.6, 1),
			})
		);
		// Confetti from right
		confetti(
			Object.assign({}, defaults, {
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
				gravity: randomInRange(0.6, 1),
			})
		);
	}, 250);
}

// Trigger confetti on initial load for section 4
window.addEventListener("load", () => {
	if (window.innerHeight >= document.documentElement.scrollHeight) {
		createConfetti();
	}
});
