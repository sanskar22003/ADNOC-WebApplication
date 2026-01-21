import Urls from "../config/urls";
import http from "./http";

export const fetchUsers = async (role = null) => {
  try {
    let url = Urls.users;

    if (role.length > 0) {
      const roles =
        role === "admin"
          ? ["operator", "crypto_admin", "content_admin", "admin"]
          : [role];
      const query = roles.map((r) => `role=${encodeURIComponent(r)}`).join("&");

      url += `?${query}`;
    }

    const response = await http.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUsers = async () => {
  const response = await http.post(`${Urls.users}`);
  return response.data;
};


export const uploadAssets = async (formData) => {
  const response = await http.post(`/upload-master-tags`, formData); 
  return response.data;
};


export const editUsers = async (id, data) => {
  const response = await http.put(`${Urls.users}/${id}`, data);
  return response.data;
};

export const deleteUsers = async (id, data) => {
  const response = await http.delete(`${Urls.users}/${id}`, data);
  return response.data;
};

export const createAdmin = async (data) => {
  const response = await http.post(`${Urls.registeradmin}`, data);
  return response.data;
};

export const companyList = async (data) => {
  const response = await http.get(`${Urls.companylist}`, data);
  return response.data;
};
export const alerts = async ({ queryKey }) => {
  const [_key, page, limit] = queryKey;
  const response = await http.get(`/alerts?page=${page}&limit=${limit}`);
  return response.data;
};


export const assets = async ({ queryKey }) => {
  const [_key, page, size] = queryKey;
  const response = await http.get(
    `/tag_master?page=${page}&size=${size}`
  );
  return response.data; 
  // expected: { data: [...], total, page, size }
};


export const alertsDashboard = async () => {
  const response = await http.get(`/alerts`);
  return response.data;
};
// export const alerts = async ({ page, size }) => {
//   // Using the params object is the standard way to handle query strings
//   const response = await http.get('/api/alerts', {
//     params: {
//       page: page,
//       size: size
//     }
//   });

//   // Based on your createMembership function, your utility
//   // returns the data inside a 'data' property
//   return response.data;
// };

export const createMembership = async (data) => {
  const response = await http.post(`${Urls.getmembership}`, data);
  return response.data;
};
export const getMembership = async (data) => {
  const response = await http.get(`${Urls.getmembership}`, data);
  return response.data;
};
export const healthapi = async (data) => {
  const response = await http.get(`${Urls.health}`, data);
  console.log(response, "ksdkdkkds");
  return response.data;
};
export const updateMembership = async (id, data) => {
  const response = await http.put(`${Urls.getmembership}/${id}`, data);
  return response.data;
};
export const fanclubList = async (data) => {
  const response = await http.get(`${Urls.fanclub}`, data);
  return response.data;
};
// export const updateMemberHistory = async (id,data) => {
//   const response = await http.get(`${Urls.updatemember}/${id}`, data);
//   return response.data;
// };

export const updateMemberHistory = async ({ queryKey }) => {
  const [, id] = queryKey;
  const response = await http.get(`${Urls.updatemember}/${id}`);
  return response.data;
};

export const getCampaign = async () => {
  const response = await http.get(`${Urls.campaign}`);
  return response.data;
};

export const patchCampaign = async () => {
  const response = await http.patch(`${Urls.patchcampaign}`);
  return response.data;
};
export const userBlock = async (id) => {
  const response = await http.patch(`${Urls.isblocked}/${id}`);
  return response.data;
};
