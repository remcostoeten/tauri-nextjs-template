"use client";

import { RoundedButton } from "@/components/_misc/RoundedButton";
import { invoke } from "@tauri-apps/api/core";
import Image from "next/image";
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
            <RoundedButton
                onClick={greet}
                title="Call &quot;greet&quot; from Rust"
            />
            <p className="break-words w-md">
                {greeted ?? "Click the button to call the Rust function"}
            </p>
        </div>
    );
}
