// const soap = require("soap-as-promised");
// import generateUuid from "./generateUuid";
import {
    getProducto,
    addElemToOrder,
    addElemToOrdersWithProblems,
    getTime,
} from "./api";
import {mailSuccess, mailUnSuccess} from "./emails";
import sendmail from "./sendmail";
import {code} from "./statusCodes/payallCodeResponce";


const middlewareServerUrl = 'http://34.66.120.175:8080/recargar';

// create payall transaction
async function postData(url: string, data: any) {
    const result = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
    });
    return await result.json();
}

// todo Move to Node Js Server
const PayallRequest = async (db: any, options: any) => {
    const {data, time, id} = options;

    const postDataInfo = {
        options,
        producto: getProducto(data.product)
    }

    try {
        const result = await postData(middlewareServerUrl, postDataInfo);


        if (result.success) {
            const orderOptions = {
                data: data,
                id: id,
            };
            const emailOptions = {
                data,
                time: getTime(),
                timePagoreacargarRessponse: time,
                id: id,
            };

            await sendmail(mailSuccess(emailOptions), "mailSuccess");
            await addElemToOrder(db, orderOptions);
            console.log("TTTTTTTTTTTTTTTTT");

            if (data.hasCoupon && data.oneOff) {
                await db.collection("numberUsedCoupon").add({number: data.to});
            }
        } else {
            const orderOptions = {
                id: id,
                data: data,
                message: result.message,
                code: result.code,
            };
            const emailOptions = {
                code: code[result.responseCode],
                data,
                time: getTime(),
                id: id,
            };
            await addElemToOrdersWithProblems(db, orderOptions);

            await sendmail(mailUnSuccess(emailOptions), "preorder");
        }
    } catch (e) {
        console.error(e);
    }

    // const { data, time, id } = options;
    // const uuid = generateUuid("123456789", 17);
    // const url = "http://164.52.144.203:9967/payall/ws?wsdl";
    // const phoneNumber = data.to.replace(/-/g, "");
    // const args = {
    //   arg0: {
    //     uuid: uuid,
    //     numero: phoneNumber,
    //     monto: data.price,
    //     operadora: data.product,
    //     producto: getProducto(data.product),
    //     pv: "4348",
    //     pin: "81264062",
    //     key: "HOcpMcgEDA4FEYX",
    //     code: "####",
    //   },
    // };
    // console.log(args);
    // soap
    //   .createClient(url)
    //   .then((client: any) => {
    //     client
    //       .recargar(args)
    //       .then(async (responce: any) => {
    //         console.log(responce);
    //         if (responce.return.codigo_respuesta === "00") {
    //           const options = {
    //             data: data,
    //             id: id,
    //           };
    //           const emailOptions = {
    //             data,
    //             time: getTime(),
    //             timePagoResponce: time,
    //             id: id,
    //           };
    //
    //           await sendmail(mailSuccess(emailOptions), "mailSuccess");
    //           await addElemToOrder(db, options);
    //           console.log("TTTTTTTTTTTTTTTTT");
    //           if (data.hasCoupon && data.oneOff) {
    //             await db.collection("numberUsedCoupon").add({ number: data.to });
    //           }
    //         } else {
    //           console.log("XXXXXXXXXXXXXXXXXXXXXX");
    //           const responceCode = responce.return.codigo_respuesta;
    //           const options = {
    //             id: id,
    //             data: data,
    //             message: responce.return.string,
    //             code: "Payall",
    //           };
    //           const emailOptions = {
    //             code: code[responceCode],
    //             data,
    //             time: getTime(),
    //             id: id,
    //           };
    //           await addElemToOrdersWithProblems(db, options);
    //
    //           await sendmail(mailUnSuccess(emailOptions), "preorder");
    //         }
    //       })
    //       .catch((error: any) => {
    //         console.log("errro1", error);
    //       });
    //   })
    //   .catch((error: any) => {
    //     console.log("error2", error);
    //   });
};

export default PayallRequest;
