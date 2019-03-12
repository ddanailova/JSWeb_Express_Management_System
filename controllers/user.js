const User = require('mongoose').model('User');
const Project = require('mongoose').model('Project');
const encryption = require('./../utilities/encryption');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },

    registerPost: (req, res) => {
        let registerArgs = req.body;

        User.findOne({
            username: registerArgs.username
        }).then(user => {
            let errorMsg = '';
            if (user) {
                errorMsg = 'User with the same username exists!';
            } else if (registerArgs.password !== registerArgs.repeatedPassword) {
                errorMsg = 'Passwords do not match!'
            }

            if (errorMsg) {
                registerArgs.error = errorMsg;
                res.render('user/register', registerArgs)
            } else {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(registerArgs.password, salt);

                let userObject = {
                    username: registerArgs.username,
                    passwordHash: passwordHash,
                    salt: salt,
                    firstName: registerArgs.firstName,
                    lastName:registerArgs.lastName,
                    roles: ['User']
                };

                User.create(userObject).then(user => {
                    req.logIn(user, (err) => {
                        if (err) {
                            registerArgs.error = err.message;
                            res.render('user/register', registerArgs);
                            return;
                        }
                        res.redirect('/');
                    })
                });
            }
        })
    },

    loginGet: (req, res) => {
        res.render('user/login');
    },

    loginPost: (req, res) => {
        let loginArgs = req.body;
        User.findOne({
            username: loginArgs.username
        }).then(user => {
            if (!user || !user.authenticate(loginArgs.password)) {
                let errorMsg = 'Either username or password is invalid!';
                loginArgs.error = errorMsg;
                res.render('user/login', loginArgs);
                return;
            }

            req.login(user, (err) => {
                if (err) {
                    res.render('user/login', {
                        error: err.message
                    });
                    return;
                }

                let returnUrl = '/';
                if (req.session.returnUrl) {
                    returnUrl = req.session.returnUrl;
                    delete req.session.returnUrl;
                }
                res.redirect(returnUrl);
            })
        })
    },

    logout: (req, res) => {
        req.logOut();
        res.redirect('/');
    },

    profileGet: async(req, res)=>{
        try{
            const id = req.user._id;
            const user = await User.findById(id).populate('teams');
            if(user.teams.length===0){
                user.noTeams=true;
                user.noProjects=true;
            }
            
            let projects =[];
            for (let team of user.teams) {
                for (let project of team.projects) {
                   let targetProject = await Project.findById(project);
                   projects.push(targetProject.name);
                }
            }

            res.render('user/profile', {user,projects});
        }catch(err){
            console.log(err);
            req.body.error = "Something went wrong with your request."
            res.render('user/login', req.body);
        }
    }
};