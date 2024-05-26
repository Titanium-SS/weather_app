"use client";

import React from "react";
import { MdNightsStay, MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import SearchBox from "./SearchBox";
import { useState } from "react";
import axios from "axios";
import { loadingCityAtom, placeAtom } from "@/app/atom";
import { useAtom } from "jotai";
import ThemeToggle from "./ThemeToggle";

type Props = { location?: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [place, setPlace] = useAtom(placeAtom);
    const [_, setLoadingCity] = useAtom(loadingCityAtom);
    const [darkMode, setDarkMode] = useState("");

    async function handleInputChange(value: string) {
        setCity(value);
        if (value.length >= 3) {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
                );

                const suggestions = response.data.list.map((item: any) => item.name);
                setSuggestions(suggestions);
                setError("");
                setShowSuggestions(true);
            } catch (error) {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }

    function handleSuggestionClick(value: string) {
        setCity(value);
        setShowSuggestions(false);
    }

    async function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
        setLoadingCity(true);
        e.preventDefault();
        if (suggestions.length === 0) {
            setError("Location not found");
            setLoadingCity(false);
        } else {
            setError("");
            setTimeout(() => {
                setLoadingCity(false);
                setPlace(city);
                setShowSuggestions(false);
            }, 500);
        }
    }

    function handleCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    setLoadingCity(true);
                    const response = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
                    );
                    setTimeout(() => {
                        setLoadingCity(false);
                        setPlace(response.data.name);
                    }, 500);
                } catch (error) {
                    setLoadingCity(false);
                }
            });
        }
    }

    // function to change icon according to current mode (light or dark)

    // function icon() {
    //     const theme = localStorage.getItem("theme");
        
    //     console.log("Current theme:", theme);

    //     if (theme === "dark") {
    //         return <MdNightsStay className="text-3xl mt-1 text-gray-300" />;
    //     } else {
    //         return <MdWbSunny className="text-3xl mt-1 text-yellow-300" />;
    //     }
    // }

    return (
        <>
            <nav className={`shadow-sm sticky top-0 left-0 z-50 bg-white dark:bg-dark`}>
                <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
                <div className="flex items-center justify-center gap-2 ">
                <h2 className={`text-3xl text-gray-500 dark:text-teal-300`}>Weather</h2>
                <h2 className={`text-3xl mt-1 text-yellow-300 dark:text-gray-300`}>
                    <div className={darkMode ? 'dark:' : ''}>
                        {darkMode ? <MdNightsStay /> : <MdWbSunny />}
                    </div>
                </h2>
                </div>

                    <section className="flex gap-3 items-center">
                        <MdMyLocation
                            title="Your Current Location"
                            onClick={handleCurrentLocation}
                            className={`text-2xl text-gray-400 dark:text-gray-300} hover:opacity-80 cursor-pointer`}
                        />
                        <MdOutlineLocationOn className={`text-3xl text-gray-500 dark:text-gray-300}`} />
                        <p className={`text-slate-900/80 dark:text-slate-300 text-sm`}> {location} </p>
                        <div className="relative hidden md:flex">
                            <SearchBox
                                value={city}
                                onSubmit={handleSubmitSearch}
                                onChange={(e) => handleInputChange(e.target.value)}
                            />
                            <SuggestionBox
                                showSuggestions={showSuggestions}
                                suggestions={suggestions}
                                handleSuggestionClick={handleSuggestionClick}
                                error={error}
                            />
                            <div className="px-3 py-1 justify-end">
                                <ThemeToggle />
                            </div>
                        </div>
                    </section>
                </div>
            </nav>
            <section className="flex max-w-7xl px-3 md:hidden ">
                <div className="relative ">
                    <SearchBox
                        value={city}
                        onSubmit={handleSubmitSearch}
                        onChange={(e) => handleInputChange(e.target.value)}
                    />
                    <SuggestionBox
                        showSuggestions={showSuggestions}
                        suggestions={suggestions}
                        handleSuggestionClick={handleSuggestionClick}
                        error={error}
                    />
                </div>
                <div className="flex flex-1 py-1 justify-end">
                    <ThemeToggle />
                </div>
            </section>
        </>
    );
}

function SuggestionBox({
    showSuggestions,
    suggestions,
    handleSuggestionClick,
    error
}: {
    showSuggestions: boolean;
    suggestions: string[];
    handleSuggestionClick: (item: string) => void;
    error: string;
}) {
    return (
        <>
            {((showSuggestions && suggestions.length > 1) || error) && (
                <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
                    {error && suggestions.length < 1 && (
                        <li className="text-red-500 p-1 "> {error}</li>
                    )}
                    {suggestions.map((item, i) => (
                        <li
                            key={i}
                            onClick={() => handleSuggestionClick(item)}
                            className="cursor-pointer p-1 rounded hover:bg-gray-200"
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
