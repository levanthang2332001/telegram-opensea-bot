import { Context, Format, Markup } from "telegraf";
import { disableNFTAlert } from "../../api/users/disableNFTAlert";

const messageAlert = (alert: any) => `${Format.italic(alert[0].chain.toUpperCase()).text} 
${alert[0].name} | Alert : <code>${alert[0].targetprice} ${alert[0].currency}</code>`

let disableAlertName = '';

const showAlertNft = (ctx: Context, alert: any) => {
    if (!alert || alert.length === 0) return;
    
    disableAlertName = alert[0]?.collection_name || '';

    if (!disableAlertName) {
        console.error('Alert does not contain collection_name');
        return;
    }

    ctx.reply(messageAlert(alert), { 
        parse_mode: 'HTML', 
        ...Markup.inlineKeyboard([
            [Markup.button.callback('Disable', 'disable')]
        ])
    });
}

const disableAlertNft = (ctx: Context) =>  {
    disableNFTAlert(ctx, { collection_name: disableAlertName }).then(() => {
        ctx.reply('Alert disabled')
    })
}

export { showAlertNft, disableAlertNft};     