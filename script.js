import { getUserIds, getData, setData, clearData } from "./storage.js";
import { sortBookmarksByDate } from "./bookmarkUtils.js";

const userSelect = document.getElementById("userSelect");
const bookmarksDiv = document.getElementById("bookmarks");
const form = document.getElementById("bookmarkForm");
const clearBookmarksBtn = document.getElementById("clearBookmarks");

let currentUser = null;

// Populate dropdown
window.onload = function () {
  const users = getUserIds();

  users.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `User ${id}`;
    userSelect.appendChild(option);
  });
};

// Handle user selection
userSelect.addEventListener("change", () => {
  currentUser = userSelect.value;
  renderBookmarks();
});

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("Please select a user first");
    return;
  }

  const url = document.getElementById("url").value;
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  const newBookmark = {
    url,
    title,
    description,
    likes: 0,
    timestamp: new Date().toISOString()
  };

  const existing = getData(currentUser) || [];
  existing.push(newBookmark);

  setData(currentUser, existing);

  form.reset();
  renderBookmarks();
});

// Like feature
function likeBookmark(timestamp) {
  const bookmarks = getData(currentUser);

  const bookmark = bookmarks.find(b => b.timestamp === timestamp);

  if (bookmark) {
    bookmark.likes = (bookmark.likes || 0) + 1;
    setData(currentUser, bookmarks);
    renderBookmarks();
  }
}

// Render bookmarks
function renderBookmarks() {
  bookmarksDiv.innerHTML = "";

  if (!currentUser) return;

  const bookmarks = sortBookmarksByDate(getData(currentUser) || []);

  if (bookmarks.length === 0) {
    bookmarksDiv.textContent = "This user has no bookmarks.";
    return;
  }

  bookmarks.forEach((b) => {
    const div = document.createElement("div");
    div.className = "bookmark";

    const title = document.createElement("a");
    title.href = b.url;
    title.target = "_blank";
    title.textContent = b.title;

    const desc = document.createElement("p");
    desc.textContent = b.description;

    const time = document.createElement("p");
    time.textContent =
      "Created: " + new Date(b.timestamp).toLocaleString();

    const likeButton = document.createElement("button");
    likeButton.textContent = `👍 Like (${b.likes || 0})`;

    likeButton.addEventListener("click", () => {
      likeBookmark(b.timestamp);
    });

    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy URL";

    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(b.url);
        copyButton.textContent = "Copied!";
        setTimeout(() => {
          copyButton.textContent = "Copy URL";
        }, 1000);
      } catch (err) {
        alert("Copy failed");
      }
    });

    div.appendChild(title);
    div.appendChild(desc);
    div.appendChild(time);
    div.appendChild(likeButton);
    div.appendChild(copyButton);

    bookmarksDiv.appendChild(div);
  });
}

// Clear bookmarks
clearBookmarksBtn.addEventListener("click", () => {
  if (!currentUser) {
    alert("Please select a user first");
    return;
  }

  if (confirm("Are you sure you want to delete all your bookmarks?")) {
    clearData(currentUser);
    renderBookmarks();
  }
});