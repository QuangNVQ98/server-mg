const moment = require('moment');
const { mongo } = require('mongoose');
const socketioTwt = require('socketio-jwt');

/**
 * Import models
 */
const CommentRoomModel = require('./model/comment-room.model');
const CommentModel = require('./model/comment.model');
const NotificationModel = require('./model/notification.model');

module.exports = (io) => {
  let USERS = [];

  io.on('connection', socketioTwt.authorize({
    secret: process.env.JWT_KEY || 'dev',
    timeout: 5000
  }))
  .on('authenticated', socket => {
    console.log(`connected: ${socket.id} ${moment()}`);
    let existUser = USERS.find(u => u.profile._id == socket.decoded_token.profile._id);
    if (existUser) {
      existUser.sockets.push(socket.id);
    } else {
      USERS.push({...socket.decoded_token, sockets: [socket.id]});
    }
    socket.join(socket.decoded_token.profile._id);

    NotificationModel.find({
      receivers: {
        $elemMatch: {
          _id: mongo.ObjectID(socket.decoded_token.profile._id),
          readed: false
        }
      }
    }).countDocuments((err, count) => {
      if (!err) {
        socket.emit('notify', count);
      }
    });

    //Join room
    socket.on('joinTask', data => {
      socket.join(data.task_id, () => {
        io.to(data.task_id).emit('joinTask', 'OK');
      });
    });
    //Leave room
    socket.on('leaveTask', data => {
      socket.leave(data.task_id);
    });
    //Send message
    socket.on('sendComment', data => {
      const user = USERS.find(u => u.sockets.indexOf(socket.id) >= 0);
      if (user) {
        const comment = new CommentModel({
          task_id: mongo.ObjectID(data.task_id),
          sender_id: mongo.ObjectID(user.profile._id),
          content: data.content,
          sent_time: moment().utc().unix()
        });
        comment.save((err, c) => {
          if (!err){
            io.to(data.task_id).emit('receiveComment', {
              ...c.toObject(), 
              avatar: user.profile.avatar,
              full_name: user.profile.full_name,
              role: user.profile.role
            });
          }
        });
      }
    });

    socket.on('disconnect', (reason) => {
      USERS = USERS.filter(u => u.socket_id != socket.id);
      console.log(`disconnected: ${socket.id}, reason: ${reason}  ${moment()}`);
    });
  });
}