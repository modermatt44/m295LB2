// POST endpoint to login accepts all combinations of email using validateEmail() method. Password has to be: "m295"
exports.login = (req, res) => {
    const email = req.body.email;
    // Regex copied from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const validatedEmail = email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    const password = req.body.password;
    if (!email || !password) {
        return res.status(422).json({ error: 'Missing email or password' });
    } else if (!validatedEmail) {
        return res.status(422).json({ error: 'Invalid email' });
    } else if (password !== 'm295') {
        return res.status(401).json({ error: 'Invalid password' });
    } else {
        req.session.user = { email: email, password: password };
        res.status(200).json(req.session.user);
    }
};

// GET endpoint to verify if user is logged in
exports.verify = (req, res) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).json({ error: 'User is not logged in' });
    }
};

// DELETE endpoint to logout
exports.logout = (req, res) => {
    req.session.destroy();
    res.sendStatus(204);
};