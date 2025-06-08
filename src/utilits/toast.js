import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModelPopup from '../views/modals/reLoginModal/Index'
let count = 1
export const toaster = async (type, comment) => {
  if (type === "error") {
    const splitMessage = comment.split(']: ');
        if (splitMessage.length >= 2) {
          const message = JSON.parse(splitMessage[1]);
           if(message[0].message == "Token is invalidated, please login again" && count === 1){
               count = 2;
               return await toast.error(<div><ModelPopup/></div>, {
                autoClose: false,
                className: 'toast-message'
            });
           }
          //   else{
          //   return await toast.error(comment, {
          //     position: "top-right",
          //     autoClose: 2000,
          // });
          //  }
        } else{
          return await toast.error(comment, {
            position: "top-right",
            autoClose: 2000,
        });
         }
  } else if (type === "warn") {
    return await toast.warn(comment, {
        position: "top-right",
        autoClose: 2000,
    });
  } else if (type === "success") {
    return await toast.success(comment, {
        position: "top-right",
        autoClose: 2000,
    });
  } else if (type === "dark") {
    return await toast.dark(comment, {
        position: "top-right",
        autoClose: 2000,
    });
  }
};
