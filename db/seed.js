// TODO #3c Updated seed.js to:
//Create 2 users:
//musiclover123 with password password123
//rockfan456 with password securepass456
//Create 20 tracks (as before)
//Create 2 playlists, each belonging to a different user:
//User 1's playlist: "My Favorites" with 7 tracks (tracks 1-7)
//User 2's playlist: "Rock Classics" with 8 tracks (tracks 8-15)


import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Create users first
  const user1 = await createUser("musiclover123", "password123");
  const user2 = await createUser("rockfan456", "securepass456");

  // Create tracks
  for (let i = 1; i <= 20; i++) {
    await createTrack("Track " + i, i * 50000);
  }

  // Create playlists for each user
  const user1Playlist = await createPlaylist(
    "My Favorites",
    "My favorite songs collection",
    user1.id
  );
  const user2Playlist = await createPlaylist(
    "Rock Classics",
    "Classic rock hits from the 80s",
    user2.id
  );

  // Add 5+ tracks to each playlist
  // User 1's playlist gets tracks 1-7
  for (let i = 1; i <= 7; i++) {
    await createPlaylistTrack(user1Playlist.id, i);
  }

  // User 2's playlist gets tracks 8-15
  for (let i = 8; i <= 15; i++) {
    await createPlaylistTrack(user2Playlist.id, i);
  }
}
