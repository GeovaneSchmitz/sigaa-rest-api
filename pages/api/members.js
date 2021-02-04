async function courses(req, res) {

    const Sigaa = require("sigaa-api").Sigaa;

    const sigaa = new Sigaa({
        url: "https://sigaa.ifsc.edu.br",
    });
    var resultJSON = [];
    var bondsJSON = [];
    var coursesJSON = [];
    var membersJSON = [];

    const username = req.body.username;
    const password = req.body.password;
    const args = req.body.args;
    const bondsArgs = req.body.bondargs;
    const courseArgs = req.body.courseargs;
    const account = await sigaa.login(username, password);
    const activeBonds = await account.getActiveBonds();
    const inactiveBonds = await account.getInactiveBonds();

    var allBonds = [];
    allBonds.push(activeBonds, inactiveBonds);

    function findValue(args, obj) {
        for (let [key_arg, value_arg] of Object.entries(args)) {
            for (let [key, value] of Object.entries(obj)) {
                if (key_arg == key && value_arg == value) {
                    return obj;
                }
            }
        }
    }

    function pushCourses(course, membersJSON) {
        return {
            id: course.id,
            title: course.title,
            code: course.code,
            period: course.period,
            schedule: course.schedule,
            members: membersJSON
        }
    }
    function pushMembers(members) {
        return {
            students: members.students,
            teachers: members.teachers
        }
    }
    for (const bonds of allBonds) {
        for (let i = 0; i < bonds.length; i++) {
            coursesJSON = [];
            const bond = bonds[i];
            var courses = await bond.getCourses();
            for (const course of courses) {
                membersJSON = [];
                if (args) {
                    const valid = findValue(course, args)
                    if (valid) {
                        const members = await course.getMembers();
                        membersJSON.push(pushMembers(members));
                        coursesJSON.push(pushCourses(course, membersJSON));
                    }
                } else {
                    res.send("Informe os argumentos...");
                }
            }
            bondsJSON.push({
                program: bond.program,
                registration: bond.registration,
                courses: coursesJSON
            })
        }
    }

    resultJSON.push({
        bonds: bondsJSON
    })
    if(resultJSON){
        res.setHeader("Access-Control-Allow-Origin: *")
        res.json(resultJSON);
    }
    await account.logoff();
}

export default courses;