/* eslint-disable arrow-body-style */
/* eslint-disable one-var */
import http from '../helpers/http';
// import http from '@/helpers/http';

export const
  fetchDevices = async (perPage, page, search) => {
    let query = '';
    // eslint-disable-next-line no-trailing-spaces
    if (search === null) { 
      query = `/devices?per_page=${perPage}&page=${page}`;
    } else {
      query = `/devices?per_page=${perPage}&page=${page}&filter=${search}`;
    }
    return http().get(query);
  },

  removeDevice = async (uid) => {
    return http().delete(`/devices/${uid}`);
  },

  // eslint-disable-next-line arrow-body-style
  renameDevice = async (data) => {
    return http().patch(`/devices/${data.uid}`, { name: data.name });
  },

  // eslint-disable-next-line arrow-body-style
  getDevice = async (uid) => {
    return http().get(`/devices/${uid}`);
  };
