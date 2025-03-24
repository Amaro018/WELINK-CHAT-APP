export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  userInformation: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    imageUrl?: string;
  };
}
