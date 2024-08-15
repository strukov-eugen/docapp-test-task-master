const roomsScheme = {
    controllers: [
        {
            name: 'RoomsController',
            view: 'RoomsView',
            repositories: ['AppointmentRepository'],
        }
    ],
    access: {
        role: 'admin'
    }
};

export default roomsScheme;