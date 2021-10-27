import User, { Channel } from "./models/User";

export const DefaultUser: User = {
  id: 1,
  fullName: "Allison Kosy",
  email: "allisonkosy@gmail.com",
  birthdate: new Date(1998, 11, 22),
  username: "kosiken",
  country: "Nigeria",
  profilePic: "/images/me.jpeg",
  isCreator: true,
};

export const UserChannel: Channel = {
  user_id: 1,
  id: 1,

  name: "Allison Kosy",
  short_description:
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque, assumenda.",

  logo: "/images/me.jpeg",
  // banner?: string;
  follower_count: 234,
  about: `When the App Store launched in 2008, YouVersion was one of the first 200 free apps available. That first weekend, 83,000 people installed the Bible on their device. But now, a Community that started with 83,000 downloads in one weekend has nearly reached half a billion.`,
  like_count: 4022,
  video_count: 25,
};
