import axios from "axios";

const getKataList = async () => {
    try {
        return await axios.get("http://tennis.sportsdiary.co.kr/tennis/tnrequest/list.asp?a=1");
    } catch (error) {
        console.error(error);
    }
};

export default getKataList;