const ctrlWrappers = (ctrl) => async (req, res, next) => {
    try {
        await ctrl(req, res);
    } catch (error) {
        next(error);
    }
};

export default ctrlWrappers;