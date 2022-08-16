import axios from "axios";

const getKatoList = async () => {
  try {
    return await axios.get("https://www.kato.kr/enterGame");
  } catch (error) {
    console.error(error);
  }
};

export default getKatoList;