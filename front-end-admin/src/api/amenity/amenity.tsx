import { api } from "../axios";

const amenity = "amenity";

export const getAmenityAPI = async (id: string, type: string) => {
  if (type === "town-house") type = "townhouse";
  return api
    .get(`${amenity}/accommodation?accommodationType=${type}&id=${id}`)
    .then((response) => {
      const data = response.data.map((item: any) => {
        return {
          icon: item.icon,
          description: item.description,
        };
      });
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addAmenityAPI = async (id: string, type: string, icon: string, description: string) => {
  if (type === "town-house") type = "townhouse";
  return api
    .post(`${amenity}/accommodation?accommodationType=${type}&id=${id}`, { icon, description })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteAmenityAPI = async (id: string, type: string, icon: string, description: string) => {
  if (type === "town-house") type = "townhouse";
  return api
    .delete(`${amenity}/accommodation?accommodationType=${type}&id=${id}&icon=${icon}&description=${description}`)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};
