import Patient from './Patient';
import Room from './Room';

export interface Status {
    code: string;
    title: string;
}

export default class Appointment {
    constructor(
        public code: string,
        public start_date: string,
        public start_time: string,
        public doctor_title: string,
        public assistant: string,
        public room_code: number,
        public patient_id: string,
        public status: Status,
        public update_time: number,
        public patient?: Patient,
        public room?: Room
    ) {}
}
