"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Calendar } from "@/shared/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover"

type DatePickerProps = {
    date?: Date | null
    onSelect?: (date: Date | undefined) => void
    children?: React.ReactNode
}

export function DatePicker({ date, onSelect, children }: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                {children || (
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date || undefined}
                    onSelect={onSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
} 