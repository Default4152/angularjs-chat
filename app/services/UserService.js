angular.module('angularChat').factory('Users', function ($firebaseArray, $firebaseObject, FirebaseUrl) {
    var usersRef = new Firebase(FirebaseUrl + 'users');
    var users = $firebaseArray(usersRef);
    var connectedRef = new Firebase(FirebaseUrl + '.info/connected');
    var Users = {
        getProfile: function (uid) {
            return $firebaseObject(usersRef.child(uid));
        },
        getDisplayName: function (uid) {
            return users.$getRecord(uid).displayName;
        },
        getDisplayImg: function (uid) {
            return users.$getRecord(uid).displayImg;
        },
        all: users,
        setOnline: function (uid) {
            var connected = $firebaseObject(connectedRef);
            var online = $firebaseArray(usersRef.child(uid + '/online'));

            connected.$watch(function () {
                if (connected.$value === true) {
                    online.$add(true).then(function (connectedRef) {
                        connectedRef.onDisconnect().remove();
                    });
                }
            });
        }
    };
    return Users;
});