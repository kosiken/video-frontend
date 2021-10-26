export function shortenText(text: string, max: number): string {
    
    if(text.length > max) return (text.slice(0, max - 3) + "...")
    else return text;
}