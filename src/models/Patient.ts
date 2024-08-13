export interface VitalSigns {
    height_ft: string;
    height_in: string;
    weight: string;
    bmi: string;
}

export default class Patient {
    constructor(
        public first_name: string,
        public last_name: string,
        public gender: string,
        public birthday: string | null,
        public vital_signs: VitalSigns,
        public is_doctor: boolean | undefined
    ) {
    }
}
