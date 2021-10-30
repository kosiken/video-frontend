import { Channel } from "../models/User";

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

  export const sanitizedChannel = function (channel: any): Channel {
    

    const sanitizedChannel: Channel = {
      id: channel.id,
      user_id: channel.user,
      name: channel.name,
      about: channel.about,
      short_description: channel.shortDescription,
      logo: channel.logo,
      banner: channel.banner,
      follower_count: channel.followerCount,
      like_count: channel.likeCount,
      video_count: channel.videoCount,
      total_views: channel.totalViews
    };

    return sanitizedChannel;
    // TODO
  }