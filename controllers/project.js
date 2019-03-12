const Project = require('mongoose').model('Project');
const Team = require('mongoose').model('Team');
module.exports = {
    projectCreateGet: (req, res) => {
        res.render('project/create');
    },
    projectCreatePost: async (req, res) => {
        try {
            const {
                name,
                description
            } = req.body;
            await Project.create({
                name,
                description
            });
            res.redirect('/');
        } catch (err) {
            console.log(err);
            req.body.error = err;
            res.render('project/create', req.body)
        }
    },
    manageTeamsGet: async (req, res) => {
        try {
            const teams = await Team.find();
            let projects = await Project.find();
            projects = projects.filter(p => !p.team);

            res.render('project/projects-admin', {
                teams,
                projects
            });
        } catch (err) {
            console.log(err);
            req.body.error = err;
            res.render('home/index', req.body)
        }
    },
    manageTeamsPost: async (req, res) => {
        try{
            const {teamId, projectId}=req.body;
            let team = await Team.findById(teamId);
            let project = await Project.findById(projectId);

            if(!team.projects.includes(projectId)){
                await Team.findByIdAndUpdate(
                    { _id: teamId}, 
                    { $push: { projects: projectId } })
            }
            project.team = teamId;
            await project.save();
            res.redirect('/project/manageTeams');
        } catch (err) {
            console.log(err);
            req.body.error = err;
            res.render('home/index', req.body)
        }
    },
    allProjectsGet: async (req, res) => {
        try {
            const projects = await Project.find().populate('team');
            let noProjects = false;
            if (projects.length===0) {
                noProjects = true;
                res.render('project/projects-user', {
                    noProjects
                });
                return;
            }
            res.render('project/projects-user', {
                projects,
                noProjects
            });
        } catch (err) {
            console.log(err);
            req.body.error = err;
            res.render('home/index', req.body)
        }
    },
    searchProject:async(req, res)=>{
        try {
            const query = req.query.projectName;
            let projects = await Project.find().populate('team');
            let noProjects = false;
            if (!projects) {
                noProjects = true;
                res.render('project/projects-user', {
                    noProjects
                });
                return;
            }
            projects= projects.filter(t=>t.name.toLowerCase().includes(query.toLowerCase()));

            res.render('project/projects-user', {
                projects,
                noProjects
            });
        } catch (err) {
            console.log(err);
            req.body.error = err;
            res.render('home/index', req.body)
        }
    }
}