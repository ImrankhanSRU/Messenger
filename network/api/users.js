import obj from '../../components/config'
const axios = require('axios');


export const authenticateUser = async (email, pwd) => {
    const res = await axios.post(obj.BASE_URL + "api/userManagement/authenticateUser", {
        "uname": email,
        "pwd": pwd
    })

    return res.data

}


// login = (email, pass) => {
//     // if(obj.isConnected) {

//         .then((response) => response.text())
//         .then((responseText) => {
//             responseObj = JSON.parse(responseText)
//             if (responseObj.code != 200) {
//                 this.setState({
//                     showError: true,
//                     errorText: responseObj.success
//                 })
//             }
//             else {
//                 obj.name = responseObj.data.fname
//                 AsyncStorage.setItem('user', JSON.stringify({ name: responseObj.data.fname, hCode: responseObj.data.hcode }));
//                 this.setState({
//                     showError: false,
//                 })
//                 obj.user_hCode = responseObj.data.hcode
//                 this.goToHome({ hCode: responseObj.data.hcode })
//             }
//         })
//         .catch((error) => {
//             console.error(error);
//         });
//     // }

//     // else {
//     //     this.setState({
//     //         showError: false
//     //     })
//     // }
// }