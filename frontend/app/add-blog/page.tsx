"use client"
import { useProviderFunction } from '@/components/context/AppContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {toast} from 'react-toastify';

export default function AddBlog() {
    const {backendURL, token} = useProviderFunction();
    const router = useRouter();
    const [data, setData] = useState({
        title: "",
        description: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(prevData => ({...prevData, [name]: value}));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendURL}/blogs/add`, data, {headers: {token}});
            if(response.data.success) {
                toast.success(response.data.message);
                router.push('/');
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <form onSubmit={handleSubmit} className='max-w-[600px] w-full mx-auto'>
            <h1 className="mb-5 text-center font-semibold border-b text-xl">Add New Blog Post</h1>
            <label htmlFor="title">Title: </label>
            <input className="w-full mb-5 border-[1.5px] border-slate-800 outline-0 rounded-md p-2" type="text" name="title" id="title" placeholder="Add Blog Title" onChange={handleChange} value={data.title} />
            <label htmlFor="description">Description: </label>
            <textarea className="w-full mb-5 border-[1.5px] border-slate-800 outline-0 rounded-md p-2" name="description" id="description" placeholder="Enter Blog Description" rows={3} onChange={handleChange} value={data.description} ></textarea>
            <button type="submit" className="bg-black text-white p-1.5 max-w-[200px] w-full hover:opacity-80 rounded-md">Add</button>
        </form>
    )
}