/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { format } from 'date-fns';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/ui/phone-input';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { BirthDateAgePicker } from '@/components/ui/birth-date-age-picker';
import { UserSchema, User } from '@/components/data-table/columns';
import { calculateAgeFromBirthDate } from '@/lib/date';

type Props = {
	initialData?: User;
	isEdit?: boolean;
	onSubmit: (data: User) => Promise<void> | void;
	onOpenChange?: (open: boolean) => void;
	useReactQuery?: boolean; // Optional: enable React Query mutations
};

export function CustomForm({ initialData, isEdit, onSubmit, onOpenChange }: Props) {
	const [birthDate, setBirthDate] = React.useState<Date | undefined>(
		initialData ? (initialData.birthDate ? new Date(initialData.birthDate) : undefined) : undefined
	);
	const [age, setAge] = React.useState<number | undefined>(initialData?.age);
	const [phone, setPhone] = React.useState<string>(initialData?.phone ?? '');
	const [genderVal, setGenderVal] = React.useState<string>(initialData?.gender ?? '');
	const [errors, setErrors] = React.useState<Record<string, string>>({});

	// keep internal values synced when editing an existing user
	React.useEffect(() => {
		if (initialData) {
			setPhone(initialData.phone ?? '');
			setGenderVal(initialData.gender ?? '');
			const birthDateObj = initialData.birthDate ? new Date(initialData.birthDate) : undefined;
			setBirthDate(birthDateObj);
			// Calculate age from birthDate if available
			const calculatedAge = birthDateObj ? calculateAgeFromBirthDate(birthDateObj) : initialData.age;
			setAge(calculatedAge);
		}
	}, [initialData]);

	// helper to clear a specific field error when the field changes
	const clearFieldError = (field: string) => {
		setErrors((prev) => {
			const next = { ...prev };
			delete (next as any)[field];
			return next;
		});
	};

	// Validate a single field using Zod by picking that field from the schema
	const validateField = (field: string, value: any) => {
		try {
			const fieldSchema = (UserSchema as any).pick({ [field]: true });
			const parsed = fieldSchema.safeParse({ [field]: value });
			if (!parsed.success) {
				setErrors((prev) => ({ ...prev, [field]: parsed.error.issues[0].message }));
				return false;
			}
			// valid
			setErrors((prev) => {
				const next = { ...prev };
				delete (next as any)[field];
				return next;
			});
			return true;
		} catch {
			// Fallback: clear the error so we don't block the user
			setErrors((prev) => {
				const next = { ...prev };
				delete (next as any)[field];
				return next;
			});
			return true;
		}
	};

	return (
		<form
			onSubmit={async (e) => {
				    e.preventDefault();
				    console.log('📝 Form onSubmit triggered!', { isEdit });
				    const formData = new FormData(e.target as HTMLFormElement);
				const birthDateStr = birthDate ? format(birthDate, 'yyyy-MM-dd') : '';

				// Calculate age from birthDate if available
				const calculatedAge = birthDate ? calculateAgeFromBirthDate(birthDate) : age;

				const rawData = {
					firstName: (formData.get('firstName') as string) ?? '',
					lastName: (formData.get('lastName') as string) ?? '',
					age: calculatedAge || 0,
					gender: (formData.get('gender') as string) ?? '',
					email: (formData.get('email') as string) ?? '',
					phone: phone,
					birthDate: birthDateStr,
					// Preserve MongoDB _id and timestamps when editing
					...(initialData?._id && { _id: initialData._id }),
					...(initialData?.createdAt && { createdAt: initialData.createdAt }),
					...(initialData?.updatedAt && { updatedAt: initialData.updatedAt }),
				} as unknown as User;

				console.log('📦 Raw form data:', rawData);

				try {
					console.log('🔍 Validating with UserSchema...');
					const validatedData = UserSchema.parse(rawData);
					console.log('✅ Validation passed!', validatedData);
					console.log('🚀 Calling onSubmit handler...');
					await Promise.resolve(onSubmit(validatedData));
					console.log('✅ onSubmit completed successfully!');
					(e.target as HTMLFormElement).reset();
					setBirthDate(undefined);
					setAge(undefined);
					setPhone('');
					setErrors({});
					onOpenChange?.(false);
				} catch (error: any) {
					console.error('❌ Form validation or submission error:', error);
					console.error('❌ Error details:', error?.issues || error?.message);
					const fieldErrors: Record<string, string> = {};
					if (error?.issues) {
						error.issues.forEach((err: any) => {
							fieldErrors[err.path?.[0]] = err.message;
						});
					}
					setErrors(fieldErrors);
					console.log('❌ Field errors set:', fieldErrors);
				}
			}}
			className="space-y-4"
		>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


				<div>
					<label className="mb-1 block text-sm font-medium">First Name</label>
					<Input
						name="firstName"
						placeholder="Enter First Name"
						onChange={() => clearFieldError('firstName')}
						onBlur={(e) => validateField('firstName', (e.target as HTMLInputElement).value)}
						defaultValue={initialData?.firstName}
					/>
					{errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
					
				</div>

				<div>
					<label className="mb-1 block text-sm font-medium">Last Name</label>
					<Input
						name="lastName"
						placeholder="Enter Last Name"
						onChange={() => clearFieldError('lastName')}
						onBlur={(e) => validateField('lastName', (e.target as HTMLInputElement).value)}
						defaultValue={initialData?.lastName}
					/>
					{errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
					
				</div>

				<div>
					<label className="mb-1 block text-sm font-medium">Gender</label>
					<Select value={genderVal} onValueChange={(val) => { setGenderVal(val); validateField('gender', val); }}>
						<SelectTrigger>
							<SelectValue placeholder="Gender" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="male">Male</SelectItem>
							<SelectItem value="female">Female</SelectItem>
							<SelectItem value="other">Other</SelectItem>
						</SelectContent>
					</Select>
					{/* keep a hidden input so FormData submission still contains gender */}
					<input type="hidden" name="gender" value={genderVal} />
					{errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
				</div>

				<div>
					<label className="mb-1 block text-sm font-medium">Email</label>
					<Input
						name="email"
						type="email"
						placeholder="Enter Email"
						onChange={() => clearFieldError('email')}
						onBlur={(e) => validateField('email', (e.target as HTMLInputElement).value)}
						defaultValue={initialData?.email}
					/>
					{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
					
				</div>

				<div className="sm:col-span-2">
					<label className="mb-1 block text-sm font-medium">Phone</label>
					<PhoneInput
						name="phone"
						value={phone}
						onChange={(v) => {
							setPhone(v);
							validateField('phone', v);
						}}
						placeholder="Enter phone number"
					/>
					{errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
					
				</div>

				<div className="sm:col-span-2">
					<BirthDateAgePicker
						birthDate={birthDate}
                        onBirthDateChange={(d) => {
							setBirthDate(d);
							// Calculate and update age when birthdate changes
							const calcAge = d ? calculateAgeFromBirthDate(d) : undefined;
							setAge(calcAge);
							// validate birthDate and age on change so errors show immediately
							if (d) {
								const birthStr = format(d, 'yyyy-MM-dd');
								validateField('birthDate', birthStr);
								validateField('age', calcAge ?? 0);
							} else {
								// clear errors if cleared
								setErrors((prev) => {
									const next = { ...prev };
									delete (next as any)['birthDate'];
									delete (next as any)['age'];
									return next;
								});
							}
							clearFieldError('birthDate');
							// also clear age error when birth date changes
							clearFieldError('age');
						}}
						onAgeChange={(a) => {
							setAge(a);
							clearFieldError('age');
						}}
						birthDateError={errors.birthDate}
						ageError={errors.age}
						className="space-y-4"
					/>
					
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Button 
					type="submit" 
					className="flex-1"
					onClick={() => {
						console.log('🖱️ Update/Add button clicked!', { 
							isEdit, 
							type: 'submit',
							hasErrors: Object.keys(errors).length > 0,
							errors 
						});
						// Don't prevent default - let form submit naturally
					}}
				>
					{isEdit ? 'Update User' : 'Add User'}
				</Button>
				<Button
					type="button"
					variant="ghost"
					className="w-32"
					onClick={() => {
						console.log('🖱️ Cancel button clicked');
						onOpenChange?.(false);
					}}
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}

export default CustomForm;
