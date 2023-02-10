module.exports.home = async function (req, res) {
    try {
        return res.render('home_page', {
            title: 'Node js Authenticator | Home', // passing title to home page
            msg: 'first load',
        });
    } catch {
        console.log('Error in home page, code=>', err);
        return;
    }
};
