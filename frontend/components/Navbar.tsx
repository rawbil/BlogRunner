"use client"

import Link from "next/link";
import { useEffect, useState } from "react"

export default function Navbar() {
    const [showNavbar, setShowNavbar] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        setShowNavbar(!!token);
    }, []);
    if(!showNavbar) return null;
    
    //handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    }
    return (
        <nav className="flex justify-between items-center px-4 shadow py-3 mb-5">
            <h1 className="font-extrabold text-xl font-serif">
                <Link href={'/'}>Blogs</Link>
            </h1>
            <ul className="flex items-center gap-10">
                <li className="text-lg hover:underline">
                    <Link href={'/'}>Home</Link>
                </li>
                <li className="text-lg hover:underline">
                    <Link href={'/about'}>About</Link>
                </li>
            </ul>
            <button onClick={handleLogout} className="bg-red-500 hover:opacity-90 p-1.5 rounded text-white">Logout</button>
        </nav>
    )
}