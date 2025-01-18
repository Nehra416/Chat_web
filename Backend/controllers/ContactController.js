import User from "../models/AuthModel.js";


const searchContact = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { searchTerm } = req.body;

        // null check for searchTerm
        // searchTerm === undefined || searchTerm === null  // alternative if condition
        if (!searchTerm) {
            return res.status(404).send("Search Term is required")
        }

        // sanitize the string from the special character and create a regex for this *************
        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(sanitizedSearchTerm, "i");
        console.log("Regex is :", regex);

        // gives a array of contacts *****
        const contacts = await User.find({
            $and: [
                { _id: { $ne: userId } },
                {
                    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
                }
            ]
        });
        // console.log("Contact is :", contacts);

        return res.status(200).json({ contacts });

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export {
    searchContact,

}