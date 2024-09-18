import { Context } from "telegraf";
import { NFTAlertWithPrice } from "../../interface";


const messageAlert = (alert: NFTAlertWithPrice) => ``

const showAlertNft = (ctx: Context, alert: NFTAlertWithPrice) => {
    console.log(alert.name)
    console.log(`*${alert.chain}* Name: ${alert.name} Alert: ${alert.targetprice} ${alert.name}`)

}

export { showAlertNft };