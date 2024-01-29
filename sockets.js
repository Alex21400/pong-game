let readyPlayerCount = 0;

function listen(io) {
    const pongGameNamespace = io.of('/pongGame');
    
    pongGameNamespace.on('connection', (socket) => {
        let room;

        socket.on('ready', () => {
            room = 'room - ' + Math.floor(readyPlayerCount / 2);
            socket.join(room);

            console.log(`An user: ${socket.id} has entered ${room}.`);
            console.log(`Player: ${socket.id} is ready...`);

            readyPlayerCount++;
    
            if(readyPlayerCount % 2 === 0) {
                pongGameNamespace.to(room).emit('startGame', socket.id)
            }
        });
    
        socket.on('paddleMove', (paddleData) => {
          socket.to(room).emit('paddleMove', paddleData);
        });
  
        socket.on('ballMove', (ballData) => {
          socket.to(room).emit('ballMove', ballData);
        });
  
        socket.on('disconnect', (reason) => {
          console.log(`Client ${socket.id} disconnected: ${reason}`);
          // Leave the room
          socket.leave(room);
        });
    });
}

module.exports = {
    listen
}