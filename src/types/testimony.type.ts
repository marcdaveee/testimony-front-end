import { IUser } from "./user.type";

export interface ITestimony {
  id: number;
  title: string;
  content: string;
  userId: number;
  user: IUser;
  createDate: Date;
  updateDate?: Date | null;
}
