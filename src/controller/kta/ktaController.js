import axios from "axios";

const getKtaList = async () => {
  try {
    return await axios.get("http://www.ktfs.or.kr/bbs/write.php?bo_table=dae_chamga", {responseType: "arraybuffer"});
  } catch (error) {
    console.error(error);
  }
};

export default getKtaList;