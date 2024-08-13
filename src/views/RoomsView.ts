import Appointment from '../models/Appointment';

export default class RoomsView {
    private container: HTMLElement;

    constructor(model: any) {
        this.container = document.getElementById('rooms-container') as HTMLElement;
    }

    renderRooms(appointments: Appointment[]) {
        this.container.innerHTML = this.generateTableHTML(appointments);
        this.addRowClickHandlers(appointments);
    }

    private generateTableHTML(appointments: Appointment[]): string {
        return `
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Room</th>
                            <th>Patient</th>
                            <th>Status</th>
                            <th>Appointment Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appointments.map(this.generateRowHTML).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    private generateRowHTML = (app: Appointment): string => `
        <tr class="room-row" data-room-id="${app.room_code}">
            <td>Room ${app.room_code}</td>
            <td>${app.patient?.first_name} ${app.patient?.last_name}</td>
            <td>${app.status.title}</td>
            <td>${this.formatDate(app.start_time)}</td>
        </tr>
    `;

    private addRowClickHandlers(appointments: Appointment[]) {
        this.container.querySelectorAll('.room-row').forEach(row => {
            row.addEventListener('click', (event) => {
                const roomCode = Number((event.currentTarget as HTMLElement).dataset.roomId);
                const appointment = appointments.find(app => app.room_code === roomCode);
                
                if (appointment) {
                    this.showAppointmentDetails(event.currentTarget as HTMLElement, appointment);
                }
            });
        });
    }

    private showAppointmentDetails(rowElement: HTMLElement, appointment: Appointment) {
        const existingDetails = rowElement.nextElementSibling;
        if (existingDetails && existingDetails.classList.contains('appointment-details')) {
            existingDetails.remove();
        }
        
        rowElement.insertAdjacentHTML('afterend', this.generatePatientDetailsHTML(appointment));
    }

    private generatePatientDetailsHTML(appointment: Appointment): string {
        const currentPatient = appointment.patient!;
        const patientNamePrefix = this.getPatientNamePrefix(currentPatient);

        return `
            <tr class="appointment-details">
                <td colspan="4">
                    <div><strong>Room:</strong> ${appointment.room_code}</div>
                    <div><strong>Date:</strong> ${this.formatDate(appointment.start_time)}</div>
                    <div><strong>Vital Signs:</strong> HT: ${currentPatient.vital_signs.height_ft}'${currentPatient.vital_signs.height_in}'' 
                         WT: ${currentPatient.vital_signs.weight}lbs., BMI: ${currentPatient.vital_signs.bmi}</div>
                    <div><strong>Patient:</strong> ${patientNamePrefix} ${currentPatient.first_name} ${currentPatient.last_name}, 
                         ${this.calculateAge(currentPatient.birthday!)} years, ${currentPatient.gender.charAt(0)}</div>
                </td>
            </tr>
        `;
    }

    private getPatientNamePrefix(patient: any): string {
        return patient.is_doctor 
            ? 'Dr.'
            : patient.gender === 'Male'
                ? 'Mr.'
                : 'Ms.';
    }

    private formatDate(date: string): string {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
    }
    
    private calculateAge(birthday: string | null): number {
        if (!birthday) return 0;
        const birthDate = new Date(birthday);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
}