// $(document).ready(function() {
//   $('.auth').click(function(e) {
//     doPost('https://sp-money.yandex.ru/oauth/authorize', {
//       client_id: '3C8EB4377C987BA354A59F09A066375AEF4203E02EEDBFFB5B527EF99D1D7606',
//       response_type: 'code',
//       redirect_uri: 'http://portion.cloudapp.net:8080/ym-result',
//       scope: 'operation-history'
//     }, function(msg) {
//       setStatus('success! ' + JSON.stringify(msg));
//     })
//   });
// });

// function doPost(address, params, callback) {
//     $.ajax({
//         type: "POST",
//         dataType: "json",
//         url: address,
//         data: params,
//         crossDomain: true,
//         async: true,
//         success: function(msg){
//             if (msg.result != "ok") {
//                 setStatus(msg.errorMessage);
//                 return;
//             }
//             callback(msg);
//         },
//         error: function(jqXHR, textStatus, errorThrown ) {
//             setStatus("Возникла ошибка. Обратитесь, пожалуйста, к разработчику.");
//         }
//     });
// }

// function setStatus(text) {
//   console.log(text);
//   $('.status').html(text);
// }