const editHistory = async (req, res, next) => {
	const changes = {
		id: req.user.id,
		name: `${req.user.firstname} ${req.user.lastname}`,
		time: new Date().toISOString(),
	};
	req.edit = [changes];
    console.log(req);
	next();
};

module.exports = {
	editHistory,
};
