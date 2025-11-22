(function () {
  const modal = document.getElementById("imageModal");
  const modalImg = modal.querySelector(".image-modal-img");
  const modalWrapper = modal.querySelector(".image-modal-wrapper");
  const closeBtn = modal.querySelector(".image-modal-close");
  const overlay = modal.querySelector(".image-modal-overlay");
  const zoomButtons = modal.querySelectorAll(".image-zoom-btn");

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialTranslateX = 0;
  let initialTranslateY = 0;

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;
  const ZOOM_STEP = 0.5;

  // Initialize click handlers for all images in post content
  function initImageClickHandlers() {
    const postImages = document.querySelectorAll(".post-content img");
    postImages.forEach((img) => {
      img.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(this.src, this.alt);
      });
    });
  }

  // Open modal with image
  function openModal(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    resetTransform();
  }

  // Close modal
  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    resetTransform();
    // Clear image source after animation
    setTimeout(() => {
      modalImg.src = "";
      modalImg.alt = "";
    }, 300);
  }

  // Reset transform
  function resetTransform() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  // Update image transform
  function updateTransform() {
    modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  // Zoom in
  function zoomIn() {
    if (scale < MAX_SCALE) {
      scale = Math.min(scale + ZOOM_STEP, MAX_SCALE);
      updateTransform();
    }
  }

  // Zoom out
  function zoomOut() {
    if (scale > MIN_SCALE) {
      scale = Math.max(scale - ZOOM_STEP, MIN_SCALE);
      // Reset translation when zooming back to min scale
      if (scale === MIN_SCALE) {
        translateX = 0;
        translateY = 0;
      }
      updateTransform();
    }
  }

  // Mouse/Touch drag handlers
  function handleDragStart(e) {
    if (scale <= MIN_SCALE) return;

    isDragging = true;
    modalWrapper.classList.add("dragging");

    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    startX = clientX;
    startY = clientY;
    initialTranslateX = translateX;
    initialTranslateY = translateY;

    e.preventDefault();
  }

  function handleDragMove(e) {
    if (!isDragging) return;

    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    translateX = initialTranslateX + (clientX - startX);
    translateY = initialTranslateY + (clientY - startY);

    updateTransform();
    e.preventDefault();
  }

  function handleDragEnd() {
    isDragging = false;
    modalWrapper.classList.remove("dragging");
  }

  // Mouse wheel zoom
  function handleWheel(e) {
    e.preventDefault();

    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }

  // Event Listeners
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  // Zoom button handlers
  zoomButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const action = this.dataset.action;
      switch (action) {
        case "zoom-in":
          zoomIn();
          break;
        case "zoom-out":
          zoomOut();
          break;
        case "reset":
          resetTransform();
          break;
      }
    });
  });

  // Drag handlers
  modalWrapper.addEventListener("mousedown", handleDragStart);
  modalWrapper.addEventListener("touchstart", handleDragStart, {
    passive: false,
  });

  document.addEventListener("mousemove", handleDragMove);
  document.addEventListener("touchmove", handleDragMove, { passive: false });

  document.addEventListener("mouseup", handleDragEnd);
  document.addEventListener("touchend", handleDragEnd);

  // Mouse wheel zoom
  modalWrapper.addEventListener("wheel", handleWheel, { passive: false });

  // Keyboard handlers
  document.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("active")) return;

    switch (e.key) {
      case "Escape":
        closeModal();
        break;
      case "+":
      case "=":
        zoomIn();
        break;
      case "-":
      case "_":
        zoomOut();
        break;
      case "0":
        resetTransform();
        break;
      case "ArrowLeft":
        translateX += 50;
        updateTransform();
        break;
      case "ArrowRight":
        translateX -= 50;
        updateTransform();
        break;
      case "ArrowUp":
        translateY += 50;
        updateTransform();
        break;
      case "ArrowDown":
        translateY -= 50;
        updateTransform();
        break;
    }
  });

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initImageClickHandlers);
  } else {
    initImageClickHandlers();
  }
})();
