'use client';

import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";


const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(true);
    
    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") setDarkMode(true);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <div className="relative w-16 h-8 flex items-center bg-gray-900 dark:bg-teal-400 cursor-pointer rounded-full p-1 transition-all duration-1000 ease-in-out"
             onClick={() => setDarkMode(!darkMode)}
        >
            <FaMoon className="text-white" size={18} />
            <div className="absolute bg-teal-400 dark:bg-medium w-6 h-6 rounded-full shadow-md transition-transform duration-1000 ease-in-out"
                 style={darkMode ? { transform: "translateX(0px)" } : { transform: "translateX(33px)" }}
            ></div>
            <BsSunFill className="ml-auto text-yellow-400" size={18} />
        </div>
    );
};

export default ThemeToggle;
