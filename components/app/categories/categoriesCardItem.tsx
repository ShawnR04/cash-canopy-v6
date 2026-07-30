"use client"

import { DynamicIcon } from "@/lib/dynamicIcon";
import { useState, useTransition } from "react";
import UpdateCategoriesModal from "./updateCategoriesModal";

interface Category {
    name: string;
    icon: string;
    color: string;
}
export default function CategoriesCardItem({ category }: { category: Category}){
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const { name, icon, color} = category;
    return(
        <>
            <div 
                className="card"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div 
                    className="absolute"
                    style={{ backgroundColor: color}}
                />
            
                <div className="flex flex-col">
                    <div className="flex gap-5 items-center">
                        <div 
                            className="w-12 h-12 flex items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 shrink-0"
                            style={{
                                backgroundColor: `${color}20`,
                                color: color
                            }}
                        >
                            <DynamicIcon name={icon} className="w-6 h-6 stroke-[2.5]"/>
                        </div>
                        <div className="">
                            <h3 className="font-bold text-lg tracking-tight transition-colors"
                                style={{
                                    color:color
                                }}
                            >
                                {name}
                            </h3>
                        </div>
                    </div>

                    {/* TODO: Add the category analytics like how many transactiosn use it */}
                    <div className=""></div>
                </div>
            </div>

            {isOpen && (
                <UpdateCategoriesModal/>
            )}
        </>
    );
}