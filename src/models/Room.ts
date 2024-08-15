export default class Room {
    code: number = 0;
    room_number: number = 0;

    constructor(params: Partial<Room> = {}) {
        Object.assign(this, params);
    }
}