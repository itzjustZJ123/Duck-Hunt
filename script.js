// Set up screen dimensions
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
let score = 0;
let spawnInterval = 3000; // Initial spawn interval in milliseconds
let escapedDucks = 0; // Initialize escaped duck counter

// Initialize the gun element
const gun = document.querySelector('.gun');

// Game Over Screen
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Function to spawn the duck
  function spawnDuck() {
    const duck = document.createElement('div');
    duck.classList.add('duck');

    // Random spawn position (left or bottom)
    const spawnFromLeft = Math.random() < 0.5;
    if (spawnFromLeft) {
      duck.style.left = `-${duck.offsetWidth * 2}px`; // Start far left
      duck.style.top = `${Math.random() * screenHeight * 0.4 + screenHeight * 0.15}px`; // Random vertical start
    } else {
      duck.style.left = `${screenWidth * 0.4 + Math.random() * screenWidth * 0.2}px`; // Near the center
      duck.style.top = `${screenHeight}px`; // Start from the bottom
    }

    document.body.appendChild(duck);
    const MAX_SPEED = 10; // Reduce maximum speed to 10
    // Speed and velocity settings
    const baseSpeed = Math.random() * 6 + 5; // Reduce base speed
    let speed = Math.min(baseSpeed, 14); // Cap speed
    let velocityX = 0;
    let velocityY = 0;

    if (spawnFromLeft) {
      const angle = Math.random() * 25 - 12.5; // Reduced angle for smoother changes
      velocityX = Math.cos(angle * Math.PI / 180) * speed;
      velocityY = Math.sin(angle * Math.PI / 180) * speed;
    } else {
      const angle = Math.random() * 2 - 1; // Reduced angle for smoother changes
      velocityX = Math.cos(angle * Math.PI / 180) * speed * 0.2; // Tiny horizontal drift
      velocityY = -Math.abs(speed); // Mostly upward
    }

    // Duck movement function
    function moveDuck() {
      const currentPos = duck.getBoundingClientRect();
      let newX = currentPos.left + velocityX;
      let newY = currentPos.top + velocityY;

      // Remove ducks that leave the screen
      if (newX < -50 || newX > screenWidth + 50 || newY < -50) {
        duck.remove();
        escapedDucks++; // Increment escaped duck counter
        document.getElementById('escaped').textContent = escapedDucks; // Update the escaped duck count on the screen
        if (escapedDucks >= 10) {
          gameOver();
        }
      } else {
        duck.style.left = `${newX}px`;
        duck.style.top = `${newY}px`;
        duck.style.transform = velocityX < 0 ? "scaleX(-1)" : "scaleX(1)";
        requestAnimationFrame(moveDuck);
      }
    }
    moveDuck();

    // Change direction near the middle
    // Change direction near the middle
    const changeDirection = () => {
      const currentPos = duck.getBoundingClientRect();
      const centerX = screenWidth / 2;
      const centerY = screenHeight / 2;

      // Random angle for a general direction change
      let angle;

      // If the duck is near the center, emphasize random direction change
      if (
        Math.abs(currentPos.left - centerX) < screenWidth * 0.2 &&
        Math.abs(currentPos.top - centerY) < screenHeight * 0.2
      ) {
        angle = Math.random() * 360; // Full random direction
      } else {
        angle = Math.random() * 15 - 7.5; // Reduced angle for smoother changes, limited to 7.5 degrees up or down
      }

      velocityX = Math.cos(angle * Math.PI / 180) * speed;
      velocityY = Math.sin(angle * Math.PI / 180) * speed; // Adjust velocityY for smoother changes

      // Flip duck direction if needed
      duck.style.transform = velocityX < 0 ? "scaleX(-1)" : "scaleX(1)";
    };

    // Change direction every 500-1000 ms
    const directionChangeInterval = setInterval(changeDirection, Math.random() * 500 + 500);

    // Clean up interval when duck is removed
    duck.addEventListener("remove", () => clearInterval(directionChangeInterval));

  // Duck click handler
    duck.addEventListener("click", (event) => {
      score = isNaN(score) ? 0 : score + 1;
      document.getElementById('score').textContent = score;

      // Increase spawn rate every 5 points
      if (score % 5 === 0) {
        spawnInterval = Math.max(500, 3000 - (score / 5) * 150); // Less steep increase
        clearInterval(spawnIntervalId);
        spawnIntervalId = setInterval(spawnDuck, spawnInterval);
      }

      const { clientX, clientY } = event;

      // Remove the clicked duck
      duck.remove();

    // Show animations (dead duck, explosion, dog GIF)
    createEffect(clientX, clientY);
  });
}

// Function to create the death animation effects
function createEffect(clickX, clickY) {
  // Dead duck image
  const image = document.createElement("img");
  image.src = "dead.PNG"; // Path to your dead.PNG
  image.style.position = "absolute";
  image.style.left = `${clickX - 50}px`; // Center the image
  image.style.top = `${clickY - 50}px`;
  image.style.width = "110px"; // Maintain aspect ratio
  image.style.transform = "rotate(-90deg)"; // Start rotated
  image.style.transition = "top .8s ease-out, transform 0.2s ease-out"; // Smooth fall and rotation
  document.body.appendChild(image);

  setTimeout(() => {
    image.style.top = `${window.innerHeight + 100}px`; // Move out of sight
    image.style.transform = "rotate(0deg)"; // Rotate to normal
  }, 50);

  // Remove the PNG image after it falls off the screen
  setTimeout(() => {
    image.remove();
  }, 3500);

  // Explosion gif
  const gif1 = document.createElement('img');
  gif1.src = 'explosion.gif'; // Path to your explosion gif
  gif1.style.position = 'absolute';
  gif1.style.left = `${clickX - 95}px`; // Move it a little to the left
  gif1.style.top = `${clickY - 50}px`;
  gif1.style.width = '150px'; // Make the gif bigger
  document.body.appendChild(gif1);

  setTimeout(() => {
    gif1.remove();
  }, 800);

  // Dog gif delayed by 1 second
  setTimeout(() => {
    const dogGif = document.createElement("img");
    dogGif.src = "dog.gif"; // Ensure "dog.gif" exists in the same directory
    dogGif.alt = "Dog GIF";
    dogGif.className = "dog-gif";
    dogGif.style.left = `${clickX - 50}px`; // Center the GIF horizontally
    dogGif.style.top = `${window.innerHeight - 100}px`; // Align it to the bottom of the screen

    document.body.appendChild(dogGif);

    setTimeout(() => {
      dogGif.remove();
    }, 3000);
  }, 1000); // 1 second delay for the dog GIF
}

// ... (rest of your JavaScript code)

// Function to show the game over screen
function gameOver() {
  clearInterval(spawnIntervalId); // Stop spawning ducks
  gameOverScreen.style.display = 'flex'; // Show the game over screen
  finalScore.textContent = score; // Display the final score
}

// ... (rest of your JavaScript code)

// Restart button functionality
restartButton.addEventListener('click', () => {
  // Reset game variables
  score = 0;
  escapedDucks = 0;
  spawnInterval = 3000;

  // Update UI elements
  document.getElementById('score').textContent = score;
  document.getElementById('escaped').textContent = escapedDucks;
  gameOverScreen.style.display = 'none'; // Hide the game over screen

  // Restart spawning ducks
  spawnIntervalId = setInterval(spawnDuck, spawnInterval);
});

// Spawn a new duck every 3 seconds (3000 ms)
let spawnIntervalId = setInterval(spawnDuck, spawnInterval);

// Gun position tracking
document.addEventListener('mousemove', (event) => {
  const gunX = event.clientX - 150; // Adjust the gun's position to be 100px to the left of the cursor
  const gunY = window.innerHeight - 10; // Position the gun at the bottom of the screen (200px from the bottom)

  gun.style.left = `${gunX}px`;
  gun.style.top = `${gunY}px`;

  if (gunX > window.innerWidth / 2) {
    gun.style.transform = 'scaleX(-1)';
  } else {
    gun.style.transform = 'scaleX(1)';
  }

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const xDiff = centerX - gunX;
  const yDiff = centerY - gunY;

  const multiplier = 0.3;
  gun.style.left = `${gunX + xDiff * multiplier}px`;
  gun.style.top = `${gunY + yDiff * multiplier}px`;
});
