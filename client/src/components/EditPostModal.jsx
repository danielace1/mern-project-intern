import PropTypes from "prop-types";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { API_URL } from "../api/api";

const EditPostModal = ({ post, onClose }) => {
  const [text, setText] = useState(post.text || "");
  const queryClient = useQueryClient();

  const { mutate: editPost, isPending: isEditing } = useMutation({
    mutationFn: async (updatedText) => {
      const res = await fetch(`${API_URL}/api/posts/update/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: updatedText }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Post updated successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    editPost(text);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-500">
        <h2 className="text-lg font-bold text-white mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full outline-none p-2 border border-gray-500 focus:border-gray-700 bg-gray-950 text-white rounded-md mb-4 resize-none"
            rows="4"
            placeholder="Update your post..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={onClose}
              disabled={isEditing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              disabled={isEditing}
            >
              {isEditing ? "Updating..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditPostModal.propTypes = {
  post: PropTypes.object,
  onClose: PropTypes.func,
};

export default EditPostModal;
