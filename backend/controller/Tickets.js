import { uploadToCloudinary } from '../middleware/uploadToCloudinary.js';
import Ticket from '../model/Ticket.js';

export const createTicket = async (req, res) => {
  try {
    console.log('Incoming request');
    const { name, email, mobileNumber, category, message } = req.body;
    console.log('Body:', req.body);

    let fileUrl = '';
    let filePublicId = '';

    if (req.file) {
      console.log('File found:', req.file.originalname);
      const result = await uploadToCloudinary(req.file.buffer, 'support_tickets', req.file.originalname);
      fileUrl = result.secure_url;
      filePublicId = result.public_id;
    }

    const ticket = await Ticket.create({
      name,
      email,
      mobileNumber,
      category,
      message,
      fileUrl,
      filePublicId
    });

    console.log('Ticket created:', ticket);
    res.status(201).json({ success: true, ticket });
  } catch (error) {
    console.error('Full error creating ticket:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Ticket creation failed",
      details: error,
    });
  }
};


//get apiexport 

export const getTickets = async (req, res) => {
  try {
    let { status } = req.query;

    const filter = {};
    if (status) {
      status = status.toUpperCase(); // convert to uppercase
      if (status === 'OPEN' || status === 'CLOSED') {
        filter.status = status;
      }
    }

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets',
    });
  }
};


//get by id

export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
    });
  }
};

//update api


export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.status) {
      updateData.status = updateData.status.toUpperCase();
    }

    const ticket = await Ticket.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      ticket,
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update ticket',
    });
  }
};


//update ticket status

export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;

    if (!status || !['OPEN', 'CLOSED'].includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values are OPEN or CLOSED.',
      });
    }

    status = status.toUpperCase();

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Ticket status updated to ${status}`,
      ticket,
    });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update ticket status',
    });
  }
};


//delete ticket


export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete ticket',
    });
  }
};


//reply
export const addReplyToTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, repliedBy } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Reply message is required' });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (ticket.status !== 'OPEN') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reply to a closed ticket',
      });
    }

    let fileUrl = '';
    let filePublicId = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'ticket_replies', req.file.originalname);
      fileUrl = result.secure_url;
      filePublicId = result.public_id;
    }

    ticket.replies.push({
      message,
      repliedBy: repliedBy || 'admin',
      fileUrl,
      filePublicId,
    });

    await ticket.save();

    return res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      ticket,
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add reply',
    });
  }
};

//assign ticket 

export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({ message: 'assignedTo is required' });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { assignedTo },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket assigned successfully', ticket: updatedTicket });
  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
