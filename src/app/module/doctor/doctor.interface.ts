export interface IUpdateDoctorSpecialtyPayload {
  specialtyId: string;
  shouldDelete?: boolean;
}

export interface IUpdateDoctorPayload {
  // password?: string;
  doctor?: {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    experience?: number;
    appointmentFee?: number;
    qualification?: string;
    currentWorkingPlace?: string;
  };
  specialties?: string[];
}
