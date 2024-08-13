import Room from '../models/Room';
import RoomsView from '../views/RoomsView';
import AppointmentRepository from '../repositories/AppointmentRepository';
import ConsentForms from '../forms/ConsentForms';

export default class RoomsController {
    private view: RoomsView;
    private appointmentRepo: AppointmentRepository;
    private consentForms: ConsentForms;

    constructor(
        model: Room,
        view: RoomsView,
        appointmentRepo: AppointmentRepository
    ) {
        this.view = view;
        this.appointmentRepo = appointmentRepo;
        this.consentForms = new ConsentForms();
    }

    async init() {
        await this.appointmentRepo.fetchAppointments();
        const appointments = this.appointmentRepo.getAppointments();
        this.view.renderRooms(appointments);
        // Рендер форм согласия
        fetch('/data/consent-forms.json')
            .then(response => response.json())
            .then(consentForms => this.consentForms.renderForms(consentForms));
    }
}
