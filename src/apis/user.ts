import axios from 'axios'
import { User } from '@/components/data-table/columns'

interface ApiUser {
  id: number
  firstName: string
  lastName: string
  age: number
  gender: string
  email: string
  phone: string
  birthDate?: string
  birthdate?: string
  dob?: string
}

export async function fetchUsers(): Promise<User[]> {
  const res = await axios.get<{ users: ApiUser[] }>('https://dummyjson.com/users')
  const users: User[] = res.data.users.map((user: ApiUser) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    gender: user.gender,
    email: user.email,
    phone: user.phone,
    // normalize possible date fields
    birthDate: user.birthDate ?? user.birthdate ?? user.dob ?? '',
  }))
  return users
}

export async function fetchUserById(id: number): Promise<User> {
  const res = await axios.get<ApiUser>(`https://dummyjson.com/users/${id}`)
  const u = res.data
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    age: u.age,
    gender: u.gender,
    email: u.email,
    phone: u.phone,
    birthDate: u.birthDate ?? u.birthdate ?? u.dob ?? '',
  }
}

export default fetchUsers
