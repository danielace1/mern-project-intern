import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  deletePost,
  updatePost,
  likeUnlikePost,
  commentOnPost,
  deleteComment,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);

router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);

router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/update/:id", protectRoute, updatePost);

router.post("/like/:id", protectRoute, likeUnlikePost);

router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:postId/comment/:commentId", protectRoute, deleteComment);

export default router;
