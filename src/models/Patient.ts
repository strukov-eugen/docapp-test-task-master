export interface VitalSigns {
    height_ft: string;
    height_in: string;
    weight: string;
    bmi: string;
}

export default class Patient {
    first_name: string = '';
    last_name: string = '';
    gender: string = '';
    birthday: string | null = null;
    vital_signs: VitalSigns = { height_ft: '', height_in: '', weight: '', bmi: '' };
    is_doctor: boolean | undefined = undefined;

    constructor(params: Partial<Patient> = {}) {
        Object.assign(this, params);
    }
}