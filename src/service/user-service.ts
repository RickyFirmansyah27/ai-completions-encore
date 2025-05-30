import { executeSQLQuery } from '../config/db-config';


const getAllUsers = () => {
  const query = 'SELECT * FROM "User"';

  return executeSQLQuery(query);
};


export default {
  getAllUsers,
};