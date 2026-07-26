
export function isFilled(value: string,type: string): boolean {
    const trimmed = value.trim();
    
    // Handling date input
    if(type === "date"){
        return trimmed !== "" && !isNaN(Date.parse(trimmed));
    }

    // Handling number input
    if(type === 'number'){
        if(trimmed === "") return false;
        return !isNaN(Number(trimmed));
    }

    return trimmed !== "";
}