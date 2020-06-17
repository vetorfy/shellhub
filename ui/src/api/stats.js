/* eslint-disable arrow-body-style */
import http from '../helpers/http';
// import http from '@/helpers/http';

// eslint-disable-next-line import/prefer-default-export
export const
  getStats = async () => {
    return http().get('/stats');
  // eslint-disable-next-line eol-last
  };
