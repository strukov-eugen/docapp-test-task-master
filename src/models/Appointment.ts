import Patient from './Patient';
import Room from './Room';

export interface Status {
    code: string;
    title: string;
}

export default class Appointment {
    code: string = '';
    start_date: string = '';
    start_time: string = '';
    doctor_title: string = '';
    assistant: string = '';
    room_code: number = 0;
    patient_id: string = '';
    status: Status = { code: '', title: '' };
    update_time: number = Date.now();
    patient?: Patient;
    room?: Room;

    constructor(params: Partial<Appointment> = {}) {
        Object.assign(this, params);
    }
}