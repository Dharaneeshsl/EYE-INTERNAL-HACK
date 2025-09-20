import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { ApiError } from '../utils/errors.js';

/**
 * Initialize Socket.io server and setup event handlers
 * @param {Server} io - Socket.io server instance
 */
export const initializeSocket = (io) => {
  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        return next(new ApiError('Authentication token required', 401));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new ApiError('Invalid authentication token', 401));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join form room for real-time updates
    socket.on('join:form', (formId) => {
      socket.join(`form:${formId}`);
      console.log(`Socket ${socket.id} joined form room: ${formId}`);
    });

    // Join analytics room for global updates
    socket.on('join:analytics', () => {
      if (socket.user.role === 'admin') {
        socket.join('analytics:global');
        console.log(`Admin ${socket.id} joined global analytics room`);
      }
    });

    // Handle form response submissions
    socket.on('response:submit', async (data) => {
      try {
        // Broadcast to form room
        io.to(`form:${data.formId}`).emit('response:new', {
          formId: data.formId,
          timestamp: new Date(),
          responseId: data.responseId
        });

        // Update analytics if admin is listening
        if (io.sockets.adapter.rooms.get('analytics:global')?.size > 0) {
          // You would typically call your analytics service here
          // const stats = await AnalyticsService.getFormStatistics(data.formId);
          io.to('analytics:global').emit('analytics:update', {
            formId: data.formId,
            type: 'new_response',
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('Socket error:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Handle server errors
  io.on('error', (error) => {
    console.error('Socket.io server error:', error);
  });
};

export default initializeSocket;