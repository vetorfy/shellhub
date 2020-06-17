/* eslint-disable arrow-body-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable one-var */
import http from '../helpers/http';
// import http from '@/helpers/http';

// eslint-disable-next-line import/prefer-default-export
export const
  fetchSessions = async (perPage, page) => {
    return http().get(`/sessions?per_page=${perPage}&page=${page}`); 
  },

  getSession = async (uid) => {
    return http().get(`/sessions/${uid}`);
  },
  // eslint-disable-next-line no-trailing-spaces
  
  closeSession = async (session) => {
    return http().post(`/sessions/${session.uid}/close`, { device: session.device_uid });
  };
