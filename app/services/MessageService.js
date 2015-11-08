angular.module('angularChat').factory('Messages', function ($firebaseArray, FirebaseUrl) {
    var channelsMessagesRef = new Firebase(FirebaseUrl + 'channelMessages');
    var userMessagesRef = new Firebase(FirebaseUrl + 'userMessages');
    return {
        forChannel: function (channelId) {
            return $firebaseArray(channelsMessagesRef.child(channelId));
        },
        forUsers: function (uid1, uid2) {
            var path = uid1 < uid2 ? uid1 + '/' + uid2 : uid2 + '/' + uid1;
            return $firebaseArray(userMessagesRef.child(path));
        }
    }
});