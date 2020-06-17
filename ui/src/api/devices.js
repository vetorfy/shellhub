import http from '../helpers/http';

const fetchDevices = async (perPage, page, search) => {
  let query = '';
  if (search === null) {
    query = `/devices?per_page=${perPage}&page=${page}`;
  } else {
    query = `/devices?per_page=${perPage}&page=${page}&filter=${search}`;
  }
  return http().get(query);
};

const removeDevice = async (uid) => http().delete(`/devices/${uid}`);

const renameDevice = async (data) => http().patch(`/devices/${data.uid}`, { name: data.name });

const getDevice = async (uid) => http().get(`/devices/${uid}`);

export default {
  fetchDevices,
  removeDevice,
  renameDevice,
  getDevice,
};
