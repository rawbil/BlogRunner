import { useEffect, useState } from "react";
import { useProviderFunction } from "./context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";

type blogTypes = {
  _id: string;
  description: string;
  title: string;
  updatedAt: Date;
  createdAt: Date;
};

export default function Dashboard() {
  const { backendURL, token } = useProviderFunction();
  const [blogList, setBlogList] = useState([]);
  const [username, setUsername] = useState('');
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchBlogsList();
      fetchUserName();
    }
  }, []);

  const fetchBlogsList = async () => {
    try {
      const response = await axios.get(`${backendURL}/blogs/list`, {
        headers: {
          token,
        },
      });
      if (response.data.success) {
       //   console.log(response.data.blogs);
        setBlogList(response.data.blogs);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //fetch username
  const fetchUserName = async () => {
    try {
        const response = await axios.get(`${backendURL}/auth/username`, {headers: {token}});
        if(response.data.success) {
            setUsername(response.data.user.username);
          //  console.log(response.data.user.username);
        }
    } catch (error) {
       console.log(error); 
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog? ")) return;
    try {
      const response = await axios.post(
        `${backendURL}/blogs/delete/${id}`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchBlogsList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1 className="text-center text-xl">
        Welcome <span className="text-orange-400 font-bold mb-10">{username}</span>
      </h1>

      <section className="px-4  max-w-[800px] w-full mx-auto">
        <div className="flex justify-end mt-10 mb-5">
          <button
            className="pr-4 bg-green-500 text-white p-2 rounded-md hover:opacity-90"
            onClick={() => router.push("/add-blog")}
          >
            +Add New
          </button>
        </div>
        <h1 className="font-bold text-2xl mb-5">My Blogs</h1>
        {blogList && blogList.length ? (
  <ul className="flex flex-col justify-center">
         { blogList.map((blog: blogTypes) => (
            <li key={blog._id} className="bg-gray-300 p-2 rounded-md mb-5">
              <div className="border-b border-gray-400 mb-2 flex justify-between items-center">
                <h1 className="text-xl">{blog.title}</h1>
                <div className="flex gap-2 p-2">
                  <button
                    className="p-1 bg-green-600 rounded text-white hover:opacity-80"
                    onClick={() => router.push(`/edit-blog/${blog._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="bg-red-500 p-1 rounded text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex text-xs justify-between text-gray-500">
                <p>CreatedAt: {new Date(blog.createdAt).toLocaleString()}</p>
                <p>UpdatedAt: {new Date(blog.updatedAt).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
        ) : (
            <div>No blogs available. Add to view </div>
        )}
      
      </section>
    </div>
  );
}
