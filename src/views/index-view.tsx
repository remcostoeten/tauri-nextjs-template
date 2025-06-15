"use client";

import { Button } from "@/shared/ui";
import { invoke } from "@tauri-apps/api/core";
import { useCallback, useState } from "react";

export default function IndexView() {
    const [greeted, setGreeted] = useState<string | null>(null);
    const greet = useCallback((): void => {
        invoke<string>("greet")
            .then((s) => {
                setGreeted(s);
            })
            .catch((err: unknown) => {
                console.error(err);
            });
    }, []);

    return (
        <div className="flex flex-col gap-2 items-start">
            <Button
                onClick={greet}
                title="Call &quot;greet&quot; from Rust"
            />
            <a href="/register" className="text-blue-500 hover:text-blue-700">register</a>
            <a href="/login" className="text-blue-500 hover:text-blue-700">login</a>
            <p className="break-words w-md">
                {greeted ?? "Click the button to call the Rust function"}
            </p>
        </div>
    );
}
