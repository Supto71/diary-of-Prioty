// Floating hearts animation
(function() {
  const container = document.getElementById('floatingHearts');
  if (!container) return;

  const hearts = ['💗', '💖', '💕', '🩷', '🌸', '✿', '♡', '❀'];

  function createHeart() {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (0.8 + Math.random() * 1) + 'rem';
    heart.style.animationDuration = (6 + Math.random() * 6) + 's';
    heart.style.animationDelay = Math.random() * 4 + 's';
    container.appendChild(heart);

    // Remove heart after animation
    setTimeout(() => {
      heart.remove();
    }, 14000);
  }

  // Create initial hearts
  for (let i = 0; i < 12; i++) {
    setTimeout(createHeart, i * 400);
  }

  // Continuously create hearts
  setInterval(createHeart, 2000);
})();
