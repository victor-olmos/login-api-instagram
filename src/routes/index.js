const express = require('express');
const router = express.Router();
const Instagram = require('node-instagram').default;
// requiero keys 
const {clientId,clientSecret} = require('../keys').instagram;

const instagram = new Instagram({
    clientId: clientId,
    clientSecret: clientSecret
  });


router.get('/', (req,res)=>{
    res.render('index');
});
//autentificacion authentication 
const redirectUri = 'http://localhost:3000/handleauth';

router.get('/auth/instagram', (req,res)=>{
    res.redirect(
        instagram.getAuthorizationUrl(redirectUri, {
            scope: ['basic', 'likes'],
            state: 'tu estado'
        })
    ); 
});

//recepcion de datos para volver a realizar una peticion ()
router.get('/handleauth',async (req,res)=>{
    try {
        
        const codigo = req.query.code;
        const data = await instagram.authorizeUser(codigo, redirectUri);
        //almaceno el token y el user id en la session
        req.session.access_token = data.access_token;
        req.session.user_id = data.user.id;

        //le paso el access_token a la instancia de instagram
        instagram.config.accessToken = req.session.access_token;
        res.redirect('/profile');
        

      } catch (err) {
        res.json(err);
      } 
});

router.get('/login', (req,res)=>{
    res.redirect('/auth/instagram');
    
});

router.get('/logout', (req,res)=>{
    delete req.session.access_token;
    delete req.session.user_id;
    res.redirect('/');
});
router.get('/profile', async (req,res)=>{
    try {
        //pregunto por los datos y los guardo 
        const profileData = await instagram.get('users/self');
        const media = await instagram.get('users/self/media/recent');

        console.log(profileData);
        
        res.render('profile', {user: profileData.data, posts: media.data});
    } catch (error) {
        console.log(error);
        
    }
});

/*
router.get('/login', (req,res)=>{
    res.render('index');
});
 */

module.exports = router;