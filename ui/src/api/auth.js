import http from '../helpers/http';

// eslint-disable-next-line import/prefer-default-export
export const
  // eslint-disable-next-line arrow-body-style
  login = async (user) => {
    return http().post('/login', user);
  // eslint-disable-next-line eol-last
  };
