const Team = require('mongoose').model('Team');
const User = require('mongoose').model('User');

module.exports = {
    teamCreateGet: (req, res) => {
        res.render('team/create');
    },
    teamCreatePost: async (req, res) => {
        try {
            const name = req.body.name;
            await Team.create({
                name
            });

            res.redirect('/');
        } catch (err) {
            console.log(err);
            req.body.error = err;
            res.render('team/create', req.body)
        }
    },
    manageTeamMembersGet: async (req, res) => {
        try {
            let users = await User.find();
            const teams = await Team.find();
            // users = users.filter(u => !u.roles.includes('Admin'));
            res.render('team/teams-admin', {
                users,
                teams
            })
        } catch (err) {
            console.log(err);
            req.body.error = err;
            res.render('home/index', req.body)
        }
    },
    manageTeamMembersPost: async (req, res) => {
        try{
            const {teamId, userId}=req.body;
            let user = await User.findById(userId);
            let team = await Team.findById(teamId);
            
            if(!user.teams.includes(team._id)){
                await User.findByIdAndUpdate(
                    {_id:userId},
                    {$push:{teams:team._id}});
            }

            if(!team.members.includes(user._id)){
                await Team.findByIdAndUpdate(
                    { _id: teamId}, 
                    { $push: { members: user._id } })
            }
            res.redirect('/team/manageMembers');

        }catch (err) {
            console.log(err);
            req.body.error = err;
            res.render('home/index', req.body)
        }
    },
    allTeamsGet: async (req, res) => {
        try {
            let teams = await Team.find().populate('members').populate('projects');
            let noTeams = false;
            if (teams.length ===0) {
                noTeams = true;
                res.render('team/teams-user',{ noTeams});
                return;
            }
            for (const team of teams) {
                if(team.members.length ===0){
                    team.noMembers=true;
                }
                if(team.projects.length ===0){
                    team.noProjects=true;
                }
            }
            res.render('team/teams-user',{teams, noTeams});
        } catch (err) {
            console.log(err);
            req.body.error = err;
            res.render('home/index', req.body)
        }
    },
    leaveTeam:async(req, res)=>{
        try{
            const userId = req.user._id;
            const teamId=req.params.id;

            let user = await User.findById(userId);
            let team =await Team.findById(teamId)
            user.teams.pull(team._id);
            await user.save();
            team.members.pull(user._id);
            await team.save();

            res.redirect('/user/profile');

        }catch (err) {
            console.log(err);
            req.body.error = err;
            res.render('home/index', req.body)
        }
    },

    searchTeam:async(req, res)=>{
        try{
            const query = req.query.teamName;
            let teams = await Team.find().populate('members').populate('projects');
            let noTeams = false;
            if (!teams) {
                noTeams = true;
            }
            teams = teams.filter(t=>t.name.toLowerCase().includes(query.toLowerCase()));
            for (const team of teams) {
                if(team.members.length ===0){
                    team.noMembers=true;
                }
                if(team.projects.length ===0){
                    team.noProjects=true;
                }
            }
            res.render('team/teams-user',{teams, noTeams});

        }catch (err) {
            console.log(err);
            req.body.error = err;
            res.render('home/index', req.body)
        }
    }
}