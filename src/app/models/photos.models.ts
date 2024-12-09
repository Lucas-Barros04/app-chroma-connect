export interface Photos
    {
        likes: number,
        imagen: string,
        name: string,
        descripcion: string,
        id: string,
        likedBy: string[];
        comments?: Comment[];
    }

export interface Comment {
    userId: string;
    username: string;
    text: string;
    timestamp: Date;
    }
