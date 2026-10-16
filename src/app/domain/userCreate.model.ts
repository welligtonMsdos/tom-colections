export interface UserCreateDto {
    name: string;
    email: string;
    password: string;
}

export interface UserSignUpDto extends UserCreateDto {
    role: number;
}
