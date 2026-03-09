/* 
import { Gender } from "../../../generated/prisma/enums";

export interface ICreateDoctorPayload {
  password: string;
  doctor: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    registrationNumber: string;
    experience: number;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
  };
  specialties: string[];
}
*/

export interface IUpdateDoctorPayload {
  password: string;
  doctor: {
    name: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    experience: number;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
  };
}
