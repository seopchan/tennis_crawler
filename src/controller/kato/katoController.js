import axios from "axios";

const getKatoList = async () => {
  try {
    return await axios.get("https://www.kato.kr/schedules/2022");
  } catch (error) {
    console.error(error);
  }
};

export default getKatoList;