import { useEffect } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";

import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
import { API_URL } from "../api/api";

const Posts = ({ feedType, username, userId }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return `${API_URL}/api/posts/all`;
      case "following":
        return `${API_URL}/api/posts/following`;
      case "posts":
        return `${API_URL}/api/posts/user/${username}`;
      case "likes":
        return `${API_URL}/api/posts/likes/${userId}`;
      default:
        return `${API_URL}/api/posts/all`;
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

Posts.propTypes = {
  feedType: PropTypes.string,
  username: PropTypes.string,
  userId: PropTypes.string,
};

export default Posts;
