import axios from 'axios';

const axiosFun = {
  get: (url, param, fun, errorFun) => {
    axios.get(url, param).then(response => {
      fun && fun(response);
    }).catch(error => {
      errorFun && errorFun(error);
    })
  },
  post: (url, param, fun, errorFun) => {
    axios.post(url, param).then(response => {
      fun && fun(response);
    }).catch(error => {
      errorFun && errorFun(error);
    })
  }
}
export default axiosFun;