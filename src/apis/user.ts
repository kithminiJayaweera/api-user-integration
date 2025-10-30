import axios from 'axios';
import { User } from '@/components/data-table/columns';

interface ApiUser {
	id: number;
	firstName: string;
	lastName: string;
	age: number;
	gender: string;
	email: string;
	phone: string;
	birthDate: string;
}

export async function fetchUsers(): Promise<User[]> {
	const res = await axios.get<{ users: ApiUser[] }>('https://dummyjson.com/users');
	const users: User[] = res.data.users.map((user: ApiUser) => ({
		id: user.id,
		firstName: user.firstName,
		lastName: user.lastName,
		age: user.age,
		gender: user.gender,
		email: user.email,
		phone: user.phone,
		birthDate: user.birthDate,
	}));
	return users;
}

export default fetchUsers;
