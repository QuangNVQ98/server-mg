// const moment = require('moment');

// module.exports = {
//   convertStrToTimestamp(dateStr) {
//     dateStr = String(dateStr);
//     if (dateStr == undefined || dateStr == null || dateStr.trim() == '') return null;
//     const arrDate = dateStr.split('/');
//     if (arrDate.length != 3) return null;

//     if (moment(dateStr, 'DD/MM/YYYY').isValid()) {
//       return moment(dateStr, 'DD/MM/YYYY').utc().unix();
//     }
//     return null;
//   },
//   deepClone(data) {
//     return data ? JSON.parse(JSON.stringify(data)) : null;
//   },
//   stripHtmlTag(html) {
//     html = String(html);
//     return html ? html.replace(/(<([^>]+)>)/gi, "") : '';
//   },
  
//   isDefined(obj) {
//     return obj !== undefined && obj !== null && obj !== '';
//   },
//   genRandomString(length) {
//     var result           = [];
//     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var charactersLength = characters.length;
//     for ( var i = 0; i < length; i++ ) {
//       result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
//     }
    
//     return result.join('');
//   },

//   addslashes(str) {  
//     return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
//   }  
// }