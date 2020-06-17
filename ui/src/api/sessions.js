/* eslint-disable arrow-body-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable one-var */
import http from '../helpers/http';

export const
  fetchSessions = async (perPage, page) => {
    return http().get(`/sessions?per_page=${perPage}&page=${page}`); 
  },

  getSession = async (uid) => {
    return http().get(`/sessions/${uid}`);
  },
  
  closeSession = async (session) => {
    return http().post(`/sessions/${session.uid}/close`, { device: session.device_uid });
  };
