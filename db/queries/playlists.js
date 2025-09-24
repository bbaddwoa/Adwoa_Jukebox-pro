import db from "#db/client";

//TODO #3b. Updated playlists.js to:
//Modify createPlaylist(name, description) to include the required user_id parameter
export async function createPlaylist(name, description, userId) {
  const sql = `
  INSERT INTO playlists
    (name, description, user_id)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [name, description, userId]);
  return playlist;
}

export async function getPlaylists() {
  const sql = `
  SELECT *
  FROM playlists
  `;
  const { rows: playlists } = await db.query(sql);
  return playlists;
}

export async function getPlaylistsByUserId(userId) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE user_id = $1
  `;
  const { rows: playlists } = await db.query(sql, [userId]);
  return playlists;
}

export async function getPlaylistsByUserIdAndTrackId(userId, trackId) {
  const sql = `
  SELECT p.*
  FROM playlists p
  JOIN playlists_tracks pt ON p.id = pt.playlist_id
  WHERE p.user_id = $1 AND pt.track_id = $2
  `;
  const { rows: playlists } = await db.query(sql, [userId, trackId]);
  return playlists;
}

export async function getPlaylistById(id) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE id = $1
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [id]);
  return playlist;
}
