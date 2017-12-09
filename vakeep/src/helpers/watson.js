

const TOKEN = 'G5fZFCi6yJ5ts9pmR6kRNH0RFEmkPWTjjbgqnxEze3g4Ml0N%2BflaV%2FaqBP%2Bh5qMkOA96gOgXmfBZAkE2MUC2Z5MnAkJZHYLjwijidEX9F2PEziD0ZG2rifWq38ppsNOiA4gNiSm%2FrAH79PlpwjHQ0vLypIgS7UNj%2BnhzYaJtKzhI%2FT6YUBH131lI5wIWCWoD62tV8d5AQ45NAd4ee90mN%2Bze4mX64anfHUC00mi8uZ5nujJ2WCgpZS0qQ%2FTuUlnxxItWxvnp1RYbJrYCDVB%2Fl3%2Bj2xpBDGKooTTagx9kuaSHqNc2SFvwHeT4YF3ga33En6WgvkllEQ6iyz0AY2Mvq244%2BANtpr32Q2RuQtaH8t46Y4pISiWgInYNFrLCvH1J%2FWzG0m4iiwwH2H%2BYc4gsenjxUeEba9Jy%2FKOoJqWFEhby77NK3JjVTWY%2Bc9PJQulOQfexfjIjlRc7VSv20Zwp0eboehaOEhTGGW%2FROXpy%2F6XFcm6QoTyXq8I7%2BIXS3EJdPqKPrYSWwbJja%2BSS7MgTX%2BcXEzI1ZHDw4sADkGIipiByQlz0RVEp3GlGr0a5f65%2Fyw8NKqlhTOyWAEV59%2F3cCaLJxw8q%2F9qO9oPZYWgdvZN1a0FJ7SQx8ZRT%2FSFJdAkvksjj346KGqgCEuB1fy37r%2FMKusOgY0u11wL7b2Sq4uo6gZGfEJg1OGmrbTjYQ9xDQ0uEMVd3T5qq%2BadmE4SVRO6QNxcdTtfWV28Oh3ToxeTR1zuJPERS39p789PzxyT%2BoiZNgJe11OtTJvfisQSM2eCo34p8RBbj3VjWTVHkG0iH%2F6%2BNRUPqhLj21nbA%2FxYeG3GDtFKcB1pkMLPetmrxT7XCtFGjQ%2Frvlzop5uyTtXIniOl0DEuaQe%2BbJDnutvY2SyVb261dsgllNQPkXnLfj5IejPBWoSkKhX%2BmkRX9UwdhrM7jLL%2FOE7moj4Oz%2BLVMr4QIBmoM4Hb5jxjZVPq1kVX8b7nK%2BWxAOdkfMwRwwSg%3D%'
const REMOTE = 'http://54.233.87.88/api/stt'
const LOCAL = 'http://localhost:3001/api/stt'

export default window.watson = {
    sendAudio : async function (audioBlob) {
        let header = new Headers()
        console.log(audioBlob)
        
        var formData = new FormData()
        formData.append("upl", audioBlob, 'audio')

        return fetch(LOCAL,{
            method: 'POST',
            body : formData,
            mode : 'no-cors'
        })

    }
    // sendAudio: async function (audioBlob) {
    //     let header = new Headers()
    //     header.append('Content-Type', "audio/webm;codecs=opus")
    //     console.log(audioBlob.blob)

    //     var reader = new window.FileReader();
    //     reader.readAsDataURL(audioBlob.blob);
    //     reader.onloadend = function () {
    //         let base64data = reader.result;
    //         console.log(base64data);
    //         return fetch(`https://insper-vacathon.mybluemix.net/stt`, {
    //             headers: header,
    //             method: 'POST',
    //             body: base64data,
    //             mode: 'no-cors'
    //         })
    //     }   
    // }

}
