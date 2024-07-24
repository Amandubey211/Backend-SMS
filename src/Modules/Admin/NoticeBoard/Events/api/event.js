import axios from 'axios';
import { baseUrl } from '../../../../../config/Common';

const token = localStorage.getItem('admin:token');

export const getEvents = async () => {
  try {
    const response = await axios.get(`${baseUrl}/admin/all/events`, {
      headers: {
        'Authentication': token
      }
    });
    return response.data.events;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const formData = new FormData();
    Object.keys(eventData).forEach(key => {
      formData.append(key, eventData[key]);
    });

    const response = await axios.post(`${baseUrl}/admin/create_event`, formData, {
      headers: {
        'Authentication': token,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const formData = new FormData();
    Object.keys(eventData).forEach(key => {
      formData.append(key, eventData[key]);
    });

    const response = await axios.put(`${baseUrl}/admin/update/event/${eventId}`, formData, {
      headers: {
        'Authentication': token,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${baseUrl}/admin/delete/event/${eventId}`, {
      headers: {
        'Authentication': token
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete event:', error);
    throw error;
  }
};
