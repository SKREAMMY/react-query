import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import "./components.css";

import { addPost, fetchPosts, fetchTags } from "../api/api";
import { useState } from "react";

interface Post {
  id?: number;
  title: string;
  body: string;
  tags?: string[];
}

export default function Postlists() {
  const [page, setPage] = useState(1);
  const {
    data: postData,
    isLoading,
    isError,
    error,
    isFetched,
  } = useQuery({
    queryKey: ["posts", { page }],
    queryFn: () => fetchPosts(page),
    staleTime: 1000 * 5,
  });

  const { data: tagsData } = useQuery({
    queryKey: ["fetchtags"],
    queryFn: fetchTags,
    staleTime: Infinity,
    // refetchInterval: 1000 * 5,
  });

  const queryClient = useQueryClient();

  const {
    mutate,
    isError: isPostError,
    reset,
  } = useMutation({
    mutationFn: addPost,

    onSuccess: (data, variables, context) => {
      console.log(data, variables, context);
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: true,
      });
    },
    onError: () => {},
    onSettled: () => {},
  });

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title") as string;
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === "on",
    );
    if (!title || !tags) return;

    mutate({ id: postData.length + 1, title, tags });
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="enter your post title"
          className="postbox"
        />

        <div className="tags">
          {tagsData?.map((tag: string) => {
            return (
              <div key={tag}>
                <input type="checkbox" name={tag} id={tag} />
                <label htmlFor={tag}>{tag}</label>
              </div>
            );
          })}
        </div>
        <button>Post</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{error?.message}</p>}
      {isPostError && <p onClick={() => reset()}>unable to post </p>}
      <div className="pages">
        <button
          onClick={() => setPage((page) => Math.max(page - 1, 0))}
          disabled={!postData?.prev}
        >
          prev
        </button>
        <span> page: {page} </span>
        <button
          onClick={() => setPage((page) => page + 1)}
          disabled={!postData?.next}
        >
          next
        </button>
      </div>

      {isFetched &&
        postData.data.map((post: Post) => {
          return (
            <div key={post.id} className="post">
              <div className="postTitle">{post?.title}</div>
              <div className="tags">
                {post.tags?.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}
