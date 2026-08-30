export enum EGender {
    Male = 'Male',
    Female = 'Female'
}

export type TUser = {
    id: string,
    email: string,
    name: string,
    gender: EGender,
    emailVerified: boolean,
    image: string | null,
    updatedAt: Date,
    createdAt: Date
}