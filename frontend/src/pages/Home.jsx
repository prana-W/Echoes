import React from "react";


const EchoesVintage = () => {
    return (
        <div className="min-h-screen bg-[#1C1917] text-stone-100 flex items-center justify-center">
            <div className="max-w-4xl w-full px-6">
                <div className="rounded-2xl bg-[#292524] border border-amber-900/40 p-10 shadow-2xl">
                    <h1 className="text-4xl font-serif mb-4 text-amber-300">
                        Echoes
                    </h1>
                    <p className="italic text-amber-100/80 mb-6">
                        Letters written today, memories read tomorrow.
                    </p>

                    <p className="text-stone-300 max-w-xl mb-10">
                        Write to your future self or someone you love. Time will keep it safe until the right moment.
                    </p>

                    <div className="flex gap-4">
                        <button className="px-8 py-3 rounded-md bg-amber-700 hover:bg-amber-600 transition shadow-md">
                            Write a Letter
                        </button>
                        <button className="px-8 py-3 rounded-md border border-amber-600 text-amber-300 hover:bg-amber-600/10 transition">
                            Read Memories
                        </button>
                    </div>

                    <div className="mt-12 border-t border-amber-900/40 pt-6">
                        <p className="text-sm text-amber-200/70">
                            “Time changes everything, except the memories we choose to preserve.”
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EchoesVintage;
