export function shortenText(text: string, max: number): string {
    
    if(text.length > max) return (text.slice(0, max - 3) + "...")
    else return text;
}

export function toHHMMSS(secs: number) {
    var sec_num = Math.floor(secs);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor(sec_num / 60) % 60;
    var seconds = sec_num % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };