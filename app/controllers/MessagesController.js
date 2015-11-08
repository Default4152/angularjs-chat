angular.module('angularChat').controller('MessagesCtrl', function (profile, channelName, messages) {
    var messagesCtrl = this;
    messagesCtrl.messages = messages;
    messagesCtrl.channelName = channelName;
    messagesCtrl.message = '';
    messagesCtrl.sendMessage = function () {
        $(".message-contain").animate({
            scrollTop: $(document).height() + 1000
        }, "slow");
        if (messagesCtrl.message.length > 0) {
            messagesCtrl.messages.$add({
                uid: profile.$id,
                body: messagesCtrl.message,
                timestamp: Firebase.ServerValue.TIMESTAMP
            }).then(function () {
                messagesCtrl.message = '';
            });
        }
    }
});