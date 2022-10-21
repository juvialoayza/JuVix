const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

//rutas de autenticación (signup y login)

// GET "/auth/signup" => renderizar la vista de formulario registro
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})

// POST "/auth/signup" => recibir la info del formulario y crear el perfil en la BD
router.post("/signup", async (req, res, next) => {
    const {firstName, lastName, username, email, password, role, photoUser} = req.body
    console.log(req.body)

    // todos los campos deben estar llenos
    if(firstName ==="" || lastName ==="" || username ==="" || email ==="" || password ===""){
        res.render("auth/signup.hbs", {
            errorMessage: "Rellena todos los campos"
        })
        return;
    }

    //validar la fuerza de la contraseña
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
    if (passwordRegex.test(password) === false) {
        res.render("auth/signup.hbs", {
            errorMessage: "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número"
        })
        return;
    }

    try{
     //validación para que el usuario sea único   
     const foundUser = await User.findOne({username:username})
     if(foundUser !== null){
        res.render("auth/signup.hbs", {
            errorMessage:"Este usuario ya existe"
        })
        return;
     }

     // elemento de seguridad
     const salt = await bcrypt.genSalt(10)
     const hashPassword = await bcrypt.hash(password,salt)

     // crear perfil del usuario
     const newUser = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: hashPassword,
        photoUser: photoUser
     }

     await User.create(newUser)
     res.redirect("/auth/login")

    }
    catch(err){
        next(err)
    }
})

//GET "/auth/login" => renderizar la vista del formulario de acceso
router.get("/login", (req, res, next) => {
    res.render("auth/login.hbs")
})

//POST "/auth/login" => validación del usuario y acceso
router.post("/login", async (req, res, next)=>{
    const{username, password} = req.body

    if(username ==="" || password === ""){
        res.render("auth/login.hbs", {
            errorMessage: "Rellena todos los campos"
        })
        return;
    }

    try{
        // verificar el usuario
        const foundUser = await User.findOne({username:username})
        if(foundUser === null){
            res.render("auth/login.hbs", {
                errorMessage: "Usuario o contraseña incorrecto"
            })
            return;
        }

        // verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, foundUser.password)

        if(isPasswordValid === false){
            res.render ("auth/login.hbs", {
                errorMessage:"Usuario o contraseña incorrecto"
            })
            return;
        }
    }
    catch(err){
        
    }

})






module.exports = router;