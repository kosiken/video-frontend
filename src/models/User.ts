

export default interface User {
    id: number;
    email: string;
    username: string;
    birthdate: Date;
    country: string;
    profilePic: string;
    fullName: string;
    password?: string;
}