import { User } from '@/components/data-table/columns';

export const manualUsers: User[] = [
	{
		id: 1001,
		firstName: 'Alice',
		lastName: 'Johnson',
		age: 29,
		gender: 'female',
		email: 'alice.johnson@example.com',
		phone: '+1 555 123 4567',
		birthDate: '1996-01-15',
	},
	{
		id: 1002,
		firstName: 'Bob',
		lastName: 'Singh',
		age: 35,
		gender: 'male',
		email: 'bob.singh@example.com',
		phone: '+44 7700 900123',
		birthDate: '1990-06-30',
	},
];

export default manualUsers;
