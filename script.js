// ========= DATA =========

// Add your unlisted YouTube video IDs here
// Newest = first in this array
const videos = [
  // Example:
  // { id: "dQw4w9WgXcQ", title: "My Secret Video" },
  { 
    id: "IfATR3YBmS8", title: "Sivaganga Vlog ✨",
    isFeatured: true
  },
  { id: "4LuqJ9QotTM", title: "Vignesh Birthday 🎂😂",
    isShowcase: true
  },
  { id: "fx0XD_CwIzg", title: "Survey Camp at Yelagiri 🌄",
    isFeatured: true
  },
  { id: "-z49GCaGbT8", title: "Amusement Park Salem"},
  { id: "iT3xDiaILT0", title: "MGM Dizzee World Adventures 🎡",
    isShowcase: true
  },
  { id: "6fh8sNpGnFs", title: "Ghost in Our Hostel 😱👻"},
  { id: "b3HBDtYIWoM", title: "Maggie in hostel PART 2 🔥"},
  { id: "piQ6umXzIyc", title: "Nexus Vijaya Mall Vlog! 🪄"},
  { id: "px1Z4dYauvw", title: "RECharge 2025 ✨"},
  { id: "xvWBRFkLf2A", title: "Hostel farewell for Habitat guys 🏠",
    isShowcase: true
  },
  { id: "_z9vy_g0m4E", title: "Behind The Scenes 🎬| Ziggurat'25 🏗️",
    isShowcase: true
  },
  { id: "_Sqn90GyoWw", title: "Vidamuyarchi - Not a Vlog"},
  { id: "fhLq6sHqI5U", title: "Vasanth Hospitalised 🤒"},
  { id: "3LkhhxhLwLA", title: "RECharge 25 announcement",
    isShowcase: true
  },
  { id: "cYLy_pdvpO4", title: "What if I am alone? 🫣"},
  { id: "yyrBux7QV_E", title: "Making hostel maggie 🍜| Chef Vignesh 🧑🏻‍🍳"},
  { id: "Rt7KApy7caw", title: "Chennai to Salem 🧳| GOAT 🎬"},
  { id: "rZfx80qTRm4", title: "Yercaud Vlog 🏞️🚗",
    isShowcase: true
  },
  { id: "0VD963OmaoQ", title: "Project Vlog 😮🦾"},
  { id: "n4Yfr80B2ak", title: "Mission courier 📦"},
];

const AUTO_ALBUMS = [
  { name: "RECharge25 🏞️", folder: "RECharge25", count: 14 },
  { name: "MGM Trip 🎡", folder: "MGM", count: 13 },
  { name: "Sivaganga 🚗", folder: "Sivaganga", count: 36 }
];



// ========= SMOOTH SCROLL (Home page buttons) =========
function setupSmoothScroll() {
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetSel = btn.getAttribute("data-scroll");
      const target = document.querySelector(targetSel);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// ========= VIDEOS PAGE =========

function createVideoCard(video) {
  const id = video.id;
  const title = video.title || "Untitled Video";

  const thumbMax = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  const thumbFallback = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  const card = document.createElement("a");
  card.href = `https://www.youtube.com/watch?v=${id}`;
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.className = "card"; // same layout everywhere
  card.dataset.search = title.toLowerCase();

  card.innerHTML = `
    <div class="card-media">
      <img src="${thumbMax}"
           loading="lazy"
           onerror="this.onerror=null;this.src='${thumbFallback}';" />
      <div class="card-overlay-gradient"></div>
      <div class="card-badge">YouTube</div>
      <div class="play-icon"><span></span></div>
    </div>
    <div class="card-body">
      <div class="card-title">${title}</div>
    </div>
  `;

  return card;
}

function loadVideos() {
  const featuredContainer = document.getElementById("featured-video");
  const showcaseGrid = document.getElementById("showcase-grid");
  const videoGrid = document.getElementById("video-grid");

  // Not on videos page? skip.
  if (!featuredContainer && !showcaseGrid && !videoGrid) return;

  if (!videos.length) {
    if (featuredContainer) {
      featuredContainer.innerHTML = `<p style="color:#aaa;font-size:0.9rem;">
        No videos yet. Add some inside <code>videos</code> array in <code>script.js</code>.
      </p>`;
    }
    if (showcaseGrid) showcaseGrid.innerHTML = "";
    if (videoGrid) videoGrid.innerHTML = "";
    return;
  }

  // ---------- Newest videos (can be 1 or many) ----------
  let featuredVideos = videos.filter(v => v.isFeatured);

  // If none flagged as isFeatured, fall back to the very first video
  if (!featuredVideos.length) {
    featuredVideos = [videos[0]];
  }

  if (featuredContainer) {
    featuredContainer.innerHTML = "";
    featuredVideos.forEach(v => {
      const card = createVideoCard(v);
      featuredContainer.appendChild(card);
    });
  }

  // ---------- Showcase videos ----------
  if (showcaseGrid) {
    showcaseGrid.innerHTML = "";

    const showcaseVideos = videos.filter(v => v.isShowcase);

    if (showcaseVideos.length) {
      showcaseVideos.forEach(v => {
        const card = createVideoCard(v);
        card.classList.add("showcase-card");
        showcaseGrid.appendChild(card);
      });
    } else {
      showcaseGrid.innerHTML = `<p style="color:#aaa;font-size:0.85rem;">
        Mark any video with <code>isShowcase: true</code> in <code>videos</code> to show it here.
      </p>`;
    }
  }

  // ---------- All videos (includes everything) ----------
  if (videoGrid) {
    videoGrid.innerHTML = "";
    videos.forEach(v => {
      const card = createVideoCard(v);
      videoGrid.appendChild(card);
    });
  }
}

// ========= PHOTOS PAGE + LIGHTBOX =========

let currentPhotoIndex = 0;
let zoomLevel = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX = 0;
let startY = 0;


function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const imgEl = document.getElementById("lightbox-image");
  // ===== DOUBLE CLICK / DOUBLE TAP TO ZOOM =====
imgEl.addEventListener("dblclick", e => {
  e.preventDefault();

  if (zoomLevel === 1) {
    // Zoom in (centered)
    zoomLevel = 2;
    panX = 0;
    panY = 0;
    imgEl.style.transform =
      `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
  } else {
    // Reset zoom
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    imgEl.style.transform = "scale(1) translate(0px, 0px)";
  }
});


  // ===== PANNING (mouse + touch) =====
imgEl.addEventListener("mousedown", e => {
  if (zoomLevel <= 1) return;

  isPanning = true;
  startX = e.clientX - panX;
  startY = e.clientY - panY;
  imgEl.classList.add("grabbing");
});

window.addEventListener("mousemove", e => {
  if (!isPanning) return;

  panX = e.clientX - startX;
  panY = e.clientY - startY;

  imgEl.style.transform =
    `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
});

window.addEventListener("mouseup", () => {
  isPanning = false;
  imgEl.classList.remove("grabbing");
});

// Touch support
imgEl.addEventListener("touchstart", e => {
  if (zoomLevel <= 1) return;

  isPanning = true;
  const t = e.touches[0];
  startX = t.clientX - panX;
  startY = t.clientY - panY;
});

imgEl.addEventListener("touchmove", e => {
  if (!isPanning) return;

  const t = e.touches[0];
  panX = t.clientX - startX;
  panY = t.clientY - startY;

  imgEl.style.transform =
    `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
});

imgEl.addEventListener("touchend", () => {
  isPanning = false;
});


  const captionEl = document.getElementById("lightbox-caption");
  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");

  const zoomInBtn = document.getElementById("zoom-in");
  const zoomOutBtn = document.getElementById("zoom-out");
  const zoomResetBtn = document.getElementById("zoom-reset");
  const downloadBtn = document.getElementById("download-photo");

function showPhoto(index) {
  if (!activeAlbum.length) return;

  if (index < 0) index = activeAlbum.length - 1;
  if (index >= activeAlbum.length) index = 0;

  currentPhotoIndex = index;

  zoomLevel = 1;
  panX = 0;
  panY = 0;

  const p = activeAlbum[index];
  imgEl.src = p.src;
  imgEl.style.transform = "scale(1) translate(0px, 0px)";
  captionEl.textContent = p.title || "";
  downloadBtn.href = p.src;
}



  function openLightbox(index) {
    lightbox.classList.add("visible");
    showPhoto(index);
  }

  function closeLightbox() {
    lightbox.classList.remove("visible");
  }

  // Buttons
  closeBtn.onclick = closeLightbox;
  prevBtn.onclick = () => showPhoto(currentPhotoIndex - 1);
  nextBtn.onclick = () => showPhoto(currentPhotoIndex + 1);

  // Zoom
  zoomInBtn.onclick = () => {
    zoomLevel = Math.min(zoomLevel + 0.2, 4);
    imgEl.style.transform = `scale(${zoomLevel})`;
  };

  zoomOutBtn.onclick = () => {
    zoomLevel = Math.max(zoomLevel - 0.2, 0.5);
    imgEl.style.transform = `scale(${zoomLevel})`;
  };

  zoomResetBtn.onclick = () => {
    zoomLevel = 1;
    imgEl.style.transform = "scale(1)";
  };

  // Click outside to close
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard controls
  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("visible")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPhoto(currentPhotoIndex - 1);
    if (e.key === "ArrowRight") showPhoto(currentPhotoIndex + 1);
    if (e.key === "+") zoomInBtn.click();
    if (e.key === "-") zoomOutBtn.click();
    if (e.key === "0") zoomResetBtn.click();
  });

  // expose opener
  window.openLightbox = openLightbox;
}

function createPhotoCard(photo, index) {
  const title = photo.title || "";

  const card = document.createElement("article");
  card.className = "card";
  card.dataset.search = title.toLowerCase();

  card.innerHTML = `
    <div class="card-media">
      <img src="${photo.src}" loading="lazy" alt="${title}" />
      <div class="card-overlay-gradient"></div>
    </div>
    <div class="card-body">
      <div class="card-title">${title || "Untitled photo"}</div>
    </div>
  `;

  card.addEventListener("click", () => window.openLightbox(index));
  return card;
}


let activeAlbum = [];
let currentAlbumIndex = 0;

function loadPhotos() {
  const photoGrid = document.getElementById("photo-grid");
  if (!photoGrid) return;

  photoGrid.innerHTML = "";

  albums.forEach((album, index) => {
    const card = createAlbumCard(album, index);
    photoGrid.appendChild(card);
  });
}

function openAlbum(albumIndex) {
  activeAlbum = albums[albumIndex].photos;
  currentAlbumIndex = albumIndex;

  const photoGrid = document.getElementById("photo-grid");
  photoGrid.innerHTML = "";

  activeAlbum.forEach((photo, index) => {
    const card = createPhotoCard(photo, index);
    photoGrid.appendChild(card);
  });

  // Update photo counter
  const photoCountEl = document.getElementById("photo-count");
  if (photoCountEl) photoCountEl.textContent = activeAlbum.length;
}


function createAlbumCard(album, albumIndex) {
  const cover = album.photos[0];

  const card = document.createElement("article");
  card.className = "card";

  card.innerHTML = `
    <div class="card-media">
      <img src="${cover.src}" loading="lazy" />
      <div class="card-overlay-gradient"></div>
    </div>
    <div class="card-body">
      <div class="card-title">${album.name}</div>
      <div style="font-size:0.8rem;color:#aaa">
        ${album.photos.length} photos
      </div>
    </div>
  `;

  card.addEventListener("click", () => openAlbum(albumIndex));
  return card;
}


// ========= SEARCH (Videos / Photos pages) =========

function setupGlobalSearch() {
  const input = document.getElementById("global-search");
  if (!input) return;

  input.addEventListener("input", () => {
    const term = input.value.trim().toLowerCase();
    const cards = document.querySelectorAll(".card");
    if (!term) {
      cards.forEach(c => c.classList.remove("hidden-by-search"));
      return;
    }
    cards.forEach(c => {
      const haystack = (c.dataset.search || "").toLowerCase();
      if (haystack.includes(term)) {
        c.classList.remove("hidden-by-search");
      } else {
        c.classList.add("hidden-by-search");
      }
    });
  });
}

// ========= INIT =========

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupLightbox();      // only active on photos.html
  loadVideos();         // only renders on videos.html
  loadPhotos();         // only renders on photos.html
  setupGlobalSearch();

  // Counts wherever they exist
  const videoCountEl = document.getElementById("video-count");
  if (videoCountEl) videoCountEl.textContent = videos.length;

  const photoCountEl = document.getElementById("photo-count");
  if (photoCountEl) photoCountEl.textContent = 0;


  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

const backBtn = document.getElementById("back-to-albums");

function showAlbums() {
  activeAlbum = [];
  loadPhotos();
  backBtn.classList.add("hidden");
}

if (backBtn) {
  backBtn.onclick = showAlbums;
}

function openAlbum(index) {
  activeAlbum = albums[index].photos;

  const grid = document.getElementById("photo-grid");
  grid.innerHTML = "";

  activeAlbum.forEach((p, i) => {
    grid.appendChild(createPhotoCard(p, i));
  });

  backBtn.classList.remove("hidden");
}

const albums = AUTO_ALBUMS.map(album => ({
  name: album.name,
  photos: Array.from({ length: album.count }, (_, i) => ({
    src: `https://ik.imagekit.io/varun7825/${album.folder}/photo%20(${i + 1}).jpg`,
    title: `${album.folder} ${i + 1}`
  }))
}));
