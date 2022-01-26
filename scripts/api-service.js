import axios from "axios";

export const postData = async (query, data) => {
    try {
      let res = await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_ASSET_URI}${query}`,
        data: data,
      });
      return res;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };