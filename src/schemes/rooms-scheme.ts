const roomsScheme = {
    controllers: [
        {
            name: 'RoomsController',
            model: 'Room',
            view: 'RoomsView',
            repositories: ['AppointmentRepository'],
        }
    ],
};

export default roomsScheme;