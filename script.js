// Initialize the page
document.documentElement.classList.remove("dark");

// Set up Intersection Observer for cake containers
const sections = document.querySelectorAll("section");
const cakeContainers = document.querySelectorAll(".cake-container");
let activeSection = 0;

const cakeObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			const container = entry.target;
			const section = container.closest("section");
			const containerIndex = Array.from(cakeContainers).indexOf(container);

			if (entry.isIntersecting) {
				container.classList.add("visible");
				activeSection = containerIndex;
				updateNavDots();

				// Add layers based on container index
				if (containerIndex >= 1) {
					container.classList.add("show-layer-2");
				}
				if (containerIndex >= 2) {
					container.classList.add("show-layer-3");
				}
				if (containerIndex === 3) {
					container.classList.add("show-candle");
					createConfetti();
				}
			} else {
				// Remove classes when container exits viewport
				container.classList.remove("visible");
				if (containerIndex >= 1) {
					container.classList.remove("show-layer-2");
				}
				if (containerIndex >= 2) {
					container.classList.remove("show-layer-3");
				}
				if (containerIndex === 3) {
					container.classList.remove("show-candle");
				}
			}
		});
	},
	{
		threshold: 0.3,
	}
);

// Observe all cake containers
cakeContainers.forEach((container) => {
	cakeObserver.observe(container);
});

// Navigation dots functionality
function updateNavDots() {
	const dots = document.querySelectorAll(".nav-dot");
	dots.forEach((dot, index) => {
		if (index === activeSection) {
			dot.classList.add("active");
		} else {
			dot.classList.remove("active");
		}
	});
}

// Add click handlers for navigation dots
document.querySelectorAll(".nav-dot").forEach((dot, index) => {
	dot.addEventListener("click", () => {
		sections[index].scrollIntoView({ behavior: "smooth" });
	});
});

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

// Initialize balloons
createBalloons();

// Navigation dots
const navDots = document.querySelectorAll(".nav-dot");

function updateNavDots() {
	navDots.forEach((dot, index) => {
		dot.classList.toggle("active", index === activeSection);
	});
}

// Trigger confetti on initial load for section 4
window.addEventListener("load", () => {
	if (window.innerHeight >= document.documentElement.scrollHeight) {
		createConfetti();
	}
});
