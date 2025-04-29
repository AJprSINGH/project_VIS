export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'underwriter';
}

export interface Underwriter {
  id: string;
  name: string;
  dob: string;
  joiningDate: string;
  password?: string;
}

export interface VehicleInsurance {
  id?: string;
  vehicleNo: string;
  vehicleType: 'two-wheeler' | 'four-wheeler';
  customerName: string;
  engineNo: string;
  chassisNo: string;
  phoneNo: string;
  premiumAmount: number;
  type: 'Full Insurance' | 'Third Party';
  fromDate: string;
  toDate: string;
  underwriterId: string;
  createdAt?: Date;
}