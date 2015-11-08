angular.module('angularChat').controller('ChannelsCtrl', function ($state, Auth, Users, profile, channels) {
    Users.setOnline(profile.$id);
    var channel = this;
    channel.profile = profile;
    channel.channels = channels;
    channel.getDisplayName = Users.getDisplayName;
    channel.getDisplayImg = Users.getDisplayImg;
    channel.users = Users.all;
    channel.logout = function () {
        channel.profile.online = null;
        channel.profile.$save().then(function () {
            Auth.$unauth();
            $state.go('home');
        });
    };
    channel.newChannel = {
        name: ''
    };
    channel.createChannel = function () {
        channel.channels.$add(channel.newChannel).then(function (ref) {
            $state.go('channels.messages', {channelId: ref.key()});
        });
    };
});