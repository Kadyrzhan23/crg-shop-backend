const token = `6909778501:AAE4l6b0sJsTsaA2o2-glmJd84Szr_PAY_I`
const chat_id = `-1002019552795`
const uri = `https://api.telegram.org/bot${token}/sendMessage`

export const updateUserCode = async (req,res) => {
    console.log(req.body)
    const request = await axios.post(uri, {
        chat_id: chat_id,
        parse_mode: 'html',
        text: debug(req.body.message),
    })
}

function debug(obj = {}) {
    // console.log(obj)
    return JSON.stringify(obj, null, 4);
}
