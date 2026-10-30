import axios from "axios";

const API = "http://localhost:5000/api/jobs";

export const getJobs = () => axios.get(API);

export const createJob = (job) => axios.post(API, job);