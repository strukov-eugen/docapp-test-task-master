import Repository from './Repository';
import Appointment from '../models/Appointment';
import Room from '../models/Room';
import Patient from '../models/Patient';

export default class AppointmentRepository extends Repository<Appointment> {
    constructor() {
        super(Appointment);
    }

    async fetchAppointments(): Promise<void> {
        try {
            const response = await fetch('/data/rooms.json');
            const data = await response.json();

            const appointments: Appointment[] = data.map((item: any) => {
                const { appointment } = item;
                const room = new Room(item);
                const patient = new Patient(appointment);
                return new Appointment({
                    code: appointment.code,
                    start_date: appointment.start_date,
                    start_time: appointment.start_time,
                    doctor_title: appointment.doctor_title,
                    assistant: appointment.assistant,
                    room_code: item.code,
                    patient_id: item.patient_id,
                    status: item.status,
                    update_time: item.update_time,
                    patient: patient,
                    room: room
                });
            });

            this.set(appointments.map(appointment => ({
                key: appointment.code, // Используем код как ключ
                item: appointment
            })));
            
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        }
    }

    getAppointments(): Appointment[] {
        // Извлекаем данные из Map и преобразуем их в массив
        return Array.from(this.getItems().values());
    }
}