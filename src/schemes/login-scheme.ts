const loginScheme = {
    controllers: [
        {
            name: 'LoginController',
            view: 'LoginView',
            repositories: ['UserRepository'],
        },
    ],
    access: {
        role: 'user'
    }
};

export default loginScheme;