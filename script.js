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
