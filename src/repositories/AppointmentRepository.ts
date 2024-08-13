import Repository from './Repository';
import Appointment from '../models/Appointment';
import Room from '../models/Room';
import Patient from '../models/Patient';

export default class AppointmentRepository extends Repository<Appointment> {
    private appointments: Appointment[] = [];

    constructor() {
        super('appointments');
        this.appointments = this.getAll();
    }

    async fetchAppointments() {
        const response = await fetch('/data/rooms.json');
        const data = await response.json();
        const rooms: Room[] = []; // load rooms as needed
        const patients: Patient[] = []; // load patients as needed

        // Create Appointment objects from JSON data
        this.appointments = data.map((item: any) => {
            const room = rooms.find(r => r.code === item.code) || new Room(item.code, item.code);
            const patient = new Patient(
                item.appointment.first_name,
                item.appointment.last_name,
                item.appointment.gender,
                item.appointment.birthday,
                    { 
                        height_ft: item.appointment.vital_signs.height_ft,
                        height_in: item.appointment.vital_signs.height_in,
                        weight: item.appointment.vital_signs.weight,
                        bmi: item.appointment.vital_signs.bmi
                    }, 
                item.appointment.is_doctor);

            return new Appointment(
                item.appointment.code,
                item.appointment.start_date,
                item.appointment.start_time,
                item.appointment.doctor_title,
                item.appointment.assistant,
                item.code,
                item.appointment.first_name + item.appointment.last_name,
                item.status,
                item.update_time,
                patient,
                room
            );
        });

        this.save(this.appointments);
    }

    getAppointments() {
        return this.appointments;
    }
}
