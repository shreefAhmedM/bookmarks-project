// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds, getData, setData } from "./storage.js";

const userSelect = document.getElementById("userSelect");
const bookmarksDiv = document.getElementById("bookmarks");
const form = document.getElementById("bookmarkForm");

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

// Handle form submit (works with Enter key automatically)
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
        timestamp: new Date().toISOString()
    };

    const existing = getData(currentUser) || [];

    existing.push(newBookmark);

    setData(currentUser, existing);

    form.reset();
    renderBookmarks();
});



// Render bookmarks
function renderBookmarks() {
    bookmarksDiv.innerHTML = "";

    if (!currentUser) return;

    const bookmarks = getData(currentUser);

    if (!bookmarks || bookmarks.length === 0) {
        bookmarksDiv.textContent = "This user has no bookmarks.";
        return;
    }

    bookmarks.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

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

        div.appendChild(title);
        div.appendChild(desc);
        div.appendChild(time);

        bookmarksDiv.appendChild(div);
    });
}