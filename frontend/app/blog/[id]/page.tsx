// app/blog/[id].tsx
"use client";

import { useState, useEffect } from "react";
import { useProviderFunction } from "@/components/context/AppContext";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

type blogTypes = {
  _id: string;
  title: string;
  description: string;
  updatedAt: Date;
  createdAt: Date;
};

export default function BlogDetail() {
  const { backendURL, token } = useProviderFunction();
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<blogTypes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && token) {
      fetchBlogDetail();
    }
  }, [id, token]);

  const fetchBlogDetail = async () => {
    try {
      const response = await axios.get(`${backendURL}/blogs/${id}`, {
        headers: {
          token,
        },
      });
      if (response.data.success) {
        setBlog(response.data.blog);
      } else {
        toast.error(response.data.message);
        router.push("/"); // Redirect to the home page if there's an error
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="max-w-[800px] mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-600 mb-6">
        Created: {new Date(blog.createdAt).toLocaleString()}
      </p>
      <p className="text-gray-600 mb-6">
        Last Updated: {new Date(blog.updatedAt).toLocaleString()}
      </p>
      <div className="text-lg">{blog.description}</div>
      <button
        className="mt-4 bg-gray-300 p-2 rounded hover:bg-gray-400"
        onClick={() => router.push("/")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
