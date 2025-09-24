import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackById } from "#db/queries/tracks";
import { getPlaylistsByUserIdAndTrackId } from "#db/queries/playlists";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";

router.route("/").get(async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.route("/:id").get(async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

router.route("/:id/playlists")
  .get(getUserFromToken, requireUser, async (req, res) => {
    const track = await getTrackById(req.params.id);
    if (!track) return res.status(404).send("Track not found.");
    
    const playlists = await getPlaylistsByUserIdAndTrackId(req.user.id, req.params.id);
    res.send(playlists);
  });
