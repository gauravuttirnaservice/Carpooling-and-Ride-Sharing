export const isAdmin = (req, res, next) => {

    if (!req.user || req.user.role !== 'admin') {
        console.log(req.user.role, "User Role")

        return res.status(403).json({ message: "Unauthorized" })
    }
    next()
};