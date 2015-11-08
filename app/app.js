angular
    .module('angularChat', [
        'firebase',
        'angular-md5',
        'ui.router'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html',
                resolve: {
                    requireNoAuth: function ($state, Auth) {
                        return Auth.$requireAuth().then(function (auth) {
                            $state.go('channels');
                        }, function (error) {
                            return;
                        });
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'AuthCtrl as authCtrl',
                resolve: {
                    requireNoAuth: function ($state, Auth) {
                        return Auth.$requireAuth().then(function (auth) {
                            var userEmail = auth.password.email;
                            $state.go('home');
                        }, function (error) {
                            return;
                        });
                    }
                }
            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/register.html',
                controller: 'AuthCtrl as authCtrl',
                resolve: {
                    requireNoAuth: function ($state, Auth) {
                        return Auth.$requireAuth().then(function (auth) {
                            var userEmail = auth.password.email;
                            $state.go('home');
                        }, function (error) {
                            return;
                        });
                    }
                }
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'views/users_profile.html',
                controller: 'ProfileCtrl as profileCtrl',
                resolve: {
                    auth: function ($state, Users, Auth) {
                        return Auth.$requireAuth().catch(function () {
                            $state.go('home');
                        });
                    },
                    profile: function (Users, Auth) {
                        return Auth.$requireAuth().then(function (auth) {
                            return Users.getProfile(auth.uid).$loaded();
                        });
                    }
                }
            }).
            state('channels', {
                url: '/channels',
                templateUrl: 'views/index.html',
                controller: 'ChannelsCtrl as channelsCtrl',
                resolve: {
                    channels: function (Channels) {
                        return Channels.$loaded();
                    },

                    profile: function ($state, Auth, Users) {
                        return Auth.$requireAuth().then(function (auth) {
                            return Users.getProfile(auth.uid).$loaded().then(function (profile) {
                                if (profile.displayName) {
                                    return profile;
                                } else {
                                    $state.go('profile');
                                }
                            });
                        }, function (error) {
                            $state.go('home');
                        });
                    }
                }
            }).
            state('channels.create', {
                url: '/create',
                templateUrl: 'views/create_channel.html',
                controller: 'ChannelsCtrl as channelsCtrl'

            }).
            state('channels.messages', {
                url: '/{channelId}/messages',
                controller: 'MessagesCtrl as messagesCtrl',
                templateUrl: 'views/messages.html',
                resolve: {
                    messages: function ($stateParams, Messages) {
                        return Messages.forChannel($stateParams.channelId).$loaded();
                    },
                    channelName: function ($stateParams, channels) {
                        return '#' + channels.$getRecord($stateParams.channelId).name;
                    }
                }
            }).
            state('channels.direct', {
                url: '/{uid}/messages/direct',
                templateUrl: 'views/messages.html',
                controller: 'MessagesCtrl as messagesCtrl',
                resolve: {
                    messages: function ($stateParams, Messages, profile) {
                        return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
                    },
                    channelName: function ($stateParams, Users) {
                        return Users.all.$loaded().then(function () {
                            return '@' + Users.getDisplayName($stateParams.uid);
                        });
                    }
                }
            });

        $urlRouterProvider.otherwise('/');
    })
    .constant('FirebaseUrl', 'https://cachat.firebaseio.com/');
