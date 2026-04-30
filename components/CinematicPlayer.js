// components/CinematicPlayer.js
"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";

export default function CinematicPlayer({ src, onEnded }) {
    const videoRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Attempt to force play if the browser pauses it
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch((err) => {
                console.warn("Autoplay was prevented by the browser:", err);
                // Browsers block unmuted autoplay unless the user has interacted 
                // with the document first (which they do by clicking "Accept Mission").
            });
        }
    }, [src]);

    if (!src) return null;

    return (
        <div className="relative aspect-video w-full bg-black rounded-lg mb-6 overflow-hidden border border-white/5 shadow-2xl">

            {/* Loading State */}
            {isLoading && !hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 z-10">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                    <p className="text-sm text-gray-400 font-mono">Establishing connection...</p>
                </div>
            )}

            {/* Error State */}
            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/30 z-10">
                    <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                    <p className="text-sm text-red-400 font-mono">Signal lost. Video failed to load.</p>
                </div>
            )}

            {/* The Native HTML5 Video Player */}
            <video
                ref={videoRef}
                src={src}
                autoPlay
                playsInline
                disablePictureInPicture
                onCanPlay={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
                onEnded={onEnded}
                // pointer-events-none completely disables pausing, seeking, and right-clicking
                className="w-full h-full object-cover pointer-events-none"
            />
        </div>
    );
}