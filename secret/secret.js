module.exports = {
    auth: {
        user: 'ashishgoyal15103140@gmail.com',
        pass: 'ashish@jiit'
    },
    
    facebook: {
        clientID: '1861759354108916', //Facebook login app id
        clientSecret: 'c88516cf29c19d5d591189d013a7c254', //Facebook login secret key
        profileFields: ['email', 'displayName'],
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        passReqToCallback: true
    }
}

