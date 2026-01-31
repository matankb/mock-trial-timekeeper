(function () {
  // Configure your images here - add as many as you want
  const screenshots = [
    {
      src: 'assets/screenshots/manager.png',
      alt: 'Time Management View',
      description:
        'Track statements, direct and cross examinations, and all-loss.',
      // '&nbsp;',
    },
    {
      src: 'assets/screenshots/list.png',
      alt: 'Trial List View',
      description: 'See all your trials in one place.',
    },
    {
      src: 'assets/screenshots/connect.png',
      alt: 'Time Management View',
      description: 'Connect your team account to sync your trials.',
    },
    {
      src: 'assets/screenshots/upload.png',
      alt: 'Team Upload View',
      description: 'Upload your trial times to your team account.',
    },
    {
      src: 'assets/screenshots/home.png',
      alt: 'Team Home View',
      description: "See all your team's times in one place.",
    },

    {
      src: 'assets/screenshots/breakdown.png',
      alt: 'Time Breakdown View',
      description: 'Track the time for each examination.',
    },
  ];

  const carousel = document.getElementById('phone-carousel');
  const dotsContainer = document.getElementById('phone-nav-dots');
  const prevBtn = document.getElementById('nav-prev');
  const nextBtn = document.getElementById('nav-next');
  const phoneDescription = document.querySelector('.phone-description');

  // Preload all images upfront
  screenshots.forEach((screenshot) => {
    const preloadImg = new Image();
    preloadImg.src = screenshot.src;
  });

  // Track state
  const slots = [];
  const positions = ['center', 'left', 'right'];
  let currentFrontIndex = 0;
  let isAnimating = false;

  // Initial image indices: center=0, left=prev (wraps to last), right=next (1)
  // This ensures clicking right shows the next image (1), clicking left shows prev
  const initialImages = [0, screenshots.length - 1, 1]; // center, left, right

  // Create the 3 phone mockup elements
  for (let i = 0; i < 3; i++) {
    const phone = document.createElement('div');
    phone.className = 'phone-mockup';
    phone.dataset.position = positions[i];

    const imgIndex = initialImages[i] % screenshots.length;
    const img = document.createElement('img');
    img.src = screenshots[imgIndex].src;
    img.alt = screenshots[imgIndex].alt;
    phone.appendChild(img);

    carousel.appendChild(phone);
    slots.push({ element: phone, imageIndex: imgIndex });
  }

  // Create display-only dots
  const dotElements = screenshots.map((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'phone-nav-dot' + (index === 0 ? ' active' : '');
    dotsContainer.appendChild(dot);
    return dot;
  });

  // Arrow button handlers
  // Next (right arrow) brings right phone to center
  // Prev (left arrow) brings left phone to center
  prevBtn.addEventListener('click', () => {
    if (!isAnimating) {
      isAnimating = true;
      rotateLeft(() => {
        isAnimating = false;
      });
    }
  });

  nextBtn.addEventListener('click', () => {
    if (!isAnimating) {
      isAnimating = true;
      rotateRight(() => {
        isAnimating = false;
      });
    }
  });

  // Rotate right: brings right phone to center (next image in sequence)
  function rotateRight(callback) {
    const centerSlot = slots.find(
      (s) => s.element.dataset.position === 'center',
    );
    const leftSlot = slots.find((s) => s.element.dataset.position === 'left');
    const rightSlot = slots.find((s) => s.element.dataset.position === 'right');

    // Update positions: center->left, right->center, left->right (back)
    centerSlot.element.dataset.position = 'left';
    rightSlot.element.dataset.position = 'center';
    leftSlot.element.dataset.position = 'right';

    // Update front index (going forward)
    const oldFrontIndex = currentFrontIndex;
    currentFrontIndex = (currentFrontIndex + 1) % screenshots.length;

    // Update dots
    dotElements[oldFrontIndex].classList.remove('active');
    dotElements[currentFrontIndex].classList.add('active');

    // Fade out description, update text, then fade in
    phoneDescription.style.opacity = '0';
    setTimeout(() => {
      phoneDescription.innerHTML = screenshots[currentFrontIndex].description;
      phoneDescription.style.opacity = '1';
    }, 125);

    // The phone that went to right (leftSlot) gets the new "next" image
    const newImageIndex = (currentFrontIndex + 1) % screenshots.length;
    setTimeout(() => {
      leftSlot.imageIndex = newImageIndex;
      leftSlot.element.querySelector('img').src =
        screenshots[newImageIndex].src;
      leftSlot.element.querySelector('img').alt =
        screenshots[newImageIndex].alt;
      if (callback) callback();
    }, 250);
  }

  // Rotate left: brings left phone to center (previous image in sequence)
  function rotateLeft(callback) {
    const centerSlot = slots.find(
      (s) => s.element.dataset.position === 'center',
    );
    const leftSlot = slots.find((s) => s.element.dataset.position === 'left');
    const rightSlot = slots.find((s) => s.element.dataset.position === 'right');

    // Update positions: center->right, left->center, right->left
    centerSlot.element.dataset.position = 'right';
    leftSlot.element.dataset.position = 'center';
    rightSlot.element.dataset.position = 'left';

    // Update front index (going backward)
    const oldFrontIndex = currentFrontIndex;
    currentFrontIndex =
      (currentFrontIndex - 1 + screenshots.length) % screenshots.length;

    // Update dots
    dotElements[oldFrontIndex].classList.remove('active');
    dotElements[currentFrontIndex].classList.add('active');

    // Fade out description, update text, then fade in
    phoneDescription.style.opacity = '0';
    setTimeout(() => {
      phoneDescription.innerHTML = screenshots[currentFrontIndex].description;
      phoneDescription.style.opacity = '1';
    }, 125);

    // The phone that went to left (rightSlot) gets the new "previous" image
    const newImageIndex =
      (currentFrontIndex - 1 + screenshots.length) % screenshots.length;
    setTimeout(() => {
      rightSlot.imageIndex = newImageIndex;
      rightSlot.element.querySelector('img').src =
        screenshots[newImageIndex].src;
      rightSlot.element.querySelector('img').alt =
        screenshots[newImageIndex].alt;
      if (callback) callback();
    }, 250);
  }

  // Initialize description text
  // phoneDescription.innerHTML = screenshots[0].description;
  phoneDescription.innerHTML = '&nbsp;';
})();
