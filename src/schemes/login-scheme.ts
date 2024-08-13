const loginScheme = {
    controllers: [
        {
            name: 'LoginController',
            model: 'User',
            view: 'LoginView',
            repositories: ['UserRepository'],
        },
    ],
};

export default loginScheme;