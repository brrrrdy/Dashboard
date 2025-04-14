document.addEventListener("DOMContentLoaded", () => {
  fetchRecentTrack();
});

async function fetchRecentTrack() {
  const username = "viptosomeone"; // Your Last.fm username
  const apiKey = "fc4fed6917c1b7a8302ceeb67022aee9";
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (
      !data.recenttracks ||
      !data.recenttracks.track ||
      data.recenttracks.track.length === 0
    ) {
      updateListeningBox(
        "No listening data available.",
        "images/icons/headphones.svg"
      );
      return;
    }

    const track = data.recenttracks.track[0];
    const nowPlaying = track["@attr"] && track["@attr"].nowplaying === "true";
    const song = `${track.name} by ${track.artist["#text"]}`;
    const albumArt = track.image[2]["#text"] || "images/icons/headphones.svg";

    updateListeningBox(
      `${nowPlaying ? "Now Playing" : "Last Played"}: <strong>${song}</strong>`,
      albumArt
    );
  } catch (error) {
    console.error("Error fetching track:", error);
    updateListeningBox(
      "Unable to load listening data.",
      "images/icons/headphones.svg"
    );
  }
}

function updateListeningBox(contentHTML, imageUrl) {
  const contentElement = document.querySelector(".card-type-1 .card-content");
  const iconElement = document.querySelector(".card-type-1 .card-icon");

  if (contentElement) {
    contentElement.innerHTML = `<p>${contentHTML}</p>`;
  }

  if (iconElement) {
    iconElement.src = imageUrl;
  }
}

async function fetchGitHubLanguages() {
  const username = "brrrrdy";
  const reposUrl = `https://api.github.com/users/${username}/repos`;

  try {
    const response = await fetch(reposUrl);
    const repos = await response.json();

    if (!repos || repos.length === 0) {
      updateGitHubBox("No repositories found.", "images/icons/github.svg");
      return;
    }

    const languagePromises = repos.map((repo) =>
      fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`)
        .then((res) => res.json())
        .catch(() => ({}))
    );

    const languagesData = await Promise.all(languagePromises);

    const languageStats = {};

    languagesData.forEach((languages) => {
      Object.entries(languages).forEach(([lang, bytes]) => {
        languageStats[lang] = (languageStats[lang] || 0) + bytes;
      });
    });

    const sortedLanguages = Object.entries(languageStats).sort(
      (a, b) => b[1] - a[1]
    );

    if (sortedLanguages.length === 0) {
      updateGitHubBox("No language data available.", "images/icons/github.svg");
      return;
    }

    const totalBytes = sortedLanguages.reduce(
      (sum, [_, bytes]) => sum + bytes,
      0
    );

    let contentHTML = `<div class="github-languages">`;

    const topLanguages = sortedLanguages.slice(0, 5);

    topLanguages.forEach(([lang, bytes]) => {
      const percentage = Math.round((bytes / totalBytes) * 100);
      contentHTML += `
        <div class="language-row">
          <span class="language-name">${lang}</span>
          <div class="language-bar-container">
            <div class="language-bar" style="width: ${percentage}%"></div>
          </div>
          <span class="language-percent">${percentage}%</span>
        </div>
      `;
    });

    contentHTML += `</div>`;

    updateGitHubBox(
      `<h4>languages used</h4>${contentHTML}`,
      "images/icons/github.svg"
    );
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    updateGitHubBox(
      "Unable to load GitHub language data.",
      "images/icons/github.svg"
    );
  }
}

function updateGitHubBox(contentHTML, imageUrl) {
  const contentElement = document.querySelector(".card-type-4 .card-content");
  const iconElement = document.querySelector(".card-type-4 .card-icon");

  if (contentElement) {
    contentElement.innerHTML = contentHTML;
  }

  if (iconElement) {
    iconElement.src = imageUrl;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchRecentTrack();
  fetchGitHubLanguages();
});
