const restrictedPages = require('./auth');
const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const teamController = require('../controllers/team');
const projectController = require('../controllers/project');
module.exports = (app) => {
    //Home route
    app.get('/', homeController.index);
    app.get('/index', homeController.index);
    //User routes
    app.get('/user/register', restrictedPages.isAnonymous, userController.registerGet);
    app.post('/user/register', restrictedPages.isAnonymous, userController.registerPost);
    app.get('/user/login', restrictedPages.isAnonymous, userController.loginGet);
    app.post('/user/login', restrictedPages.isAnonymous, userController.loginPost);
    app.post('/user/logout', restrictedPages.isAuthed, userController.logout);
    app.get('/user/profile', restrictedPages.isAuthed, userController.profileGet);
    app.get('/team/all',restrictedPages.hasRole('User'), teamController.allTeamsGet);
    app.get('/project/all',restrictedPages.hasRole('User'), projectController.allProjectsGet);
    app.get('/team/search',restrictedPages.hasRole('User'), teamController.searchTeam);
    app.get('/project/search',restrictedPages.hasRole('User'), projectController.searchProject);
    //TODO leave team route and fix profile
    //Admin routs
    app.get('/team/create',restrictedPages.hasRole('Admin'), teamController.teamCreateGet);
    app.post('/team/create',restrictedPages.hasRole('Admin'), teamController.teamCreatePost);
    app.get('/project/create',restrictedPages.hasRole('Admin'), projectController.projectCreateGet);
    app.post('/project/create',restrictedPages.hasRole('Admin'), projectController.projectCreatePost);
    app.get('/team/manageMembers',restrictedPages.hasRole('Admin'), teamController.manageTeamMembersGet);
    app.post('/team/manageMembers',restrictedPages.hasRole('Admin'), teamController.manageTeamMembersPost);
    app.get('/project/manageTeams',restrictedPages.hasRole('Admin'), projectController.manageTeamsGet);
    app.post('/project/manageTeams',restrictedPages.hasRole('Admin'), projectController.manageTeamsPost);
    
    app.post('/team/leave/:id', restrictedPages.isAuthed,teamController.leaveTeam);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};