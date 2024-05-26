import React from 'react';
import {cn} from "@/utils/cn";


export default function Container(props: React.HTMLProps<HTMLDivElement>) {
    return (
        <div
            {...props}
            className={cn(
                'w-full bg-white text-slate-950 border border-black rounded-xl flex py-4 shadow-sm dark:bg-box dark:text-white dark:border-white', 
                props.className
            )}
        />
    );
}