export default async function bonds(req, res) {
    if (req.method === 'POST') {

        const Sigaa = require("sigaa-api").Sigaa;

        const sigaa = new Sigaa({
            url: "https://sigaa.ifsc.edu.br",
        });
        var result = [];

        const account = await sigaa.login(req.body.username, req.body.password);
        
        const activeBonds = await account.getActiveBonds();
        const inactiveBonds = await account.getInactiveBonds();

        var allBonds = [];
        allBonds.push(activeBonds, inactiveBonds);


        for (const bonds of allBonds) {
            bonds.forEach(bond => {
                result.push({
                    program: bond.program,
                    registration: bond.registration
                })
            });
        }
        res.json(result)
        await account.logoff();
    }
}